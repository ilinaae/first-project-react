from pydantic import BaseModel

from app.schemas.user import UserResponse


class LoginRequest(BaseModel):
    email: str
    password: str


class RefreshTokenRequest(BaseModel):
    refreshToken: str


class AuthResponse(BaseModel):
    accessToken: str
    refreshToken: str
    user: UserResponse


class TokenMessage(BaseModel):
    message: str
