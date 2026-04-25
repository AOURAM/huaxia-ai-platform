from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, field_validator


ALLOWED_REGIONS = {"north", "south", "coastal", "west", "central"}
ALLOWED_COST_LEVELS = {"low", "medium", "high"}


def normalize_slug(value: str) -> str:
    return value.strip().lower().replace(" ", "-")


class CityCreate(BaseModel):
    slug: str
    name: str
    province: str
    region: str
    lat: float
    lng: float
    description: str
    image_url: Optional[str] = None
    tags: List[str] = []

    student_summary: Optional[str] = None
    cost_level: Optional[str] = None
    popular_universities: List[str] = []
    highlights: List[str] = []

    @field_validator("slug")
    @classmethod
    def validate_slug(cls, value: str) -> str:
        return normalize_slug(value)

    @field_validator("region")
    @classmethod
    def validate_region(cls, value: str) -> str:
        value = value.strip().lower()
        if value not in ALLOWED_REGIONS:
            raise ValueError("region must be one of: north, south, coastal, west, central")
        return value

    @field_validator("cost_level")
    @classmethod
    def validate_cost_level(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value

        value = value.strip().lower()
        if value not in ALLOWED_COST_LEVELS:
            raise ValueError("cost_level must be one of: low, medium, high")
        return value


class CityUpdate(BaseModel):
    name: Optional[str] = None
    province: Optional[str] = None
    region: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    tags: Optional[List[str]] = None

    student_summary: Optional[str] = None
    cost_level: Optional[str] = None
    popular_universities: Optional[List[str]] = None
    highlights: Optional[List[str]] = None

    @field_validator("region")
    @classmethod
    def validate_region(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value

        value = value.strip().lower()
        if value not in ALLOWED_REGIONS:
            raise ValueError("region must be one of: north, south, coastal, west, central")
        return value

    @field_validator("cost_level")
    @classmethod
    def validate_cost_level(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value

        value = value.strip().lower()
        if value not in ALLOWED_COST_LEVELS:
            raise ValueError("cost_level must be one of: low, medium, high")
        return value


class CityOut(BaseModel):
    id: int
    slug: str
    name: str
    province: str
    region: str
    lat: float
    lng: float
    description: str
    image_url: Optional[str]
    tags: List[str]

    student_summary: Optional[str]
    cost_level: Optional[str]
    popular_universities: List[str]
    highlights: List[str]

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True