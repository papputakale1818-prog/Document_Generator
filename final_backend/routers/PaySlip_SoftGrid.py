from typing import Optional
# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from typing import List

# from database import get_db
# from models.PaySlip_SoftGrid import PaySlip
# from schemas.PaySlip_SoftGrid import PaySlipCreate, PaySlipResponse, PaySlipUpdate
# from routers.deps import get_current_user
# from models.user import User

# router = APIRouter(
#     prefix="/payslips",
#     tags=["PaySlips"],
# )

# # ─── Helper: payslip + creator name ──────────────────────────────────────────
# def enrich_payslip(payslip: PaySlip, db: Session) -> dict:
#     data = {c.name: getattr(payslip, c.name) for c in payslip.__table__.columns}
#     if payslip.created_by:
#         creator = db.query(User).filter(User.id == payslip.created_by).first()
#         data['created_by_name'] = creator.name if creator else None
#     else:
#         data['created_by_name'] = None
#     return data

# # ─── POST — Create ────────────────────────────────────────────────────────────
# @router.post("/", response_model=PaySlipResponse, status_code=status.HTTP_201_CREATED)
# def create_payslip(
#     data: PaySlipCreate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     existing = db.query(PaySlip).filter(
#         PaySlip.emp_id == data.emp_id,
#         PaySlip.month  == data.month,
#         PaySlip.year   == data.year,
#     ).first()

#     if existing:
#         raise HTTPException(
#             status_code=status.HTTP_409_CONFLICT,
#             detail=f"Payslip for emp_id '{data.emp_id}' — {data.month} {data.year} already exists (ID #{existing.id}).",
#         )

#     payslip = PaySlip(**data.dict())
#     payslip.created_by = current_user.id

#     db.add(payslip)
#     db.commit()
#     db.refresh(payslip)
#     return enrich_payslip(payslip, db)


# # ─── GET — All ────────────────────────────────────────────────────────────────
# @router.get("/", response_model=List[PaySlipResponse])
# def get_payslips(
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     payslips = db.query(PaySlip).order_by(PaySlip.id.desc()).all()
#     return [enrich_payslip(ps, db) for ps in payslips]


# # ─── GET — Single ─────────────────────────────────────────────────────────────
# @router.get("/{payslip_id}", response_model=PaySlipResponse)
# def get_payslip(
#     payslip_id: int,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     payslip = db.query(PaySlip).filter(PaySlip.id == payslip_id).first()
#     if not payslip:
#         raise HTTPException(status_code=404, detail="PaySlip not found")
#     return enrich_payslip(payslip, db)


# # ─── PUT — Update ─────────────────────────────────────────────────────────────
# @router.put("/{payslip_id}", response_model=PaySlipResponse)
# def update_payslip(
#     payslip_id: int,
#     data: PaySlipUpdate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     payslip = db.query(PaySlip).filter(PaySlip.id == payslip_id).first()
#     if not payslip:
#         raise HTTPException(status_code=404, detail="PaySlip not found")

#     for field, value in data.dict(exclude_unset=True).items():
#         setattr(payslip, field, value)

#     db.commit()
#     db.refresh(payslip)
#     return enrich_payslip(payslip, db)


# # ─── DELETE ───────────────────────────────────────────────────────────────────
# @router.delete("/{payslip_id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_payslip(
#     payslip_id: int,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     payslip = db.query(PaySlip).filter(PaySlip.id == payslip_id).first()
#     if not payslip:
#         raise HTTPException(status_code=404, detail="PaySlip not found")

#     db.delete(payslip)
#     db.commit()
#     return None

# router_payslip.py — FastAPI PaySlip Router (COMPLETE snippet)
# हे तुमच्या existing router file मध्ये merge करा.

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.PaySlip_SoftGrid import PaySlip
from models.user import User
from models.company import Company
from schemas.PaySlip_SoftGrid import PaySlipCreate, PaySlipResponse, PaySlipUpdate
from routers.deps import get_current_user

router = APIRouter(prefix="/payslips", tags=["payslips"])


def _attach_extra(ps: PaySlip, db: Session) -> dict:
    data = {c.name: getattr(ps, c.name) for c in ps.__table__.columns}

    # created_by_name
    if ps.created_by:
        u = db.query(User).filter(User.id == ps.created_by).first()
        data['created_by_name'] = u.name if u else None
    else:
        data['created_by_name'] = None

    # company_name
    try:
        if ps.company_id:
            company = db.query(Company).filter(Company.id == ps.company_id).first()
            data['company_name'] = company.name if company else None
        else:
            data['company_name'] = None
    except Exception:
        data['company_name'] = None

    return data


@router.post("/", response_model=PaySlipResponse, status_code=status.HTTP_201_CREATED)
def create_payslip(
    payload: PaySlipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(PaySlip).filter(
        PaySlip.emp_id == payload.emp_id,
        PaySlip.month  == payload.month,
        PaySlip.year   == payload.year,
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Pay Slip for {payload.emp_id} — {payload.month} {payload.year} already exists (ID #{existing.id}). Delete or update it first."
        )

    data = payload.dict()
    data['gross_salary']  = data.get('monthly_gross')   or data.get('gross_salary')  or 0
    data['pf']            = data.get('pf_employee')     or data.get('pf')            or 0
    data['esi']           = data.get('esi_employee')    or data.get('esi')           or 0
    data['deductions']    = data.get('total_deduction') or data.get('deductions')    or 0

    ps = PaySlip(**data, created_by=current_user.id)
    db.add(ps)
    db.commit()
    db.refresh(ps)
    return _attach_extra(ps, db)


@router.get("/", response_model=List[PaySlipResponse])
def list_payslips(
    company_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(PaySlip)
    # company_id query param दिला असेल तर त्यानुसार filter करा
    if company_id:
        q = q.filter(PaySlip.company_id == company_id)
    elif current_user.role != 'admin' and current_user.company_id:
        q = q.filter(PaySlip.company_id == current_user.company_id)
    return [_attach_extra(ps, db) for ps in q.order_by(PaySlip.id.desc()).all()]


@router.get("/{ps_id}", response_model=PaySlipResponse)
def get_payslip(
    ps_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ps = db.query(PaySlip).filter(PaySlip.id == ps_id).first()
    if not ps:
        raise HTTPException(status_code=404, detail="Pay Slip not found")
    return _attach_extra(ps, db)


@router.put("/{ps_id}", response_model=PaySlipResponse)
def update_payslip(
    ps_id: int,
    payload: PaySlipUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ps = db.query(PaySlip).filter(PaySlip.id == ps_id).first()
    if not ps:
        raise HTTPException(status_code=404, detail="Pay Slip not found")
    for k, v in payload.dict(exclude_none=True).items():
        setattr(ps, k, v)
    if payload.monthly_gross   is not None: ps.gross_salary = payload.monthly_gross
    if payload.pf_employee     is not None: ps.pf           = payload.pf_employee
    if payload.total_deduction is not None: ps.deductions   = payload.total_deduction
    db.commit()
    db.refresh(ps)
    return _attach_extra(ps, db)


@router.delete("/{ps_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_payslip(
    ps_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ps = db.query(PaySlip).filter(PaySlip.id == ps_id).first()
    if not ps:
        raise HTTPException(status_code=404, detail="Pay Slip not found")
    if current_user.role != 'admin' and ps.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this record")
    db.delete(ps)
    db.commit()