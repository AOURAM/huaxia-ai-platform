from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func

from app.database import Base


class CultureEvent(Base):
    __tablename__ = "culture_events"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(160), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(200), nullable=False)

    event_date = Column(Date, nullable=False, index=True)
    start_time = Column(String(20), nullable=False)

    tag = Column(String(50), nullable=False, index=True)

    created_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )