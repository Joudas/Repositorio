# Especificación: Corrección de Errores del Backend — ZenTrack

> **Estado:** ✅ Implementado  
> **Fecha:** 2026-07-07  
> **Versión:** 1.1

---

## 1. Diagnóstico del Estado Actual

### 1.1 Estructura del Proyecto

```
ZenTrack/
├── Backend/                          # API REST (Node.js + Express + Prisma)
│   ├── src/
│   │   ├── index.ts                  # ⚠️ VACÍO — 0 líneas
│   │   ├── utils/
│   │   │   └── db.ts                 # ⚠️ Importa PrismaClient (instalado pero no resuelve)
│   │   └── generated/prisma/         # Cliente Prisma generado (existe)
│   ├── prisma/
│   │   ├── schema.prisma             # Modelos: User, Board, List, Card, Energy enum
│   │   └── migrations/               # Migración initial_models ya creada
│   ├── package.json                  # Dependencias: express, @prisma/client, dotenv, pg
│   ├── tsconfig.json                 # moduleResolution: "bundler", sin outDir
│   └── pnpm-workspace.yaml           # ⚠️ Bloquea builds de Prisma
├── Frontend/                         # React + Vite + TypeScript
│   └── src/
│       ├── App.tsx                   # Template Vite por defecto
│       └── main.tsx                  # Entry point básico
├── package.json                      # Root — solo Frontend (Vite/React)
├── tsconfig.json                     # Referencia: Backend + Frontend
└── AGENTS.md                         # Metodología SDD, stack, convenciones
```

### 1.2 Nota sobre Prisma 7

Durante la implementación se descubrió que **Prisma 7** introduce cambios importantes respecto a versiones anteriores:

1. **Engine type `client` por defecto** — El generador `prisma-client` usa engine `"client"`, que **requiere** un driver adapter o `accelerateUrl` en el constructor.
2. **`url` en datasource bloqueada** — El campo `url` en `datasource db {}` ya no es válido. La URL debe ir en `prisma.config.ts`.
3. **Import directo del generated** — Con salida personalizada, `@prisma/client` no exporta `PrismaClient` como ESM. Hay que importar de `../generated/prisma/client.js`.

La solución implementada usa `@prisma/adapter-pg` (paquete ya instalado) + `pg` como driver adapter, que es la vía recomendada por Prisma 7.

### 1.2 Problemas Identificados

#### 🔴 Error 1: `src/index.ts` vacío

- **Archivo:** `Backend/src/index.ts`
- **Síntoma:** El archivo existe pero tiene **0 líneas de código**. No hay servidor Express, no hay rutas, no hay middleware.
- **Causa:** Nunca se implementó el punto de entrada del backend.

#### 🔴 Error 2: PrismaClient no resuelve desde `@prisma/client`

- **Archivo:** `Backend/src/utils/db.ts`
- **Código actual:**
  ```ts
  import { PrismaClient } from "@prisma/client";
  export const prismaClient = new PrismaClient();
  ```
- **Síntoma:** El entorno reporta que no encuentra el módulo `@prisma/client`.
- **Causa raíz:** El `tsconfig.json` del Backend usa `moduleResolution: "bundler"` pero no hay un bundler configurado para el backend. Además, el `pnpm-workspace.yaml` bloquea los builds de Prisma (`@prisma/engines: false`, `prisma: false`), lo que impide que `prisma generate` funcione correctamente.
- **Nota:** El paquete `@prisma/client` SÍ está instalado en `node_modules`. El problema es de resolución en tiempo de compilación/ejecución.

#### 🔴 Error 3: No hay script para arrancar el backend

- **Archivo:** `Backend/package.json`
- **Síntoma:** Solo existe el script `test`. No hay `dev`, `start`, ni `build`.
- **Faltante:** No está instalado `tsx` (recomendado para ESM + TypeScript) ni `ts-node`.

#### 🟡 Error 4: `pnpm-workspace.yaml` bloquea builds de Prisma

- **Archivos:** `Backend/pnpm-workspace.yaml`, `Frontend/pnpm-workspace.yaml`
- **Síntoma:** `allowBuilds: { '@prisma/engines': false, prisma: false }` impide que Prisma ejecute sus builds nativos necesarios para generar el cliente funcional.

#### 🟡 Error 5: `tsconfig.json` del Backend incompleto

- **Falta:** `outDir`, `rootDir`, `composite: true` (necesario porque el root tsconfig lo referencia como project reference).

---

## 2. Plan de Corrección

### Fase 1: Configuración del Entorno Backend

| # | Acción | Archivo | Detalle |
|---|--------|---------|---------|
| 1.1 | Instalar `tsx` | `Backend/package.json` | Runtime para ejecutar TypeScript con ESM: `pnpm add -D tsx` |
| 1.2 | Agregar scripts | `Backend/package.json` | `"dev": "tsx watch src/index.ts"`, `"build": "tsc"`, `"start": "node dist/index.js"` |
| 1.3 | Habilitar builds de Prisma | `Backend/pnpm-workspace.yaml` | Eliminar o modificar el bloqueo de builds de Prisma |
| 1.4 | Regenerar cliente Prisma | CLI | Ejecutar `npx prisma generate` en Backend/ |

### Fase 2: Implementación del Servidor Express

| # | Acción | Archivo | Detalle |
|---|--------|---------|---------|
| 2.1 | Crear servidor Express básico | `Backend/src/index.ts` | Importar express, configurar middleware JSON, definir ruta health `/api/health`, iniciar servidor en puerto 3001 |
| 2.2 | Configurar dotenv | `Backend/src/index.ts` | Importar dotenv al inicio para cargar variables de entorno |

### Fase 3: Corrección de PrismaClient

| # | Acción | Archivo | Detalle |
|---|--------|---------|---------|
| 3.1 | Mejorar `db.ts` | `Backend/src/utils/db.ts` | Importar de `../generated/prisma/client.js` (no de `@prisma/client`). Usar `PrismaPg` adapter con `pg`. Singleton en `globalThis` para hot-reload. |
| 3.2 | Verificar generación | CLI | Ejecutar `./node_modules/.bin/prisma generate` |

### Fase 4: Configuración del tsconfig

| # | Acción | Archivo | Detalle |
|---|--------|---------|---------|
| 4.1 | Mejorar tsconfig del Backend | `Backend/tsconfig.json` | Agregar `outDir: "./dist"`, `rootDir: "./src"`, `composite: true`, `declaration: true` |

---

## 3. Endpoints a Crear

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/health` | Health check — verifica que el server y la DB responden |
| `GET` | `/api/boards` | Listar tableros (placeholder para desarrollo) |

---

## 4. Componentes del Backend

```
src/
├── index.ts              # Entry point — servidor Express
├── utils/
│   └── db.ts             # Singleton de PrismaClient
├── routes/               # (futuro)
│   ├── health.ts         # Ruta de health check
│   └── boards.ts         # (futuro) CRUD de tableros
├── middleware/            # (futuro)
│   └── error.ts          # Manejador global de errores
└── generated/prisma/     # Cliente Prisma generado (no tocar)
```

---

## 5. Dependencias a Instalar

### Existentes (ya en `package.json`)
- `express` ^5.2.1
- `@prisma/client` ^7.8.0
- `@prisma/adapter-pg` ^7.8.0
- `dotenv` ^17.4.2
- `pg` ^8.22.0

### Por agregar
- `tsx` (dev) — runtime TypeScript para desarrollo

---

## 6. Pruebas de Validación — Resultados ✅

| # | Prueba | Resultado |
|---|--------|-----------|
| 1 | `pnpm run dev` en Backend/ inicia sin errores | ✅ Arranca con `tsx watch` |
| 2 | `curl localhost:3001/api/health` | ✅ `{"status":"ok","database":"connected"}` |
| 3 | `./node_modules/.bin/prisma generate` | ✅ Generado en `src/generated/prisma/` |
| 4 | Import de PrismaClient desde generated path | ✅ Resuelve y conecta a PostgreSQL |

---

## 7. Dudas / Preguntas al Project Manager

1. **Puerto del backend:** Por defecto propongo `3001` (el 3000 suele estar ocupado y el docker-compose usa 3000). ¿Lo dejamos en `3001` o prefieres `3000`?
2. **Base de datos:** Veo que hay un `docker-compose.yml` con PostgreSQL. ¿Está corriendo el contenedor de base de datos o prefieres que trabajemos con conexión directa?
3. **Frontend:** ¿Quieres que avance también con la configuración inicial del frontend (instalar Tailwind Motion, Radix, React Query, Zustand, @hello-pangea/dnd) o solo backend por ahora?
4. **Ejecución:** ¿Prefieres usar `tsx` para desarrollo (recomendado) o compilar con `tsc` cada vez?
