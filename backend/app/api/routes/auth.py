from fastapi import APIRouter, Depends, HTTPException, status
from jwt import InvalidTokenError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db import get_db
from app.models import User
from app.schemas.auth import AuthResponse, LoginRequest, RefreshTokenRequest, TokenMessage
from app.schemas.user import RegisterRequest, UpdateUserRequest, UserResponse
from app.services.auth import (
    authenticate_user,
    build_auth_response,
    create_user,
    get_user_by_email,
    revoke_refresh_token,
    rotate_refresh_token,
    update_user_profile,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> AuthResponse:
    existing_user = get_user_by_email(db, str(payload.email))
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists",
        )

    user = create_user(db, payload)
    return build_auth_response(db, user)


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> AuthResponse:
    user = authenticate_user(db, payload.email, payload.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return build_auth_response(db, user)


@router.post("/refresh", response_model=AuthResponse)
def refresh(payload: RefreshTokenRequest, db: Session = Depends(get_db)) -> AuthResponse:
    try:
        auth_response = rotate_refresh_token(db, payload.refreshToken)
    except InvalidTokenError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is invalid",
        ) from error

    if auth_response is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is expired or revoked",
        )

    return auth_response


@router.post("/logout", response_model=TokenMessage)
def logout(payload: RefreshTokenRequest, db: Session = Depends(get_db)) -> TokenMessage:
    try:
        revoke_refresh_token(db, payload.refreshToken)
    except InvalidTokenError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is invalid",
        ) from error

    return TokenMessage(message="Logged out successfully")


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    return UserResponse.model_validate(current_user)


@router.patch("/me", response_model=UserResponse)
def update_me(
    payload: UpdateUserRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserResponse:
    existing_user = get_user_by_email(db, str(payload.email))
    if existing_user is not None and existing_user.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists",
        )

    updated_user = update_user_profile(db, current_user, payload)
    return UserResponse.model_validate(updated_user)
