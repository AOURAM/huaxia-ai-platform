from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from app.database import Base, engine
from app.models.user import User
from app.models.post import Post
from app.routers.user import router as user_router
from app.routers.post import router as post_router
from app.models.post_reaction import PostReaction
from app.models.comment import Comment
from app.routers.comment import router as comment_router
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Huaxia Backend API")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

Base.metadata.create_all(bind=engine)

app.include_router(post_router)
app.include_router(user_router)
app.include_router(comment_router)


@app.get("/")
def root():
    return {"message": "Backend is running"}