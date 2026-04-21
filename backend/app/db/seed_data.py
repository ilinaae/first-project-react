from __future__ import annotations

from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models import ExtraService, Order, PackagingOption, Product, User


@dataclass(frozen=True)
class SeedUser:
    email: str
    full_name: str
    password: str
    phone: str
    role: str


@dataclass(frozen=True)
class SeedProduct:
    category: str
    description: str
    image: str
    is_available: bool
    price: int
    stock: int
    tags: list[str]
    title: str


@dataclass(frozen=True)
class SeedOrder:
    address: str | None
    comment: str | None
    delivery_method: str
    items: list[dict[str, object]]
    status: str
    total_price: int
    user_email: str


@dataclass(frozen=True)
class SeedPackagingOption:
    name: str
    price: int


@dataclass(frozen=True)
class SeedExtraService:
    name: str
    price: int


DEMO_USERS: tuple[SeedUser, ...] = (
    SeedUser(
        email="user@gmail.com",
        full_name="Алина Клиент",
        password="user123",
        phone="+7 (900) 123-45-67",
        role="user",
    ),
    SeedUser(
        email="admin@gmail.com",
        full_name="Алина Администратор",
        password="admin123",
        phone="+7 (900) 555-10-10",
        role="admin",
    ),
)

DEMO_PRODUCTS: tuple[SeedProduct, ...] = (
    SeedProduct("bouquet", "Нежный букет из кремовых роз и эвкалипта.", "/product-images/bouquet-1.jpg", True, 4200, 6, ["обновлено"], "Бархатный рассвет"),
    SeedProduct("flower", "Белая роза поштучно для составления собственного букета.", "/product-images/flower-1.jpg", True, 240, 40, ["классика"], "Белая роза"),
    SeedProduct("gift", "Мягкая игрушка, которая отлично дополняет праздничный букет.", "/product-images/gift-1.jpg", True, 1600, 9, ["подарок"], "Мишка-компаньон"),
    SeedProduct("bouquet", "Воздушный букет из пионов в пастельной гамме.", "/product-images/bouquet-2.jpg", True, 5300, 4, ["новинка", "нежность"], "Пионовый сад"),
    SeedProduct("flower", "Желтые тюльпаны поштучно для ярких весенних композиций.", "/product-images/flower-2.jpg", True, 180, 56, ["обновлено"], "Солнечный тюльпан"),
    SeedProduct("gift", "Открытка ручной работы с шелковой декоративной лентой.", "/product-images/gift-2.jpg", True, 250, 20, ["дополнение"], "Открытка с лентой"),
    SeedProduct("bouquet", "Композиция с лавандой, розами и мягкой упаковкой.", "/product-images/bouquet-3.jpg", True, 6100, 3, ["премиум"], "Лавандовое облако"),
    SeedProduct("flower", "Нежная гвоздика поштучно для объемных бюджетных букетов.", "/product-images/flower-3.jpg", True, 140, 70, ["нежность"], "Розовая гвоздика"),
    SeedProduct("gift", "Прозрачная ваза для готового букета или композиции.", "/product-images/gift-3.jpg", True, 950, 11, ["дом"], "Стеклянная ваза"),
    SeedProduct("flower", "Элегантный цветок поштучно для авторских свадебных букетов.", "/product-images/flower-4.jpg", True, 320, 24, ["свадьба"], "Белый ранункулюс"),
    SeedProduct("gift", "Мини-набор макаронс как сладкое дополнение к заказу.", "/product-images/gift-4.jpg", False, 790, 7, ["сладости"], "Коробка макаронс"),
    SeedProduct("bouquet", "Светлый букет для дня рождения с розами и эустомой.", "/product-images/bouquet-4.jpg", True, 4700, 5, ["день рождения"], "Утренний сад"),
    SeedProduct("flower", "Белая садовая ромашка.", "/product-images/flower-5.jpg", True, 70, 29, ["новинка"], "Ромашка"),
)

DEMO_ORDERS: tuple[SeedOrder, ...] = (
    SeedOrder(
        address=None,
        comment=None,
        delivery_method="pickup",
        items=[
            {
                "id": "1",
                "title": "Бархатный рассвет",
                "image": "/product-images/bouquet-1.jpg",
                "price": 4200,
                "quantity": 1,
                "type": "product",
            }
        ],
        status="confirmed",
        total_price=4200,
        user_email="user@gmail.com",
    ),
    SeedOrder(
        address="Саратов, ул Алых роз",
        comment=None,
        delivery_method="delivery",
        items=[
            {
                "id": "5-demo",
                "image": "/product-images/flower-2.jpg",
                "price": 180,
                "quantity": 2,
                "title": "Солнечный тюльпан",
                "type": "product",
            },
            {
                "id": "4-demo",
                "image": "/product-images/bouquet-2.jpg",
                "price": 5300,
                "quantity": 1,
                "title": "Пионовый сад",
                "type": "product",
            },
            {
                "details": [
                    "Белая роза x1",
                    "Упаковка: Премиальная лента",
                    "Доп. услуга: Открытка",
                ],
                "id": "custom-bouquet-demo-1",
                "image": "/product-images/flower-1.jpg",
                "price": 790,
                "quantity": 1,
                "title": "Авторский букет",
                "type": "customBouquet",
            },
        ],
        status="new",
        total_price=6450,
        user_email="user@gmail.com",
    ),
)

DEMO_PACKAGING_OPTIONS: tuple[SeedPackagingOption, ...] = (
    SeedPackagingOption(name="Крафтовая упаковка", price=250),
    SeedPackagingOption(name="Премиальная лента", price=400),
)

DEMO_EXTRA_SERVICES: tuple[SeedExtraService, ...] = (
    SeedExtraService(name="Собрать букет", price=500),
    SeedExtraService(name="Открытка", price=150),
)


def seed_demo_users(db: Session) -> list[str]:
    messages: list[str] = []

    for seed_user in DEMO_USERS:
        existing_user = db.scalar(select(User).where(User.email == seed_user.email))

        if existing_user is None:
            db.add(
                User(
                    email=seed_user.email,
                    full_name=seed_user.full_name,
                    phone=seed_user.phone,
                    password_hash=get_password_hash(seed_user.password),
                    role=seed_user.role,
                    is_active=True,
                ),
            )
            messages.append(f"Created {seed_user.role}: {seed_user.email}")
            continue

        existing_user.full_name = seed_user.full_name
        existing_user.phone = seed_user.phone
        existing_user.password_hash = get_password_hash(seed_user.password)
        existing_user.role = seed_user.role
        existing_user.is_active = True
        db.add(existing_user)
        messages.append(f"Updated {seed_user.role}: {seed_user.email}")

    db.commit()
    return messages



def seed_demo_products(db: Session) -> list[str]:
    messages: list[str] = []

    for seed_product in DEMO_PRODUCTS:
        existing_product = db.scalar(select(Product).where(Product.title == seed_product.title))

        if existing_product is None:
            db.add(
                Product(
                    category=seed_product.category,
                    description=seed_product.description,
                    image=seed_product.image,
                    is_available=seed_product.is_available,
                    price=seed_product.price,
                    stock=seed_product.stock,
                    tags=seed_product.tags,
                    title=seed_product.title,
                ),
            )
            messages.append(f"Created product: {seed_product.title}")
            continue

        existing_product.category = seed_product.category
        existing_product.description = seed_product.description
        existing_product.image = seed_product.image
        existing_product.is_available = seed_product.is_available
        existing_product.price = seed_product.price
        existing_product.stock = seed_product.stock
        existing_product.tags = seed_product.tags
        existing_product.title = seed_product.title
        db.add(existing_product)
        messages.append(f"Updated product: {seed_product.title}")

    db.commit()
    return messages



def seed_demo_orders(db: Session) -> list[str]:
    messages: list[str] = []

    for seed_order in DEMO_ORDERS:
        user = db.scalar(select(User).where(User.email == seed_order.user_email))
        if user is None:
            messages.append(f"Skipped order for missing user: {seed_order.user_email}")
            continue

        first_item_title = str(seed_order.items[0].get("title", "Заказ"))
        existing_order = db.scalar(
            select(Order).where(
                Order.user_id == user.id,
                Order.total_price == seed_order.total_price,
                Order.delivery_method == seed_order.delivery_method,
            )
        )

        if existing_order is None:
            db.add(
                Order(
                    address=seed_order.address,
                    comment=seed_order.comment,
                    delivery_method=seed_order.delivery_method,
                    items=seed_order.items,
                    status=seed_order.status,
                    total_price=seed_order.total_price,
                    user_id=user.id,
                ),
            )
            messages.append(f"Created order for {seed_order.user_email}: {first_item_title}")
            continue

        existing_order.address = seed_order.address
        existing_order.comment = seed_order.comment
        existing_order.delivery_method = seed_order.delivery_method
        existing_order.items = seed_order.items
        existing_order.status = seed_order.status
        existing_order.total_price = seed_order.total_price
        existing_order.user_id = user.id
        db.add(existing_order)
        messages.append(f"Updated order for {seed_order.user_email}: {first_item_title}")

    db.commit()
    return messages



def seed_demo_packaging_options(db: Session) -> list[str]:
    messages: list[str] = []

    for seed_option in DEMO_PACKAGING_OPTIONS:
        existing_option = db.scalar(select(PackagingOption).where(PackagingOption.name == seed_option.name))

        if existing_option is None:
            db.add(PackagingOption(name=seed_option.name, price=seed_option.price))
            messages.append(f"Created packaging option: {seed_option.name}")
            continue

        existing_option.price = seed_option.price
        db.add(existing_option)
        messages.append(f"Updated packaging option: {seed_option.name}")

    db.commit()
    return messages



def seed_demo_extra_services(db: Session) -> list[str]:
    messages: list[str] = []

    for seed_service in DEMO_EXTRA_SERVICES:
        existing_service = db.scalar(select(ExtraService).where(ExtraService.name == seed_service.name))

        if existing_service is None:
            db.add(ExtraService(name=seed_service.name, price=seed_service.price))
            messages.append(f"Created extra service: {seed_service.name}")
            continue

        existing_service.price = seed_service.price
        db.add(existing_service)
        messages.append(f"Updated extra service: {seed_service.name}")

    db.commit()
    return messages
