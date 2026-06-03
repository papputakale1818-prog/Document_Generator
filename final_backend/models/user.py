
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from models.user_company import user_company_table

class User(Base):
    __tablename__ = "users"
    id            = Column(Integer, primary_key=True, index=True)
    name          = Column(String(100), nullable=False)
    email         = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role          = Column(String(20), default="user")

    # ──  ───────────────────────────────────────────────────────────
    mobile        = Column(String(20),  nullable=True)
    department    = Column(String(100), nullable=True)
    designation   = Column(String(100), nullable=True)

    # ── Legacy single company () ─────────────
    company_id    = Column(Integer, ForeignKey("companies.id"), nullable=True)
    company       = relationship("Company", foreign_keys=[company_id])

    # ── Many-to-Many: multiple companies ─────────────────────────────────────
    companies     = relationship("Company", secondary=user_company_table, backref="assigned_users")