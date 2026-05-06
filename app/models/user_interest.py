from sqlalchemy import Column, ForeignKey, Float, String, DateTime, Integer
from sqlalchemy.sql import func

from app.database import Base


class UserInterest(Base):
    __tablename__ = "user_interests"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    category_id = Column(String, primary_key=True)  # keep flexible for now

    weight = Column(Float, default=1.0)
    source = Column(String, default="onboarding")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())