# Flora Boutique

Flora Boutique is a flower store web application built with React, TypeScript, Redux Toolkit and FastAPI.

## Project structure

- `src/` - frontend on React + TypeScript
- `backend/` - backend on FastAPI + PostgreSQL

## Frontend commands

```powershell
yarn install
yarn dev
yarn build
```

## Backend commands

```powershell
yarn backend:migrate
yarn backend:seed
yarn backend:start
```

## Demo accounts

- User: `user@gmail.com / user123`
- Admin: `admin@gmail.com / admin123`

## What is already implemented

- JWT authentication with access and refresh tokens
- user profile and protected routes
- catalog of bouquets, flowers and gifts
- bouquet constructor
- cart and checkout
- admin panel for products and orders
- PostgreSQL migrations and demo seed scripts

## Backend demo data

Seed commands create:

- demo users
- demo products
- demo orders
- packaging options
- extra services

## Notes

- Frontend expects backend at `http://127.0.0.1:8000`
- Static product image paths remain in frontend public assets
