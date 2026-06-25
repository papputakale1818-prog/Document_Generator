# from sqlalchemy import Column, Integer, String, Boolean
# from database import Base

# class Company(Base):
#     __tablename__ = "companies"
#     id        = Column(Integer, primary_key=True, index=True)
#     name      = Column(String(100), nullable=False)
#     logo_url  = Column(String(255))
#     address   = Column(String(300))
#     gstin     = Column(String(20))
#     pan       = Column(String(15))
#     cin       = Column(String(25))
#     is_active = Column(Boolean, default=True)


from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Company(Base):
    __tablename__ = "companies"
    id        = Column(Integer, primary_key=True, index=True)
    name      = Column(String(100), nullable=False)
    logo_url  = Column(String(255))
    address   = Column(String(300))
    gstin     = Column(String(20))
    pan       = Column(String(15))
    cin       = Column(String(25))
    is_active = Column(Boolean, default=True)