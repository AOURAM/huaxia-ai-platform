"""baseline existing database

Revision ID: 1531bc7d21d6
Revises: 
Create Date: 2026-05-07 12:42:13.304448
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '1531bc7d21d6'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass