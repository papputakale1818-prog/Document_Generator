
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.PaySlipTracker import PaySlipTracker
from schemas.PaySlipTracker import PaySlipTrackerResponse, PaySlipTrackerSummary
from routers.deps import get_current_user
from models.user import User

router = APIRouter(
    prefix="/payslip-tracker",
    tags=["PaySlip Tracker"],
)

MONTHS_ORDER = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
]

# ─── GET — Employee cha year wise summary ─────────────────────────────────────
@router.get("/summary/{emp_id}/{year}", response_model=PaySlipTrackerSummary)
def get_tracker_summary(
    emp_id: str,
    year: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    records = db.query(PaySlipTracker).filter(
        PaySlipTracker.emp_id == emp_id,
        PaySlipTracker.year   == year,
    ).all()

    created_months = {r.month: r.payslip_id for r in records}
    emp_name = records[0].emp_name if records else emp_id

    months_status = []
    for m in MONTHS_ORDER:
        if m in created_months:
            months_status.append({
                "month":      m,
                "status":     "created",
                "payslip_id": created_months[m],
            })
        else:
            months_status.append({
                "month":      m,
                "status":     "pending",
                "payslip_id": None,
            })

    return PaySlipTrackerSummary(
        emp_id=emp_id,
        emp_name=emp_name,
        year=year,
        months=months_status,
    )


# ─── GET — All tracker records (company wise) ─────────────────────────────────
@router.get("/", response_model=List[PaySlipTrackerResponse])
def get_all_tracker(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "admin":
        records = db.query(PaySlipTracker).order_by(PaySlipTracker.id.desc()).all()
    elif current_user.company_id:
        records = db.query(PaySlipTracker).filter(
            PaySlipTracker.company_id == current_user.company_id
        ).order_by(PaySlipTracker.id.desc()).all()
    else:
        records = db.query(PaySlipTracker).filter(
            PaySlipTracker.created_by == current_user.id
        ).order_by(PaySlipTracker.id.desc()).all()

    return records