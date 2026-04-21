# Flora Boutique Backend

Backend for Flora Boutique on FastAPI + PostgreSQL.

## Current stack

- FastAPI application structure
- environment-based settings
- CORS for frontend
- SQLAlchemy ORM
- Alembic migrations
- auth, products, orders and catalog tables
- JWT auth with access and refresh tokens

## Quick start

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Database

Set DATABASE_URL in .env, then run:

```powershell
.venv\Scripts\alembic upgrade head
```

To create demo accounts for login and admin panel:

```powershell
.venv\Scripts\python.exe seed_demo_users.py
```

To create demo products for the catalog:

```powershell
.venv\Scripts\python.exe seed_demo_products.py
```

To create demo orders:

```powershell
.venv\Scripts\python.exe seed_demo_orders.py
```

To create packaging options and extra services:

```powershell
.venv\Scripts\python.exe seed_catalog_options.py
```

## Check

- http://127.0.0.1:8000/api/v1/health
- http://127.0.0.1:8000/docs

## Auth endpoints

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- POST /api/v1/auth/logout
- GET /api/v1/auth/me
- PATCH /api/v1/auth/me

## Product endpoints

- GET /api/v1/products
- POST /api/v1/products
- PUT /api/v1/products/{product_id}
- PATCH /api/v1/products/{product_id}
- DELETE /api/v1/products/{product_id}

## Order endpoints

- POST /api/v1/orders
- GET /api/v1/orders
- GET /api/v1/orders/{order_id}
- PATCH /api/v1/orders/{order_id}

## Catalog endpoints

- GET /api/v1/packaging-options
- GET /api/v1/extra-services

## Demo accounts

- User: `user@gmail.com / user123`
- Admin: `admin@gmail.com / admin123`
