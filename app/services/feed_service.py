from datetime import datetime, timezone
import math

from sqlalchemy.orm import Session

from app.models.post import Post
from app.models.user_interest import UserInterest


def recency_score(created_at):
    if created_at is None:
        return 0.0

    now = datetime.now(timezone.utc)

    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)

    hours = (now - created_at).total_seconds() / 3600
    return 1 / (hours + 1)


def engagement_score(post: Post) -> float:
    likes = post.likes_count or 0
    dislikes = post.dislikes_count or 0
    raw_score = max(likes - dislikes, 0)

    return math.log(1 + raw_score)


def get_feed(db: Session, user_id, limit=20):
    results = (
        db.query(Post, UserInterest.weight)
        .join(UserInterest, Post.category_id == UserInterest.category_id)
        .filter(UserInterest.user_id == user_id)
        .all()
    )

    if not results:
        return db.query(Post).order_by(Post.created_at.desc()).limit(limit).all()

    scored = []

    for post, weight in results:
        score = (
            0.6 * float(weight)
            + 0.3 * recency_score(post.created_at)
            + 0.1 * engagement_score(post)
        )
        scored.append((post, score))

    scored.sort(key=lambda item: item[1], reverse=True)

    return [post for post, _ in scored[:limit]]