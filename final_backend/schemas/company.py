from pydantic import BaseModel
from typing import Optional

class CompanyOut(BaseModel):
    id:       int
    name:     str
    logo_url: Optional[str] = None
    address:  Optional[str] = None

    class Config:
        from_attributes = True

