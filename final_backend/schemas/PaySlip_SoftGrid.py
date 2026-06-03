# from pydantic import BaseModel
# from typing import Optional
# from datetime import datetime

# # ─── Create (POST) ────────────────────────────────────────────────────────────
# class PaySlipCreate(BaseModel):
#     company_id:      Optional[int]   = None

#     # Pay Period
#     month:           str
#     year:            int

#     # Employee Info
#     emp_id:          Optional[str]   = None
#     emp_name:        str
#     designation:     Optional[str]   = None
#     department:      Optional[str]   = None

#     # Identity & Bank
#     uan_number:      Optional[str]   = None
#     pf_number:       Optional[str]   = None
#     pan_number:      Optional[str]   = None
#     adhar_number:    Optional[str]   = None
#     bank_name:       Optional[str]   = None
#     account_no:      Optional[str]   = None

#     # Attendance
#     paid_days:       Optional[float] = 21
#     working_days:    Optional[float] = 21
#     lop:             Optional[float] = 0
#     pl:              Optional[str]   = None

#     # Salary
#     annual_gross:    Optional[float] = 0
#     monthly_gross:   Optional[float] = 0
#     basic:           Optional[float] = 0
#     da:              Optional[float] = 0
#     hra:             Optional[float] = 0
#     conveyance:      Optional[float] = 0
#     medical:         Optional[float] = 0
#     special:         Optional[float] = 0
#     salary_mode:     Optional[str]   = "auto"

#     # Deductions
#     pf_employee:     Optional[float] = 0
#     esi_employee:    Optional[float] = 0
#     prof_tax:        Optional[float] = 200
#     loan_recovery:   Optional[float] = 0
#     other_deduction: Optional[float] = 0
#     tds:             Optional[float] = 0
#     total_deduction: Optional[float] = 0
#     net_salary:      Optional[float] = 0


# # ─── Response (GET) ───────────────────────────────────────────────────────────
# class PaySlipResponse(PaySlipCreate):
#     id:              int
#     created_by:      Optional[int]      = None
#     created_at:      Optional[datetime] = None

#     class Config:
#         from_attributes = True


# # ─── Update (PUT) ─────────────────────────────────────────────────────────────
# class PaySlipUpdate(BaseModel):
#     month:           Optional[str]   = None
#     year:            Optional[int]   = None
#     emp_name:        Optional[str]   = None
#     designation:     Optional[str]   = None
#     department:      Optional[str]   = None
#     uan_number:      Optional[str]   = None
#     pf_number:       Optional[str]   = None
#     pan_number:      Optional[str]   = None
#     adhar_number:    Optional[str]   = None
#     bank_name:       Optional[str]   = None
#     account_no:      Optional[str]   = None
#     paid_days:       Optional[float] = None
#     working_days:    Optional[float] = None
#     lop:             Optional[float] = None
#     pl:              Optional[str]   = None
#     annual_gross:    Optional[float] = None
#     monthly_gross:   Optional[float] = None
#     basic:           Optional[float] = None
#     da:              Optional[float] = None
#     hra:             Optional[float] = None
#     conveyance:      Optional[float] = None
#     medical:         Optional[float] = None
#     special:         Optional[float] = None
#     salary_mode:     Optional[str]   = None
#     pf_employee:     Optional[float] = None
#     esi_employee:    Optional[float] = None
#     prof_tax:        Optional[float] = None
#     loan_recovery:   Optional[float] = None
#     other_deduction: Optional[float] = None
#     tds:             Optional[float] = None
#     total_deduction: Optional[float] = None
#     net_salary:      Optional[float] = None
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# ─── Create (POST) ────────────────────────────────────────────────────────────
class PaySlipCreate(BaseModel):
    company_id:      Optional[int]   = None

    # Pay Period
    month:           str
    year:            int

    # Employee Info
    emp_id:          Optional[str]   = None
    emp_name:        str
    designation:     Optional[str]   = None
    department:      Optional[str]   = None

    # Identity & Bank
    uan_number:      Optional[str]   = None
    pf_number:       Optional[str]   = None
    pan_number:      Optional[str]   = None
    adhar_number:    Optional[str]   = None
    bank_name:       Optional[str]   = None
    account_no:      Optional[str]   = None

    # Attendance
    paid_days:       Optional[float] = 21
    working_days:    Optional[float] = 21
    lop:             Optional[float] = 0
    pl:              Optional[str]   = None

    # Salary
    annual_gross:    Optional[float] = 0
    monthly_gross:   Optional[float] = 0
    basic:           Optional[float] = 0
    da:              Optional[float] = 0
    hra:             Optional[float] = 0
    conveyance:      Optional[float] = 0
    medical:         Optional[float] = 0
    special:         Optional[float] = 0
    salary_mode:     Optional[str]   = "auto"

    # Deductions
    pf_employee:     Optional[float] = 0
    esi_employee:    Optional[float] = 0
    prof_tax:        Optional[float] = 200
    loan_recovery:   Optional[float] = 0
    other_deduction: Optional[float] = 0
    tds:             Optional[float] = 0
    total_deduction: Optional[float] = 0
    net_salary:      Optional[float] = 0


# ─── Response (GET) ───────────────────────────────────────────────────────────
class PaySlipResponse(PaySlipCreate):
    id:                int
    created_by:        Optional[int]      = None
    created_at:        Optional[datetime] = None
    created_by_name:   Optional[str]      = None   # ← NEW: कोणी assign केलं
    company_name:      Optional[str]      = None   # ← NEW: कोणत्या company चं

    class Config:
        from_attributes = True


# ─── Update (PUT) ─────────────────────────────────────────────────────────────
class PaySlipUpdate(BaseModel):
    month:           Optional[str]   = None
    year:            Optional[int]   = None
    emp_name:        Optional[str]   = None
    designation:     Optional[str]   = None
    department:      Optional[str]   = None
    uan_number:      Optional[str]   = None
    pf_number:       Optional[str]   = None
    pan_number:      Optional[str]   = None
    adhar_number:    Optional[str]   = None
    bank_name:       Optional[str]   = None
    account_no:      Optional[str]   = None
    paid_days:       Optional[float] = None
    working_days:    Optional[float] = None
    lop:             Optional[float] = None
    pl:              Optional[str]   = None
    annual_gross:    Optional[float] = None
    monthly_gross:   Optional[float] = None
    basic:           Optional[float] = None
    da:              Optional[float] = None
    hra:             Optional[float] = None
    conveyance:      Optional[float] = None
    medical:         Optional[float] = None
    special:         Optional[float] = None
    salary_mode:     Optional[str]   = None
    pf_employee:     Optional[float] = None
    esi_employee:    Optional[float] = None
    prof_tax:        Optional[float] = None
    loan_recovery:   Optional[float] = None
    other_deduction: Optional[float] = None
    tds:             Optional[float] = None
    total_deduction: Optional[float] = None
    net_salary:      Optional[float] = None