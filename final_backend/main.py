
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base

# Models import
import models.user
import models.company
import models.documents
import models.user_company
import models.offer_letter
import models.PaySlip_SoftGrid     # ✅ exact file name

# Routers import
from routers import auth, companies, letters, admin, offer_letter_router as offer_letter ,PaySlip_SoftGrid
from routers import PaySlip_SoftGrid    # ✅ exact file name
from routers.PaySlip_SoftGrid import router as payslip_router
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
app.include_router(admin.router)
app.include_router(offer_letter.router)
app.include_router(payslip_router)                 

@app.get("/")
def root():
    return {"message": "HR Docs API v2 is running ✅"}