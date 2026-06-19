from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.ResignationAcceptance_softgrid import ResignationAcceptanceSoftgrid
from schemas.ResignationAcceptance_softgrid import (
    ResignationAcceptanceCreate,
    ResignationAcceptanceUpdate,
    ResignationAcceptanceFetchResponse,
    ResignationAcceptanceResponse,
)
from models.employee import Employee
from routers.deps import get_current_user
from models.user import User

router = APIRouter(
    prefix="/api/resignation-acceptance",
    tags=["Resignation Acceptance — SoftGrid"],
)


# ── GET /{emp_id} ← Frontend Fetch button (fetches from employees table) ────
@router.get("/{emp_id}", response_model=ResignationAcceptanceFetchResponse)
def fetch_by_emp_id(
    emp_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    employee = db.query(Employee).filter(Employee.emp_id == emp_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{emp_id}' not found in employees table.",
        )

    # Check if a resignation acceptance record already exists for this employee
    record = (
        db.query(ResignationAcceptanceSoftgrid)
        .filter(ResignationAcceptanceSoftgrid.emp_id == emp_id)
        .first()
    )

    return ResignationAcceptanceFetchResponse(
        emp_id=employee.emp_id,
        emp_name=employee.full_name,
        letter_date=record.letter_date if record else None,
    )


# ── GET / — list all ─────────────────────────────────────────────────────────
@router.get("/", response_model=List[ResignationAcceptanceResponse])
def list_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(ResignationAcceptanceSoftgrid, User.name.label("created_by_name"))
        .outerjoin(User, User.id == ResignationAcceptanceSoftgrid.created_by)
        .order_by(ResignationAcceptanceSoftgrid.letter_date.desc())
        .all()
    )

    result = []
    for record, created_by_name in rows:
        data = ResignationAcceptanceResponse.model_validate(record)
        data.created_by_name = created_by_name
        result.append(data)
    return result


# ── POST / — save new record ─────────────────────────────────────────────────
@router.post("/", response_model=ResignationAcceptanceResponse, status_code=status.HTTP_201_CREATED)
def create_record(
    payload: ResignationAcceptanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    emp_exists = db.query(Employee).filter(Employee.emp_id == payload.emp_id).first()
    if not emp_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{payload.emp_id}' does not exist in employees table.",
        )
    existing = (
        db.query(ResignationAcceptanceSoftgrid)
        .filter(ResignationAcceptanceSoftgrid.emp_id == payload.emp_id)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Resignation acceptance for '{payload.emp_id}' already exists. Use PATCH to update.",
        )
    record = ResignationAcceptanceSoftgrid(**payload.dict(), created_by=current_user.id)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


# ── PATCH /{emp_id} — update ─────────────────────────────────────────────────
@router.patch("/{emp_id}", response_model=ResignationAcceptanceResponse)
def update_record(
    emp_id: str,
    payload: ResignationAcceptanceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = (
        db.query(ResignationAcceptanceSoftgrid)
        .filter(ResignationAcceptanceSoftgrid.emp_id == emp_id)
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{emp_id}' not found in resignation_acceptance_softgrid table.",
        )
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(record, field, value)
    db.commit()
    db.refresh(record)
    return record


# ── DELETE /{emp_id} ─────────────────────────────────────────────────────────
@router.delete("/{emp_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_record(
    emp_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = (
        db.query(ResignationAcceptanceSoftgrid)
        .filter(ResignationAcceptanceSoftgrid.emp_id == emp_id)
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{emp_id}' not found in resignation_acceptance_softgrid table.",
        )
    db.delete(record)
    db.commit()
    return None