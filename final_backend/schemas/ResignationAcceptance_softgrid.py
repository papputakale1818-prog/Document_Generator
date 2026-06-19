
from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional


# ── Used by POST / ────────────────────────────────────────────────────────
# Only emp_id + letter_date come from the client.
# created_by is set server-side from the logged-in user, never from payload.
class ResignationAcceptanceCreate(BaseModel):
    emp_id: str
    letter_date: date


# ── Used by PATCH /{emp_id} ──────────────────────────────────────────────
class ResignationAcceptanceUpdate(BaseModel):
    letter_date: Optional[date] = None


# ── Used by GET /{emp_id} ← Frontend "Fetch Details" button ─────────────
# emp_name comes from the employees table join; letter_date comes from
# an existing record if one was already generated for this employee.
class ResignationAcceptanceFetchResponse(BaseModel):
    emp_id: str
    emp_name: str
    letter_date: Optional[date] = None


# ── Used by GET / and as the response of POST / PATCH ───────────────────
class ResignationAcceptanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    emp_id: str
    letter_date: date
    created_by: int
    created_by_name: Optional[str] = None