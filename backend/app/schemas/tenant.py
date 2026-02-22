from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
import re


class TenantBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    business_hours: Optional[dict] = None

    @field_validator('slug')
    @classmethod
    def validate_slug(cls, v):
        if not re.match(r'^[a-z0-9-]+$', v):
            raise ValueError('Slug must contain only lowercase letters, numbers, and hyphens')
        if len(v) < 3 or len(v) > 50:
            raise ValueError('Slug must be between 3 and 50 characters')
        return v


class TenantCreate(BaseModel):
    """Used for restaurant registration"""
    name: str
    slug: str
    email: EmailStr
    password: str
    phone: Optional[str] = None

    @field_validator('slug')
    @classmethod
    def validate_slug(cls, v):
        if not re.match(r'^[a-z0-9-]+$', v):
            raise ValueError('Slug must contain only lowercase letters, numbers, and hyphens')
        if len(v) < 3 or len(v) > 50:
            raise ValueError('Slug must be between 3 and 50 characters')
        return v


class TenantUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    business_hours: Optional[dict] = None


class TenantResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    business_hours: Optional[dict] = None
    is_active: bool
    is_onboarded: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TenantPublicResponse(BaseModel):
    """Public info visible to customers"""
    name: str
    slug: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    business_hours: Optional[dict] = None

    class Config:
        from_attributes = True


# Subscription schemas
class PlanResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price_monthly: float
    max_menu_items: int
    max_orders_per_month: int
    analytics_enabled: bool
    priority_support: bool

    class Config:
        from_attributes = True


class SubscriptionResponse(BaseModel):
    id: int
    tenant_id: int
    plan_id: int
    status: str
    orders_this_month: int
    plan: Optional[PlanResponse] = None

    class Config:
        from_attributes = True
