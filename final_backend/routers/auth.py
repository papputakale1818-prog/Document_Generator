 
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models.user import User
from services.auth_service import verify_password, hash_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


# ── Schemas ───────────────────────────────────────────────────────────────────

class ChangePasswordRequest(BaseModel):
    email:        str
    old_password: str
    new_password: str


# ── Login ─────────────────────────────────────────────────────────────────────

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db:        Session                   = Depends(get_db),
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"user_id": user.id, "email": user.email})
    return {
        "access_token": token,
        "token_type":   "bearer",
        "user": {
            "id":          user.id,
            "email":       user.email,
            "name":        user.name,
            "role":        user.role,
            "mobile":      user.mobile,
            "department":  user.department,
            "designation": user.designation,
            "company_id":  user.company_id,
        }
    }


# ── Change Password ───────────────────────────────────────────────────────────

@router.post("/change-password")
def change_password(data: ChangePasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")
    if not verify_password(data.old_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Old password is incorrect")
    if data.old_password == data.new_password:
        raise HTTPException(status_code=400, detail="New password must be different from old password")
    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
    user.password_hash = hash_password(data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}