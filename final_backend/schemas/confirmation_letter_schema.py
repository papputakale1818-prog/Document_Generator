from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


# ---------- Save (DB me jaycha) ----------
class ConfirmationLetterCreate(BaseModel):
    emp_id: str
    company_id: int
    letter_date: date
    created_by: Optional[str] = None


class ConfirmationLetterOut(BaseModel):
    id: int
    emp_id: str
    company_id: int
    letter_date: date
    created_by: Optional[str] = None
    created_at: Optional[datetime] = None
    created_by_name: Optional[str] = None

    class Config:
        from_attributes = True


# ---------- Fetch employee (PDF display sathi, DB la save nahi) ----------
class ConfirmationEmployeeOut(BaseModel):
    emp_id: str
    full_name: str
    designation: Optional[str] = None
    joining_date: Optional[date] = None

    class Config:
        from_attributes = True