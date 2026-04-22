from datetime import datetime
from pydantic import BaseModel, field_validator


class CommentCreate(BaseModel):
    content: str

    @field_validator("content")
    @classmethod
    def validate_content(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("content cannot be empty")
        if len(value) > 1000:
            raise ValueError("content must be at most 1000 characters")
        return value


class CommentUpdate(BaseModel):
    content: str

    @field_validator("content")
    @classmethod
    def validate_content(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("content cannot be empty")
        if len(value) > 1000:
            raise ValueError("content must be at most 1000 characters")
        return value


class CommentResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    updated_at: datetime
    user_id: int
    post_id: int

    class Config:
        from_attributes = True


class CommentDetailResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    updated_at: datetime
    user_id: int
    post_id: int
    username: str