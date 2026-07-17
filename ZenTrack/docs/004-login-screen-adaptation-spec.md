# Especificación: Adaptación de Login Template a LoginScreen — ZenTrack

> **Estado:** Borrador para aprobación  
> **Fecha:** 2026-07-08  
> **Versión:** 1.0

---

## 1. Objetivo

Tomar la interfaz visual existente en `login-template/` y adaptarla al `LoginScreen.tsx` dentro de la estructura Bulletproof React del frontend, integrando React Query para las llamadas a la API.

---

## 2. Estado Actual

### Template disponible en `login-template/`

```
login-template/
├── components/
│   └── Login.tsx              ← Interfaz visual del login (Tailwind + Motion)
├── hooks/
│   └── useWindowsDimentions.ts ← Hook para detectar tamaño de ventana
├── page/                       ← Vacío
└── index.ts                    ← Vacío
```

El template incluye:
- Fondo con degradado púrpura (`from-[#AF84FF] to-[#7C3AED]`)
- Layout responsive: formulario a la izquierda, navegación a la derecha en desktop
- Animaciones con `motion` en los items de navegación
- Grid de 2 columnas en desktop (`lg:w-[50%]`), pantalla completa en mobile
- Importa un componente `<Form/>` desde `../../../components/UI`

### LoginScreen actual (`Frontend/src/features/auth/login/LoginScreen.tsx`)

```tsx
export default function LoginScreen() {
  useEffect(() => { getUsers(); }, []);
  return <div />;
}
```

Sin interfaz visual. Solo llama a `getUsers()`.

### Dependencias faltantes en Frontend

| Paquete | Estado | Propósito |
|---------|--------|-----------|
| `tailwindcss` | ❌ No instalado | Clases utilitarias CSS |
| `@tailwindcss/vite` | ❌ No instalado | Plugin de Vite para Tailwind |
| `motion` (framer-motion) | ❌ No instalado | Animaciones con `motion` |

---

## 3. Plan de Implementación

### Fase 1: Instalar dependencias

```bash
cd Frontend
pnpm add motion
pnpm add -D tailwindcss @tailwindcss/vite
```

### Fase 2: Configurar Tailwind CSS v4

Tailwind v4 cambió: ya no usa `tailwind.config.js` ni `postcss`. Se configura con el plugin de Vite y un archivo CSS con `@import "tailwindcss"`.

**`Frontend/vite.config.ts`** — agregar el plugin de Tailwind.
**`Frontend/src/index.css`** — agregar `@import "tailwindcss"`.

### Fase 3: Crear componentes necesarios

#### `src/components/UI/Form.tsx`

El template importa `<Form/>` desde `../../../components/UI`. Hay que crearlo:
- Input de email con label
- Input de password con label
- Botón de submit "Iniciar sesión"
- Manejo de estado local (email, password)
- Llamada a `POST /users` con React Query

#### `src/features/auth/login/hooks/useWindowDimensions.ts`

Copiar el hook del template `login-template/hooks/useWindowsDimentions.ts`.

> **Nota:** Corregir el typo del nombre del archivo original (`Dimentions` → `Dimensions`).

### Fase 4: Adaptar LoginScreen

Reemplazar el contenido actual de `LoginScreen.tsx` con la interfaz del template más la lógica de React Query.

Componentes que conforman la pantalla:

```
LoginScreen
├── Layout responsive (2 columnas en lg, 1 en mobile)
├── Columna izquierda: Formulario
│   └── Form (email + password + botón submit)
└── Columna derecha (solo desktop): Navegación
    └── Links animados con motion (Register, Login, Home)
```

### Fase 5: Integrar en App.tsx

Renderizar `LoginScreen` en `App.tsx` y configurar `QueryClientProvider` de React Query.

---

## 4. Archivos a Crear / Modificar

| Archivo | Acción |
|---------|--------|
| `Frontend/package.json` | ✅ Agregar `motion`, `tailwindcss`, `@tailwindcss/vite` |
| `Frontend/vite.config.ts` | ✅ Agregar plugin de Tailwind |
| `Frontend/src/index.css` | ✅ Agregar `@import "tailwindcss"` |
| `Frontend/src/components/UI/Form.tsx` | 🆕 Crear formulario de login |
| `Frontend/src/features/auth/login/hooks/useWindowDimensions.ts` | 🆕 Copiar desde template |
| `Frontend/src/features/auth/login/LoginScreen.tsx` | ✅ Reemplazar con template adaptado |
| `Frontend/src/main.tsx` | ✅ Envolver con QueryClientProvider |
| `login-template/components/Login.tsx` | ❌ Eliminar (código movido) |

---

## 5. Dependencias

```bash
pnpm add motion
pnpm add -D tailwindcss @tailwindcss/vite
```

---

## 6. Preguntas / Bloqueantes

1. **El componente `Form` no existe.** En el template se importa de `../../../components/UI`. Propongo crearlo con email, password y botón submit conectado a `POST /users`. ¿Te parece bien o tenés otro diseño para el formulario?
2. **Los links de navegación** (Register, Login, Home) en la columna derecha: ¿deberían navegar a rutas o son solo visuales por ahora?
3. **`motion`** usa `framer-motion` — es la nueva versión. En el template se importa como `"motion/react"`. Confirmado que funciona igual.
4. ¿Querés que la pantalla de login sea la pantalla principal (ruta `/`) o prefieres que tenga su propia ruta tipo `/login`?

---

## 7. Validación

| # | Prueba | Resultado esperado |
|---|--------|-------------------|
| 1 | `pnpm run dev` en Frontend | Arranca sin errores |
| 2 | Pantalla de login en navegador | Fondo púrpura, formulario centrado, responsive |
| 3 | Campos de email y password | Visibles y funcionales |
| 4 | Submit del formulario | Llama a `POST /users` o muestra loading |
| 5 | Redimensionar ventana | Layout cambia a 2 columnas en desktop |
