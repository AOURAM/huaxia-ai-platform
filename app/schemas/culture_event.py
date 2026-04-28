from datetime import date, datetime

from pydantic import BaseModel, field_validator


ALLOWED_EVENT_TAGS = {
    "festival",
    "workshop",
    "food",
    "music",
    "language",
    "campus",
    "community",
    "other",
}


class CultureEventCreate(BaseModel):
    title: str
    description: str
    location: str
    event_date: date
    start_time: str
    tag: str = "community"

    @field_validator("title", "description", "location", "start_time")
    @classmethod
    def validate_required_text(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("This field cannot be empty")

        return value

    @field_validator("tag")
    @classmethod
    def validate_tag(cls, value: str) -> str:
        value = value.strip().lower().replace(" ", "_")

        if value not in ALLOWED_EVENT_TAGS:
            raise ValueError(
                "tag must be one of: festival, workshop, food, music, language, campus, community, other"
            )

        return value


class CultureEventUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    location: str | None = None
    event_date: date | None = None
    start_time: str | None = None
    tag: str | None = None

    @field_validator("title", "description", "location", "start_time")
    @classmethod
    def validate_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip()

        if not value:
            raise ValueError("This field cannot be empty")

        return value

    @field_validator("tag")
    @classmethod
    def validate_tag(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip().lower().replace(" ", "_")

        if value not in ALLOWED_EVENT_TAGS:
            raise ValueError(
                "tag must be one of: festival, workshop, food, music, language, campus, community, other"
            )

        return value


class CultureEventOut(BaseModel):
    id: int
    title: str
    description: str
    location: str
    event_date: date
    start_time: str
    tag: str
    created_by_user_id: int | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True