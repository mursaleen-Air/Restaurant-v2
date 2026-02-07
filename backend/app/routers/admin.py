from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.core.dependencies import require_admin
from app.models.user import User
from app.models.order import Order
from app.models.category import Category
from app.models.menu_item import MenuItem

router = APIRouter()

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    """Get admin dashboard statistics"""
    total_users = db.query(func.count(User.id)).scalar()
    total_orders = db.query(func.count(Order.id)).scalar()
    total_revenue = db.query(func.sum(Order.total_amount)).filter(Order.status == "completed").scalar() or 0.0
    total_categories = db.query(func.count(Category.id)).scalar()
    total_menu_items = db.query(func.count(MenuItem.id)).scalar()
    
    # Recent orders (last 10)
    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(10).all()
    
    return {
        "total_users": total_users,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "total_categories": total_categories,
        "total_menu_items": total_menu_items,
        "recent_orders": [
            {
                "id": order.id,
                "user_id": order.user_id,
                "total_amount": order.total_amount,
                "status": order.status,
                "created_at": order.created_at.isoformat() if order.created_at else None
            }
            for order in recent_orders
        ]
    }

@router.get("/users")
def get_all_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_admin)
):
    """Get all users (admin only)"""
    users = db.query(User).offset(skip).limit(limit).all()
    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
        for user in users
    ]

@router.put("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    role: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update user role (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found")
    
    if role not in ["admin", "customer"]:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Invalid role. Must be 'admin' or 'customer'")
    
    user.role = role
    db.commit()
    db.refresh(user)
    
    return {"message": f"User role updated to {role}", "user_id": user_id}
