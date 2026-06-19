from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func

from database import Base


class ConfirmationLetter(Base):
    __tablename__ = "confirmation_letters"

    id = Column(Integer, primary_key=True, index=True)
    emp_id = Column(String(50), ForeignKey("employees.emp_id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    letter_date = Column(Date, nullable=False)
    created_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now())