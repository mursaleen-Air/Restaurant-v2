from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base


class Plan(Base):
    """Subscription plans (Free, Pro, Enterprise)"""
    __tablename__ = "plan"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)  # "Free", "Pro", "Enterprise"
    description = Column(String(255), nullable=True)
    price_monthly = Column(Float, default=0.0)  # For display purposes
    
    # Limits
    max_menu_items = Column(Integer, default=10)  # -1 for unlimited
    max_orders_per_month = Column(Integer, default=50)  # -1 for unlimited
    
    # Features flags
    analytics_enabled = Column(Boolean, default=False)
    priority_support = Column(Boolean, default=False)
    custom_domain = Column(Boolean, default=False)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    subscriptions = relationship("Subscription", back_populates="plan")

    def __repr__(self):
        return f"<Plan {self.name}>"


class Subscription(Base):
    """Tenant subscription to a plan"""
    __tablename__ = "subscription"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenant.id"), unique=True, nullable=False)
    plan_id = Column(Integer, ForeignKey("plan.id"), nullable=False)
    
    status = Column(String(20), default="active")  # "active", "canceled", "suspended"
    
    # Usage tracking
    orders_this_month = Column(Integer, default=0)
    last_reset_date = Column(DateTime(timezone=True), server_default=func.now())
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    tenant = relationship("Tenant", back_populates="subscription")
    plan = relationship("Plan", back_populates="subscriptions")

    def __repr__(self):
        return f"<Subscription tenant={self.tenant_id} plan={self.plan_id}>"
