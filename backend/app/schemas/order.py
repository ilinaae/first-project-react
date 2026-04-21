from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CartItemPayload(BaseModel):
    details: list[str] | None = None
    id: str
    image: str
    price: int = Field(ge=0)
    quantity: int = Field(ge=1)
    title: str
    type: str


class OrderCreateRequest(BaseModel):
    address: str | None = Field(default=None, max_length=255)
    comment: str | None = Field(default=None, max_length=2000)
    deliveryMethod: str
    items: list[CartItemPayload]
    totalPrice: int = Field(ge=0)
    userId: int


class OrderStatusUpdateRequest(BaseModel):
    status: str


class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    address: str | None = None
    comment: str | None = None
    createdAt: datetime = Field(validation_alias="created_at")
    deliveryMethod: str = Field(validation_alias="delivery_method")
    items: list[CartItemPayload]
    status: str
    totalPrice: int = Field(validation_alias="total_price")
    userId: int = Field(validation_alias="user_id")
