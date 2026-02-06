from fastapi import APIRouter, Depends
from app.core.dependencies import require_admin, require_customer
from app.models.user import User

router = APIRouter()

@router.get("/admin-only")
def admin_only(current_user: User = Depends(require_admin)):
    return {"message": "Hello Admin", "user": current_user.email}

@router.get("/customer-only")
def customer_only(current_user: User = Depends(require_customer)):
    return {"message": "Hello Customer", "user": current_user.email}
