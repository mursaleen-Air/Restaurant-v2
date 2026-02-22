from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base


class Tenant(Base):
    """Restaurant/Tenant model for multi-tenancy"""
    __tablename__ = "tenant"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)  # "Pizza Palace"
    slug = Column(String(100), unique=True, nullable=False, index=True)  # "pizza-palace"
    
    # Branding
    logo_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    
    # Contact Info
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    address = Column(String(500), nullable=True)
    
    # Business Hours (JSON: {"monday": {"open": "09:00", "close": "22:00"}, ...})
    business_hours = Column(JSON, nullable=True)
    
    # Settings
    is_active = Column(Boolean, default=True)
    is_onboarded = Column(Boolean, default=False)  # Completed onboarding wizard
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    users = relationship("User", back_populates="tenant")
    categories = relationship("Category", back_populates="tenant", cascade="all, delete-orphan")
    menu_items = relationship("MenuItem", back_populates="tenant", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="tenant")
    subscription = relationship("Subscription", back_populates="tenant", uselist=False)

    def __repr__(self):
        return f"<Tenant {self.slug}>"
