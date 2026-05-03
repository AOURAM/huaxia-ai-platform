from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.core.avatar import ALLOWED_AVATAR_STYLES

GenderValue = Literal["female", "male", "non_binary", "prefer_not_to_say"]


class UserCreate(BaseModel):
    username: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=2, max_length=100)
    bio: str | None = Field(default=None, max_length=500)
    gender: GenderValue | None = None
    avatar_style: str | None = Field(default=None, max_length=50)
    avatar_seed: str | None = Field(default=None, max_length=120)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: EmailStr
    bio: str | None = None
    gender: str | None = None
    avatar_style: str | None = None
    avatar_seed: str | None = None
    avatar_url: str


class Token(BaseModel):
    access_token: str
    token_type: str


def validate_avatar_style(style: str) -> str:
    clean_style = style.strip()

    if clean_style not in ALLOWED_AVATAR_STYLES:
        allowed_styles = ", ".join(sorted(ALLOWED_AVATAR_STYLES))
        raise ValueError(f"Invalid avatar style. Allowed styles: {allowed_styles}")

    return clean_style