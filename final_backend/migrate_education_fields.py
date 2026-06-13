
"""
run: python migrate_education_fields.py
"""
from database import engine
from sqlalchemy import text

COLUMNS_TO_ADD = {
    "notifications": [
        ("emp_id",          "VARCHAR(20)"),
        ("grad_degree",     "VARCHAR(100)"),
        ("grad_college",    "VARCHAR(200)"),
        ("grad_university", "VARCHAR(200)"),
        ("grad_year",       "VARCHAR(4)"),
        ("grad_grade",      "VARCHAR(20)"),
        ("pg_degree",       "VARCHAR(100)"),
        ("pg_college",      "VARCHAR(200)"),
        ("pg_university",   "VARCHAR(200)"),
        ("pg_year",         "VARCHAR(4)"),
        ("pg_grade",        "VARCHAR(20)"),
    ],
    "employees": [
        ("grad_degree",     "VARCHAR(100)"),
        ("grad_college",    "VARCHAR(200)"),
        ("grad_university", "VARCHAR(200)"),
        ("grad_year",       "VARCHAR(4)"),
        ("grad_grade",      "VARCHAR(20)"),
        ("pg_degree",       "VARCHAR(100)"),
        ("pg_college",      "VARCHAR(200)"),
        ("pg_university",   "VARCHAR(200)"),
        ("pg_year",         "VARCHAR(4)"),
        ("pg_grade",        "VARCHAR(20)"),
    ],
}

def column_exists(conn, table, column):
    result = conn.execute(text(
        f"SELECT COUNT(*) FROM information_schema.COLUMNS "
        f"WHERE TABLE_SCHEMA = DATABASE() "
        f"AND TABLE_NAME = '{table}' "
        f"AND COLUMN_NAME = '{column}'"
    ))
    return result.scalar() > 0

with engine.connect() as conn:
    for table, columns in COLUMNS_TO_ADD.items():
        print(f"\n── {table} ──")
        for col_name, col_type in columns:
            if column_exists(conn, table, col_name):
                print(f"  SKIP (already exists): {col_name}")
            else:
                try:
                    conn.execute(text(
                        f"ALTER TABLE {table} ADD COLUMN {col_name} {col_type} NULL"
                    ))
                    conn.commit()
                    print(f"  ADDED: {col_name}")
                except Exception as e:
                    print(f"  ERROR: {col_name} — {e}")

    print("\n✅ Migration complete!")