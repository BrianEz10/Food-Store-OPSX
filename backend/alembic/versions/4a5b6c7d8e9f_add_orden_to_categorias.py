"""add_orden_to_categorias

Revision ID: 4a5b6c7d8e9f
Revises: 3a4b5c6d7e8f
Create Date: 2026-05-19 23:05:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4a5b6c7d8e9f'
down_revision: Union[str, None] = '3a4b5c6d7e8f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add orden column to categorias table."""
    op.add_column(
        'categorias',
        sa.Column('orden', sa.Integer(), server_default=sa.text('0'), nullable=False),
    )


def downgrade() -> None:
    """Remove orden column from categorias table."""
    op.drop_column('categorias', 'orden')
