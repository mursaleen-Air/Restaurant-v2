from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class OrderItem(Base):
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("order.id"))
    menu_item_id = Column(Integer, ForeignKey("menuitem.id"))
    quantity = Column(Integer, default=1)
    price = Column(Float)  # Snasphot of price at time of order

    order = relationship("Order", back_populates="items")
    menu_item = relationship("MenuItem")
