from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import get_current_active_user, require_admin, require_customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.menu_item import MenuItem
from app.schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate

router = APIRouter()

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

    new_order = Order(
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
