from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from routers.deps import get_current_user
from models.documents import AppraisalLetter
import AppraisalLetter_Softgrid_schemas as schemas

router = APIRouter(prefix="/appraisal-letters", tags=["Appraisal Letters"])


@router.post("/", response_model=schemas.AppraisalLetterOut)
def create_appraisal_letter(
    payload: schemas.AppraisalLetterCreate,
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
    return record


@router.get("/{emp_id}", response_model=list[schemas.AppraisalLetterOut])
def get_appraisal_letters_by_emp(
    emp_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(AppraisalLetter)
        .filter(AppraisalLetter.emp_id == emp_id)
        .order_by(AppraisalLetter.id.desc())
        .all()
    )