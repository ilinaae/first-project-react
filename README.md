# Flora Boutique

Flora Boutique is a full-stack flower store application with a React frontend and a FastAPI backend.

## Stack

- React
- TypeScript
- Redux Toolkit
- react-router-dom
- Axios
- SCSS
- FastAPI
- PostgreSQL
- Alembic

## Project structure

- `src/` - frontend on React + TypeScript
- `backend/` - backend on FastAPI + PostgreSQL
- `public/` - static frontend assets

## Main features

- landing page and multi-page routing
- login and registration
- protected user area
- dashboard after authorization
- bouquet constructor
- product catalog
- cart and checkout
- user profile with order history
- admin panel for products and orders
- JWT authentication with access and refresh tokens

## Frontend запуск

```powershell
yarn install
yarn dev
```

Production preview:

```powershell
yarn build
yarn start
```

## Backend запуск

```powershell
yarn backend:migrate
yarn backend:seed
yarn backend:start
```

## Demo accounts

- User: `user@gmail.com / user123`
- Admin: `admin@gmail.com / admin123`

## Backend seed data

Seed scripts create:

- demo users
- demo products
- demo orders
- packaging options
- extra services

## Notes

- Frontend expects backend at `http://127.0.0.1:8000`
- Frontend dev and preview ports are allowed in backend CORS settings
- Product images are stored in `public/product-images`
