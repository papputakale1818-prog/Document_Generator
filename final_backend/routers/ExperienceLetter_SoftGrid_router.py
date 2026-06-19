# from fastapi import APIRouter, Depends, status
# from sqlalchemy.orm import Session

# from database import get_db
# from models.experience_letter import ExperienceLetter
# from schemas.experience_letter import ExperienceLetterCreate, ExperienceLetterResponse
# from routers.deps import get_current_user
# from models.user import User

# router = APIRouter(
#     prefix="/api/experience-letters",
#     tags=["Experience Letters — SoftGrid"],
# )


# # ── POST / — save new record ─────────────────────────────────────────────────
# @router.post("/", response_model=ExperienceLetterResponse, status_code=status.HTTP_201_CREATED)
# def create_record(
#     payload: ExperienceLetterCreate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     record = ExperienceLetter(
#         emp_id=payload.emp_id,
#         letter_date=payload.letter_date,
#         company_id=payload.company_id,
#         created_by=current_user.id,
#     )
#     db.add(record)
#     db.commit()
#     db.refresh(record)
#     return record
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.ExperienceLetter_SoftGrid_model import ExperienceLetter
from schemas.ExperienceLetter_SoftGrid_schemas import ExperienceLetterCreate, ExperienceLetterOut
from routers.deps import get_current_user
from models.user import User

router = APIRouter(
    prefix="/api/experience-letters",
    tags=["Experience Letters — SoftGrid"],
)


# ── POST / — save new record ─────────────────────────────────────────────────
@router.post("/", response_model=ExperienceLetterOut, status_code=status.HTTP_201_CREATED)
def create_record(
    payload: ExperienceLetterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = ExperienceLetter(
        emp_id=payload.emp_id,
        letter_date=payload.letter_date,
        company_id=payload.company_id,
        created_by=current_user.id,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


# ── GET / — list all records ──────────────────────────────────────────────────
@router.get("/", response_model=list[ExperienceLetterOut])
def list_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(ExperienceLetter, User.name.label("created_by_name"))
        .outerjoin(User, User.id == ExperienceLetter.created_by)
        .order_by(ExperienceLetter.id.desc())
        .all()
    )

    result = []
    for record, created_by_name in rows:
        data = ExperienceLetterOut.model_validate(record)
        data.created_by_name = created_by_name
        result.append(data)
    return result


# ── DELETE /{record_id} — delete a record ────────────────────────────────────
@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = db.query(ExperienceLetter).filter(ExperienceLetter.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()