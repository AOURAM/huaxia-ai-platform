from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.avatar import (
    ALLOWED_AVATAR_STYLES,
    DEFAULT_AVATAR_STYLE,
    build_default_avatar_seed,
)
from app.core.dependencies import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.database import get_db
from app.models.user import User
from app.schemas.user import Token, UserCreate, UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])


def normalize_optional_text(value: str | None) -> str | None:
    if value is None:
        return None

    cleaned_value = value.strip()
    return cleaned_value or None


def ensure_user_avatar_defaults(user: User) -> None:
    if not user.avatar_style:
        user.avatar_style = DEFAULT_AVATAR_STYLE

    if not user.avatar_seed:
        user.avatar_seed = build_default_avatar_seed(user.id)


def validate_avatar_style_or_400(style: str) -> str:
    clean_style = style.strip()

    if clean_style not in ALLOWED_AVATAR_STYLES:
        allowed_styles = ", ".join(sorted(ALLOWED_AVATAR_STYLES))
        raise HTTPException(
            status_code=400,
            detail=f"Invalid avatar style. Allowed styles: {allowed_styles}",
        )

    return clean_style


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    username = user.username.strip()

    existing_user = (
        db.query(User)
        .filter((User.username == username) | (User.email == user.email))
        .first()
    )

    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    new_user = User(
        username=username,
        email=user.email,
        password=hash_password(user.password),
        bio=None,
        gender=None,
        avatar_style=DEFAULT_AVATAR_STYLE,
        avatar_seed=None,
    )

    db.add(new_user)
    db.flush()

    new_user.avatar_seed = build_default_avatar_seed(new_user.id)

    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=Token)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    db_user = db.query(User).filter(User.email == form_data.username).first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    if not verify_password(form_data.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    access_token = create_access_token(data={"sub": db_user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/me", response_model=UserResponse)
def read_current_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ensure_user_avatar_defaults(current_user)

    db.commit()
    db.refresh(current_user)

    return current_user


@router.patch("/me", response_model=UserResponse)
def update_current_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    update_data = user_update.model_dump(exclude_unset=True)

    if "username" in update_data:
        new_username = normalize_optional_text(update_data["username"])

        if not new_username:
            raise HTTPException(status_code=400, detail="Username cannot be empty")

        username_owner = (
            db.query(User)
            .filter(User.username == new_username, User.id != current_user.id)
            .first()
        )

        if username_owner:
            raise HTTPException(status_code=400, detail="Username already exists")

        current_user.username = new_username

    if "bio" in update_data:
        current_user.bio = normalize_optional_text(update_data["bio"])

    if "gender" in update_data:
        current_user.gender = update_data["gender"]

    if "avatar_style" in update_data:
        avatar_style = normalize_optional_text(update_data["avatar_style"])

        if avatar_style:
            current_user.avatar_style = validate_avatar_style_or_400(avatar_style)
        else:
            current_user.avatar_style = DEFAULT_AVATAR_STYLE

    if "avatar_seed" in update_data:
        avatar_seed = normalize_optional_text(update_data["avatar_seed"])

        if avatar_seed:
            current_user.avatar_seed = avatar_seed
        else:
            current_user.avatar_seed = build_default_avatar_seed(current_user.id)

    ensure_user_avatar_defaults(current_user)

    db.commit()
    db.refresh(current_user)

    return current_user