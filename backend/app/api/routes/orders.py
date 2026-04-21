from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_admin_user, get_current_user
from app.db import get_db
from app.models import User
from app.schemas.order import OrderCreateRequest, OrderResponse, OrderStatusUpdateRequest
from app.services.orders import can_access_order, create_order, get_order_by_id, get_orders, update_order_status

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order_endpoint(
    payload: OrderCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OrderResponse:
    if current_user.id != payload.userId and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot create order for another user")

    order = create_order(db, payload)
    return OrderResponse.model_validate(order)


@router.get("", response_model=list[OrderResponse])
def list_orders(
    userId: int | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[OrderResponse]:
    if current_user.role != "admin":
        if userId is not None and userId != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot view another user's orders")
        userId = current_user.id

    orders = get_orders(db, userId)
    return [OrderResponse.model_validate(order) for order in orders]


@router.patch("/{order_id}", response_model=OrderResponse)
def patch_order_status_endpoint(
    order_id: int,
    payload: OrderStatusUpdateRequest,
    db: Session = Depends(get_db),
    _admin_user: User = Depends(get_admin_user),
) -> OrderResponse:
    order = get_order_by_id(db, order_id)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    updated_order = update_order_status(db, order, payload)
    return OrderResponse.model_validate(updated_order)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_endpoint(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OrderResponse:
    order = get_order_by_id(db, order_id)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    if not can_access_order(current_user, order):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot view this order")

    return OrderResponse.model_validate(order)
