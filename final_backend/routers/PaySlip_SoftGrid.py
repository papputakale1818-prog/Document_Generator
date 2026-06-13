from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.PaySlip_SoftGrid import PaySlip
from schemas.PaySlip_SoftGrid import PaySlipCreate, PaySlipResponse, PaySlipUpdate
from routers.deps import get_current_user
from models.user import User

router = APIRouter(
    prefix="/payslips",
    tags=["PaySlips"],
)

# ─── Helper: payslip + creator name ──────────────────────────────────────────
def enrich_payslip(payslip: PaySlip, db: Session) -> dict:
    data = {c.name: getattr(payslip, c.name) for c in payslip.__table__.columns}
    if payslip.created_by:
        creator = db.query(User).filter(User.id == payslip.created_by).first()
        data['created_by_name'] = creator.name if creator else None
    else:
        data['created_by_name'] = None
    return data

# ─── POST — Create ────────────────────────────────────────────────────────────
@router.post("/", response_model=PaySlipResponse, status_code=status.HTTP_201_CREATED)
def create_payslip(
    data: PaySlipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(PaySlip).filter(
        PaySlip.emp_id == data.emp_id,
        PaySlip.month  == data.month,
        PaySlip.year   == data.year,
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Payslip for emp_id '{data.emp_id}' — {data.month} {data.year} already exists (ID #{existing.id}).",
        )

    payslip = PaySlip(**data.dict())
    payslip.created_by = current_user.id

    db.add(payslip)
    db.commit()
    db.refresh(payslip)
    return enrich_payslip(payslip, db)


# ─── GET — All ────────────────────────────────────────────────────────────────
@router.get("/", response_model=List[PaySlipResponse])
def get_payslips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payslips = db.query(PaySlip).order_by(PaySlip.id.desc()).all()
    return [enrich_payslip(ps, db) for ps in payslips]


# ─── GET — Single ─────────────────────────────────────────────────────────────
@router.get("/{payslip_id}", response_model=PaySlipResponse)
def get_payslip(
    payslip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payslip = db.query(PaySlip).filter(PaySlip.id == payslip_id).first()
    if not payslip:
        raise HTTPException(status_code=404, detail="PaySlip not found")
    return enrich_payslip(payslip, db)


# ─── PUT — Update ─────────────────────────────────────────────────────────────
@router.put("/{payslip_id}", response_model=PaySlipResponse)
def update_payslip(
    payslip_id: int,
    data: PaySlipUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payslip = db.query(PaySlip).filter(PaySlip.id == payslip_id).first()
    if not payslip:
        raise HTTPException(status_code=404, detail="PaySlip not found")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(payslip, field, value)

    db.commit()
    db.refresh(payslip)
    return enrich_payslip(payslip, db)


# ─── DELETE ───────────────────────────────────────────────────────────────────
@router.delete("/{payslip_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_payslip(
    payslip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payslip = db.query(PaySlip).filter(PaySlip.id == payslip_id).first()
    if not payslip:
        raise HTTPException(status_code=404, detail="PaySlip not found")

    db.delete(payslip)
    db.commit()
    return None