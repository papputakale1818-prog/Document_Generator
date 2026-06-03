from pydantic import BaseModel
from datetime import date

class OfferLetterCreate(BaseModel):
    candidate_name: str
    designation:    str
    department:     str
    ctc:            float
    joining_date:   date

class OfferConfirmCreate(BaseModel):
    employee_name:  str
    designation:    str
    confirmed_date: date

class PaySlipCreate(BaseModel):
    employee_name: str
    month:         str
    year:          int
    basic:         float
    hra:           float
    allowances:    float
    deductions:    float

class AppraisalCreate(BaseModel):
    employee_name:  str
    old_ctc:        float
    new_ctc:        float
    effective_date: date

class RelievingCreate(BaseModel):
    employee_name:    str
    designation:      str
    last_working_day: date

class ExperienceCreate(BaseModel):
    employee_name: str
    designation:   str
    from_date:     date
    to_date:       date
