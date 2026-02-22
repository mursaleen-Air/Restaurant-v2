from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core import security
from app.models.tenant import Tenant
from app.models.subscription import Plan, Subscription
from app.models.user import User
from app.schemas.tenant import (
    TenantCreate, TenantUpdate, TenantResponse, TenantPublicResponse,
    PlanResponse, SubscriptionResponse
)

router = APIRouter()


@router.post("/register", response_model=TenantResponse, status_code=status.HTTP_201_CREATED)
def register_restaurant(tenant_in: TenantCreate, db: Session = Depends(get_db)):
    """
    Register a new restaurant and create owner account.
    """
    # Check if slug already exists
    existing = db.query(Tenant).filter(Tenant.slug == tenant_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="This restaurant URL is already taken. Please choose another."
        )
    
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == tenant_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists."
        )
    
    # Create tenant
    tenant = Tenant(
        name=tenant_in.name,
        slug=tenant_in.slug,
        email=tenant_in.email,
        phone=tenant_in.phone,
        is_active=True,
        is_onboarded=False
    )
    db.add(tenant)
    db.flush()  # Get tenant.id
    
    # Create owner user
    owner = User(
        tenant_id=tenant.id,
        name=tenant_in.name,
        email=tenant_in.email,
        phone=tenant_in.phone,
        hashed_password=security.get_password_hash(tenant_in.password),
        role="owner"
    )
    db.add(owner)
    
    # Assign free plan by default
    free_plan = db.query(Plan).filter(Plan.name == "Free").first()
    if free_plan:
        subscription = Subscription(
            tenant_id=tenant.id,
            plan_id=free_plan.id,
            status="active"
        )
        db.add(subscription)
    
    db.commit()
    db.refresh(tenant)
    
    return tenant


@router.get("/plans", response_model=list[PlanResponse])
def get_plans(db: Session = Depends(get_db)):
    """Get all available subscription plans."""
    plans = db.query(Plan).filter(Plan.is_active == True).all()
    return plans


@router.get("/{slug}", response_model=TenantPublicResponse)
def get_restaurant_public(slug: str, db: Session = Depends(get_db)):
    """
    Get public restaurant info by slug.
    Used for public menu pages.
    """
    tenant = db.query(Tenant).filter(Tenant.slug == slug, Tenant.is_active == True).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return tenant


@router.put("/settings", response_model=TenantResponse)
def update_restaurant_settings(
    tenant_update: TenantUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(security.get_current_user)
):
    """
    Update restaurant settings. Only restaurant owner can update.
    """
    if current_user.role != "owner" or not current_user.tenant_id:
        raise HTTPException(status_code=403, detail="Only restaurant owners can update settings")
    
    tenant = db.query(Tenant).filter(Tenant.id == current_user.tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    # Update fields
    update_data = tenant_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tenant, field, value)
    
    db.commit()
    db.refresh(tenant)
    return tenant


@router.post("/onboarding/complete", response_model=TenantResponse)
def complete_onboarding(
    tenant_update: TenantUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(security.get_current_user)
):
    """
    Complete the onboarding process and update restaurant details.
    """
    if current_user.role != "owner" or not current_user.tenant_id:
        raise HTTPException(status_code=403, detail="Only restaurant owners can complete onboarding")
    
    tenant = db.query(Tenant).filter(Tenant.id == current_user.tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    # Update fields
    update_data = tenant_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tenant, field, value)
    
    tenant.is_onboarded = True
    db.commit()
    db.refresh(tenant)
    return tenant


@router.get("/my/subscription", response_model=SubscriptionResponse)
def get_my_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(security.get_current_user)
):
    """Get current restaurant's subscription details."""
    if not current_user.tenant_id:
        raise HTTPException(status_code=400, detail="User is not associated with a restaurant")
    
    subscription = db.query(Subscription).filter(
        Subscription.tenant_id == current_user.tenant_id
    ).first()
    
    if not subscription:
        raise HTTPException(status_code=404, detail="No subscription found")
    
    return subscription
