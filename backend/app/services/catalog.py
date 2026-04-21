from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import ExtraService, PackagingOption



def get_packaging_options(db: Session) -> list[PackagingOption]:
    statement = select(PackagingOption).order_by(PackagingOption.id.asc())
    return list(db.scalars(statement).all())



def get_extra_services(db: Session) -> list[ExtraService]:
    statement = select(ExtraService).order_by(ExtraService.id.asc())
    return list(db.scalars(statement).all())
