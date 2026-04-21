from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Order, User
from app.schemas.order import OrderCreateRequest, OrderStatusUpdateRequest



def create_order(db: Session, payload: OrderCreateRequest) -> Order:
    order = Order(
        address=payload.address,
        comment=payload.comment,
        delivery_method=payload.deliveryMethod,
        items=[item.model_dump() for item in payload.items],
        status="new",
        total_price=payload.totalPrice,
        user_id=payload.userId,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order



def get_orders(db: Session, user_id: int | None = None) -> list[Order]:
    statement = select(Order).order_by(Order.created_at.desc(), Order.id.desc())
    if user_id is not None:
        statement = statement.where(Order.user_id == user_id)

    return list(db.scalars(statement).all())



def get_order_by_id(db: Session, order_id: int) -> Order | None:
    return db.get(Order, order_id)



def update_order_status(db: Session, order: Order, payload: OrderStatusUpdateRequest) -> Order:
    order.status = payload.status
    db.add(order)
    db.commit()
    db.refresh(order)
    return order



def can_access_order(user: User, order: Order) -> bool:
    return user.role == "admin" or user.id == order.user_id
