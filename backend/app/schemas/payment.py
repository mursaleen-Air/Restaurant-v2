from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class PaymentBase(BaseModel):
    amount: float
    payment_method: str

class PaymentCreate(PaymentBase):
    order_id: int

class Payment(PaymentBase):
    id: int
    order_id: int
    status: str
    created_at: datetime

    class Config:
        orm_mode = True
