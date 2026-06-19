from datetime import datetime, date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models.employee import Employee
from models.offer_letter import OfferLetter
from models.confirmation_letter_model import ConfirmationLetter
from models.user import User
from schemas.confirmation_letter_schema import (
    ConfirmationEmployeeOut,
    ConfirmationLetterCreate,
    ConfirmationLetterOut,
)
from routers.deps import get_current_user

router = APIRouter(prefix="/confirmation-letter", tags=["Confirmation Letter"])


def parse_joining_date(value: Optional[str]) -> Optional[date]:
    """
    OfferLetter.joining_date is stored as a free-text String(20) column,
    not a real Date column, so it can arrive in different formats.
    Try the common ones; return None if it can't be parsed instead of
    crashing the response.
    """
    if not value:
        return None

    value = value.strip()
    formats = ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%m/%d/%Y", "%d-%b-%Y", "%d %B %Y")
    for fmt in formats:
        try:
            return datetime.strptime(value, fmt).date()
        except ValueError:
            continue
    return None


# ---------- Fetch employee details (joining date offer_letters table madhun) ----------
@router.get("/fetch-employee", response_model=ConfirmationEmployeeOut)
def fetch_employee_for_confirmation(
    emp_id: str = Query(...),
    company_id: int = Query(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    employee = (
        db.query(Employee)
        .filter(Employee.emp_id == emp_id, Employee.company_id == company_id)
        .first()
    )
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    offer = (
        db.query(OfferLetter)
        .filter(OfferLetter.emp_id == emp_id, OfferLetter.company_id == company_id)
        .first()
    )

    return ConfirmationEmployeeOut(
        emp_id=employee.emp_id,
        full_name=employee.full_name,
        designation=employee.designation,
        joining_date=parse_joining_date(offer.joining_date) if offer else None,
    )


# ---------- Save confirmation letter (emp_id, letter_date, created_by ekach) ----------
@router.post("/save", response_model=ConfirmationLetterOut)
def save_confirmation_letter(
    payload: ConfirmationLetterCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    employee = (
        db.query(Employee)
        .filter(Employee.emp_id == payload.emp_id, Employee.company_id == payload.company_id)
        .first()
    )
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    record = ConfirmationLetter(
        emp_id=payload.emp_id,
        company_id=payload.company_id,
        letter_date=payload.letter_date,
        created_by=current_user.id,  # ← always from token, never from payload
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


# ---------- List saved confirmation letters (MyDocuments.jsx sathi) ----------
@router.get("/list", response_model=list[ConfirmationLetterOut])
def list_confirmation_letters(
    emp_id: str = Query(None),
    company_id: int = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = (
        db.query(ConfirmationLetter, User.name.label("created_by_name"))
        .outerjoin(User, User.id == ConfirmationLetter.created_by)
    )
    if emp_id:
        query = query.filter(ConfirmationLetter.emp_id == emp_id)
    if company_id:
        query = query.filter(ConfirmationLetter.company_id == company_id)

    rows = query.order_by(ConfirmationLetter.id.desc()).all()

    result = []
    for record, created_by_name in rows:
        data = ConfirmationLetterOut.model_validate(record)
        data.created_by_name = created_by_name
        result.append(data)
    return result


# ---------- Delete confirmation letter (admin ka jyane create kela tyalach delete karta yeil) ----------
@router.delete("/{confirmation_id}")
def delete_confirmation_letter(
    confirmation_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    record = (
        db.query(ConfirmationLetter)
        .filter(ConfirmationLetter.id == confirmation_id)
        .first()
    )
    if not record:
        raise HTTPException(status_code=404, detail="Confirmation letter not found")

    if current_user.role != "admin" and str(record.created_by) != str(current_user.id):
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to delete this confirmation letter",
        )

    db.delete(record)
    db.commit()
    return {"detail": "Confirmation letter deleted successfully"}