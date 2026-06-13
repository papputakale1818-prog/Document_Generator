import os, sys
from dotenv import load_dotenv
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# ── .env load + path setup ────────────────────────────────────────────────────
load_dotenv()
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# ── Alembic config ────────────────────────────────────────────────────────────
config = context.config

# DB URL — .env मधून read करतो (alembic.ini override)
config.set_main_option(
    "sqlalchemy.url",
    f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ── Models import — सगळे import केले नाहीत तर alembic tables detect करणार नाही
from database import Base

from models import company
from models import user
from models import user_company
from models import employee
from models import notification
from models import documents
from models import offer_letter
from models import PaySlip_SoftGrid

target_metadata = Base.metadata


# ── Offline mode ──────────────────────────────────────────────────────────────
def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


# ── Online mode ───────────────────────────────────────────────────────────────
def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()