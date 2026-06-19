 #  
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List

from database import get_db
from models.Relieving_letters_Softgrid import RelievingLetterSoftgrid
from schemas.Relieving_letters_Softgrid import (
    RelievingLetterCreate,
    RelievingLetterUpdate,
    RelievingLetterFetchResponse,
    RelievingLetterResponse,
)
from models.employee import Employee
from routers.deps import get_current_user
from models.user import User

router = APIRouter(
    prefix="/api/relieving-letters",
    tags=["Relieving Letters — SoftGrid"],
)


# ── GET /{emp_id} ← Frontend Fetch button (fetches from employees table) ────
@router.get("/{emp_id}", response_model=RelievingLetterFetchResponse)
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

    # Check if a relieving letter already exists for this employee
    record = (
        db.query(RelievingLetterSoftgrid)
        .filter(RelievingLetterSoftgrid.emp_id == emp_id)
        .first()
    )

    return RelievingLetterFetchResponse(
        emp_id=employee.emp_id,
        emp_name=employee.full_name,
        resignation_date=record.resignation_date if record else None,
        relieving_date=record.relieving_date if record else None,
        letter_date=record.letter_date if record else None,
    )


# ── GET / — list all ─────────────────────────────────────────────────────────
@router.get("/", response_model=List[RelievingLetterResponse])
def list_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(RelievingLetterSoftgrid, User.name.label("created_by_name"))
        .outerjoin(User, User.id == RelievingLetterSoftgrid.created_by)
        .order_by(RelievingLetterSoftgrid.id.desc())
        .all()
    )

    result = []
    for record, created_by_name in rows:
        data = RelievingLetterResponse.model_validate(record)
        data.created_by_name = created_by_name
        result.append(data)
    return result


# ── POST / — save new record ─────────────────────────────────────────────────
@router.post("/", response_model=RelievingLetterResponse, status_code=status.HTTP_201_CREATED)
def create_record(
    payload: RelievingLetterCreate,
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
        db.query(RelievingLetterSoftgrid)
        .filter(RelievingLetterSoftgrid.emp_id == payload.emp_id)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Relieving letter for '{payload.emp_id}' already exists. Use PATCH to update.",
        )
    print("DEBUG current_user:", current_user, "| id:", current_user.id)
    record = RelievingLetterSoftgrid(**payload.dict(), created_by=current_user.id)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


# ── PATCH /{emp_id} — update ─────────────────────────────────────────────────
@router.patch("/{emp_id}", response_model=RelievingLetterResponse)
def update_record(
    emp_id: str,
    payload: RelievingLetterUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = (
        db.query(RelievingLetterSoftgrid)
        .filter(RelievingLetterSoftgrid.emp_id == emp_id)
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{emp_id}' not found in relieving_letters table.",
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
        db.query(RelievingLetterSoftgrid)
        .filter(RelievingLetterSoftgrid.emp_id == emp_id)
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee '{emp_id}' not found in relieving_letters table.",
        )
    db.delete(record)
    db.commit()
    return None