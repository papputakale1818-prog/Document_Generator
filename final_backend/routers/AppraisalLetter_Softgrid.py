from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from routers.deps import get_current_user
from models.documents import AppraisalLetter
from models.user import User
from models.company import Company
from schemas import AppraisalLetter_Softgrid_schemas as schemas

router = APIRouter(prefix="/appraisal-letters", tags=["Appraisal Letters"])


class AppraisalLetterCreate(schemas.AppraisalLetterCreate):
    pass


class AppraisalLetterOut(schemas.AppraisalLetterOut):
    pass


@router.post("/", response_model=AppraisalLetterOut)
def create_appraisal_letter(
    payload: AppraisalLetterCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    record = AppraisalLetter(
        **payload.dict(),
        created_by=current_user.id,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return _attach_extra(record, db)


@router.get("/", response_model=list[AppraisalLetterOut])
def get_all_appraisal_letters(
    company_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = db.query(AppraisalLetter)
    if company_id:
        query = query.filter(AppraisalLetter.company_id == company_id)
    records = query.order_by(AppraisalLetter.id.desc()).all()
    return [_attach_extra(r, db) for r in records]


@router.get("/{emp_id}", response_model=list[AppraisalLetterOut])
def get_appraisal_letters_by_emp(
    emp_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    records = (
        db.query(AppraisalLetter)
        .filter(AppraisalLetter.emp_id == emp_id)
        .order_by(AppraisalLetter.id.desc())
        .all()
    )
    return [_attach_extra(r, db) for r in records]


@router.delete("/{letter_id}")
def delete_appraisal_letter(
    letter_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    record = db.query(AppraisalLetter).filter(AppraisalLetter.id == letter_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Appraisal letter not found")

    if current_user.role != "admin" and record.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to delete this record")

    db.delete(record)
    db.commit()
    return {"detail": "Appraisal letter deleted"}


def _attach_extra(record: AppraisalLetter, db: Session):
    """Attach created_by_name and company_name (transient, not persisted)."""
    creator_name = None
    if getattr(record, "created_by", None):
        creator = db.query(User).filter(User.id == record.created_by).first()
        if creator:
            creator_name = getattr(creator, "name", None)

    company_name = None
    if getattr(record, "company_id", None):
        company = db.query(Company).filter(Company.id == record.company_id).first()
        if company:
            company_name = company.name

    record.created_by_name = creator_name
    record.company_name = company_name
    return record