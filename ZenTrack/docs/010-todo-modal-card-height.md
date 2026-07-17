# Especificación: Todo Modal global + Card height consistente

## 1. Modal global para editar Todo

### Estado actual
- `Todo.tsx` tiene un `handleClick` que fetcha el todo completo y llama `setFormEdit(todo)`.
- `Card.tsx` declara `formEdit` como estado pero **no lo renderiza en ninguna parte** — es un estado muerto.
- No existe ningún modal, dialog, portal ni overlay en el frontend.

### Solución — Modal con Portal + Zustand

**Arquitectura:**
1. Crear un store Zustand `useModalStore` con: `todo: Todo | null`, `isOpen: boolean`, `open(todo)`, `close()`.
2. Crear un componente `TodoModal` que usa `createPortal` para renderizar en `document.body`.
3. `Todo.tsx` onClick llama a `useModalStore.getState().open(todo)` en vez de `setFormEdit`.
4. `TodoModal` se renderiza desde `App.tsx` o `RouterEngine.tsx` (nivel global, fuera de rutas), escucha el store y muestra el modal cuando `isOpen === true`.

**Estructura del modal:**
```
┌──────────────────────────────────┐
│  ✏️ Edit Todo              [X]  │  ← header con cerrar
├──────────────────────────────────┤
│  📋 Title: [____________]       │  ← input editable
│  📝 Description: [________]     │  ← textarea editable
│  ⚡ Energy: [BAJA|MEDIA|ALTA]   │  ← select
│  💬 Comments: [___________]     │  ← textarea
│  📅 End Date: [_______]         │  ← date input
│  ✅ Check: [x] Done             │  ← checkbox
├──────────────────────────────────┤
│        [Cancel]  [Save]          │  ← buttons
└──────────────────────────────────┘
```

**Comportamiento:**
- Al abrir: backdrop semi-translúcido (overlay) + modal centrado con z-50.
- Al hacer click en el overlay o en [X]: cierra.
- Al hacer click en [Save]: ejecuta `updateTodo(id, data)` via React Query mutation, cierra el modal.
- Al hacer click en [Cancel]: cierra sin guardar.

**Tecnologías:**
- `createPortal` de `react-dom` para renderizar fuera del árbol.
- `useModalStore` (Zustand, sin persist) para estado global del modal.
- `useMutation` de `@tanstack/react-query` para el update.
- Tailwind para estilos (overlay bg-black/50, modal rounded-lg).

### Archivos a crear
- `Frontend/src/stores/modalStore.ts`
- `Frontend/src/components/TodoModal.tsx`

### Archivos a modificar
- `Frontend/src/components/RouterEngine.tsx` — agregar `<TodoModal />`
- `Frontend/src/features/board/components/Todo.tsx` — cambiar `handleClick` para usar modalStore
- `Frontend/src/features/board/components/Card.tsx` — eliminar estado `formEdit` y prop `setFormEdit`

---

## 2. Card — altura consistente al expandir

### Estado actual
- `Card.tsx` tiene estado `contractCard`.
- `contractCard = true`: la card se colapsa a una franja vertical (writing-mode: vertical-rl, width fijo ~40px).
- `contractCard = false`: la card se expande y su altura varía según si tiene 0, 1, o varios todos.

### Problema
La altura de la card expandida cambia con el contenido. Si no hay todos se ve chica, si hay muchos se estira. No hay consistencia visual.

### Solución — altura fija con scroll interno

Cuando la card está expandida:
- Altura fija: `h-96` (384px).
- Overflow: `overflow-y-auto` para que los todos internos scrolleen si exceden.
- Scroll vertical personalizado: track `gray-5` (bg), thumb `gray-6` (barra).
- Esto aplica solo cuando `contractCard === false`.

### Archivos a modificar
- `Frontend/src/features/board/components/Card.tsx`

---

## 3. TodoAdd — textarea autoexpandible con tope

### Estado actual
- `TodoAdd.tsx` usa un `<textarea>` con `min-h-16 max-h-30`.
- El textarea tiene `resize` por defecto (el usuario puede arrastrar para agrandar).

### Problema
Al escribir, el textarea mantiene altura fija. El usuario llega a tener que scrollear dentro del textarea en vez de que se expanda naturalmente hasta un límite.

### Solución
- `field-sizing: content` — el textarea crece automáticamente con el contenido.
- `resize-none` — evitar que el usuario lo redimensione manualmente (el auto-grow es suficiente).
- `max-h-30` — tope de altura, después de eso aparece scroll interno.
- `overflow-y-auto` — cuando excede max-h-30, scrollea dentro del textarea.

### Archivos a modificar
- `Frontend/src/features/board/components/TodoAdd.tsx`

---

## 4. Scroll personalizado (global para cards)

### Solución
En `index.css`, agregar estilos para scroll vertical:

```css
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: #424242; /* gray-5 */
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #292929; /* gray-6 */
  border-radius: 3px;
}
```

Aplicar clase `custom-scroll` a la card expandida y al textarea de TodoAdd.

### Archivos a modificar
- `Frontend/src/index.css`
- `Frontend/src/features/board/components/Card.tsx`
- `Frontend/src/features/board/components/TodoAdd.tsx`

---

## 5. Resumen de cambios

| Archivo | Cambio |
|---|---|
| `stores/modalStore.ts` | **Nuevo** — Zustand store: `todo`, `isOpen`, `open()`, `close()` |
| `components/TodoModal.tsx` | **Nuevo** — Modal con createPortal, form de edición completo |
| `components/RouterEngine.tsx` | Agregar `<TodoModal />` dentro del árbol (fuera de Routes) |
| `features/board/components/Todo.tsx` | handleClick usa `modalStore.open(todo)` en vez de `setFormEdit` |
| `features/board/components/Card.tsx` | Eliminar `formEdit`, eliminar `setFormEdit` prop en `<Todo>`. Agregar `h-96 overflow-y-auto` en expandido |

---

¿Apruebas esta especificación?
