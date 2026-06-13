from pydantic import BaseModel, EmailStr
from typing import Optional

class RegisterSchema(BaseModel):
    name:     str
    email:    EmailStr
    password: str
    mobile:   Optional[str] = None

class LoginSchema(BaseModel):
    email:    EmailStr
    password: str

class UserInfo(BaseModel):
    id:    int
    name:  str
    email: str
    role:  Optional[str] = None

class TokenSchema(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user:         UserInfo

class ChangePasswordRequest(BaseModel):
    email:        str
    old_password: str
    new_password: str