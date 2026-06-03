from database import SessionLocal, engine, Base
import models.user
import models.company
import models.documents
from models.user import User
from models.company import Company
from services.auth_service import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ── Companies seed ─────────────────────────────────────────────────────────
COMPANIES = [
    {"id": 1, "name": "SoftGrid Info Pvt Ltd",       "is_active": True},
    {"id": 2, "name": "UAS IT Consultancy PVT LTD",  "is_active": True},
    {"id": 3, "name": "Iconsteam Pvt Ltd",            "is_active": True},
    {"id": 4, "name": "Cyber Trident Solutions",      "is_active": True},
    {"id": 5, "name": "Bits Sparrow Technology",      "is_active": True},
]

for co_data in COMPANIES:
    existing = db.query(Company).filter(Company.id == co_data["id"]).first()
    if not existing:
        db.add(Company(**co_data))
        print(f"✅ Company created: {co_data['name']}")
    else:
        print(f"⚠️  Already exists: {co_data['name']}")

db.commit()

# ── Admin user seed ────────────────────────────────────────────────────────
admin_email = "admin@softgridinfo.in"
existing_admin = db.query(User).filter(User.email == admin_email).first()
if not existing_admin:
    admin = User(
        name="Admin",
        email=admin_email,
        password_hash=hash_password("admin@2026"),
        role="admin",
        company_id=1,
    )
    db.add(admin)
    db.commit()
    print(f"\n✅ Admin created")
    print(f"   Email   : {admin_email}")
    print(f"   Password: admin@2026")
    print(f"   Role    : admin")
else:
    print(f"\n⚠️  Admin already exists: {admin_email}")

db.close()
print("\n🎉 Seed complete!")
