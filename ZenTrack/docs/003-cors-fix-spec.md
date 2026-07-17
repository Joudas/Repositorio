# Especificación: Corrección de CORS — ZenTrack

> **Estado:** ✅ Implementado  
> **Fecha:** 2026-07-07  
> **Versión:** 1.1

---

## 1. Problema

El frontend (React con Vite) corre en un puerto/origen diferente al backend (Express en puerto 3001). Cuando el frontend intenta hacer peticiones `fetch` o `axios` al backend, el navegador bloquea la solicitud por la política de **CORS (Cross-Origin Resource Sharing)**.

### Escenario típico

| Capa | Puerto | Origen |
|------|--------|--------|
| Frontend (Vite) | `5173` | `http://localhost:5173` |
| Backend (Express) | `3001` | `http://localhost:3001` |

El navegador envía una solicitud `OPTIONS` (preflight) y espera que el backend responda con cabeceras como `Access-Control-Allow-Origin`. Si no las recibe, bloquea la petición.

### Error en consola del navegador

```
Access to fetch at 'http://localhost:3001/api/users' from origin 'http://localhost:5173'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
on the requested resource.
```

---

## 2. Solución Propuesta

Agregar el middleware `cors` al backend para que Express incluya automáticamente las cabeceras CORS en cada respuesta.

### Paquete a instalar

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `cors` | ^2.8.5 | Middleware de Express para cabeceras CORS |
| `@types/cors` | — | Tipados para TypeScript (dev) |

### Configuración

Para desarrollo, permitimos el origen del frontend de Vite (`http://localhost:5173`) y métodos HTTP estándar.

```ts
import cors from "cors";

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));
```

| Opción | Valor | Explicación |
|--------|-------|-------------|
| `origin` | `["http://localhost:5173"]` | Solo permite peticiones desde el frontend de Vite |
| `methods` | GET, POST, PUT, DELETE, PATCH | Métodos HTTP permitidos |
| `credentials` | `true` | Permite enviar cookies / auth headers si se necesita |

> **Nota:** En producción, `origin` debería apuntar al dominio real del frontend (ej: `https://zentrack.app`). Para desarrollo con Vite en puerto 5173 es suficiente.

---

## 3. Archivos a Modificar

### 3.1 Instalar dependencia

```bash
cd Backend
pnpm add cors
pnpm add -D @types/cors
```

### 3.2 `src/index.ts`

Agregar el import y el middleware ANTES de las rutas:

```ts
import cors from "cors";

// ─── Middleware global ─────────────────────────────────────
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
```

El orden importa: `cors()` debe ejecutarse antes de que lleguen a las rutas para que las cabeceras se agreguen a la respuesta OPTIONS (preflight) y a las respuestas normales.

---

## 4. Pruebas de Validación — Resultados ✅

| # | Prueba | Resultado |
|---|--------|-----------|
| 1 | Backend arranca sin errores | ✅ `pnpm run dev` compila y arranca |
| 2 | Preflight OPTIONS | ✅ `Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH` |
| 3 | GET con Origin simulado | ✅ Responde con datos correctamente |

---

## 5. Alternativa (sin dependencias)

Si se prefiere no instalar `cors`, se puede agregar manualmente el middleware:

```ts
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (_req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});
```

Pero es más verboso y propenso a errores. La librería `cors` es el estándar.

---

## 6. Riesgos

| Riesgo | Mitigación |
|--------|-----------|
| Abrir CORS a cualquier origen (`origin: *`) en producción | No hacerlo. Configurar `origin` explícitamente |
| Olvidar configurar producción | Recordar cambiar `origin` al dominio real al deployar |
| Credenciales no funcionan si `origin` es `*` | Usar lista explícita de orígenes |
