from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine

# Import models so SQLAlchemy registers all tables before create_all.
import app.models.user
import app.models.post
import app.models.post_reaction
import app.models.comment
import app.models.user_onboarding
import app.models.city
import app.models.culture_event
import app.models.user_interest

from app.routers.user import router as user_router
from app.routers.post import router as post_router
from app.routers.comment import router as comment_router
from app.routers.onboarding import router as onboarding_router
from app.routers.city import router as city_router
from app.routers.culture_event import router as culture_event_router
from app.routers.feed import router as feed_router

app = FastAPI(
    title="Huaxia Backend API",
    description="Backend API for Huaxia, an AI-assisted semantic search community platform.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


app.include_router(post_router)
app.include_router(user_router)
app.include_router(comment_router)
app.include_router(onboarding_router)
app.include_router(city_router)
app.include_router(culture_event_router)
app.include_router(feed_router)


@app.get("/")
def root():
    return {
        "message": "Huaxia API is running",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "huaxia-api",
    }