# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from sqlalchemy import desc
# from database import get_db
# from models.employee import Employee
# from models.offer_letter import OfferLetter
# from models.user import User
# from routers.deps import get_current_user


# router = APIRouter(prefix="/employees", tags=["Employees"])


# # ── 0. Last Emp ID — Auto Generate साठी ──────────────────────────────────────
# # Frontend हे call करतो: GET /employees/last-emp-id?company_id=1
# # Response: { "emp_id": "SGT1005" } किंवा { "emp_id": null }

# @router.get("/last-emp-id")
# def get_last_emp_id(
#     company_id  : int,
#     db          : Session = Depends(get_db),
#     current_user: User    = Depends(get_current_user),
# ):
#     last = (
#         db.query(Employee)
#         .filter(Employee.company_id == company_id)
#         .order_by(desc(Employee.id))
#         .first()
#     )
#     return {"emp_id": last.emp_id if last else None}


# # ── 1. Company च्या सगळ्या employees GET ──────────────────────────────────────

# @router.get("/")
# def get_employees(
#     company_id  : int,
#     db          : Session = Depends(get_db),
#     current_user: User    = Depends(get_current_user),
# ):
#     employees = (
#         db.query(Employee)
#         .filter(Employee.company_id == company_id)
#         .order_by(Employee.created_at.desc())
#         .all()
#     )

#     return [
#         {
#             "id"             : e.id,
#             "emp_id"         : e.emp_id,
#             "full_name"      : e.full_name,
#             "designation"    : e.designation,
#             "department"     : e.department,
#             "mobile"         : e.mobile,
#             "personal_email" : e.personal_email,
#             "emp_type"       : e.emp_type,
#             "gender"         : e.gender,
#             "dob"            : e.dob,
#             "blood_group"    : e.blood_group,
#             "pan"            : e.pan,
#             "aadhar"         : e.aadhar,
#             "uan_number"     : e.uan_number,
#             "pf_number"      : e.pf_number,
#             "bank_acc"       : e.bank_acc,
#             "ifsc"           : e.ifsc,
#             "bank_name"      : e.bank_name,
#             "address"        : e.address,
#             "city"           : e.city,
#             "state"          : e.state,
#             "pin"            : e.pin,
#             "company_id"     : e.company_id,
#             "created_at"     : e.created_at,
#             # ── Graduation ─────────────────────────────────────────────────
#             "grad_degree"    : e.grad_degree,
#             "grad_college"   : e.grad_college,
#             "grad_university": e.grad_university,
#             "grad_year"      : e.grad_year,
#             "grad_grade"     : e.grad_grade,
#             # ── Post Graduation ────────────────────────────────────────────
#             "pg_degree"      : e.pg_degree,
#             "pg_college"     : e.pg_college,
#             "pg_university"  : e.pg_university,
#             "pg_year"        : e.pg_year,
#             "pg_grade"       : e.pg_grade,
#         }
#         for e in employees
#     ]


# # ── Fetch employee by emp_id + company_id (query params) ─────────────────────
# # Frontend calls: GET /employees/by-emp-id?emp_id=SG264530&company_id=1
# # IMPORTANT: This route must be defined BEFORE the @router.get("/{emp_id}") route,
# # otherwise FastAPI will treat "by-emp-id" as the emp_id path parameter.

# @router.get("/by-emp-id")
# def get_employee_by_emp_id(
#     emp_id      : str,
#     company_id  : int,
#     db          : Session = Depends(get_db),
#     current_user: User    = Depends(get_current_user),
# ):
#     e = (
#         db.query(Employee)
#         .filter(Employee.emp_id == emp_id, Employee.company_id == company_id)
#         .first()
#     )
#     if not e:
#         raise HTTPException(status_code=404, detail="Employee not found")

#     offer = db.query(OfferLetter).filter(OfferLetter.emp_id == emp_id).first()

#     return {
#         "id"             : e.id,
#         "emp_id"         : e.emp_id,
#         "full_name"      : e.full_name,
#         "designation"    : e.designation,
#         "department"     : e.department,
#         "mobile"         : e.mobile,
#         "personal_email" : e.personal_email,
#         "emp_type"       : e.emp_type,
#         "company_id"     : e.company_id,
#         "current_salary" : offer.monthly_gross if offer else None,
#     }


# # ── 2. Single employee GET ────────────────────────────────────────────────────

# @router.get("/{emp_id}")
# def get_employee(
#     emp_id      : str,
#     db          : Session = Depends(get_db),
#     current_user: User    = Depends(get_current_user),
# ):
#     e = db.query(Employee).filter(Employee.emp_id == emp_id).first()
#     if not e:
#         raise HTTPException(status_code=404, detail="Employee not found")

#     return {
#         "id"             : e.id,
#         "emp_id"         : e.emp_id,
#         "full_name"      : e.full_name,
#         "designation"    : e.designation,
#         "department"     : e.department,
#         "mobile"         : e.mobile,
#         "personal_email" : e.personal_email,
#         "emp_type"       : e.emp_type,
#         "gender"         : e.gender,
#         "dob"            : e.dob,
#         "blood_group"    : e.blood_group,
#         "pan"            : e.pan,
#         "aadhar"         : e.aadhar,
#         "uan_number"     : e.uan_number,
#         "pf_number"      : e.pf_number,
#         "bank_acc"       : e.bank_acc,
#         "ifsc"           : e.ifsc,
#         "bank_name"      : e.bank_name,
#         "address"        : e.address,
#         "city"           : e.city,
#         "state"          : e.state,
#         "pin"            : e.pin,
#         "company_id"     : e.company_id,
#         "created_at"     : e.created_at,
#         # ── Graduation ─────────────────────────────────────────────────────
#         "grad_degree"    : e.grad_degree,
#         "grad_college"   : e.grad_college,
#         "grad_university": e.grad_university,
#         "grad_year"      : e.grad_year,
#         "grad_grade"     : e.grad_grade,
#         # ── Post Graduation ────────────────────────────────────────────────
#         "pg_degree"      : e.pg_degree,
#         "pg_college"     : e.pg_college,
#         "pg_university"  : e.pg_university,
#         "pg_year"        : e.pg_year,
#         "pg_grade"       : e.pg_grade,
#     }

# # ── 3. Employee Update (PUT) ──────────────────────────────────────────────────

# from pydantic import BaseModel
# from typing import Optional

# class EmployeeUpdate(BaseModel):
#     emp_id:          Optional[str] = None
#     full_name:       Optional[str] = None
#     dob:             Optional[str] = None
#     gender:          Optional[str] = None
#     blood_group:     Optional[str] = None
#     personal_email:  Optional[str] = None
#     mobile:          Optional[str] = None
#     designation:     Optional[str] = None
#     department:      Optional[str] = None
#     emp_type:        Optional[str] = None
#     pan:             Optional[str] = None
#     aadhar:          Optional[str] = None
#     uan_number:      Optional[str] = None
#     pf_number:       Optional[str] = None
#     bank_acc:        Optional[str] = None
#     ifsc:            Optional[str] = None
#     bank_name:       Optional[str] = None
#     address:         Optional[str] = None
#     city:            Optional[str] = None
#     state:           Optional[str] = None
#     pin:             Optional[str] = None
#     grad_degree:     Optional[str] = None
#     grad_college:    Optional[str] = None
#     grad_university: Optional[str] = None
#     grad_year:       Optional[str] = None
#     grad_grade:      Optional[str] = None
#     pg_degree:       Optional[str] = None
#     pg_college:      Optional[str] = None
#     pg_university:   Optional[str] = None
#     pg_year:         Optional[str] = None
#     pg_grade:        Optional[str] = None


# @router.put("/{employee_id}")
# def update_employee(
#     employee_id : int,
#     data        : EmployeeUpdate,
#     db          : Session = Depends(get_db),
#     current_user: User    = Depends(get_current_user),
# ):
#     e = db.query(Employee).filter(Employee.id == employee_id).first()
#     if not e:
#         raise HTTPException(status_code=404, detail="Employee not found")

#     # Only update fields that were actually sent (non-None)
#     update_fields = data.model_dump(exclude_unset=True)
#     for field, value in update_fields.items():
#         setattr(e, field, value)

#     db.commit()
#     db.refresh(e)

#     return {
#         "id"             : e.id,
#         "emp_id"         : e.emp_id,
#         "full_name"      : e.full_name,
#         "designation"    : e.designation,
#         "department"     : e.department,
#         "mobile"         : e.mobile,
#         "personal_email" : e.personal_email,
#         "emp_type"       : e.emp_type,
#         "gender"         : e.gender,
#         "dob"            : e.dob,
#         "blood_group"    : e.blood_group,
#         "pan"            : e.pan,
#         "aadhar"         : e.aadhar,
#         "uan_number"     : e.uan_number,
#         "pf_number"      : e.pf_number,
#         "bank_acc"       : e.bank_acc,
#         "ifsc"           : e.ifsc,
#         "bank_name"      : e.bank_name,
#         "address"        : e.address,
#         "city"           : e.city,
#         "state"          : e.state,
#         "pin"            : e.pin,
#         "company_id"     : e.company_id,
#         "created_at"     : e.created_at,
#         "grad_degree"    : e.grad_degree,
#         "grad_college"   : e.grad_college,
#         "grad_university": e.grad_university,
#         "grad_year"      : e.grad_year,
#         "grad_grade"     : e.grad_grade,
#         "pg_degree"      : e.pg_degree,
#         "pg_college"     : e.pg_college,
#         "pg_university"  : e.pg_university,
#         "pg_year"        : e.pg_year,
#         "pg_grade"       : e.pg_grade,
#     }

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional
from database import get_db
from models.employee import Employee
from models.offer_letter import OfferLetter
from models.user import User
from routers.deps import get_current_user


router = APIRouter(prefix="/employees", tags=["Employees"])


# ── 0. Last Emp ID — Auto Generate साठी ──────────────────────────────────────
# Frontend हे call करतो: GET /employees/last-emp-id?company_id=1
# Response: { "emp_id": "SGT1005" } किंवा { "emp_id": null }

@router.get("/last-emp-id")
def get_last_emp_id(
    company_id  : int,
    db          : Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    last = (
        db.query(Employee)
        .filter(Employee.company_id == company_id)
        .order_by(desc(Employee.id))
        .first()
    )
    return {"emp_id": last.emp_id if last else None}


# ── 1. Company च्या सगळ्या employees GET ──────────────────────────────────────

@router.get("/")
def get_employees(
    company_id  : Optional[int] = None,
    db          : Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    query = db.query(Employee)

    if company_id is not None:
        query = query.filter(Employee.company_id == company_id)
    elif current_user.role != "admin":
        # non-admin users must always scope to a company_id
        raise HTTPException(status_code=400, detail="company_id is required")
    # admin + no company_id ⇒ return employees across ALL companies

    employees = query.order_by(Employee.created_at.desc()).all()

    return [
        {
            "id"             : e.id,
            "emp_id"         : e.emp_id,
            "full_name"      : e.full_name,
            "designation"    : e.designation,
            "department"     : e.department,
            "mobile"         : e.mobile,
            "personal_email" : e.personal_email,
            "emp_type"       : e.emp_type,
            "gender"         : e.gender,
            "dob"            : e.dob,
            "blood_group"    : e.blood_group,
            "pan"            : e.pan,
            "aadhar"         : e.aadhar,
            "uan_number"     : e.uan_number,
            "pf_number"      : e.pf_number,
            "bank_acc"       : e.bank_acc,
            "ifsc"           : e.ifsc,
            "bank_name"      : e.bank_name,
            "address"        : e.address,
            "city"           : e.city,
            "state"          : e.state,
            "pin"            : e.pin,
            "company_id"     : e.company_id,
            "created_at"     : e.created_at,
            # ── Graduation ─────────────────────────────────────────────────
            "grad_degree"    : e.grad_degree,
            "grad_college"   : e.grad_college,
            "grad_university": e.grad_university,
            "grad_year"      : e.grad_year,
            "grad_grade"     : e.grad_grade,
            # ── Post Graduation ────────────────────────────────────────────
            "pg_degree"      : e.pg_degree,
            "pg_college"     : e.pg_college,
            "pg_university"  : e.pg_university,
            "pg_year"        : e.pg_year,
            "pg_grade"       : e.pg_grade,
        }
        for e in employees
    ]


# ── Fetch employee by emp_id + company_id (query params) ─────────────────────
# Frontend calls: GET /employees/by-emp-id?emp_id=SG264530&company_id=1
# IMPORTANT: This route must be defined BEFORE the @router.get("/{emp_id}") route,
# otherwise FastAPI will treat "by-emp-id" as the emp_id path parameter.

@router.get("/by-emp-id")
def get_employee_by_emp_id(
    emp_id      : str,
    company_id  : int,
    db          : Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    e = (
        db.query(Employee)
        .filter(Employee.emp_id == emp_id, Employee.company_id == company_id)
        .first()
    )
    if not e:
        raise HTTPException(status_code=404, detail="Employee not found")

    offer = db.query(OfferLetter).filter(OfferLetter.emp_id == emp_id).first()

    return {
        "id"             : e.id,
        "emp_id"         : e.emp_id,
        "full_name"      : e.full_name,
        "designation"    : e.designation,
        "department"     : e.department,
        "mobile"         : e.mobile,
        "personal_email" : e.personal_email,
        "emp_type"       : e.emp_type,
        "company_id"     : e.company_id,
        "current_salary" : offer.monthly_gross if offer else None,
        "joining_date"   : offer.joining_date if offer else None,
    }


# ── 2. Single employee GET ────────────────────────────────────────────────────

@router.get("/{emp_id}")
def get_employee(
    emp_id      : str,
    db          : Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    e = db.query(Employee).filter(Employee.emp_id == emp_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Employee not found")

    return {
        "id"             : e.id,
        "emp_id"         : e.emp_id,
        "full_name"      : e.full_name,
        "designation"    : e.designation,
        "department"     : e.department,
        "mobile"         : e.mobile,
        "personal_email" : e.personal_email,
        "emp_type"       : e.emp_type,
        "gender"         : e.gender,
        "dob"            : e.dob,
        "blood_group"    : e.blood_group,
        "pan"            : e.pan,
        "aadhar"         : e.aadhar,
        "uan_number"     : e.uan_number,
        "pf_number"      : e.pf_number,
        "bank_acc"       : e.bank_acc,
        "ifsc"           : e.ifsc,
        "bank_name"      : e.bank_name,
        "address"        : e.address,
        "city"           : e.city,
        "state"          : e.state,
        "pin"            : e.pin,
        "company_id"     : e.company_id,
        "created_at"     : e.created_at,
        # ── Graduation ─────────────────────────────────────────────────────
        "grad_degree"    : e.grad_degree,
        "grad_college"   : e.grad_college,
        "grad_university": e.grad_university,
        "grad_year"      : e.grad_year,
        "grad_grade"     : e.grad_grade,
        # ── Post Graduation ────────────────────────────────────────────────
        "pg_degree"      : e.pg_degree,
        "pg_college"     : e.pg_college,
        "pg_university"  : e.pg_university,
        "pg_year"        : e.pg_year,
        "pg_grade"       : e.pg_grade,
    }

# ── 3. Employee Update (PUT) ──────────────────────────────────────────────────

from pydantic import BaseModel
from typing import Optional

class EmployeeUpdate(BaseModel):
    emp_id:          Optional[str] = None
    full_name:       Optional[str] = None
    dob:             Optional[str] = None
    gender:          Optional[str] = None
    blood_group:     Optional[str] = None
    personal_email:  Optional[str] = None
    mobile:          Optional[str] = None
    designation:     Optional[str] = None
    department:      Optional[str] = None
    emp_type:        Optional[str] = None
    pan:             Optional[str] = None
    aadhar:          Optional[str] = None
    uan_number:      Optional[str] = None
    pf_number:       Optional[str] = None
    bank_acc:        Optional[str] = None
    ifsc:            Optional[str] = None
    bank_name:       Optional[str] = None
    address:         Optional[str] = None
    city:            Optional[str] = None
    state:           Optional[str] = None
    pin:             Optional[str] = None
    grad_degree:     Optional[str] = None
    grad_college:    Optional[str] = None
    grad_university: Optional[str] = None
    grad_year:       Optional[str] = None
    grad_grade:      Optional[str] = None
    pg_degree:       Optional[str] = None
    pg_college:      Optional[str] = None
    pg_university:   Optional[str] = None
    pg_year:         Optional[str] = None
    pg_grade:        Optional[str] = None


@router.put("/{employee_id}")
def update_employee(
    employee_id : int,
    data        : EmployeeUpdate,
    db          : Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    e = db.query(Employee).filter(Employee.id == employee_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Only update fields that were actually sent (non-None)
    update_fields = data.model_dump(exclude_unset=True)
    for field, value in update_fields.items():
        setattr(e, field, value)

    db.commit()
    db.refresh(e)

    return {
        "id"             : e.id,
        "emp_id"         : e.emp_id,
        "full_name"      : e.full_name,
        "designation"    : e.designation,
        "department"     : e.department,
        "mobile"         : e.mobile,
        "personal_email" : e.personal_email,
        "emp_type"       : e.emp_type,
        "gender"         : e.gender,
        "dob"            : e.dob,
        "blood_group"    : e.blood_group,
        "pan"            : e.pan,
        "aadhar"         : e.aadhar,
        "uan_number"     : e.uan_number,
        "pf_number"      : e.pf_number,
        "bank_acc"       : e.bank_acc,
        "ifsc"           : e.ifsc,
        "bank_name"      : e.bank_name,
        "address"        : e.address,
        "city"           : e.city,
        "state"          : e.state,
        "pin"            : e.pin,
        "company_id"     : e.company_id,
        "created_at"     : e.created_at,
        "grad_degree"    : e.grad_degree,
        "grad_college"   : e.grad_college,
        "grad_university": e.grad_university,
        "grad_year"      : e.grad_year,
        "grad_grade"     : e.grad_grade,
        "pg_degree"      : e.pg_degree,
        "pg_college"     : e.pg_college,
        "pg_university"  : e.pg_university,
        "pg_year"        : e.pg_year,
        "pg_grade"       : e.pg_grade,
    }