from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.company import Company
from models.user import User
from models.user_company import user_company_table
from schemas.company import CompanyOut
from routers.deps import get_current_user
from typing import List

router = APIRouter(prefix="/companies", tags=["Companies"])

@router.get("/", response_model=List[CompanyOut])
def get_companies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Admin → सगळ्या active companies
    if current_user.role == "admin":
        return db.query(Company).filter(Company.is_active == True).all()

    # Normal user → many-to-many table मधून assigned companies
    assigned = (
        db.query(Company)
        .join(user_company_table, user_company_table.c.company_id == Company.id)
        .filter(
            user_company_table.c.user_id == current_user.id,
            Company.is_active == True
        )
        .all()
    )
    return assigned

@router.get("/{company_id}", response_model=CompanyOut)
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company