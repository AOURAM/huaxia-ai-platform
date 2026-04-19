from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from app.database import Base, engine
from app.models.user import User
from app.models.post import Post
from app.routers.user import router as user_router
from app.routers.post import router as post_router


app = FastAPI(title="Huaxia Backend API")

Base.metadata.create_all(bind=engine)

app.include_router(post_router)
app.include_router(user_router)


@app.get("/")
def root():
    return {"message": "Backend is running"}