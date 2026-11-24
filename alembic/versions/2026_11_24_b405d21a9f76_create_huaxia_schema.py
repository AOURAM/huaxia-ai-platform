"""Create the Huaxia schema on a new database.

Revision ID: b405d21a9f76
Revises: 1531bc7d21d6
"""

from alembic import context, op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "b405d21a9f76"
down_revision = "1531bc7d21d6"
branch_labels = None
depends_on = None

APP_TABLES = {
    "cities",
    "comments",
    "culture_events",
    "post_reactions",
    "posts",
    "user_interests",
    "user_onboarding",
    "users",
}


def upgrade() -> None:
    if not context.is_offline_mode():
        existing = APP_TABLES.intersection(sa.inspect(op.get_bind()).get_table_names())
        if existing == APP_TABLES:
            return
        if existing:
            missing = ", ".join(sorted(APP_TABLES - existing))
            raise RuntimeError(f"Incomplete Huaxia schema. Missing tables: {missing}")

    op.create_table(
        'cities',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('slug', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('province', sa.String(), nullable=False),
        sa.Column('region', sa.String(), nullable=False),
        sa.Column('lat', sa.Float(), nullable=False),
        sa.Column('lng', sa.Float(), nullable=False),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('image_url', sa.String(), nullable=True),
        sa.Column('tags', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('student_summary', sa.String(), nullable=True),
        sa.Column('cost_level', sa.String(), nullable=True),
        sa.Column('popular_universities', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('highlights', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_cities_id'), 'cities', ['id'], unique=False)
    op.create_index(op.f('ix_cities_slug'), 'cities', ['slug'], unique=True)
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password', sa.String(length=255), nullable=False),
        sa.Column('bio', sa.String(length=500), nullable=True),
        sa.Column('gender', sa.String(length=30), nullable=True),
        sa.Column('avatar_style', sa.String(length=50), nullable=True),
        sa.Column('avatar_seed', sa.String(length=120), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    op.create_table(
        'culture_events',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=160), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('location', sa.String(length=200), nullable=False),
        sa.Column('event_date', sa.Date(), nullable=False),
        sa.Column('start_time', sa.String(length=20), nullable=False),
        sa.Column('tag', sa.String(length=50), nullable=False),
        sa.Column('created_by_user_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['created_by_user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_culture_events_created_by_user_id'), 'culture_events', ['created_by_user_id'], unique=False)
    op.create_index(op.f('ix_culture_events_event_date'), 'culture_events', ['event_date'], unique=False)
    op.create_index(op.f('ix_culture_events_id'), 'culture_events', ['id'], unique=False)
    op.create_index(op.f('ix_culture_events_tag'), 'culture_events', ['tag'], unique=False)
    op.create_table(
        'posts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('page_name', sa.String(length=50), nullable=False),
        sa.Column('content_type', sa.String(length=50), nullable=False),
        sa.Column('category_id', sa.String(length=100), nullable=True),
        sa.Column('ai_status', sa.String(length=20), nullable=False),
        sa.Column('ai_error', sa.Text(), nullable=True),
        sa.Column('ai_analysis', sa.Text(), nullable=True),
        sa.Column('ai_updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('tags', sa.Text(), nullable=True),
        sa.Column('embedding', sa.Text(), nullable=True),
        sa.Column('search_vector', postgresql.TSVECTOR(), nullable=True),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('likes_count', sa.Integer(), nullable=False),
        sa.Column('dislikes_count', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('city_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['city_id'], ['cities.id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_posts_ai_status'), 'posts', ['ai_status'], unique=False)
    op.create_index(op.f('ix_posts_category_id'), 'posts', ['category_id'], unique=False)
    op.create_index(op.f('ix_posts_city_id'), 'posts', ['city_id'], unique=False)
    op.create_index(op.f('ix_posts_content_type'), 'posts', ['content_type'], unique=False)
    op.create_index(op.f('ix_posts_id'), 'posts', ['id'], unique=False)
    op.create_index(op.f('ix_posts_page_name'), 'posts', ['page_name'], unique=False)
    op.create_index(op.f('ix_posts_user_id'), 'posts', ['user_id'], unique=False)
    op.create_table(
        'user_interests',
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('category_id', sa.String(), nullable=False),
        sa.Column('weight', sa.Float(), nullable=True),
        sa.Column('source', sa.String(), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('user_id', 'category_id'),
    )
    op.create_table(
        'user_onboarding',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('interests', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('city', sa.String(), nullable=True),
        sa.Column('university', sa.String(), nullable=True),
        sa.Column('goal', sa.String(), nullable=True),
        sa.Column('completed', sa.Boolean(), nullable=False),
        sa.Column('skipped', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_user_onboarding_id'), 'user_onboarding', ['id'], unique=False)
    op.create_index(op.f('ix_user_onboarding_user_id'), 'user_onboarding', ['user_id'], unique=True)
    op.create_table(
        'comments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('post_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['post_id'], ['posts.id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_comments_id'), 'comments', ['id'], unique=False)
    op.create_index(op.f('ix_comments_post_id'), 'comments', ['post_id'], unique=False)
    op.create_index(op.f('ix_comments_user_id'), 'comments', ['user_id'], unique=False)
    op.create_table(
        'post_reactions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('post_id', sa.Integer(), nullable=False),
        sa.Column('reaction_type', sa.String(length=10), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['post_id'], ['posts.id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'post_id', name='unique_user_post_reaction'),
    )
    op.create_index(op.f('ix_post_reactions_id'), 'post_reactions', ['id'], unique=False)


def downgrade() -> None:
    # The preceding baseline also represents a database with these tables.
    pass
