from datetime import datetime
from pydantic import BaseModel, field_validator


ALLOWED_PAGES = {"cities", "universities", "culture", "daily_life"}
ALLOWED_CONTENT_TYPES = {"question", "guide", "experience", "news", "tip"}


class PostCreate(BaseModel):
    title: str
    content: str
    page_name: str
    content_type: str
    category: str | None = None

    @field_validator("page_name")
    @classmethod
    def validate_page_name(cls, value: str) -> str:
        value = value.strip().lower()
        if value not in ALLOWED_PAGES:
            raise ValueError(
                "page_name must be one of: cities, universities, culture, daily_life"
            )
        return value

    @field_validator("content_type")
    @classmethod
    def validate_content_type(cls, value: str) -> str:
        value = value.strip().lower()
        if value not in ALLOWED_CONTENT_TYPES:
            raise ValueError(
                "content_type must be one of: question, guide, experience, news, tip"
            )
        return value


class PostUpdate(BaseModel):
    title: str
    content: str
    page_name: str
    content_type: str

    @field_validator("page_name")
    @classmethod
    def validate_page_name(cls, value: str) -> str:
        value = value.strip().lower()
        if value not in ALLOWED_PAGES:
            raise ValueError(
                "page_name must be one of: cities, universities, culture, daily_life"
            )
        return value

    @field_validator("content_type")
    @classmethod
    def validate_content_type(cls, value: str) -> str:
        value = value.strip().lower()
        if value not in ALLOWED_CONTENT_TYPES:
            raise ValueError(
                "content_type must be one of: question, guide, experience, news, tip"
            )
        return value


class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    page_name: str
    content_type: str
    category: str | None = None
    ai_analysis: str | None = None
    summary: str | None = None
    tags: str | None = None
    likes_count: int
    dislikes_count: int
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True


class SemanticSearchRequest(BaseModel):
    query: str
    page_name: str | None = None
    content_type: str | None = None
    limit: int = 5

    @field_validator("page_name")
    @classmethod
    def validate_optional_page_name(cls, value: str | None) -> str | None:
        if value is None:
            return value
        value = value.strip().lower()
        if value not in ALLOWED_PAGES:
            raise ValueError(
                "page_name must be one of: cities, universities, culture, daily_life"
            )
        return value

    @field_validator("content_type")
    @classmethod
    def validate_optional_content_type(cls, value: str | None) -> str | None:
        if value is None:
            return value
        value = value.strip().lower()
        if value not in ALLOWED_CONTENT_TYPES:
            raise ValueError(
                "content_type must be one of: question, guide, experience, news, tip"
            )
        return value


class GlobalSearchRequest(BaseModel):
    query: str
    per_page_limit: int = 3
    min_score: float = 0.20