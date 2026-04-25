from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)

    page_name = Column(String(50), nullable=False, index=True)
    content_type = Column(String(50), nullable=False, index=True)

    category = Column(String(100), nullable=True)
    ai_analysis = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    tags = Column(Text, nullable=True)

    embedding = Column(Text, nullable=True)
    search_vector = Column(Text, nullable=True)

    image_url = Column(String(500), nullable=True)

    likes_count = Column(Integer, nullable=False, default=0)
    dislikes_count = Column(Integer, nullable=False, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=True, index=True)