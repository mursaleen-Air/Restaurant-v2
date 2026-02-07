import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

# Login first
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    data={"username": "admin@gourmethaven.com", "password": "admin123"}
)
token = login_response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

print("Logged in successfully!")

# Get categories
categories = requests.get(f"{BASE_URL}/categories/").json()
print(f"Found {len(categories)} categories")

# Find or create categories we need
cat_map = {c["name"]: c["id"] for c in categories}

if "Appetizers" not in cat_map:
    resp = requests.post(f"{BASE_URL}/categories/", headers=headers, json={"name": "Appetizers", "description": "Starters"})
    cat_map["Appetizers"] = resp.json()["id"]
    print("Created Appetizers category")

if "Main Course" not in cat_map:
    resp = requests.post(f"{BASE_URL}/categories/", headers=headers, json={"name": "Main Course", "description": "Main dishes"})
    cat_map["Main Course"] = resp.json()["id"]
    print("Created Main Course category")

if "Beverages" not in cat_map:
    resp = requests.post(f"{BASE_URL}/categories/", headers=headers, json={"name": "Beverages", "description": "Drinks"})
    cat_map["Beverages"] = resp.json()["id"]
    print("Created Beverages category")

# Create menu items
menu_items = [
    {"name": "Garlic Bread", "description": "Toasted bread with garlic butter", "price": 5.99, "category_id": cat_map.get("Appetizers", 1), "is_available": True},
    {"name": "Mozzarella Sticks", "description": "Crispy fried cheese sticks", "price": 8.99, "category_id": cat_map.get("Appetizers", 1), "is_available": True},
    {"name": "Grilled Salmon", "description": "Fresh salmon with lemon butter", "price": 24.99, "category_id": cat_map.get("Main Course", 2), "is_available": True},
    {"name": "Beef Steak", "description": "Premium ribeye steak", "price": 29.99, "category_id": cat_map.get("Main Course", 2), "is_available": True},
    {"name": "Fresh Lemonade", "description": "House-made lemonade", "price": 4.99, "category_id": cat_map.get("Beverages", 3), "is_available": True},
]

for item in menu_items:
    resp = requests.post(f"{BASE_URL}/menu/", headers=headers, json=item)
    if resp.status_code == 200:
        print(f"Created: {item['name']}")
    else:
        print(f"Failed to create {item['name']}: {resp.status_code} - {resp.text}")

print("\nDone seeding menu items!")
