from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from typing import Optional, List
from database import get_db
from models.user import User
from models.company import Company
from routers.deps import get_admin_user
from services.auth_service import hash_password

router = APIRouter(prefix="/admin", tags=["Admin"])

# ── Pydantic Schemas ─────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name:        str
    email:       str
    password:    str
    mobile:      Optional[str] = None
    department:  Optional[str] = None
    designation: Optional[str] = None
    role:        str = "user"

class UserUpdate(BaseModel):
    name:        Optional[str] = None
    email:       Optional[str] = None
    mobile:      Optional[str] = None
    department:  Optional[str] = None
    designation: Optional[str] = None
    role:        Optional[str] = None
    password:    Optional[str] = None

class AssignCompaniesBody(BaseModel):
    company_ids: List[int]

# ── Helper: user → dict ──────────────────────────────────────────────────────
def user_to_dict(u: User) -> dict:
    return {
        "id":          u.id,
        "name":        u.name,
        "email":       u.email,
        "mobile":      getattr(u, 'mobile', None),
        "department":  getattr(u, 'department', None),
        "designation": getattr(u, 'designation', None),
        "role":        u.role,
    }

# ── Helper: get assigned company ids for a user (raw SQL — safe) ─────────────
def get_company_ids(user_id: int, db: Session) -> List[int]:
    result = db.execute(
        text("SELECT company_id FROM user_companies WHERE user_id = :uid"),
        {"uid": user_id}
    ).fetchall()
    return [row[0] for row in result]

# ── Helper: set companies for a user (replace all) ───────────────────────────
def set_companies(user_id: int, company_ids: List[int], db: Session):
    # delete existing
    db.execute(
        text("DELETE FROM user_companies WHERE user_id = :uid"),
        {"uid": user_id}
    )
    # insert new
    for cid in company_ids:
        company = db.query(Company).filter(Company.id == cid).first()
        if not company:
            raise HTTPException(status_code=404, detail=f"Company id={cid} not found")
        db.execute(
            text("INSERT INTO user_companies (user_id, company_id) VALUES (:uid, :cid)"),
            {"uid": user_id, "cid": cid}
        )
    db.commit()


# ════════════════════════════════════════════════════════════════════════════
# USERS — CRUD
# ════════════════════════════════════════════════════════════════════════════

# ── GET all users ────────────────────────────────────────────────────────────
@router.get("/users")
def get_all_users(
    db:    Session = Depends(get_db),
    admin: User    = Depends(get_admin_user),
):
    users = db.query(User).all()
    return [user_to_dict(u) for u in users]


# ── POST create user ─────────────────────────────────────────────────────────
@router.post("/users", status_code=201)
def create_user(
    data:  UserCreate,
    db:    Session = Depends(get_db),
    admin: User    = Depends(get_admin_user),
):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=          data.name,
        email=         data.email,
        password_hash= hash_password(data.password),
        mobile=        data.mobile,
        department=    data.department,
        designation=   data.designation,
        role=          data.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": f"User '{user.name}' created", "id": user.id, **user_to_dict(user)}


# ── PUT update user ──────────────────────────────────────────────────────────
@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    data:    UserUpdate,
    db:      Session = Depends(get_db),
    admin:   User    = Depends(get_admin_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.name        is not None: user.name        = data.name
    if data.email       is not None:
        exists = db.query(User).filter(User.email == data.email, User.id != user_id).first()
        if exists:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = data.email
    if data.mobile      is not None: user.mobile      = data.mobile
    if data.department  is not None: user.department  = data.department
    if data.designation is not None: user.designation = data.designation
    if data.role        is not None: user.role        = data.role
    if data.password:                user.password_hash = hash_password(data.password)

    db.commit()
    db.refresh(user)
    return user_to_dict(user)


# ── DELETE user ──────────────────────────────────────────────────────────────
@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db:      Session = Depends(get_db),
    admin:   User    = Depends(get_admin_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # user_companies madhun pan delete kar
    db.execute(
        text("DELETE FROM user_companies WHERE user_id = :uid"),
        {"uid": user_id}
    )
    db.delete(user)
    db.commit()
    return {"message": f"User '{user.name}' deleted"}


# ════════════════════════════════════════════════════════════════════════════
# COMPANIES — assign / get / update
# ════════════════════════════════════════════════════════════════════════════

# ── GET user's assigned companies ────────────────────────────────────────────
@router.get("/users/{user_id}/companies")
def get_user_companies(
    user_id: int,
    db:      Session = Depends(get_db),
    admin:   User    = Depends(get_admin_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    ids = get_company_ids(user_id, db)

    # legacy fallback
    if not ids and user.company_id:
        ids = [user.company_id]

    if not ids:
        return []

    companies = db.query(Company).filter(Company.id.in_(ids)).all()
    return [{"id": c.id, "name": c.name} for c in companies]


# ── PUT assign / update multiple companies ───────────────────────────────────
@router.put("/users/{user_id}/companies")
def assign_companies(
    user_id: int,
    data:    AssignCompaniesBody,
    db:      Session = Depends(get_db),
    admin:   User    = Depends(get_admin_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    set_companies(user_id, data.company_ids, db)

    # legacy company_id pan update kar
    user.company_id = data.company_ids[0] if data.company_ids else None
    db.commit()

    ids = get_company_ids(user_id, db)
    companies = db.query(Company).filter(Company.id.in_(ids)).all()
    return {
        "message":   f"{user.name} ला {len(ids)} companies assign केल्या",
        "companies": [{"id": c.id, "name": c.name} for c in companies],
    }


# ════════════════════════════════════════════════════════════════════════════
# LEGACY endpoints
# ════════════════════════════════════════════════════════════════════════════

class AssignCompany(BaseModel):
    user_id:    int
    company_id: int

@router.put("/assign-company")
def assign_company_legacy(
    data:  AssignCompany,
    db:    Session = Depends(get_db),
    admin: User    = Depends(get_admin_user),
):
    set_companies(data.user_id, [data.company_id], db)
    return {"message": "Company assigned"}

@router.put("/remove-company/{user_id}")
def remove_company(
    user_id: int,
    db:      Session = Depends(get_db),
    admin:   User    = Depends(get_admin_user),
):
    set_companies(user_id, [], db)
    return {"message": "Company access removed"}

@router.put("/make-admin/{user_id}")
def make_admin(
    user_id: int,
    db:      Session = Depends(get_db),
    admin:   User    = Depends(get_admin_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = "admin"
    db.commit()
    return {"message": f"{user.name} आता admin आहे"}