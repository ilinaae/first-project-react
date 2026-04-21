from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)
from app.models import RefreshToken, User
from app.schemas.auth import AuthResponse
from app.schemas.user import RegisterRequest, UpdateUserRequest, UserResponse


def get_user_by_email(db: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return db.scalar(statement)



def create_user(db: Session, payload: RegisterRequest) -> User:
    user = User(
        email=str(payload.email),
        full_name=payload.name,
        phone=payload.phone,
        password_hash=get_password_hash(payload.password),
        role="user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user



def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if user is None:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user



def _store_refresh_token(db: Session, *, user_id: int, token_id: str, expires_at: datetime) -> None:
    refresh_token = RefreshToken(
        token_id=token_id,
        user_id=user_id,
        expires_at=expires_at,
    )
    db.add(refresh_token)
    db.commit()



def build_auth_response(db: Session, user: User) -> AuthResponse:
    access_token, _, _ = create_access_token(user_id=user.id, role=user.role)
    refresh_token, refresh_token_id, refresh_expires_at = create_refresh_token(
        user_id=user.id,
        role=user.role,
    )
    _store_refresh_token(
        db,
        user_id=user.id,
        token_id=refresh_token_id,
        expires_at=refresh_expires_at,
    )

    return AuthResponse(
        accessToken=access_token,
        refreshToken=refresh_token,
        user=UserResponse.model_validate(user),
    )



def revoke_refresh_token(db: Session, refresh_token: str) -> None:
    payload = decode_token(refresh_token)
    token_id = payload["jti"]
    stored_token = db.scalar(select(RefreshToken).where(RefreshToken.token_id == token_id))

    if stored_token is None or stored_token.revoked_at is not None:
        return

    stored_token.revoked_at = datetime.now(UTC)
    db.add(stored_token)
    db.commit()



def rotate_refresh_token(db: Session, refresh_token: str) -> AuthResponse | None:
    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        return None

    token_id = payload["jti"]
    user_id = int(payload["sub"])
    stored_token = db.scalar(select(RefreshToken).where(RefreshToken.token_id == token_id))

    if stored_token is None or stored_token.revoked_at is not None:
        return None

    if stored_token.expires_at <= datetime.now(UTC):
        return None

    user = db.get(User, user_id)
    if user is None or not user.is_active:
        return None

    revoke_refresh_token(db, refresh_token)
    return build_auth_response(db, user)


def update_user_profile(db: Session, user: User, payload: UpdateUserRequest) -> User:
    user.email = str(payload.email)
    user.full_name = payload.name
    user.phone = payload.phone
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
