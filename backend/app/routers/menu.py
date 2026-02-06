from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import require_admin
from app.models.menu_item import MenuItem
from app.models.category import Category
from app.schemas.menu_item import MenuItemCreate, MenuItemUpdate, MenuItemResponse

router = APIRouter()

@router.post("/", response_model=MenuItemResponse)
def create_menu_item(
    item: MenuItemCreate, 
    db: Session = Depends(get_db), 
    current_user = Depends(require_admin)
):
    # Check if category exists
    category = db.query(Category).filter(Category.id == item.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
        
    new_item = MenuItem(**item.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/{item_id}", response_model=MenuItemResponse)
def update_menu_item(
    item_id: int, 
    item_update: MenuItemUpdate, 
    db: Session = Depends(get_db), 
    current_user = Depends(require_admin)
):
    db_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    update_data = item_update.dict(exclude_unset=True)
    if not update_data:
        return db_item
    
    # If category_id is being updated, verify it exists
    if "category_id" in update_data:
        category = db.query(Category).filter(Category.id == update_data["category_id"]).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

    for key, value in update_data.items():
        setattr(db_item, key, value)
    
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menu_item(
    item_id: int, 
    db: Session = Depends(get_db), 
    current_user = Depends(require_admin)
):
    db_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    db.delete(db_item)
    db.commit()
    return None

@router.get("/", response_model=List[MenuItemResponse])
def read_menu_items(
    skip: int = 0, 
    limit: int = 100, 
    category_id: int = None,
    db: Session = Depends(get_db)
):
    query = db.query(MenuItem)
    if category_id:
        query = query.filter(MenuItem.category_id == category_id)
    items = query.offset(skip).limit(limit).all()
    return items

@router.get("/{item_id}", response_model=MenuItemResponse)
def read_menu_item(
    item_id: int, 
    db: Session = Depends(get_db)
):
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item
