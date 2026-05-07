import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostResponse
from app.services.feed_service import get_feed

router = APIRouter(prefix="/feed", tags=["feed"])


def parse_tags(tags_value):
    if tags_value is None:
        return None

    if isinstance(tags_value, list):
        return tags_value

    if isinstance(tags_value, str):
        try:
            return json.loads(tags_value)
        except json.JSONDecodeError:
            return []

    return []


def serialize_post_response(post: Post) -> dict:
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "page_name": post.page_name,
        "content_type": post.content_type,
        "category_id": post.category_id,
        "ai_analysis": post.ai_analysis,
        "summary": post.summary,
        "tags": parse_tags(post.tags),
        "image_url": post.image_url,
        "likes_count": post.likes_count,
        "dislikes_count": post.dislikes_count,
        "created_at": post.created_at,
        "user_id": post.user_id,
        "city_id": post.city_id,
    }


@router.get("/", response_model=list[PostResponse])
def read_feed(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    posts = get_feed(db, current_user.id)
    return [serialize_post_response(post) for post in posts]