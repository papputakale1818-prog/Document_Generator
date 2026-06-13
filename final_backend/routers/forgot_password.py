# routers/forgot_password.py
# This file exists because main.py imports it.
# Change-password logic is handled in routers/auth.py
# This file is kept as a placeholder to avoid import errors.

from fastapi import APIRouter

router = APIRouter(prefix="/forgot-password", tags=["Forgot Password"])

# Change password route is available at POST /auth/change-password