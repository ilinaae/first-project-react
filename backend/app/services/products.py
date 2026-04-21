from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Product
from app.schemas.product import (
    ProductAvailabilityRequest,
    ProductCreateRequest,
    ProductUpdateRequest,
)


def get_products(db: Session, category: str | None = None) -> list[Product]:
    statement = select(Product).order_by(Product.id.asc())
    if category is not None:
        statement = statement.where(Product.category == category)

    return list(db.scalars(statement).all())



def get_product_by_id(db: Session, product_id: int) -> Product | None:
    return db.get(Product, product_id)



def create_product(db: Session, payload: ProductCreateRequest) -> Product:
    product = Product(
        category=payload.category,
        description=payload.description,
        image=payload.image,
        is_available=payload.isAvailable,
        price=payload.price,
        stock=payload.stock,
        tags=["новинка"],
        title=payload.title,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product



def update_product(db: Session, product: Product, payload: ProductUpdateRequest) -> Product:
    product.category = payload.category
    product.description = payload.description
    product.image = payload.image
    product.is_available = payload.isAvailable
    product.price = payload.price
    product.stock = payload.stock
    product.tags = ["обновлено"]
    product.title = payload.title
    db.add(product)
    db.commit()
    db.refresh(product)
    return product



def update_product_availability(
    db: Session,
    product: Product,
    payload: ProductAvailabilityRequest,
) -> Product:
    product.is_available = payload.isAvailable
    db.add(product)
    db.commit()
    db.refresh(product)
    return product



def delete_product(db: Session, product: Product) -> None:
    db.delete(product)
    db.commit()
