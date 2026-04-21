from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.catalog import ExtraServiceResponse, PackagingOptionResponse
from app.services.catalog import get_extra_services, get_packaging_options

router = APIRouter(tags=["Catalog"])


@router.get("/packaging-options", response_model=list[PackagingOptionResponse])
def list_packaging_options(db: Session = Depends(get_db)) -> list[PackagingOptionResponse]:
    items = get_packaging_options(db)
    return [PackagingOptionResponse.model_validate(item) for item in items]


@router.get("/extra-services", response_model=list[ExtraServiceResponse])
def list_extra_services(db: Session = Depends(get_db)) -> list[ExtraServiceResponse]:
    items = get_extra_services(db)
    return [ExtraServiceResponse.model_validate(item) for item in items]
