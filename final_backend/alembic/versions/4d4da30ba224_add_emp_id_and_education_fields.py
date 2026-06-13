"""add emp_id and education fields

Revision ID: 4d4da30ba224
Revises: 
Create Date: 2026-06-05 11:20:52.834002

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '4d4da30ba224'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── employees table — education fields ───────────────────────────────────
    op.add_column('employees', sa.Column('grad_degree',     sa.String(length=100), nullable=True))
    op.add_column('employees', sa.Column('grad_college',    sa.String(length=200), nullable=True))
    op.add_column('employees', sa.Column('grad_university', sa.String(length=200), nullable=True))
    op.add_column('employees', sa.Column('grad_year',       sa.String(length=4),   nullable=True))
    op.add_column('employees', sa.Column('grad_grade',      sa.String(length=20),  nullable=True))
    op.add_column('employees', sa.Column('pg_degree',       sa.String(length=100), nullable=True))
    op.add_column('employees', sa.Column('pg_college',      sa.String(length=200), nullable=True))
    op.add_column('employees', sa.Column('pg_university',   sa.String(length=200), nullable=True))
    op.add_column('employees', sa.Column('pg_year',         sa.String(length=4),   nullable=True))
    op.add_column('employees', sa.Column('pg_grade',        sa.String(length=20),  nullable=True))

    # ── notifications table — emp_id + education fields ───────────────────────
    op.add_column('notifications', sa.Column('emp_id',          sa.String(length=20),  nullable=True))
    op.add_column('notifications', sa.Column('grad_degree',     sa.String(length=100), nullable=True))
    op.add_column('notifications', sa.Column('grad_college',    sa.String(length=200), nullable=True))
    op.add_column('notifications', sa.Column('grad_university', sa.String(length=200), nullable=True))
    op.add_column('notifications', sa.Column('grad_year',       sa.String(length=4),   nullable=True))
    op.add_column('notifications', sa.Column('grad_grade',      sa.String(length=20),  nullable=True))
    op.add_column('notifications', sa.Column('pg_degree',       sa.String(length=100), nullable=True))
    op.add_column('notifications', sa.Column('pg_college',      sa.String(length=200), nullable=True))
    op.add_column('notifications', sa.Column('pg_university',   sa.String(length=200), nullable=True))
    op.add_column('notifications', sa.Column('pg_year',         sa.String(length=4),   nullable=True))
    op.add_column('notifications', sa.Column('pg_grade',        sa.String(length=20),  nullable=True))


def downgrade() -> None:
    # ── notifications ─────────────────────────────────────────────────────────
    op.drop_column('notifications', 'pg_grade')
    op.drop_column('notifications', 'pg_year')
    op.drop_column('notifications', 'pg_university')
    op.drop_column('notifications', 'pg_college')
    op.drop_column('notifications', 'pg_degree')
    op.drop_column('notifications', 'grad_grade')
    op.drop_column('notifications', 'grad_year')
    op.drop_column('notifications', 'grad_university')
    op.drop_column('notifications', 'grad_college')
    op.drop_column('notifications', 'grad_degree')
    op.drop_column('notifications', 'emp_id')

    # ── employees ─────────────────────────────────────────────────────────────
    op.drop_column('employees', 'pg_grade')
    op.drop_column('employees', 'pg_year')
    op.drop_column('employees', 'pg_university')
    op.drop_column('employees', 'pg_college')
    op.drop_column('employees', 'pg_degree')
    op.drop_column('employees', 'grad_grade')
    op.drop_column('employees', 'grad_year')
    op.drop_column('employees', 'grad_university')
    op.drop_column('employees', 'grad_college')
    op.drop_column('employees', 'grad_degree')