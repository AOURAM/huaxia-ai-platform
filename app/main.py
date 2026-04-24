from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app.models.user import User
from app.models.post import Post
from app.models.post_reaction import PostReaction
from app.models.comment import Comment
from app.routers.user import router as user_router
from app.routers.post import router as post_router
from app.routers.comment import router as comment_router
from app.models.user_onboarding import UserOnboarding
from app.routers.onboarding import router as onboarding_router

app = FastAPI(title="Huaxia Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

Base.metadata.create_all(bind=engine)

app.include_router(post_router)
app.include_router(user_router)
app.include_router(comment_router)
app.include_router(onboarding_router)

@app.get("/")
def root():
    return {"message": "Backend is running"}