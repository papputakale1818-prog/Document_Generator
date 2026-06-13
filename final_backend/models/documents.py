from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from database import Base

class OfferConfirmation(Base):
    __tablename__ = "offer_confirmations"
    id             = Column(Integer, primary_key=True, index=True)
    employee_name  = Column(String(150))
    designation    = Column(String(100))
    confirmed_date = Column(Date)
    company_id     = Column(Integer, ForeignKey("companies.id"))
    created_by     = Column(Integer, ForeignKey("users.id"))

# class PaySlip(Base):
#     __tablename__ = "payslips"
#     id            = Column(Integer, primary_key=True, index=True)
#     employee_name = Column(String(150))
#     month         = Column(String(20))
#     year          = Column(Integer)
#     basic         = Column(Float)
#     hra           = Column(Float)
#     allowances    = Column(Float)
#     deductions    = Column(Float)
#     company_id    = Column(Integer, ForeignKey("companies.id"))
#     created_by    = Column(Integer, ForeignKey("users.id"))

class AppraisalLetter(Base):
    __tablename__ = "appraisal_letters"
    id             = Column(Integer, primary_key=True, index=True)
    emp_id         = Column(String(20), ForeignKey("employees.emp_id"), nullable=True, index=True)
    employee_name  = Column(String(150))
    designation    = Column(String(100), nullable=True)
    old_ctc        = Column(Float)
    new_ctc        = Column(Float)
    effective_date = Column(Date)
    company_id     = Column(Integer, ForeignKey("companies.id"))
    created_by     = Column(Integer, ForeignKey("users.id"))

class RelievingLetter(Base):
    __tablename__ = "relieving_letters"
    id               = Column(Integer, primary_key=True, index=True)
    employee_name    = Column(String(150))
    designation      = Column(String(100))
    last_working_day = Column(Date)
    company_id       = Column(Integer, ForeignKey("companies.id"))
    created_by       = Column(Integer, ForeignKey("users.id"))

class ExperienceLetter(Base):
    __tablename__ = "experience_letters"
    id            = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String(150))
    designation   = Column(String(100))
    from_date     = Column(Date)
    to_date       = Column(Date)
    company_id    = Column(Integer, ForeignKey("companies.id"))
    created_by    = Column(Integer, ForeignKey("users.id"))