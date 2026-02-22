from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenant.id"), nullable=True)  # NULL for platform admins
    name = Column(String)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String(50), nullable=True)  # For guest orders
    hashed_password = Column(String, nullable=True)  # NULL for guest users
    role = Column(String, default="customer")  # "owner", "staff", "customer", "platform_admin"
    is_guest = Column(Integer, default=0)  # 1 for guest checkout users
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tenant = relationship("Tenant", back_populates="users")
