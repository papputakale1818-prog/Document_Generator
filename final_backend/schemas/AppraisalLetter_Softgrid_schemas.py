

from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class AppraisalLetterCreate(BaseModel):
    emp_id: Optional[str] = None
    employee_name: Optional[str] = None
    designation: Optional[str] = None
    old_ctc: Optional[float] = None
    new_ctc: Optional[float] = None
    effective_date: Optional[date] = None
    company_id: Optional[int] = None


class AppraisalLetterOut(AppraisalLetterCreate):
    id: int
    created_by: Optional[int] = None
    created_by_name: Optional[str] = None
    company_name: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True