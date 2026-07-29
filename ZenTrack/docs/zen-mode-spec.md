# Zen Mode — Especificación de Diseño

## 1. Resumen

El **Zen Mode** permite que el usuario se enfoque en una sola tarjeta ("Doing") ocultando el resto de las cards del board. Si no existe una card "Doing", el sistema guía al usuario para crearla.

## 2. Comportamiento

```
     ┌──────────────────────────────────────────────────┐
     │  Header: [◉ Zen]  [Nombre del Board]             │
     ├──────────────────────────────────────────────────┤
     │  ┌──────────────────┐  ┌────────────────────┐    │
     │  │      InBox       │  │     Doing           │    │
     │  │  (opcional)      │  │  ┌──────────────┐   │    │
     │  │                  │  │  │ Todo 1        │   │    │
     │  │                  │  │  │ Todo 2        │   │    │
     │  │                  │  │  └──────────────┘   │    │
     │  └──────────────────┘  └────────────────────┘    │
     └──────────────────────────────────────────────────┘
```

- **Off**: el board se ve normal (como ahora), todas las cards visibles
- **On**: solo se muestra la card con título "Doing". InBox opcional
- Si se apaga Zen, vuelven todas las cards

## 3. Backend

**No requiere cambios en el esquema de Prisma.** 
- Al registrarse ya se crea una card "Doing" por defecto
- Se usará el título de la card como identificador: buscar la card con título `"Doing"` dentro del board
- El backend ya tiene `GET /api/board/card/g/:boardId` que devuelve todas las cards del board con sus todos. Es suficiente.

### Endpoints necesarios: NINGUNO

Ya existen:

| Método | Ruta | Uso |
|--------|------|-----|
| `GET` | `/api/board/card/g/:boardId` | Listar todas las cards |
| `POST` | `/api/board/card` | Crear card (para crear "Doing") |

## 4. Frontend — Componentes y Estado

### 4.1. BoardScreen — nuevo estado

```ts
const [zenMode, setZenMode] = useState(false);
```

### 4.2. ZenToggle — nuevo componente

**Ruta**: `Frontend/src/features/board/components/ZenToggle.tsx`

**Props**: `{ zenMode: boolean; onToggle: () => void; hasDoingCard: boolean; onCreateDoing: () => void }`

**Comportamiento**:
- Botón con ícono de enfoque/zen (svg simple de círculo con punto centrado o luna)
- Si `zenMode` está activo, se muestra destacado (brand-primary)
- Tooltip: "Zen Mode" / "Exit Zen"
- Si el usuario activa Zen y `hasDoingCard` es `false`, se abre un modal/prompt pidiendo crear la card "Doing"

### 4.3. DoingPrompt — nuevo componente (opcional)

**Ruta**: `Frontend/src/features/board/components/DoingPrompt.tsx`

**Props**: `{ isOpen: boolean; onClose: () => void; onConfirm: () => void; isCreating: boolean }`

**Comportamiento**:
- Modal de confirmación: "¿Quieres crear una card Doing para el modo Zen?"
- Botón "Sí, crear" → llama `onConfirm` (BoardScreen ejecuta `postCard(boardId, "Doing")` y activa Zen)
- Botón "No" → cierra el modal, no pasa nada
- `isCreating`: deshabilita botones mientras se crea

### 4.4. Main — modificación

**Ruta**: `Frontend/src/features/board/components/Layout/Main.tsx`

**Nueva prop**: `zenMode?: boolean; doingCardId?: string | null`

**Comportamiento**:
- Si `zenMode = true`, filtrar `cards.data` para mostrar solo `doingCardId`
- Si `zenMode = false`, mostrar todas las cards como ahora

### 4.5. Lógica en BoardScreen

```
al togglear Zen ON:
  1. Buscar en la query de cards la card con title === "Doing"
  2. Si existe → setZenMode(true)
  3. Si no existe → abrir DoingPrompt (confirmación)
    3a. Usuario confirma → postCard(boardId, "Doing"), esperar respuesta, setZenMode(true)
    3b. Usuario cancela → cerrar prompt, no pasa nada

al togglear Zen OFF:
  → setZenMode(false)
```

## 5. Flujo de datos

```
BoardScreen
├── state: zenMode (boolean)
├── state: doingCardId (string | null)
│
├── Header
│   └── ZenToggle ← { zenMode, onToggle, hasDoingCard, onCreateDoing }
│
├── Main ← recibe { zenMode, doingCardId }
│   └── si zenMode=true, filtra cards
│
└── DoingPrompt ← modal para crear "Doing"
```

## 6. Archivos a crear/modificar

### Nuevos

| Archivo | Propósito |
|---------|-----------|
| `Frontend/src/features/board/components/ZenToggle.tsx` | Botón toggle Zen en el header |
| `Frontend/src/features/board/components/DoingPrompt.tsx` | Modal para crear "Doing" |

### Modificar

| Archivo | Cambio |
|---------|--------|
| `Frontend/src/features/board/BoardScreen.tsx` | Agregar estado `zenMode`, lógica de toggle, integración con Main |
| `Frontend/src/features/board/components/Layout/Main.tsx` | Nueva prop `zenMode / doingCardId`, filtrar cards |
| `Frontend/src/components/layout/Header/Header.tsx` | Slot o prop para el ZenToggle (o se renderiza desde BoardScreen) |

## 7. Mockup visual (ASCII)

### Zen OFF (normal)
```
[≡]  [InBox]  [  Doing  ]  [  Done  ]  ⚡
```

### Zen ON
```
[≡]  [● Doing (única)]  ⚡  [✕ Exit Zen]
```

### Sin Doing — prompt
```
┌──────────────────────────────┐
│   ⚡ Zen Mode               │
│                              │
│   ¿Quieres crear una card    │
│   Doing para el modo Zen?    │
│                              │
│      [No]  [Sí, crear]      │
└──────────────────────────────┘
```

## 8. Tareas de implementación

1. Crear `DoingPrompt.tsx` — modal de confirmación con "Sí, crear" / "No"
2. Ubicar botón Zen en el header del board (al lado del título del board)
3. Modificar `Main.tsx` — aceptar prop `zenMode` + `doingCardId`, filtrar cards
4. Modificar `BoardScreen.tsx` — estado `zenMode`, lógica de detección de "Doing", integración con DoingPrompt
5. Verificar build: `pnpm run build` en Frontend
