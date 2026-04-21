"""create catalog tables

Revision ID: 20260415_0004
Revises: 20260415_0003
Create Date: 2026-04-15 00:30:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260415_0004"
down_revision: str | None = "20260415_0003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "packaging_options",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("price", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_packaging_options")),
    )
    op.create_table(
        "extra_services",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("price", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_extra_services")),
    )



def downgrade() -> None:
    op.drop_table("extra_services")
    op.drop_table("packaging_options")
