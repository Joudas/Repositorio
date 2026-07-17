# Especificación: Reestructura de APIs con Express Router — ZenTrack

> **Estado:** Borrador para aprobación  
> **Fecha:** 2026-07-07  
> **Versión:** 1.0

---

## 1. Problemas Actuales

### 🔴 Bug en index.ts
- Ruta `/api/users ` tiene un espacio después de "users" → `GET /api/users` no funciona

### 🔴 Arquitectura incorrecta en apis/
- `apis/list.ts` crea `const app = express()` local y registra rutas en esa instancia que **nunca se monta** en el servidor principal → las rutas jamás responden
- `apis/user.ts` importa Express y crea instancia al pedo
- `apis/user.ts` exporta `getUsers(res)` como función suelta pero nadie la usa en `index.ts`
- Ambos archivos importan `dotenv/config` innecesariamente

---

## 2. Solución Propuesta: Express Router

Vamos a usar `express.Router()` que es el mecanismo nativo de Express para dividir rutas en archivos separados.

### Estructura final

```
src/
├── index.ts              # Monta los routers, middleware global, listen
├── utils/
│   └── db.ts             # Singleton PrismaClient
├── apis/
│   ├── user.ts           # Router con CRUD de usuarios
│   └── list.ts           # Router con CRUD de listas (futuro)
└── generated/prisma/     # Cliente Prisma
```

### Cómo funciona Express Router

Cada archivo en `apis/` crea un `Router`, define sus rutas con `router.get()`, `router.post()`, etc., y lo exporta como `default`.

En `index.ts`, se monta con `app.use("/api/users", router)` — así todas las rutas definidas en el router quedan bajo el prefijo `/api/users`.

```
index.ts                          apis/user.ts
─────────────────────             ─────────────────────
app.use("/api/users", userRouter)  router.get("/")      → GET    /api/users
                                   router.get("/:id")   → GET    /api/users/:id
                                   router.post("/")     → POST   /api/users
                                   router.put("/:id")   → PUT    /api/users/:id
                                   router.delete("/:id") → DELETE /api/users/:id
```

---

## 3. Archivos a Modificar

### 3.1 `src/apis/user.ts` — Router completo con CRUD

Se reemplaza el contenido actual por un router con los cinco métodos HTTP:

| Método | Ruta | Descripción | Comportamiento |
|--------|------|-------------|----------------|
| `GET` | `/` | Listar usuarios | `prisma.user.findMany()` |
| `GET` | `/:id` | Obtener un usuario | `prisma.user.findUnique({ where: { id } })` |
| `POST` | `/` | Crear usuario | `prisma.user.create({ data: { email, password } })` |
| `PUT` | `/:id` | Actualizar usuario | `prisma.user.update({ where: { id }, data: {...} })` |
| `DELETE` | `/:id` | Eliminar usuario | `prisma.user.delete({ where: { id } })` |
| `DELETE` | `/` | Eliminar todos (dev) | `prisma.user.deleteMany()` |

**Importante:** La contraseña se guarda en texto plano. Esto es temporal — más adelante agregaremos hashing con bcrypt.

### 3.2 `src/index.ts` — Limpiar y montar routers

Cambios:

1. Eliminar la ruta `/api/users ` (con espacio) del index
2. Eliminar el import de `getUsers` (ya no es una función suelta)
3. Agregar import del router de usuarios
4. Montar el router: `app.use("/api/users", userRouter)`
5. Mantener `/api/health` y `/api/boards` (comentado)

---

## 4. Métodos HTTP — Referencia para apis/

Este es el patrón que vamos a seguir en cada archivo de API:

```ts
import { Router, type Request, type Response } from "express";
import { prisma } from "../utils/db.js";

const router = Router();

// GET / — Listar todos
router.get("/", async (_req: Request, res: Response) => {
  const items = await prisma.model.findMany();
  res.json(items);
});

// GET /:id — Obtener uno
router.get("/:id", async (req: Request, res: Response) => {
  const item = await prisma.model.findUnique({ where: { id: req.params.id } });
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(item);
});

// POST / — Crear uno
router.post("/", async (req: Request, res: Response) => {
  const item = await prisma.model.create({ data: req.body });
  res.status(201).json(item);
});

// PUT /:id — Actualizar uno
router.put("/:id", async (req: Request, res: Response) => {
  const item = await prisma.model.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(item);
});

// DELETE /:id — Eliminar uno
router.delete("/:id", async (req: Request, res: Response) => {
  await prisma.model.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
```

---

## 5. Validación

Luego de la implementación:

1. `pnpm run dev` arranca sin errores
2. `GET /api/users` responde `[]` (vacío, sin usuarios cargados)
3. `GET /api/users/some-id` responde `404` si no existe
4. `POST /api/users` con body `{ "email": "...", "password": "..." }` responde `201` con el usuario creado
5. `PUT /api/users/:id` actualiza el usuario
6. `DELETE /api/users/:id` elimina y responde `204`

---

## 6. Notas

- `apis/list.ts` NO se toca en este cambio (queda para después)
- Las contraseñas se guardan en texto plano hasta que implementemos autenticación
- No se toca `docker-compose.yml`, `Dockerfile`, ni `package.json` en este cambio
