from fastapi import APIRouter, Depends, Response, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.documents import AppraisalLetter
from models.ExperienceLetter_SoftGrid_model import ExperienceLetter
from models.offer_letter import OfferLetter
from models.company import Company
from models.user import User
from schemas.documents import OfferLetterCreate, AppraisalCreate, RelievingCreate
from schemas.ExperienceLetter_SoftGrid_schemas import ExperienceLetterCreate, ExperienceLetterOut
from services.pdf_service import generate_offer_letter_pdf
from routers.deps import get_current_user

router = APIRouter(prefix="/letters", tags=["Letters"])

def apply_filter(query, model, current_user):
    """Company filter — always. User filter — only for non-admins."""
    query = query.filter(model.company_id == current_user.company_id)
    if current_user.role != "admin":
        query = query.filter(model.created_by == current_user.id)
    return query

# ── Offer Letter ─────────────────────────────────────────────────────────────
@router.post("/offer", status_code=201)
def create_offer_letter(data: OfferLetterCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    record = OfferLetter(**data.model_dump(), company_id=current_user.company_id, created_by=current_user.id)
    db.add(record); db.commit(); db.refresh(record)
    return {"id": record.id, "message": "Offer letter created"}

@router.get("/offer")
def get_offer_letters(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return apply_filter(db.query(OfferLetter), OfferLetter, current_user).all()

@router.get("/offer/{letter_id}/pdf")
def download_offer_pdf(letter_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    letter = apply_filter(db.query(OfferLetter).filter(OfferLetter.id == letter_id), OfferLetter, current_user).first()
    if not letter:
        raise HTTPException(status_code=404, detail="Not found or access denied")
    company = db.query(Company).filter(Company.id == letter.company_id).first()
    pdf = generate_offer_letter_pdf(letter.__dict__, company.__dict__)
    return Response(content=pdf, media_type="application/pdf",
                    headers={"Content-Disposition": f"attachment; filename=offer_{letter_id}.pdf"})

# ── Appraisal ─────────────────────────────────────────────────────────────────
@router.post("/appraisal", status_code=201)
def create_appraisal(data: AppraisalCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    record = AppraisalLetter(**data.model_dump(), company_id=current_user.company_id, created_by=current_user.id)
    db.add(record); db.commit()
    return {"message": "Appraisal letter created"}

@router.get("/appraisal")
def get_appraisals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return apply_filter(db.query(AppraisalLetter), AppraisalLetter, current_user).all()


# ── Experience ────────────────────────────────────────────────────────────────
@router.post("/experience", status_code=201, response_model=ExperienceLetterOut)
def create_experience(data: ExperienceLetterCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    record = ExperienceLetter(**data.model_dump(), created_by=current_user.id)
    db.add(record); db.commit(); db.refresh(record)
    return record

@router.get("/experience")
def get_experience(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return apply_filter(db.query(ExperienceLetter), ExperienceLetter, current_user).all()