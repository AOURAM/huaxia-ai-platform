from sqlalchemy import Column, Integer, String

from app.core.avatar import build_avatar_url
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)

    bio = Column(String(500), nullable=True)
    gender = Column(String(30), nullable=True)

    avatar_style = Column(String(50), nullable=True)
    avatar_seed = Column(String(120), nullable=True)

    @property
    def avatar_url(self) -> str:
        return build_avatar_url(self.avatar_style, self.avatar_seed)