from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

# ─── Create (POST) ────────────────────────────────────────────────────────────
class PaySlipCreate(BaseModel):
    emp_id:       str
    month:        str
    year:         int
    gross_salary: Optional[float] = 0
    net_salary:   Optional[float] = 0
    working_days: Optional[float] = 21
    paid_days:    Optional[float] = 21
    pf:           Optional[float] = 0
    esi:          Optional[float] = 0
    deductions:   Optional[float] = 0

    @validator('emp_id')
    def emp_id_required(cls, v):
        if not v or not v.strip():
            raise ValueError('emp_id is required')
        return v.strip()

# ─── Response (GET) ───────────────────────────────────────────────────────────
class PaySlipResponse(PaySlipCreate):
    id:              int
    created_at:      Optional[datetime] = None
    created_by:      Optional[int]      = None  # ← user ID
    created_by_name: Optional[str]      = None  # ← user चं name

    class Config:
        from_attributes = True

# ─── Update (PUT) ─────────────────────────────────────────────────────────────
class PaySlipUpdate(BaseModel):
    month:        Optional[str]   = None
    year:         Optional[int]   = None
    gross_salary: Optional[float] = None
    net_salary:   Optional[float] = None
    working_days: Optional[float] = None
    paid_days:    Optional[float] = None
    pf:           Optional[float] = None
    esi:          Optional[float] = None
    deductions:   Optional[float] = None