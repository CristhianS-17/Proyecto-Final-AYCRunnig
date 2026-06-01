"""merge migration heads

Revision ID: 108a8127ea90
Revises: 902c9a194c12, cc736bffd472
Create Date: 2026-06-01 19:11:38.846861

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '108a8127ea90'
down_revision = ('902c9a194c12', 'cc736bffd472')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
