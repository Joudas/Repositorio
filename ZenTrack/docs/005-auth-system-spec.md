# Especificación: Sistema de Autenticación — ZenTrack

> **Estado:** Borrador para aprobación  
> **Fecha:** 2026-07-08  
> **Versión:** 1.0

---

## 1. Objetivo

Implementar un sistema de autenticación seguro para ZenTrack usando **JWT en cookie HttpOnly** (backend) y **Zustand en memoria** (frontend), con manejo de rutas públicas y privadas.

---

## 2. Arquitectura General

```
                  ┌─────────────────────────────────┐
                  │        Navegador (Frontend)      │
                  │                                  │
                  │  Zustand (user en memoria)       │
                  │       ↑ checkSession()           │
                  │       ↓ login() / logout()       │
                  │                                  │
                  │  ProtectedRoute / PublicRoute     │
                  │       ↑ auth store               │
                  └──────────┬──────────────────────┘
                             │ Cookie HttpOnly (automática)
                             │ credentials: "include"
                  ┌──────────▼──────────────────────┐
                  │        Backend (Express)          │
                  │                                  │
                  │  POST /api/auth/register         │
                  │  POST /api/auth/login    → JWT   │
                  │  POST /api/auth/logout   → borra │
                  │  GET  /api/auth/me       → user  │
                  │                                  │
                  │  JWT en cookie:                  │
                  │  HttpOnly; Secure; SameSite=Strict│
                  └─────────────────────────────────┘
```

**Principio rector:** el frontend **nunca** toca el token. El backend lo maneja íntegramente en cookies. El frontend solo sabe si hay sesión porque llama a `/api/auth/me`.

---

## 3. Backend — Endpoints de Auth

### 3.1 Nuevo router: `src/apis/auth.ts`

Endpoint | Método | Body | Respuesta | Cookie
---------|--------|------|-----------|-------
`/api/auth/register` | POST | `{ email, password, name? }` | `201 { id, email, name }` | Set-Cookie JWT
`/api/auth/login` | POST | `{ email, password }` | `200 { id, email, name }` | Set-Cookie JWT
`/api/auth/logout` | POST | — | `200 { ok: true }` | Clear cookie
`/api/auth/me` | GET | — | `200 { id, email, name }` \| `401` | Lee cookie

### 3.2 Dependencias nuevas en Backend

```bash
cd Backend
pnpm add jsonwebtoken bcrypt cookie-parser
pnpm add -D @types/jsonwebtoken @types/bcrypt @types/cookie-parser
```

### 3.3 Configuración de cookie

```ts
res.cookie("token", jwt, {
  httpOnly: true,
  secure: process.env["NODE_ENV"] === "production",
  sameSite: "strict",
  maxAge: 1000 * 60 * 15, // 15 minutos (access token)
  path: "/",
});
```

- `httpOnly`: inaccesible desde JS
- `secure`: solo HTTPS en producción
- `sameSite: "strict"`: no se envía en requests cross-site
- `maxAge`: 15 min para access token (refresh token se discute después)

### 3.4 Middleware de autenticación

```ts
// src/middleware/auth.ts
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies["token"];
  if (!token) return res.status(401).json({ error: "No autenticado" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub; // el id del usuario
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}
```

### 3.5 Registro en `index.ts`

```ts
import authRouter from "./apis/auth.js";
// ...
app.use("/api/auth", authRouter);
```

**Orden de middlewares:** `cookie-parser` → `express.json` → CORS → routers.

### 3.6 .env (Backend)

```
JWT_SECRET=zentrack-dev-secret-change-in-production
```

> En producción, usar un valor generado con `openssl rand -hex 64`.

---

## 4. Frontend — Store de Auth con Zustand

### 4.1 Dependencia nueva

```bash
cd Frontend
pnpm add zustand
```

### 4.2 `src/stores/authStore.ts`

```ts
interface User {
  id: string;
  email: string;
  name: string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}
```

**Reglas del store:**

- **Sin `persist` middleware.** El estado vive SOLO en memoria. Al recargar la página, `isLoading = true` y `checkSession()` decide si hay sesión o no.
- `isAuthenticated` es un derived state: `user !== null`.
- `login()` y `register()` llaman al backend, el backend setea la cookie, y el frontend hidrata `user` con la respuesta.
- `logout()` llama al backend para borrar la cookie y setea `user = null`.
- `checkSession()` se llama UNA vez al montar la app. Si el backend responde 200 → hidrata `user`. Si 401 → `user = null`.

### 4.3 Servicio `src/services/auth.ts`

Wrapper alrededor de `api.ts` para los endpoints de auth. Todas las llamadas usan `credentials: "include"` para que el browser mande la cookie automáticamente.

```ts
// api.ts ya existente — necesita incluir credentials
export const api = {
  get: <T>(path: string) => request<T>(path, { credentials: "include" }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body), credentials: "include" }),
  // ...
};
```

---

## 5. Sistema de Rutas (Públicas vs Privadas)

### 5.1 `src/components/UI/ProtectedRoute.tsx`

Redirige a `/login` si el usuario no está autenticado.

```tsx
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <Skeleton />; // o spinner
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
```

### 5.2 `src/components/UI/PublicRoute.tsx`

Redirige a `/` si el usuario YA está autenticado (para no mostrar login a quien ya tiene sesión).

```tsx
export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <Skeleton />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}
```

### 5.3 Mapa de rutas en `main.tsx`

```tsx
<Routes>
  {/* Públicas — solo si NO hay sesión */}
  <Route element={<PublicRoute />}>
    <Route path="/login" element={<LoginScreen />} />
    <Route path="/register" element={<RegisterScreen />} />
  </Route>

  {/* Privadas — solo si HAY sesión */}
  <Route element={<ProtectedRoute />}>
    <Route path="/" element={<HomeScreen />} />
    <Route path="/board/:id" element={<BoardScreen />} />
  </Route>

  {/* Catch-all */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

**Patrón de layout routes:** `PublicRoute` y `ProtectedRoute` se usan como **layout routes** (sin `path`) que envuelven a sus hijas. Si la condición no se cumple, redirigen con `<Navigate>`.

### 5.4 `useAuthStore` con `Outlet` para layout routes

Las rutas públicas/privadas deben usar `<Outlet />` internamente:

```tsx
// ProtectedRoute.tsx
import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
```

```tsx
// main.tsx
<Route element={<PublicRoute />}>
  <Route path="/login" element={<LoginScreen />} />
</Route>
<Route element={<ProtectedRoute />}>
  <Route path="/" element={<HomeScreen />} />
</Route>
```

---

## 6. Check Session al Startup

### 6.1 En `App.tsx` (o `main.tsx`)

```tsx
function App() {
  const checkSession = useAuthStore((s) => s.checkSession);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => { checkSession(); }, []);

  if (isLoading) return <Spinner />;

  return (
    <Routes>
      {/* ... */}
    </Routes>
  );
}
```

### 6.2 Flujo

1. Usuario abre la app → `isLoading = true`
2. Se monta `App` → `useEffect` llama a `checkSession()`
3. `checkSession()` hace `GET /api/auth/me` con la cookie
4. **200** → hidrata `user` en Zustand → `isLoading = false`
5. **401** → `user = null` → `isLoading = false`
6. Los route guards ven `isAuthenticated` y deciden qué renderizar

Esto evita el flash de login → home o viceversa.

---

## 7. Dependencias Completas

### Frontend

| Paquete | Versión | Propósito | Instalado |
|---------|---------|-----------|:---------:|
| `zustand` | ^5.x | Estado global del auth | ❌ Agregar |

Ya instalado: `react-router-dom`, `@tanstack/react-query`.

### Backend

| Paquete | Versión | Propósito | Instalado |
|---------|---------|-----------|:---------:|
| `jsonwebtoken` | ^9.x | Generar y verificar JWT | ❌ Agregar |
| `bcrypt` | ^5.x | Hash de contraseñas | ❌ Agregar |
| `cookie-parser` | ^1.x | Leer cookies en Express | ❌ Agregar |
| `@types/jsonwebtoken` | — | Tipados | ❌ Agregar |
| `@types/bcrypt` | — | Tipados | ❌ Agregar |
| `@types/cookie-parser` | — | Tipados | ❌ Agregar |

---

## 8. Estructura de Archivos a Crear/Modificar

| Archivo | Acción |
|---------|--------|
| `Frontend/src/stores/authStore.ts` | 🆕 Store de auth con Zustand |
| `Frontend/src/services/auth.ts` | 🆕 Llamadas a `/api/auth/*` |
| `Frontend/src/services/api.ts` | ✅ Agregar `credentials: "include"` |
| `Frontend/src/components/UI/ProtectedRoute.tsx` | 🆕 Layout route privada |
| `Frontend/src/components/UI/PublicRoute.tsx` | 🆕 Layout route pública |
| `Frontend/src/components/UI/Spinner.tsx` | 🆕 Componente de loading |
| `Frontend/src/main.tsx` | ✅ Reemplazar Routes con layout routes |
| `Backend/src/apis/auth.ts` | 🆕 Router de auth (register, login, logout, me) |
| `Backend/src/middleware/auth.ts` | 🆕 Middleware `requireAuth` |
| `Backend/src/index.ts` | ✅ Montar authRouter, cookie-parser |
| `Backend/.env` | ✅ Agregar `JWT_SECRET` |
| `Backend/.env-template` | ✅ Agregar `JWT_SECRET` |

---

## 9. Preguntas / Decisiones Pendientes

1. **Nombre del usuario:** el schema de Prisma tiene `User { id, email, password }`. Para mostrar el nombre en la UI, hay que agregar un campo `name String?` al modelo. ¿Agregamos migración?
2. **Refresh token:** por ahora usamos un solo JWT de 15 min. Si queremos sesión persistente (días), necesitamos refresh token en cookie separada con `path=/api/auth/refresh`. ¿Lo dejamos para después?
3. **Vite proxy:** el proxy actual redirige `/api` → `localhost:3001`. Las cookies requieren que el backend y frontend estén en el mismo origen, o CORS con `credentials: true` (ya está configurado). Con el proxy de Vite en dev, funciona sin problemas.
4. **Spinner:** ¿preferís un skeleton genérico o uno específico para auth loading?

---

## 10. Validación

| # | Prueba | Resultado esperado |
|---|--------|-------------------|
| 1 | `pnpm run dev` en Frontend + Backend | Arrancan sin errores |
| 2 | POST `/api/auth/register` con email y password | 201 + cookie seteada |
| 3 | POST `/api/auth/login` con credenciales válidas | 200 + cookie seteada |
| 4 | GET `/api/auth/me` con cookie válida | 200 + datos del usuario |
| 5 | GET `/api/auth/me` sin cookie | 401 |
| 6 | Acceder a `/` sin sesión | Redirige a `/login` |
| 7 | Acceder a `/login` con sesión activa | Redirige a `/` |
| 8 | Refrescar la página estando logueado | Sigue mostrando ruta privada (sin flash) |
