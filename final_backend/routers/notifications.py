from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.notification import Notification
from models.employee import Employee
from models.user import User
from pydantic import BaseModel
from typing import Optional
from routers.deps import get_current_user

import datetime

router = APIRouter(prefix="/notifications", tags=["Notifications"])


# ── Schema ────────────────────────────────────────────────────────────────────

class EmployeeRequest(BaseModel):
    emp_id         : Optional[str] = None

    # Personal
    full_name      : str
    dob            : Optional[str] = None
    gender         : Optional[str] = None
    blood_group    : Optional[str] = None
    personal_email : Optional[str] = None
    mobile         : str

    # Employment
    designation    : Optional[str] = None
    department     : Optional[str] = None
    emp_type       : Optional[str] = "Full-Time"

    # Documents
    pan            : Optional[str] = None
    aadhar         : Optional[str] = None
    bank_acc       : Optional[str] = None
    ifsc           : Optional[str] = None
    bank_name      : Optional[str] = None

    # Address
    address        : Optional[str] = None
    city           : Optional[str] = None
    state          : Optional[str] = None
    pin            : Optional[str] = None

    company_id     : Optional[int] = None

    # Graduation
    grad_degree     : Optional[str] = None
    grad_college    : Optional[str] = None
    grad_university : Optional[str] = None
    grad_year       : Optional[str] = None
    grad_grade      : Optional[str] = None

    # Post Graduation
    pg_degree       : Optional[str] = None
    pg_college      : Optional[str] = None
    pg_university   : Optional[str] = None
    pg_year         : Optional[str] = None
    pg_grade        : Optional[str] = None


# ── 1. Employee form submit → Direct Employee add + Notification ──────────────

@router.post("/")
def create_employee_with_notification(
    payload     : EmployeeRequest,
    db          : Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    # emp_id दिला नसेल तर auto generate करा
    if payload.emp_id:
        emp_id = payload.emp_id
    else:
        year = datetime.datetime.utcnow().strftime("%y")
        last = (
            db.query(Employee)
            .filter(Employee.company_id == payload.company_id)
            .order_by(Employee.id.desc())
            .first()
        )
        if last and last.emp_id:
            import re
            match = re.match(r'^([A-Za-z]*)(\d+)$', last.emp_id)
            if match:
                prefix   = match.group(1)
                next_num = int(match.group(2)) + 1
                padded   = str(next_num).zfill(len(match.group(2)))
                emp_id   = f"{prefix}{padded}"
            else:
                emp_id = f"SG{year}{str(db.query(Employee).count() + 1).zfill(4)}"
        else:
            emp_id = f"SG{year}0001"

    # Duplicate emp_id check
    existing = db.query(Employee).filter(Employee.emp_id == emp_id).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Employee ID '{emp_id}' already exists."
        )

    # ── Employee table मध्ये directly add करा ────────────────────────────────
    employee = Employee(
        emp_id          = emp_id,
        full_name       = payload.full_name,
        dob             = payload.dob,
        gender          = payload.gender,
        blood_group     = payload.blood_group,
        personal_email  = payload.personal_email,
        mobile          = payload.mobile,
        designation     = payload.designation,
        department      = payload.department,
        emp_type        = payload.emp_type,
        pan             = payload.pan,
        aadhar          = payload.aadhar,
        bank_acc        = payload.bank_acc,
        ifsc            = payload.ifsc,
        bank_name       = payload.bank_name,
        address         = payload.address,
        city            = payload.city,
        state           = payload.state,
        pin             = payload.pin,
        company_id      = payload.company_id,
        grad_degree     = payload.grad_degree,
        grad_college    = payload.grad_college,
        grad_university = payload.grad_university,
        grad_year       = payload.grad_year,
        grad_grade      = payload.grad_grade,
        pg_degree       = payload.pg_degree,
        pg_college      = payload.pg_college,
        pg_university   = payload.pg_university,
        pg_year         = payload.pg_year,
        pg_grade        = payload.pg_grade,
    )
    db.add(employee)

    # ── Admin ला info notification पाठवा ─────────────────────────────────────
    notif = Notification(
        type             = "employee_added",
        status           = "info",
        emp_id           = emp_id,
        company_id       = payload.company_id,
        full_name        = payload.full_name,
        dob              = payload.dob,
        gender           = payload.gender,
        blood_group      = payload.blood_group,
        personal_email   = payload.personal_email,
        mobile           = payload.mobile,
        designation      = payload.designation,
        department       = payload.department,
        emp_type         = payload.emp_type,
        pan              = payload.pan,
        aadhar           = payload.aadhar,
        bank_acc         = payload.bank_acc,
        ifsc             = payload.ifsc,
        bank_name        = payload.bank_name,
        address          = payload.address,
        city             = payload.city,
        state            = payload.state,
        pin              = payload.pin,
        generated_emp_id = emp_id,
        grad_degree      = payload.grad_degree,
        grad_college     = payload.grad_college,
        grad_university  = payload.grad_university,
        grad_year        = payload.grad_year,
        grad_grade       = payload.grad_grade,
        pg_degree        = payload.pg_degree,
        pg_college       = payload.pg_college,
        pg_university    = payload.pg_university,
        pg_year          = payload.pg_year,
        pg_grade         = payload.pg_grade,
    )
    db.add(notif)
    db.commit()

    return {
        "message" : "Employee added successfully",
        "emp_id"  : emp_id,
    }


# ── 2. Admin — सगळ्या notifications GET ──────────────────────────────────────

@router.get("/")
def get_notifications(
    db          : Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

    notifications = (
        db.query(Notification)
        .order_by(Notification.created_at.desc())
        .all()
    )

    return [
        {
            "id"              : n.id,
            "type"            : n.type,
            "status"          : n.status,
            "emp_id"          : n.emp_id,
            "full_name"       : n.full_name,
            "designation"     : n.designation,
            "department"      : n.department,
            "mobile"          : n.mobile,
            "company_id"      : n.company_id,
            "emp_type"        : n.emp_type,
            "created_at"      : n.created_at,
            "generated_emp_id": n.generated_emp_id,
        }
        for n in notifications
    ]


# ── 3. Count (bell icon साठी) ─────────────────────────────────────────────────

@router.get("/pending-count")
def pending_count(
    db          : Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

    count = db.query(Notification).filter(Notification.status == "info").count()
    return {"count": count}