"""
Run this script to seed the database with sample categories and menu items.
Usage: python -m app.db.seed
"""
from app.db.session import SessionLocal
from app.models.category import Category
from app.models.menu_item import MenuItem

def seed_database():
    db = SessionLocal()
    try:
        # Check if data already exists
        existing_categories = db.query(Category).count()
        if existing_categories > 0:
            print("Database already has categories. Skipping seed.")
            return
        
        # Create categories
        categories_data = [
            {"name": "Appetizers", "description": "Start your meal with these delicious starters"},
            {"name": "Main Course", "description": "Hearty and satisfying main dishes"},
            {"name": "Desserts", "description": "Sweet treats to end your meal"},
            {"name": "Beverages", "description": "Refreshing drinks and cocktails"},
            {"name": "Salads", "description": "Fresh and healthy salad options"},
        ]
        
        categories = {}
        for cat_data in categories_data:
            category = Category(**cat_data)
            db.add(category)
            db.flush()
            categories[cat_data["name"]] = category.id
            print(f"Created category: {cat_data['name']}")
        
        # Create menu items
        menu_items_data = [
            # Appetizers
            {"name": "Garlic Bread", "description": "Toasted bread with garlic butter and herbs", "price": 5.99, "category_id": categories["Appetizers"], "is_available": True},
            {"name": "Mozzarella Sticks", "description": "Crispy fried mozzarella with marinara sauce", "price": 8.99, "category_id": categories["Appetizers"], "is_available": True},
            {"name": "Bruschetta", "description": "Grilled bread topped with tomatoes, basil, and olive oil", "price": 7.99, "category_id": categories["Appetizers"], "is_available": True},
            
            # Main Course
            {"name": "Grilled Salmon", "description": "Fresh Atlantic salmon with lemon butter sauce", "price": 24.99, "category_id": categories["Main Course"], "is_available": True},
            {"name": "Beef Steak", "description": "12oz ribeye steak cooked to perfection", "price": 29.99, "category_id": categories["Main Course"], "is_available": True},
            {"name": "Chicken Parmesan", "description": "Breaded chicken with marinara and melted mozzarella", "price": 18.99, "category_id": categories["Main Course"], "is_available": True},
            {"name": "Pasta Carbonara", "description": "Creamy pasta with bacon and parmesan", "price": 16.99, "category_id": categories["Main Course"], "is_available": True},
            
            # Desserts
            {"name": "Chocolate Lava Cake", "description": "Warm chocolate cake with molten center", "price": 8.99, "category_id": categories["Desserts"], "is_available": True},
            {"name": "Tiramisu", "description": "Classic Italian coffee-flavored dessert", "price": 7.99, "category_id": categories["Desserts"], "is_available": True},
            {"name": "Cheesecake", "description": "New York style cheesecake with berry compote", "price": 7.99, "category_id": categories["Desserts"], "is_available": True},
            
            # Beverages
            {"name": "Fresh Lemonade", "description": "House-made lemonade with fresh lemons", "price": 4.99, "category_id": categories["Beverages"], "is_available": True},
            {"name": "Iced Tea", "description": "Freshly brewed iced tea", "price": 3.99, "category_id": categories["Beverages"], "is_available": True},
            {"name": "Coffee", "description": "Premium roast coffee", "price": 3.49, "category_id": categories["Beverages"], "is_available": True},
            
            # Salads
            {"name": "Caesar Salad", "description": "Romaine lettuce with caesar dressing and croutons", "price": 12.99, "category_id": categories["Salads"], "is_available": True},
            {"name": "Greek Salad", "description": "Fresh vegetables with feta cheese and olives", "price": 11.99, "category_id": categories["Salads"], "is_available": True},
        ]
        
        for item_data in menu_items_data:
            menu_item = MenuItem(**item_data)
            db.add(menu_item)
            print(f"Created menu item: {item_data['name']}")
        
        db.commit()
        print("\nDatabase seeded successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
