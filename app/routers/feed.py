from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.feed_service import get_feed
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/feed", tags=["feed"])


@router.get("/")
def read_feed(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return get_feed(db, user.id)