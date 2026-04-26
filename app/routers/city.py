import json

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.city import City
from app.models.post import Post
from app.models.user import User
from app.schemas.city import CityCreate, CityOut, CityUpdate
from app.schemas.post import PostResponse

router = APIRouter(prefix="/cities", tags=["cities"])


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
        "city_id": post.city_id,
        "category": post.category,
        "ai_analysis": post.ai_analysis,
        "summary": post.summary,
        "tags": parse_tags(post.tags),
        "image_url": post.image_url,
        "likes_count": post.likes_count,
        "dislikes_count": post.dislikes_count,
        "created_at": post.created_at,
        "user_id": post.user_id,
    }


@router.get("/", response_model=list[CityOut])
def get_cities(
    region: str | None = Query(default=None),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(City)

    if region and region != "all":
        query = query.filter(City.region == region)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            City.name.ilike(search_term)
            | City.province.ilike(search_term)
            | City.description.ilike(search_term)
            | City.student_summary.ilike(search_term)
        )

    return query.order_by(City.name.asc()).all()


@router.post("/", response_model=CityOut)
def create_city(
    payload: CityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_city = db.query(City).filter(City.slug == payload.slug).first()

    if existing_city:
        raise HTTPException(status_code=400, detail="City slug already exists")

    city = City(**payload.model_dump())

    db.add(city)
    db.commit()
    db.refresh(city)

    return city


@router.get("/{slug}", response_model=CityOut)
def get_city(slug: str, db: Session = Depends(get_db)):
    city = db.query(City).filter(City.slug == slug).first()

    if not city:
        raise HTTPException(status_code=404, detail="City not found")

    return city


@router.put("/{slug}", response_model=CityOut)
def update_city(
    slug: str,
    payload: CityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    city = db.query(City).filter(City.slug == slug).first()

    if not city:
        raise HTTPException(status_code=404, detail="City not found")

    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(city, field, value)

    db.commit()
    db.refresh(city)

    return city


@router.get("/{slug}/posts", response_model=list[PostResponse])
def get_city_posts(slug: str, db: Session = Depends(get_db)):
    city = db.query(City).filter(City.slug == slug).first()

    if not city:
        raise HTTPException(status_code=404, detail="City not found")

    posts = (
    db.query(Post)
    .filter(
        Post.page_name == "cities",
        Post.city_id == city.id,
        Post.city_id.isnot(None),
    )
    .order_by(Post.created_at.desc())
    .all()
)

    return [serialize_post_response(post) for post in posts]