from sqlalchemy import Table, Column, Integer, ForeignKey
from database import Base

user_company_table = Table(
    "user_companies",
    Base.metadata,
    Column("user_id",    Integer, ForeignKey("users.id",    ondelete="CASCADE"), primary_key=True),
    Column("company_id", Integer, ForeignKey("companies.id", ondelete="CASCADE"), primary_key=True),
)