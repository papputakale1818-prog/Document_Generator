

# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from typing import List

# from database import get_db
# from models.PaySlip_SoftGrid import PaySlip
# from models.user import User
# from models.company import Company
# from schemas.PaySlip_SoftGrid import PaySlipCreate, PaySlipResponse, PaySlipUpdate
# from fastapi.security import OAuth2PasswordBearer
# from jose import JWTError, jwt
# import os

# SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
# ALGORITHM  = "HS256"
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         user_id: int = payload.get("user_id")
#         if user_id is None:
#             raise HTTPException(status_code=401, detail="Invalid token")
#     except JWTError:
#         raise HTTPException(status_code=401, detail="Invalid token")
#     user = db.query(User).filter(User.id == user_id).first()
#     if not user:
#         raise HTTPException(status_code=401, detail="User not found")
#     return user


# # ─── Helper: payslip ला name fields attach करा ───────────────────────────────
# def attach_names(ps: PaySlip, db: Session) -> PaySlipResponse:
#     data = PaySlipResponse.from_orm(ps)

#     if ps.created_by:
#         user = db.query(User).filter(User.id == ps.created_by).first()
#         data.created_by_name = user.name if user else None

#     if ps.company_id:
#         company = db.query(Company).filter(Company.id == ps.company_id).first()
#         data.company_name = company.name if company else None

#     return data


# router = APIRouter(
#     prefix="/payslips",
#     tags=["PaySlips"],
# )

# # ─── POST — Create PaySlip ────────────────────────────────────────────────────
# @router.post("/", response_model=PaySlipResponse, status_code=status.HTTP_201_CREATED)
# def create_payslip(
#     data: PaySlipCreate,
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user),
# ):
#     payslip = PaySlip(**data.dict(), created_by=current_user.id)
#     db.add(payslip)
#     db.commit()
#     db.refresh(payslip)
#     return attach_names(payslip, db)


# # ─── GET — All PaySlips (current user / admin sees all) ──────────────────────
# @router.get("/", response_model=List[PaySlipResponse])
# def get_payslips(
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user),
# ):
#     if current_user.role == "admin":
#         payslips = db.query(PaySlip).order_by(PaySlip.id.desc()).all()
#     else:
#         payslips = (
#             db.query(PaySlip)
#             .filter(PaySlip.created_by == current_user.id)
#             .order_by(PaySlip.id.desc())
#             .all()
#         )
#     return [attach_names(ps, db) for ps in payslips]


# # ─── GET — Single PaySlip by ID ───────────────────────────────────────────────
# @router.get("/{payslip_id}", response_model=PaySlipResponse)
# def get_payslip(
#     payslip_id: int,
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user),
# ):
#     payslip = db.query(PaySlip).filter(PaySlip.id == payslip_id).first()
#     if not payslip:
#         raise HTTPException(status_code=404, detail="PaySlip not found")
#     if current_user.role != "admin" and payslip.created_by != current_user.id:
#         raise HTTPException(status_code=403, detail="Access denied")
#     return attach_names(payslip, db)


# # ─── PUT — Update PaySlip ─────────────────────────────────────────────────────
# @router.put("/{payslip_id}", response_model=PaySlipResponse)
# def update_payslip(
#     payslip_id: int,
#     data: PaySlipUpdate,
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user),
# ):
#     payslip = db.query(PaySlip).filter(PaySlip.id == payslip_id).first()
#     if not payslip:
#         raise HTTPException(status_code=404, detail="PaySlip not found")
#     if current_user.role != "admin" and payslip.created_by != current_user.id:
#         raise HTTPException(status_code=403, detail="Access denied")

#     for field, value in data.dict(exclude_unset=True).items():
#         setattr(payslip, field, value)

#     db.commit()
#     db.refresh(payslip)
#     return attach_names(payslip, db)


# # ─── DELETE — Delete PaySlip ──────────────────────────────────────────────────
# @router.delete("/{payslip_id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_payslip(
#     payslip_id: int,
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user),
# ):
#     payslip = db.query(PaySlip).filter(PaySlip.id == payslip_id).first()
#     if not payslip:
#         raise HTTPException(status_code=404, detail="PaySlip not found")
#     if current_user.role != "admin" and payslip.created_by != current_user.id:
#         raise HTTPException(status_code=403, detail="Access denied")

#     db.delete(payslip)
#     db.commit()
#     return None
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.PaySlip_SoftGrid import PaySlip
from models.user import User
from models.company import Company
from schemas.PaySlip_SoftGrid import PaySlipCreate, PaySlipResponse, PaySlipUpdate
from routers.deps import get_current_user

router = APIRouter(
    prefix="/payslips",
    tags=["PaySlips"],
)

# ─── Helper: name fields attach करा ──────────────────────────────────────────
def attach_names(ps: PaySlip, db: Session) -> PaySlipResponse:
    data = PaySlipResponse.from_orm(ps)

    if ps.created_by:
        user = db.query(User).filter(User.id == ps.created_by).first()
        data.created_by_name = user.name if user else None

    if ps.company_id:
        company = db.query(Company).filter(Company.id == ps.company_id).first()
        data.company_name = company.name if company else None

    return data


# ─── POST — Create PaySlip ────────────────────────────────────────────────────
@router.post("/", response_model=PaySlipResponse, status_code=status.HTTP_201_CREATED)
def create_payslip(
    data: PaySlipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payslip = PaySlip(**data.dict(), created_by=current_user.id)
    db.add(payslip)
    db.commit()
    db.refresh(payslip)
    return attach_names(payslip, db)


# ─── GET — All PaySlips ───────────────────────────────────────────────────────
@router.get("/", response_model=List[PaySlipResponse])
def get_payslips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "admin":
        # Admin ला सगळे documents दिसतात
        payslips = db.query(PaySlip).order_by(PaySlip.id.desc()).all()

    elif current_user.company_id:
        # Same company_id असलेल्या सर्व users चे documents दिसतात
        payslips = (
            db.query(PaySlip)
            .filter(PaySlip.company_id == current_user.company_id)
            .order_by(PaySlip.id.desc())
            .all()
        )

    else:
        # Company नसेल तर फक्त स्वतःचे documents
        payslips = (
            db.query(PaySlip)
            .filter(PaySlip.created_by == current_user.id)
            .order_by(PaySlip.id.desc())
            .all()
        )

    return [attach_names(ps, db) for ps in payslips]


# ─── GET — Single PaySlip by ID ───────────────────────────────────────────────
@router.get("/{payslip_id}", response_model=PaySlipResponse)
def get_payslip(
    payslip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payslip = db.query(PaySlip).filter(PaySlip.id == payslip_id).first()
    if not payslip:
        raise HTTPException(status_code=404, detail="PaySlip not found")

    # Access check — admin, same company, ya creator
    if current_user.role != "admin":
        if current_user.company_id and payslip.company_id != current_user.company_id:
            raise HTTPException(status_code=403, detail="Access denied")
        elif not current_user.company_id and payslip.created_by != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")

    return attach_names(payslip, db)


# ─── PUT — Update PaySlip ─────────────────────────────────────────────────────
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
    if current_user.role != "admin" and payslip.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(payslip, field, value)

    db.commit()
    db.refresh(payslip)
    return attach_names(payslip, db)


# ─── DELETE — Delete PaySlip ──────────────────────────────────────────────────
@router.delete("/{payslip_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_payslip(
    payslip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payslip = db.query(PaySlip).filter(PaySlip.id == payslip_id).first()
    if not payslip:
        raise HTTPException(status_code=404, detail="PaySlip not found")
    if current_user.role != "admin" and payslip.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    db.delete(payslip)
    db.commit()
    return None