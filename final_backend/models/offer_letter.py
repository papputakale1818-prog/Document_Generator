
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class OfferLetter(Base):
    __tablename__ = "offer_letters"
    __table_args__ = {'extend_existing': True}

    id              = Column(Integer, primary_key=True, index=True)

    # ── Created by (logged in user) ──────────────────────────────────────────
    created_by      = Column(Integer, ForeignKey("users.id"), nullable=True)
    creator         = relationship("User", foreign_keys=[created_by])

    # ── Company ──────────────────────────────────────────────────────────────
    company_id      = Column(Integer, ForeignKey("companies.id"), nullable=True)
    company         = relationship("Company", foreign_keys=[company_id])

    # ── Employee Info ────────────────────────────────────────────────────────
    full_name       = Column(String(150), nullable=False)
    # candidate_name  = Column(String(150), nullable=True)
    designation     = Column(String(150), nullable=True)
    department      = Column(String(150), nullable=True)
    manager         = Column(String(150), nullable=True)
    location        = Column(String(200), nullable=True)

    # ── Dates ────────────────────────────────────────────────────────────────
    offer_date      = Column(String(20),  nullable=True)
    joining_date    = Column(String(20),  nullable=True)
    appoint_date    = Column(String(20),  nullable=True)
    contract_period = Column(String(50),  nullable=True)

    # ── Salary ───────────────────────────────────────────────────────────────
    annual_gross    = Column(Float, nullable=True)
    monthly_gross   = Column(Float, nullable=True)
    basic           = Column(Float, nullable=True)
    da              = Column(Float, nullable=True)
    hra             = Column(Float, nullable=True)
    conveyance      = Column(Float, nullable=True)
    medical         = Column(Float, nullable=True)
    special         = Column(Float, nullable=True)
    net_monthly     = Column(Float, nullable=True)
    annual_ctc      = Column(Float, nullable=True)

    # ── PF / ESI ─────────────────────────────────────────────────────────────
    pf_employee     = Column(Boolean, default=True)
    pf_employer     = Column(Boolean, default=True)
    esi_on          = Column(Boolean, default=False)
    pf_rate         = Column(Float, default=12)
    pf_emr_rate     = Column(Float, default=13)

    # ── Timestamps ───────────────────────────────────────────────────────────
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())