from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from database import Base

 

class AppraisalLetter(Base):
    __tablename__ = "appraisal_letters"
    id             = Column(Integer, primary_key=True, index=True)
    emp_id         = Column(String(20), ForeignKey("employees.emp_id"), nullable=True, index=True)
    designation    = Column(String(100), nullable=True)
    old_ctc        = Column(Float)
    new_ctc        = Column(Float)
    old_monthly_gross = Column(Float, nullable=True)
    new_monthly_gross = Column(Float, nullable=True)
    effective_date = Column(Date)
    company_id     = Column(Integer, ForeignKey("companies.id"))
    created_by     = Column(Integer, ForeignKey("users.id"))