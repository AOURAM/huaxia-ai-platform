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

    city = City(
        slug=payload.slug,
        name=payload.name,
        province=payload.province,
        region=payload.region,
        lat=payload.lat,
        lng=payload.lng,
        description=payload.description,
        image_url=payload.image_url,
        tags=payload.tags,
        student_summary=payload.student_summary,
        cost_level=payload.cost_level,
        popular_universities=payload.popular_universities,
        highlights=payload.highlights,
    )

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

    return (
        db.query(Post)
        .filter(Post.page_name == "cities", Post.city_id == city.id)
        .order_by(Post.created_at.desc())
        .all()
    )