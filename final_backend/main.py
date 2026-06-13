

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base

# Models import
import models.user
import models.company
import models.documents
import models.user_company
import models.offer_letter
import models.PaySlip_SoftGrid
import models.employee        
import models.notification     

# Routers import
from routers import auth, companies, letters, admin
from routers import offer_letter_router as offer_letter
from routers import PaySlip_SoftGrid
from routers import AppraisalLetter_Softgrid
from routers import notifications
from routers import employees      
from routers import forgot_password


Base.metadata.create_all(bind=engine)

app = FastAPI(title="HR Docs API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(companies.router)
app.include_router(letters.router)
app.include_router(PaySlip_SoftGrid.router)
app.include_router(AppraisalLetter_Softgrid.router)
app.include_router(admin.router)
app.include_router(offer_letter.router)
app.include_router(notifications.router)
app.include_router(employees.router) 
app.include_router(forgot_password.router)


@app.get("/")
def root():

    return {"message": "HR Docs API v2 is running ✅"}