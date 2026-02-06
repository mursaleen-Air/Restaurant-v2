from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class MenuItemBase(BaseModel):
    name: str
    description: str
    price: float
    image_url: Optional[str] = None
    is_available: bool = True
    category_id: int

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None
    category_id: Optional[int] = None

class MenuItemResponse(MenuItemBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
