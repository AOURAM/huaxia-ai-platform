from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.culture_event import CultureEvent
from app.models.user import User
from app.schemas.culture_event import (
    CultureEventCreate,
    CultureEventOut,
    CultureEventUpdate,
)

router = APIRouter(prefix="/culture-events", tags=["Culture Events"])


@router.get("/", response_model=list[CultureEventOut])
def get_culture_events(
    upcoming_only: bool = Query(default=False),
    db: Session = Depends(get_db),
):
    query = db.query(CultureEvent)

    if upcoming_only:
        query = query.filter(CultureEvent.event_date >= date.today())

    return (
        query.order_by(CultureEvent.event_date.asc(), CultureEvent.start_time.asc())
        .all()
    )


@router.post("/", response_model=CultureEventOut)
def create_culture_event(
    payload: CultureEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = CultureEvent(
        title=payload.title,
        description=payload.description,
        location=payload.location,
        event_date=payload.event_date,
        start_time=payload.start_time,
        tag=payload.tag,
        created_by_user_id=current_user.id,
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event


@router.put("/{event_id}", response_model=CultureEventOut)
def update_culture_event(
    event_id: int,
    payload: CultureEventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = db.query(CultureEvent).filter(CultureEvent.id == event_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Culture event not found")

    if event.created_by_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this event")

    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(event, field, value)

    db.commit()
    db.refresh(event)

    return event


@router.delete("/{event_id}")
def delete_culture_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    event = db.query(CultureEvent).filter(CultureEvent.id == event_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Culture event not found")

    if event.created_by_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this event")

    db.delete(event)
    db.commit()

    return {"message": "Culture event deleted successfully"}