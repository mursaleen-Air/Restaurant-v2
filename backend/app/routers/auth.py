from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core import security
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token, UserLogin

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == user_in.email).first()
        if user:
            raise HTTPException(
                status_code=400,
                detail="The user with this email already exists in the system.",
            )
        user = User(
            email=user_in.email,
            name=user_in.name,
            hashed_password=security.get_password_hash(user_in.password),
            role="customer"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    OAuth2 compatible login endpoint.
    Use 'username' field for email address.
    """
    print(f"Login attempt for: {form_data.username}")
    
    # OAuth2 form uses 'username' field, but we use it as email
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user:
        print(f"User not found: {form_data.username}")
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    print(f"User found: {user.email}, role: {user.role}")
    
    if not security.verify_password(form_data.password, user.hashed_password):
        print(f"Password verification failed for: {form_data.username}")
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    print(f"Login successful for: {form_data.username}")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.email, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login-json", response_model=Token)
def login_json(user_in: UserLogin, db: Session = Depends(get_db)):
    """
    JSON body login endpoint for frontend use.
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not security.verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=400, detail="Incorrect email or password"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.email, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/debug/users")
def debug_users(db: Session = Depends(get_db)):
    """Debug endpoint to list all users (remove in production)"""
    users = db.query(User).all()
    return [{"id": u.id, "email": u.email, "role": u.role} for u in users]

@router.post("/debug/reset-password")
def reset_password(email: str, new_password: str, db: Session = Depends(get_db)):
    """Debug endpoint to reset a user's password (remove in production)"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.hashed_password = security.get_password_hash(new_password)
    db.commit()
    return {"message": f"Password reset for {email}"}

@router.post("/debug/create-admin")
def create_admin(db: Session = Depends(get_db)):
    """Debug endpoint to create admin user (remove in production)"""
    email = settings.FIRST_SUPERUSER
    password = settings.FIRST_SUPERUSER_PASSWORD
    
    user = db.query(User).filter(User.email == email).first()
    if user:
        # Update password and role
        user.hashed_password = security.get_password_hash(password)
        user.role = "admin"
        db.commit()
        return {"message": f"Admin user {email} password reset and role updated"}
    
    user = User(
        email=email,
        name="Admin",
        hashed_password=security.get_password_hash(password),
        role="admin"
    )
    db.add(user)
    db.commit()
    return {"message": f"Admin user {email} created"}
