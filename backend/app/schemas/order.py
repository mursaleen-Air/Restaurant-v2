from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from app.schemas.menu_item import MenuItemResponse

class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int
    price: Optional[float] = None  # For guest orders

class OrderItemResponse(BaseModel):
    id: int
    quantity: int
    price: float
    menu_item: Optional[MenuItemResponse] = None

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]

class GuestOrderCreate(BaseModel):
    """Order creation for guest checkout (no login required)"""
    customer_name: str
    customer_phone: str
    customer_address: Optional[str] = None
    notes: Optional[str] = None
    items: List[OrderItemCreate]
    total_amount: Optional[float] = None

class OrderStatusUpdate(BaseModel):
    status: str

class OrderResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_address: Optional[str] = None
    notes: Optional[str] = None
    total_amount: float
    status: str
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

