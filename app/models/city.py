from sqlalchemy import Column, DateTime, Float, Integer, String, func
from sqlalchemy.dialects.postgresql import JSONB

from app.database import Base


class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    province = Column(String, nullable=False)
    region = Column(String, nullable=False)

    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)

    description = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    tags = Column(JSONB, nullable=False, default=list)

    student_summary = Column(String, nullable=True)
    cost_level = Column(String, nullable=True)
    popular_universities = Column(JSONB, nullable=False, default=list)
    highlights = Column(JSONB, nullable=False, default=list)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)