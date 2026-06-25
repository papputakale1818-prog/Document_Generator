#                      # ← user चं name
# from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
# from sqlalchemy.orm import relationship
# from sqlalchemy.sql import func
# from database import Base

# class PaySlip(Base):
#     __tablename__ = "payslips"
#     __table_args__ = {'extend_existing': True}

#     id           = Column(Integer, primary_key=True, index=True)
#     emp_id       = Column(String(50), ForeignKey("employees.emp_id"), nullable=False, index=True)
#     month        = Column(String(20), nullable=False)
#     year         = Column(Integer,    nullable=False)
#     gross_salary = Column(Float,      default=0)
#     net_salary   = Column(Float,      default=0)
#     working_days = Column(Float,      default=21)
#     paid_days    = Column(Float,      default=21)
#     pf           = Column(Float,      default=0)
#     esi          = Column(Float,      default=0)
#     deductions   = Column(Float,      default=0)
#     created_at   = Column(DateTime(timezone=True), server_default=func.now())

#     # ── Created by (logged in user) ──────────────────────────────────────────
#     created_by   = Column(Integer, ForeignKey("users.id"), nullable=True)
#     creator      = relationship("User", foreign_keys=[created_by])

# model_PaySlip.py  — PaySlip SQLAlchemy Model (COMPLETE — सगळे fields)
# Replace your existing PaySlip model with this.
# Migration: alembic upgrade head  OR  drop + recreate payslips table.

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class PaySlip(Base):
    __tablename__ = "payslips"
    __table_args__ = {'extend_existing': True}

    # ── Primary key ───────────────────────────────────────────────────────────
    id             = Column(Integer, primary_key=True, index=True)

    # ── Company (multi-tenant) ────────────────────────────────────────────────
    company_id     = Column(Integer, ForeignKey("companies.id"), nullable=True, index=True)

    # ── Pay Period ────────────────────────────────────────────────────────────
    month          = Column(String(20),  nullable=False)
    year           = Column(Integer,     nullable=False)

    # ── Employee identity ─────────────────────────────────────────────────────
    emp_id         = Column(String(50),  ForeignKey("employees.emp_id"), nullable=False, index=True)
    emp_name       = Column(String(150), nullable=True)
    designation    = Column(String(100), nullable=True)
    department     = Column(String(100), nullable=True)

    # ── Statutory numbers ─────────────────────────────────────────────────────
    uan_number     = Column(String(50),  nullable=True)
    pf_number      = Column(String(50),  nullable=True)
    pan_number     = Column(String(20),  nullable=True)
    adhar_number   = Column(String(30),  nullable=True)

    # ── Bank details ──────────────────────────────────────────────────────────
    bank_name      = Column(String(100), nullable=True)
    account_no     = Column(String(50),  nullable=True)

    # ── Attendance ────────────────────────────────────────────────────────────
    working_days   = Column(Float, default=21)
    paid_days      = Column(Float, default=21)
    lop            = Column(Float, default=0)     # Loss of Pay days
    pl             = Column(String(50), nullable=True)  # PL / leave balance

    # ── Salary mode ('auto' | 'custom') ──────────────────────────────────────
    salary_mode    = Column(String(10), default='auto')

    # ── Gross ─────────────────────────────────────────────────────────────────
    annual_gross   = Column(Float, default=0)
    monthly_gross  = Column(Float, default=0)   # = gross_salary (renamed for clarity)
    gross_salary   = Column(Float, default=0)   # keep for backward compat

    # ── Earnings breakdown ────────────────────────────────────────────────────
    basic          = Column(Float, default=0)
    da             = Column(Float, default=0)
    hra            = Column(Float, default=0)
    conveyance     = Column(Float, default=0)
    medical        = Column(Float, default=0)
    special        = Column(Float, default=0)

    # ── Deductions ────────────────────────────────────────────────────────────
    pf_employee    = Column(Float, default=0)    # PF amount (0 = toggle OFF)
    esi_employee   = Column(Float, default=0)    # ESI amount (0 = toggle OFF or not applicable)
    prof_tax       = Column(Float, default=0)    # Professional Tax (fixed ₹200)
    loan_recovery  = Column(Float, default=0)
    other_deduction= Column(Float, default=0)
    tds            = Column(Float, default=0)
    total_deduction= Column(Float, default=0)

    # ── Legacy columns (kept for backward compat — mapped to new ones) ────────
    pf             = Column(Float, default=0)    # old name for pf_employee
    esi            = Column(Float, default=0)    # old name for esi_employee
    deductions     = Column(Float, default=0)    # old name for total_deduction
    net_salary     = Column(Float, default=0)

    # ── Audit ─────────────────────────────────────────────────────────────────
    created_at     = Column(DateTime(timezone=True), server_default=func.now())
    created_by     = Column(Integer, ForeignKey("users.id"), nullable=True)
    creator        = relationship("User", foreign_keys=[created_by])