from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_admin_user
from app.db import get_db
from app.models import User
from app.schemas.product import (
    ProductAvailabilityRequest,
    ProductCreateRequest,
    ProductResponse,
    ProductUpdateRequest,
)
from app.services.products import (
    create_product,
    delete_product,
    get_product_by_id,
    get_products,
    update_product,
    update_product_availability,
)

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=list[ProductResponse])
def list_products(
    category: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[ProductResponse]:
    items = get_products(db, category)
    return [ProductResponse.model_validate(item) for item in items]


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product_endpoint(
    payload: ProductCreateRequest,
    db: Session = Depends(get_db),
    _admin_user: User = Depends(get_admin_user),
) -> ProductResponse:
    product = create_product(db, payload)
    return ProductResponse.model_validate(product)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product_endpoint(
    product_id: int,
    payload: ProductUpdateRequest,
    db: Session = Depends(get_db),
    _admin_user: User = Depends(get_admin_user),
) -> ProductResponse:
    product = get_product_by_id(db, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    updated_product = update_product(db, product, payload)
    return ProductResponse.model_validate(updated_product)


@router.patch("/{product_id}", response_model=ProductResponse)
def patch_product_endpoint(
    product_id: int,
    payload: ProductAvailabilityRequest,
    db: Session = Depends(get_db),
    _admin_user: User = Depends(get_admin_user),
) -> ProductResponse:
    product = get_product_by_id(db, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    updated_product = update_product_availability(db, product, payload)
    return ProductResponse.model_validate(updated_product)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_endpoint(
    product_id: int,
    db: Session = Depends(get_db),
    _admin_user: User = Depends(get_admin_user),
) -> Response:
    product = get_product_by_id(db, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    delete_product(db, product)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
