
from sqlalchemy import Column, String, Date, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime


class ResignationAcceptanceSoftgrid(Base):
    __tablename__ = "resignation_acceptance_softgrid"

    # emp_id used directly as primary key (1 acceptance record per employee),
    # FK → employees.emp_id (unique=True there, so it's a valid FK target).
    emp_id      = Column(String(20), ForeignKey("employees.emp_id"), primary_key=True)
    letter_date = Column(Date, nullable=False)
    created_by  = Column(Integer, ForeignKey("users.id"), nullable=False)   # ⚠️ adjust "users" if your User table name differs
    created_at  = Column(DateTime, default=datetime.datetime.utcnow)

    employee = relationship("Employee", back_populates="resignation_acceptance")