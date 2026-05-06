from sqlalchemy.orm import Session
from app.models.post import Post
from app.models.user_interest import UserInterest
from datetime import datetime
import math


def recency_score(created_at):
    hours = (datetime.utcnow() - created_at).total_seconds() / 3600
    return 1 / (hours + 1)


def engagement_score(post):
    return math.log(1 + (post.likes_count or 0) + (post.comments_count or 0))


def get_feed(db: Session, user_id, limit=20):
    results = (
        db.query(Post, UserInterest.weight)
        .join(UserInterest, Post.category_id == UserInterest.category_id)
        .filter(UserInterest.user_id == user_id)
        .all()
    )

    # ✅ FALLBACK (VERY IMPORTANT)
    if not results:
        return db.query(Post).order_by(Post.created_at.desc()).limit(limit).all()

    scored = []

    for post, weight in results:
        score = (
            0.6 * weight +
            0.3 * recency_score(post.created_at) +
            0.1 * engagement_score(post)
        )

        scored.append((post, score))

    scored.sort(key=lambda x: x[1], reverse=True)

    return [p for p, _ in scored[:limit]]