from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    name: str = Field(min_length=2, max_length=255)
    password: str = Field(min_length=6, max_length=255)
    phone: str = Field(min_length=5, max_length=32)


class UpdateUserRequest(BaseModel):
    email: EmailStr
    name: str = Field(min_length=2, max_length=255)
    phone: str = Field(min_length=5, max_length=32)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    email: EmailStr
    name: str = Field(validation_alias="full_name")
    phone: str
    role: str
    createdAt: datetime = Field(validation_alias="created_at")
