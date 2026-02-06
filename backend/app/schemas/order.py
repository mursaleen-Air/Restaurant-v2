from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from app.schemas.menu_item import MenuItemResponse

class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int

class OrderItemResponse(BaseModel):
    id: int
    quantity: int
    price: float
    menu_item: MenuItemResponse

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]

class OrderStatusUpdate(BaseModel):
    status: str

class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True
