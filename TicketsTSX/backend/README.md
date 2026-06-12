# Backend (FastAPI + MySQL + JWT)

Backend para registro/login de usuarios con JWT, conectado a MySQL (`tickets` en `localhost:3306`).

## Estructura

- `app/main.py`: App FastAPI y startup.
- `app/core/`: configuración y seguridad JWT/password.
- `app/db/`: conexión SQLAlchemy.
- `app/models/`: modelos ORM.
- `app/schemas/`: contratos de entrada/salida.
- `app/api/routes/`: endpoints.

## Variables de entorno

Copiar `.env.example` a `.env` y ajustar credenciales.

## Endpoints

- `GET /health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

## Nota

La tabla `users` se crea automáticamente al iniciar la app por primera vez (`Base.metadata.create_all`).
