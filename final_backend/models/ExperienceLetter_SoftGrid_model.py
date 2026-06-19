from sqlalchemy import Column, Integer, String, Date, ForeignKey
from database import Base


class ExperienceLetter(Base):
    __tablename__ = "experience_letters"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    emp_id = Column(
        String(20),
        ForeignKey("employees.emp_id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    letter_date = Column(Date, nullable=True)

    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)