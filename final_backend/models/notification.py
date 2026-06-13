
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime


class Notification(Base):
    __tablename__ = "notifications"

    id               = Column(Integer, primary_key=True, index=True)
    type             = Column(String(50))
    status           = Column(String(20),  default="pending")
    company_id       = Column(Integer, ForeignKey("companies.id"), nullable=True)

    # ── Employee ID (frontend पाठवतो — auto किंवा manual) ─────────────────────
    emp_id           = Column(String(20),  nullable=True)

    # ── Personal ──────────────────────────────────────────────────────────────
    full_name        = Column(String(100))
    dob              = Column(String(20),  nullable=True)
    gender           = Column(String(10),  nullable=True)
    blood_group      = Column(String(5),   nullable=True)
    personal_email   = Column(String(100), nullable=True)
    mobile           = Column(String(15))

    # ── Employment ────────────────────────────────────────────────────────────
    designation      = Column(String(100), nullable=True)
    department       = Column(String(100), nullable=True)
    emp_type         = Column(String(30),  nullable=True)

    # ── Documents ─────────────────────────────────────────────────────────────
    pan              = Column(String(15),  nullable=True)
    aadhar           = Column(String(20),  nullable=True)
    bank_acc         = Column(String(30),  nullable=True)
    ifsc             = Column(String(15),  nullable=True)
    bank_name        = Column(String(100), nullable=True)

    # ── Address ───────────────────────────────────────────────────────────────
    address          = Column(String(300), nullable=True)
    city             = Column(String(50),  nullable=True)
    state            = Column(String(50),  nullable=True)
    pin              = Column(String(10),  nullable=True)

    # ── Graduation ────────────────────────────────────────────────────────────
    grad_degree      = Column(String(100), nullable=True)
    grad_college     = Column(String(200), nullable=True)
    grad_university  = Column(String(200), nullable=True)
    grad_year        = Column(String(4),   nullable=True)
    grad_grade       = Column(String(20),  nullable=True)

    # ── Post Graduation ───────────────────────────────────────────────────────
    pg_degree        = Column(String(100), nullable=True)
    pg_college       = Column(String(200), nullable=True)
    pg_university    = Column(String(200), nullable=True)
    pg_year          = Column(String(4),   nullable=True)
    pg_grade         = Column(String(20),  nullable=True)

    # ── Meta ──────────────────────────────────────────────────────────────────
    generated_emp_id = Column(String(20),  nullable=True)
    created_at       = Column(DateTime,    default=datetime.datetime.utcnow)

    company          = relationship("Company", foreign_keys=[company_id])