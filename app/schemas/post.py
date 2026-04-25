from datetime import datetime

from pydantic import BaseModel, field_validator

from app.schemas.comment import CommentDetailResponse

ALLOWED_PAGES = {"cities", "universities", "culture", "daily_life"}
ALLOWED_CONTENT_TYPES = {"question", "guide", "experience", "news", "tip"}


def normalize_page_name(value: str) -> str:
    value = value.strip().lower()
    if value not in ALLOWED_PAGES:
        raise ValueError(
            "page_name must be one of: cities, universities, culture, daily_life"
        )
    return value


def normalize_content_type(value: str) -> str:
    value = value.strip().lower()
    if value not in ALLOWED_CONTENT_TYPES:
        raise ValueError(
            "content_type must be one of: question, guide, experience, news, tip"
        )
    return value


class PostCreate(BaseModel):
    title: str
    content: str
    page_name: str
    content_type: str
    category: str | None = None
    city_id: int | None = None

    @field_validator("page_name")
    @classmethod
    def validate_page_name(cls, value: str) -> str:
        return normalize_page_name(value)

    @field_validator("content_type")
    @classmethod
    def validate_content_type(cls, value: str) -> str:
        return normalize_content_type(value)


class PostUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    page_name: str | None = None
    content_type: str | None = None
    city_id: int | None = None

    @field_validator("page_name")
    @classmethod
    def validate_page_name(cls, value: str | None) -> str | None:
        if value is None:
            return value
        return normalize_page_name(value)

    @field_validator("content_type")
    @classmethod
    def validate_content_type(cls, value: str | None) -> str | None:
        if value is None:
            return value
        return normalize_content_type(value)


class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    page_name: str
    content_type: str
    category: str | None = None
    ai_analysis: str | None = None
    summary: str | None = None
    tags: list[str] | None = None
    likes_count: int
    dislikes_count: int
    created_at: datetime
    user_id: int
    city_id: int | None = None
    image_url: str | None = None

    class Config:
        from_attributes = True


class HybridSearchRequest(BaseModel):
    query: str
    page_name: str | None = None
    content_type: str | None = None
    city_id: int | None = None
    limit: int = 5

    @field_validator("page_name")
    @classmethod
    def validate_page_name(cls, value: str | None) -> str | None:
        if value is None:
            return value
        return normalize_page_name(value)

    @field_validator("content_type")
    @classmethod
    def validate_content_type(cls, value: str | None) -> str | None:
        if value is None:
            return value
        return normalize_content_type(value)

    @field_validator("limit")
    @classmethod
    def validate_limit(cls, value: int) -> int:
        if value < 1 or value > 50:
            raise ValueError("limit must be between 1 and 50")
        return value


class GlobalSearchRequest(BaseModel):
    query: str
    per_page_limit: int = 3
    min_score: float = 0.20

    @field_validator("per_page_limit")
    @classmethod
    def validate_per_page_limit(cls, value: int) -> int:
        if value < 1 or value > 20:
            raise ValueError("per_page_limit must be between 1 and 20")
        return value

    @field_validator("min_score")
    @classmethod
    def validate_min_score(cls, value: float) -> float:
        if value < 0 or value > 1:
            raise ValueError("min_score must be between 0 and 1")
        return value


class PostReactionRequest(BaseModel):
    reaction_type: str

    @field_validator("reaction_type")
    @classmethod
    def validate_reaction_type(cls, value: str) -> str:
        value = value.strip().lower()
        if value not in {"like", "dislike"}:
            raise ValueError("reaction_type must be 'like' or 'dislike'")
        return value


class RecommendationResponse(BaseModel):
    id: int
    title: str
    page_name: str
    content_type: str
    category: str | None = None
    summary: str | None = None
    image_url: str | None = None
    similarity: float
    engagement_score: float
    recommendation_score: float


class PostDetailResponse(BaseModel):
    post: PostResponse
    comments: list[CommentDetailResponse]
    total_comments: int
    recommendations: list[RecommendationResponse]
    user_reaction: str | None = None