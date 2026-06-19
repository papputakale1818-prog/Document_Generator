# from datetime import date
# from pydantic import BaseModel, ConfigDict


# class RelievingLetterCreate(BaseModel):
#     emp_id:           str
#     resignation_date: date | None = None
#     relieving_date:   date | None = None
#     letter_date:      date | None = None
#     is_relieved:      bool        = False


# class RelievingLetterUpdate(BaseModel):
#     resignation_date: date | None = None
#     relieving_date:   date | None = None
#     letter_date:      date | None = None
#     is_relieved:      bool | None = None


# class RelievingLetterFetchResponse(BaseModel):
#     emp_id:           str
#     emp_name:         str
#     resignation_date: date | None = None
#     relieving_date:   date | None = None
#     letter_date:      date | None = None

#     model_config = ConfigDict(from_attributes=True)


# class RelievingLetterResponse(BaseModel):
#     id:               int
#     emp_id:           str
#     resignation_date: date | None = None
#     relieving_date:   date | None = None
#     letter_date:      date | None = None
#     is_relieved:      bool

#     model_config = ConfigDict(from_attributes=True)
from datetime import date
from pydantic import BaseModel, ConfigDict


class RelievingLetterCreate(BaseModel):
    emp_id:           str
    resignation_date: date | None = None
    relieving_date:   date | None = None
    letter_date:      date | None = None
    is_relieved:      bool        = False


class RelievingLetterUpdate(BaseModel):
    resignation_date: date | None = None
    relieving_date:   date | None = None
    letter_date:      date | None = None
    is_relieved:      bool | None = None


class RelievingLetterFetchResponse(BaseModel):
    emp_id:           str
    emp_name:         str
    resignation_date: date | None = None
    relieving_date:   date | None = None
    letter_date:      date | None = None

    model_config = ConfigDict(from_attributes=True)


class RelievingLetterResponse(BaseModel):
    id:               int
    emp_id:           str
    resignation_date: date | None = None
    relieving_date:   date | None = None
    letter_date:      date | None = None
    is_relieved:      bool
    created_by:       int | None = None
    created_by_name:  str | None = None

    model_config = ConfigDict(from_attributes=True)