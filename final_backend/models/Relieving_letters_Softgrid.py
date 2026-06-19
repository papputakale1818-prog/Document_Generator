 
from datetime import date
from sqlalchemy import String, Date, Boolean, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


class RelievingLetterSoftgrid(Base):
    __tablename__ = "relieving_letters"
    __table_args__ = {"extend_existing": True}

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)

    emp_id: Mapped[str] = mapped_column(
        String(20),
        ForeignKey("employees.emp_id", ondelete="CASCADE"),
        unique=True,
        index=True,
        nullable=False,
    )

    resignation_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    relieving_date:   Mapped[date | None] = mapped_column(Date, nullable=True)
    letter_date:      Mapped[date | None] = mapped_column(Date, nullable=True)

    is_relieved: Mapped[bool] = mapped_column(Boolean, default=False)

    created_by: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
    )

    employee: Mapped["Employee"] = relationship("Employee", back_populates="relieving_letter")