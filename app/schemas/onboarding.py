from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


ALLOWED_INTERESTS = {
    "cities",
    "universities",
    "culture",
    "daily_life",
    "housing",
    "visas",
    "food",
    "study_tips",
    "transportation",
}


class OnboardingUpsert(BaseModel):
    interests: List[str] = Field(default_factory=list)
    city: Optional[str] = None
    university: Optional[str] = None
    goal: Optional[str] = None
    completed: bool = True
    skipped: bool = False

    def validate_interests(self) -> None:
        invalid = [item for item in self.interests if item not in ALLOWED_INTERESTS]
        if invalid:
            raise ValueError(f"Invalid interests: {', '.join(invalid)}")


class OnboardingOut(BaseModel):
    id: int
    user_id: int
    interests: List[str]
    city: Optional[str]
    university: Optional[str]
    goal: Optional[str]
    completed: bool
    skipped: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True