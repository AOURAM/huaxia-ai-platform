from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.user_onboarding import UserOnboarding
from app.models.user_interest import UserInterest
from app.routers.user import get_current_user
from app.schemas.onboarding import OnboardingOut, OnboardingUpsert

router = APIRouter(prefix="/users/me/onboarding", tags=["onboarding"])


class InterestPayload(BaseModel):
    category_ids: List[str]


def sync_user_interests(db: Session, user_id: int, interests: list[str]) -> None:
    db.query(UserInterest).filter(UserInterest.user_id == user_id).delete()

    for interest in interests:
        db.add(
            UserInterest(
                user_id=user_id,
                category_id=interest,
                weight=1.0,
                source="onboarding",
            )
        )


@router.post("/interests")
def set_interests(
    payload: InterestPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not payload.category_ids:
        raise HTTPException(status_code=400, detail="No interests provided")

    sync_user_interests(db, current_user.id, payload.category_ids)
    db.commit()

    return {"status": "ok"}


@router.get("/", response_model=OnboardingOut)
def get_my_onboarding(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    onboarding = (
        db.query(UserOnboarding)
        .filter(UserOnboarding.user_id == current_user.id)
        .first()
    )

    if not onboarding:
        raise HTTPException(status_code=404, detail="Onboarding not found")

    return onboarding


@router.put("/", response_model=OnboardingOut)
def upsert_my_onboarding(
    payload: OnboardingUpsert,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        payload.validate_interests()
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error

    onboarding = (
        db.query(UserOnboarding)
        .filter(UserOnboarding.user_id == current_user.id)
        .first()
    )

    interests = [] if payload.skipped else payload.interests

    if onboarding is None:
        onboarding = UserOnboarding(
            user_id=current_user.id,
            interests=interests,
            city=payload.city,
            university=payload.university,
            goal=payload.goal,
            completed=payload.completed,
            skipped=payload.skipped,
        )
        db.add(onboarding)
    else:
        onboarding.interests = interests
        onboarding.city = payload.city
        onboarding.university = payload.university
        onboarding.goal = payload.goal
        onboarding.completed = payload.completed
        onboarding.skipped = payload.skipped

    sync_user_interests(db, current_user.id, interests)

    db.commit()
    db.refresh(onboarding)

    return onboarding