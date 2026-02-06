from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class Payment(Base):
    __tablename__ = "payment"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("order.id"), unique=True)
    amount = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, completed, failed
    payment_method = Column(String) # card, cash, etc
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    order = relationship("Order", back_populates="payment")
