from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database import Base

class PaySlip(Base):
    __tablename__ = "payslips"
    __table_args__ = {'extend_existing': True}

    id               = Column(Integer, primary_key=True, index=True)
    company_id       = Column(Integer, ForeignKey("companies.id"), nullable=True)

    # Pay Period
    month            = Column(String(20),  nullable=False)
    year             = Column(Integer,     nullable=False)

    # Employee Info
    emp_id           = Column(String(50),  nullable=True)
    emp_name         = Column(String(150), nullable=False)
    designation      = Column(String(100), nullable=True)
    department       = Column(String(100), nullable=True)

    # Identity & Bank
    uan_number       = Column(String(30),  nullable=True)
    pf_number        = Column(String(30),  nullable=True)
    pan_number       = Column(String(20),  nullable=True)
    adhar_number     = Column(String(20),  nullable=True)
    bank_name        = Column(String(100), nullable=True)
    account_no       = Column(String(30),  nullable=True)

    # Attendance
    paid_days        = Column(Float, default=21)
    working_days     = Column(Float, default=21)
    lop              = Column(Float, default=0)
    pl               = Column(String(50),  nullable=True)

    # Salary
    annual_gross     = Column(Float, default=0)
    monthly_gross    = Column(Float, default=0)
    basic            = Column(Float, default=0)
    da               = Column(Float, default=0)
    hra              = Column(Float, default=0)
    conveyance       = Column(Float, default=0)
    medical          = Column(Float, default=0)
    special          = Column(Float, default=0)
    salary_mode      = Column(String(10), default="auto")  # 'auto' | 'custom'

    # Deductions
    pf_employee      = Column(Float, default=0)
    esi_employee     = Column(Float, default=0)
    prof_tax         = Column(Float, default=200)
    loan_recovery    = Column(Float, default=0)
    other_deduction  = Column(Float, default=0)
    tds              = Column(Float, default=0)
    total_deduction  = Column(Float, default=0)
    net_salary       = Column(Float, default=0)

    # Meta
    created_by       = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())