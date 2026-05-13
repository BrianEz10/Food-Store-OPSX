"""add_descripcion_to_ingredientes

Revision ID: 2a3b4c5d6e7f
Revises: 6ee74042a432
Create Date: 2026-05-13 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2a3b4c5d6e7f'
down_revision: Union[str, None] = '6ee74042a432'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add descripcion column to ingredientes table."""
    op.add_column(
        'ingredientes',
        sa.Column('descripcion', sa.Text(), nullable=True),
    )


def downgrade() -> None:
    """Remove descripcion column from ingredientes table."""
    op.drop_column('ingredientes', 'descripcion')
