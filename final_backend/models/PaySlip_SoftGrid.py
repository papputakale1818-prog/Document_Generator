                     # ← user चं name
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class PaySlip(Base):
    __tablename__ = "payslips"
    __table_args__ = {'extend_existing': True}

    id           = Column(Integer, primary_key=True, index=True)
    emp_id       = Column(String(50), ForeignKey("employees.emp_id"), nullable=False, index=True)
    month        = Column(String(20), nullable=False)
    year         = Column(Integer,    nullable=False)
    gross_salary = Column(Float,      default=0)
    net_salary   = Column(Float,      default=0)
    working_days = Column(Float,      default=21)
    paid_days    = Column(Float,      default=21)
    pf           = Column(Float,      default=0)
    esi          = Column(Float,      default=0)
    deductions   = Column(Float,      default=0)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    # ── Created by (logged in user) ──────────────────────────────────────────
    created_by   = Column(Integer, ForeignKey("users.id"), nullable=True)
    creator      = relationship("User", foreign_keys=[created_by])