 

from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime


# ─── Create (POST) ────────────────────────────────────────────────────────────
class PaySlipCreate(BaseModel):
    # Company
    company_id:       Optional[int]   = None

    # Pay period
    month:            str
    year:             int

    # Employee identity
    emp_id:           str
    emp_name:         Optional[str]   = None
    designation:      Optional[str]   = None
    department:       Optional[str]   = None

    # Statutory numbers
    uan_number:       Optional[str]   = None
    pf_number:        Optional[str]   = None
    pan_number:       Optional[str]   = None
    adhar_number:     Optional[str]   = None

    # Bank details
    bank_name:        Optional[str]   = None
    account_no:       Optional[str]   = None

    # Attendance
    working_days:     Optional[float] = 21
    paid_days:        Optional[float] = 21
    lop:              Optional[float] = 0
    pl:               Optional[str]   = None


    # Salary mode
    salary_mode:      Optional[str]   = 'auto'

    # Gross
    annual_gross:     Optional[float] = 0
    monthly_gross:    Optional[float] = 0
    gross_salary:     Optional[float] = 0   # backward compat alias

    # Earnings breakdown
    basic:            Optional[float] = 0
    da:               Optional[float] = 0
    hra:              Optional[float] = 0
    conveyance:       Optional[float] = 0
    medical:          Optional[float] = 0
    special:          Optional[float] = 0

    # Deductions
    pf_employee:      Optional[float] = 0
    esi_employee:     Optional[float] = 0
    prof_tax:         Optional[float] = 0
    loan_recovery:    Optional[float] = 0
    other_deduction:  Optional[float] = 0
    tds:              Optional[float] = 0
    total_deduction:  Optional[float] = 0

    # Legacy aliases (kept so old clients don't break)
    pf:               Optional[float] = 0
    esi:              Optional[float] = 0
    deductions:       Optional[float] = 0
    net_salary:       Optional[float] = 0

    @validator('emp_id')
    def emp_id_required(cls, v):
        if not v or not v.strip():
            raise ValueError('emp_id is required')
        return v.strip()


# ─── Response (GET) ───────────────────────────────────────────────────────────
class PaySlipResponse(PaySlipCreate):
    id:               int
    created_at:       Optional[datetime] = None
    created_by:       Optional[int]      = None
    created_by_name:  Optional[str]      = None
    company_name:     Optional[str]      = None

    class Config:
        from_attributes = True


# ─── Update (PUT) ─────────────────────────────────────────────────────────────
class PaySlipUpdate(BaseModel):
    month:            Optional[str]   = None
    year:             Optional[int]   = None
    emp_name:         Optional[str]   = None
    designation:      Optional[str]   = None
    department:       Optional[str]   = None
    uan_number:       Optional[str]   = None
    pf_number:        Optional[str]   = None
    pan_number:       Optional[str]   = None
    adhar_number:     Optional[str]   = None
    bank_name:        Optional[str]   = None
    account_no:       Optional[str]   = None
    working_days:     Optional[float] = None
    paid_days:        Optional[float] = None
    lop:              Optional[float] = None
    pl:               Optional[str]   = None
    salary_mode:      Optional[str]   = None
    annual_gross:     Optional[float] = None
    monthly_gross:    Optional[float] = None
    gross_salary:     Optional[float] = None
    basic:            Optional[float] = None
    da:               Optional[float] = None
    hra:              Optional[float] = None
    conveyance:       Optional[float] = None
    medical:          Optional[float] = None
    special:          Optional[float] = None
    pf_employee:      Optional[float] = None
    esi_employee:     Optional[float] = None
    prof_tax:         Optional[float] = None
    loan_recovery:    Optional[float] = None
    other_deduction:  Optional[float] = None
    tds:              Optional[float] = None
    total_deduction:  Optional[float] = None
    net_salary:       Optional[float] = None