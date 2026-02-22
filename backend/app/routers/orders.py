from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import get_current_active_user, require_admin, require_customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.menu_item import MenuItem
from app.models.tenant import Tenant
from app.schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate, GuestOrderCreate

router = APIRouter()


@router.post("/guest", response_model=OrderResponse)
def create_guest_order(
    order_in: GuestOrderCreate,
    x_tenant_slug: Optional[str] = Header(None, alias="X-Tenant-Slug"),
    db: Session = Depends(get_db)
):
    """Create an order for guest checkout (no login required)"""
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Cannot create empty order")
    
    if not order_in.customer_name or not order_in.customer_phone:
        raise HTTPException(status_code=400, detail="Customer name and phone required")
    
    # Get tenant by slug
    tenant = None
    if x_tenant_slug:
        tenant = db.query(Tenant).filter(Tenant.slug == x_tenant_slug, Tenant.is_active == True).first()
    
    if not tenant:
        raise HTTPException(status_code=400, detail="Restaurant not found")
    
    total_amount = 0.0
    order_items = []
    
    for item in order_in.items:
        menu_item = db.query(MenuItem).filter(
            MenuItem.id == item.menu_item_id,
            MenuItem.tenant_id == tenant.id
        ).first()
        
        if not menu_item or not menu_item.is_available:
            raise HTTPException(
                status_code=400, 
                detail=f"Menu item {item.menu_item_id} not available"
            )
        
        item_price = item.price if item.price else menu_item.price
        item_total = item_price * item.quantity
        total_amount += item_total
        
        order_items.append({
            "menu_item_id": menu_item.id,
            "quantity": item.quantity,
            "price": item_price
        })

    # Create order
    new_order = Order(
        tenant_id=tenant.id,
        user_id=None,  # Guest order
        customer_name=order_in.customer_name,
        customer_phone=order_in.customer_phone,
        customer_address=order_in.customer_address,
        notes=order_in.notes,
        total_amount=total_amount,
        status="pending"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    # Add order items
    for item_data in order_items:
        new_order_item = OrderItem(
            order_id=new_order.id,
            **item_data
        )
        db.add(new_order_item)
    
    db.commit()
    db.refresh(new_order)
    return new_order


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_by_id(
    order_id: int,
    x_tenant_slug: Optional[str] = Header(None, alias="X-Tenant-Slug"),
    db: Session = Depends(get_db)
):
    """Get order by ID for tracking (public endpoint)"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Verify tenant if slug provided
    if x_tenant_slug:
        tenant = db.query(Tenant).filter(Tenant.slug == x_tenant_slug).first()
        if tenant and order.tenant_id != tenant.id:
            raise HTTPException(status_code=404, detail="Order not found")
    
    return order


@router.post("/", response_model=OrderResponse)
def create_order(
    order_in: OrderCreate, 
    db: Session = Depends(get_db), 
    current_user = Depends(require_customer)
):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Cannot create empty order")
    
    total_amount = 0.0
    order_items = []
    
    for item in order_in.items:
        menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()
        if not menu_item or not menu_item.is_available:
            raise HTTPException(
                status_code=400, 
                detail=f"Menu item {item.menu_item_id} not available"
            )
        
        item_total = menu_item.price * item.quantity
        total_amount += item_total
        
        order_items.append({
            "menu_item_id": menu_item.id,
            "quantity": item.quantity,
            "price": menu_item.price
        })

    # Get tenant from user
    tenant_id = current_user.tenant_id if current_user.tenant_id else None
    
    new_order = Order(
        tenant_id=tenant_id,
        user_id=current_user.id,
        total_amount=total_amount,
        status="pending"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    for item_data in order_items:
        new_order_item = OrderItem(
            order_id=new_order.id,
            **item_data
        )
        db.add(new_order_item)
    
    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/my", response_model=List[OrderResponse])
def read_my_orders(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user = Depends(require_customer)
):
    orders = db.query(Order)\
        .filter(Order.user_id == current_user.id)\
        .order_by(Order.created_at.desc())\
        .offset(skip).limit(limit).all()
    return orders

@router.get("/", response_model=List[OrderResponse])
def read_all_orders(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    orders = db.query(Order).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders

@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int, 
    status_update: OrderStatusUpdate, 
    db: Session = Depends(get_db), 
    current_user = Depends(require_admin)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status_update.status
    db.add(order)
    db.commit()
    db.refresh(order)
    return order

