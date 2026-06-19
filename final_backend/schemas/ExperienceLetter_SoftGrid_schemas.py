from pydantic import BaseModel
from typing import Optional
from datetime import date


class ExperienceLetterCreate(BaseModel):
    emp_id:       Optional[str]  = None
    letter_date:  Optional[date] = None
    company_id:   Optional[int]  = None


class ExperienceLetterOut(BaseModel):
    id:           int
    emp_id:       Optional[str]  = None
    letter_date:  Optional[date] = None
    company_id:   Optional[int]  = None
    created_by:   Optional[int]  = None
    created_by_name: Optional[str] = None

    class Config:
        from_attributes = True