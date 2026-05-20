"""add_configuracion_table

Revision ID: 3a4b5c6d7e8f
Revises: 2a3b4c5d6e7f
Create Date: 2026-05-19 22:55:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3a4b5c6d7e8f'
down_revision: Union[str, None] = '2a3b4c5d6e7f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create configuracion table."""
    op.create_table(
        'configuracion',
        sa.Column('clave', sa.String(100), nullable=False),
        sa.Column('valor', sa.Text(), nullable=False),
        sa.Column('descripcion', sa.Text(), nullable=True),
        sa.Column('actualizado_en', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('clave'),
    )


def downgrade() -> None:
    """Drop configuracion table."""
    op.drop_table('configuracion')
