import hashlib
import random
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import Session
from passlib.context import CryptContext

# ── ADJUST THIS: point these at your project's actual files ──
from database import Base, get_db      # noqa: E402
from models.user import User            # noqa: E402

from email_service import send_otp_email  # noqa: E402


# ──────────────────────────────────────────────
# Config
# ──────────────────────────────────────────────
OTP_VALIDITY_MINUTES = 5
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ──────────────────────────────────────────────
# DB Model — new table, doesn't touch your users table
# ──────────────────────────────────────────────
class PasswordResetOTP(Base):
    __tablename__ = "password_reset_otps"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), index=True, nullable=False)
    otp_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


# ──────────────────────────────────────────────
# Request schemas
# ──────────────────────────────────────────────
class SendOtpRequest(BaseModel):
    email: EmailStr


class VerifyOtpRequest(BaseModel):
    email: EmailStr
    otp: str


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str


# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────
def generate_otp() -> str:
    return f"{random.randint(0, 999999):06d}"


def hash_otp(otp: str) -> str:
    return hashlib.sha256(otp.encode()).hexdigest()


def get_latest_otp_row(db: Session, email: str):
    return (
        db.query(PasswordResetOTP)
        .filter(PasswordResetOTP.email == email)
        .order_by(PasswordResetOTP.id.desc())
        .first()
    )


# ──────────────────────────────────────────────
# Router
# ──────────────────────────────────────────────
router = APIRouter(prefix="/auth/forgot-password", tags=["Forgot Password"])


@router.post("/send-otp")
def send_otp(payload: SendOtpRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email")

    # clear any previous OTPs for this email so old ones can't be reused
    db.query(PasswordResetOTP).filter(PasswordResetOTP.email == payload.email).delete()
    db.commit()

    otp = generate_otp()
    otp_row = PasswordResetOTP(
        email=payload.email,
        otp_hash=hash_otp(otp),
        expires_at=datetime.utcnow() + timedelta(minutes=OTP_VALIDITY_MINUTES),
        is_verified=False,
    )
    db.add(otp_row)
    db.commit()

    try:
        send_otp_email(payload.email, otp)
    except Exception as e:
        # roll back the OTP row if email sending failed, so the user can retry cleanly
        db.delete(otp_row)
        db.commit()
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "OTP sent successfully to your email"}


@router.post("/verify-otp")
def verify_otp(payload: VerifyOtpRequest, db: Session = Depends(get_db)):
    otp_row = get_latest_otp_row(db, payload.email)

    if not otp_row:
        raise HTTPException(status_code=400, detail="No OTP request found. Please request a new OTP")

    if datetime.utcnow() > otp_row.expires_at:
        raise HTTPException(status_code=400, detail="OTP expired. Please resend")

    if otp_row.otp_hash != hash_otp(payload.otp):
        raise HTTPException(status_code=400, detail="Invalid OTP")

    otp_row.is_verified = True
    db.commit()

    return {"message": "OTP verified successfully"}


@router.post("/reset")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    if len(payload.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")

    otp_row = get_latest_otp_row(db, payload.email)

    if not otp_row or not otp_row.is_verified:
        raise HTTPException(status_code=400, detail="OTP not verified. Please verify OTP first")

    if datetime.utcnow() > otp_row.expires_at:
        raise HTTPException(status_code=400, detail="OTP expired. Please request a new OTP")

    if otp_row.otp_hash != hash_otp(payload.otp):
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # user.hashed_password = pwd_context.hash(payload.new_password)
    user.password_hash = pwd_context.hash(payload.new_password)

    db.commit()

    # one-time use: remove the OTP row after a successful reset
    db.delete(otp_row)
    db.commit()

    return {"message": "Password reset successful"}