# Especificación: Validación de Datos con Zod en Backend — ZenTrack

> **Estado:** Borrador para aprobación  
> **Fecha:** 2026-07-08  
> **Versión:** 1.0

---

## 1. Objetivo

Reemplazar las validaciones manuales (`if (!email || !password)`) en los endpoints de auth con **schemas de Zod**, garantizando tipado estricto, mensajes de error consistentes y seguridad contra datos malformados.

---

## 2. Estado Actual

Actualmente los endpoints validan a mano:

```ts
// auth.ts — validación inline, frágil y repetitiva
if (!email || !password) {
  res.status(400).json({ error: "email y password son requeridos" });
  return;
}
```

Problemas:
- No valida formato de email (cualquier string pasa)
- No valida longitud mínima de password
- `name` opcional no tiene type coercion
- Los errores no son consistentes entre endpoints
- Si llega un tipo inesperado (ej. `email: 123`), no se detecta

---

## 3. Solución: Zod Schemas

### 3.1 Dependencia

```bash
cd Backend
pnpm add zod
```

Zod es liviano (~8KB gzip), sin dependencias, y se integra naturalmente con TypeScript.

### 3.2 Esquemas

```ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({ required_error: "email es requerido" })
    .email("email no válido"),
  password: z
    .string({ required_error: "password es requerido" })
    .min(6, "password debe tener al menos 6 caracteres")
    .max(100, "password demasiado largo"),
  name: z
    .string()
    .min(1, "name no puede estar vacío")
    .max(100, "name demasiado largo")
    .optional()
    .nullable()
    .default(null),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "email es requerido" })
    .email("email no válido"),
  password: z
    .string({ required_error: "password es requerido" })
    .min(1, "password es requerido"),
});
```

### 3.3 Middleware de validación

```ts
// src/middleware/validate.ts
import { type Request, type Response, type NextFunction } from "express";
import { type ZodSchema, ZodError } from "zod";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      res.status(400).json({ error: "Datos inválidos", details: errors });
      return;
    }
    req.body = result.data; // body tipado y sanitizado
    next();
  };
}
```

### 3.4 Aplicación en rutas

```ts
import { registerSchema, loginSchema } from "../schemas/auth.js";
import { validate } from "../middleware/validate.js";

router.post("/register", validate(registerSchema), async (req, res) => {
  const { email, password, name } = req.body; // ✅ tipado inferido
  // ... lógica existente, sin validaciones manuales
});
```

---

## 4. Archivos a Crear/Modificar

| Archivo | Acción |
|---------|--------|
| `Backend/src/schemas/auth.ts` | 🆕 Schemas de Zod para register y login |
| `Backend/src/middleware/validate.ts` | 🆕 Middleware genérico `validate(schema)` |
| `Backend/src/apis/auth.ts` | ✅ Reemplazar validaciones manuales por `validate()` |
| `Backend/package.json` | ✅ Agregar `zod` |

---

## 5. Formato de Error de Respuesta

```json
{
  "error": "Datos inválidos",
  "details": [
    { "field": "email", "message": "email no válido" },
    { "field": "password", "message": "password debe tener al menos 6 caracteres" }
  ]
}
```

Esto permite al frontend mostrar errores específicos por campo.

---

## 6. No Alcanza (fuera de scope)

- Validación en otros endpoints (boards, lists, cards) — se hará cuando se implementen
- Sanitización de XSS en strings — Express + Prisma ya manejan escaping
- Rate limiting — se hará después si es necesario

---

## 7. Validación

| # | Prueba | Resultado esperado |
|---|--------|-------------------|
| 1 | POST `/api/auth/register` con `{ email: "invalido" }` | 400 con `details[0].field = "email"` |
| 2 | POST `/api/auth/register` con `{ email: "a@b.com", password: "123" }` | 400 (password < 6 chars) |
| 3 | POST `/api/auth/register` sin body | 400 con errores de campos requeridos |
| 4 | POST `/api/auth/register` con datos válidos + `name` | 201 — funciona igual que antes |
| 5 | POST `/api/auth/register` con datos válidos sin `name` | 201 con `name: null` (default) |
| 6 | POST `/api/auth/login` con `{ email: "", password: "" }` | 400 con errores específicos |
| 7 | POST `/api/auth/login` con datos válidos | 200 — funciona igual que antes |
| 8 | Los endpoints existentes siguen respondiendo igual con datos válidos | Sin cambios en comportamiento |
