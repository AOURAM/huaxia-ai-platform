from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.user_onboarding import UserOnboarding
from app.routers.user import get_current_user
from app.schemas.onboarding import OnboardingOut, OnboardingUpsert

router = APIRouter(prefix="/users/me/onboarding", tags=["onboarding"])


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

    if onboarding is None:
        onboarding = UserOnboarding(
            user_id=current_user.id,
            interests=payload.interests,
            city=payload.city,
            university=payload.university,
            goal=payload.goal,
            completed=payload.completed,
            skipped=payload.skipped,
        )
        db.add(onboarding)
    else:
        onboarding.interests = payload.interests
        onboarding.city = payload.city
        onboarding.university = payload.university
        onboarding.goal = payload.goal
        onboarding.completed = payload.completed
        onboarding.skipped = payload.skipped

    db.commit()
    db.refresh(onboarding)

    return onboarding