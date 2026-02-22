import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.db.base import Base
from app.db.session import engine, SessionLocal

from app.core.config import settings
from app.core import security
from app.routers import auth, users, categories, menu, orders, admin, test_role, upload, tenants
# Import all models to ensure SQLAlchemy relationships are properly resolved
from app.models import Tenant, Plan, Subscription, User, Category, MenuItem, OrderItem, Payment, Order

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set CORS - allow all origins in development, or specific origins if configured
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # Allow all origins for local development
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Serve static files from uploads directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(categories.router, prefix=f"{settings.API_V1_STR}/categories", tags=["categories"])
app.include_router(menu.router, prefix=f"{settings.API_V1_STR}/menu", tags=["menu"])
app.include_router(orders.router, prefix=f"{settings.API_V1_STR}/orders", tags=["orders"])
app.include_router(admin.router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(upload.router, prefix=f"{settings.API_V1_STR}/upload", tags=["upload"])
app.include_router(tenants.router, prefix=f"{settings.API_V1_STR}/tenants", tags=["tenants"])
app.include_router(test_role.router, prefix="/test-role", tags=["Role Test"])

@app.on_event("startup")
def on_startup():
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Seed default subscription plans
        if db.query(Plan).count() == 0:
            plans = [
                Plan(
                    name="Free",
                    description="Get started with basic features",
                    price_monthly=0.0,
                    max_menu_items=10,
                    max_orders_per_month=50,
                    analytics_enabled=False,
                    priority_support=False,
                    is_active=True
                ),
                Plan(
                    name="Pro",
                    description="Perfect for growing restaurants",
                    price_monthly=29.0,
                    max_menu_items=50,
                    max_orders_per_month=-1,  # Unlimited
                    analytics_enabled=True,
                    priority_support=False,
                    is_active=True
                ),
                Plan(
                    name="Enterprise",
                    description="Full features for large operations",
                    price_monthly=99.0,
                    max_menu_items=-1,  # Unlimited
                    max_orders_per_month=-1,  # Unlimited
                    analytics_enabled=True,
                    priority_support=True,
                    is_active=True
                )
            ]
            db.add_all(plans)
            db.commit()
            print("Created default subscription plans")
        
        # Create platform admin if it doesn't exist
        user = db.query(User).filter(User.email == settings.FIRST_SUPERUSER).first()
        if not user:
            user = User(
                email=settings.FIRST_SUPERUSER,
                name="Platform Admin",
                hashed_password=security.get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                role="platform_admin"
            )
            db.add(user)
            db.commit()
            print(f"Created platform admin: {settings.FIRST_SUPERUSER}")
        else:
            # Ensure the user has platform_admin role
            if user.role not in ["admin", "platform_admin"]:
                user.role = "platform_admin"
                db.commit()
                print(f"Updated {settings.FIRST_SUPERUSER} to platform_admin role")
    except Exception as e:
        print(f"Error during startup: {e}")
        db.rollback()
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Welcome to Restaurant Management API"}
