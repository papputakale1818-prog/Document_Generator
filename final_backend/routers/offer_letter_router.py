from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.offer_letter import OfferLetter
from routers.deps import get_current_user
from models.user import User
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/offer-letters", tags=["Offer Letters"])

# ── Schema ────────────────────────────────────────────────────────────────────
class OfferLetterCreate(BaseModel):
    emp_id:          str             # Required
    company_id:      Optional[int]   = None
    full_name:       str
    designation:     Optional[str]   = None
    department:      Optional[str]   = None
    manager:         Optional[str]   = None
    location:        Optional[str]   = None
    offer_date:      Optional[str]   = None
    joining_date:    Optional[str]   = None
    appoint_date:    Optional[str]   = None
    contract_period: Optional[str]   = None
    annual_gross:    Optional[float] = None
    monthly_gross:   Optional[float] = None
    basic:           Optional[float] = None
    da:              Optional[float] = None
    hra:             Optional[float] = None
    conveyance:      Optional[float] = None
    medical:         Optional[float] = None
    special:         Optional[float] = None
    net_monthly:     Optional[float] = None
    annual_ctc:      Optional[float] = None
    pf_employee:     Optional[bool]  = True
    pf_employer:     Optional[bool]  = True
    esi_on:          Optional[bool]  = False
    pf_rate:         Optional[float] = 12
    pf_emr_rate:     Optional[float] = 13

class OfferLetterOut(BaseModel):
    emp_id:          str
    full_name:       str
    designation:     Optional[str]
    department:      Optional[str]
    annual_gross:    Optional[float]
    monthly_gross:   Optional[float]
    annual_ctc:      Optional[float]
    net_monthly:     Optional[float]
    offer_date:      Optional[str]
    joining_date:    Optional[str]
    contract_period: Optional[str]
    company_id:      Optional[int]
    created_by:      Optional[int]
    created_by_name: Optional[str] = None
    company_name:    Optional[str] = None
    created_at:      Optional[datetime]

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_with_creator(cls, letter):
        obj = cls.model_validate(letter)
        if letter.creator:
            obj.created_by_name = letter.creator.name
        if letter.company:
            obj.company_name = letter.company.name
        return obj

# ── Save Offer Letter ─────────────────────────────────────────────────────────
@router.post("/", response_model=OfferLetterOut)
def save_offer_letter(
    data: OfferLetterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    letter = db.query(OfferLetter).filter(OfferLetter.emp_id == data.emp_id).first()
    if letter:
        # Already exists → Update
        letter.company_id      = data.company_id
        letter.full_name       = data.full_name
        letter.designation     = data.designation
        letter.department      = data.department
        letter.manager         = data.manager
        letter.location        = data.location
        letter.offer_date      = data.offer_date
        letter.joining_date    = data.joining_date
        letter.appoint_date    = data.appoint_date
        letter.contract_period = data.contract_period
        letter.annual_gross    = data.annual_gross
        letter.monthly_gross   = data.monthly_gross
        letter.basic           = data.basic
        letter.da              = data.da
        letter.hra             = data.hra
        letter.conveyance      = data.conveyance
        letter.medical         = data.medical
        letter.special         = data.special
        letter.net_monthly     = data.net_monthly
        letter.annual_ctc      = data.annual_ctc
        letter.pf_employee     = data.pf_employee
        letter.pf_employer     = data.pf_employer
        letter.esi_on          = data.esi_on
        letter.pf_rate         = data.pf_rate
        letter.pf_emr_rate     = data.pf_emr_rate
    else:
        # New → Insert
        letter = OfferLetter(
            emp_id          = data.emp_id,
            created_by      = current_user.id,
            company_id      = data.company_id,
            full_name       = data.full_name,
            designation     = data.designation,
            department      = data.department,
            manager         = data.manager,
            location        = data.location,
            offer_date      = data.offer_date,
            joining_date    = data.joining_date,
            appoint_date    = data.appoint_date,
            contract_period = data.contract_period,
            annual_gross    = data.annual_gross,
            monthly_gross   = data.monthly_gross,
            basic           = data.basic,
            da              = data.da,
            hra             = data.hra,
            conveyance      = data.conveyance,
            medical         = data.medical,
            special         = data.special,
            net_monthly     = data.net_monthly,
            annual_ctc      = data.annual_ctc,
            pf_employee     = data.pf_employee,
            pf_employer     = data.pf_employer,
            esi_on          = data.esi_on,
            pf_rate         = data.pf_rate,
            pf_emr_rate     = data.pf_emr_rate,
        )
        db.add(letter)
    db.commit()
    db.refresh(letter)
    return OfferLetterOut.from_orm_with_creator(letter)

# ── Get All ───────────────────────────────────────────────────────────────────
@router.get("/", response_model=list[OfferLetterOut])
def get_offer_letters(
    emp_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # emp_id filter असेल तर directly त्या employee चा letter return करा
    if emp_id:
        letters = (
            db.query(OfferLetter)
            .filter(OfferLetter.emp_id == emp_id)
            .order_by(OfferLetter.created_at.desc())
            .all()
        )
        return [OfferLetterOut.from_orm_with_creator(l) for l in letters]

    if current_user.role == "admin":
        letters = db.query(OfferLetter).order_by(OfferLetter.created_at.desc()).all()
    elif current_user.company_id:
        letters = (
            db.query(OfferLetter)
            .filter(OfferLetter.company_id == current_user.company_id)
            .order_by(OfferLetter.created_at.desc())
            .all()
        )
    else:
        letters = (
            db.query(OfferLetter)
            .filter(OfferLetter.created_by == current_user.id)
            .order_by(OfferLetter.created_at.desc())
            .all()
        )
    return [OfferLetterOut.from_orm_with_creator(l) for l in letters]

# ── Get Single ────────────────────────────────────────────────────────────────
@router.get("/{emp_id}", response_model=OfferLetterOut)
def get_offer_letter(
    emp_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    letter = db.query(OfferLetter).filter(OfferLetter.emp_id == emp_id).first()
    if not letter:
        raise HTTPException(status_code=404, detail="Offer letter not found")
    if current_user.role != "admin" and letter.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return OfferLetterOut.from_orm_with_creator(letter)

# ── Delete ────────────────────────────────────────────────────────────────────
@router.delete("/{emp_id}")
def delete_offer_letter(
    emp_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    letter = db.query(OfferLetter).filter(OfferLetter.emp_id == emp_id).first()
    if not letter:
        raise HTTPException(status_code=404, detail="Not found")
    if current_user.role != "admin" and letter.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    db.delete(letter)
    db.commit()
    return {"message": "Deleted successfully"}