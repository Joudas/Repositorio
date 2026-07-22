# 014 — Fixes desde Requirements.md

## 1. Animación hover en todo solo cuando no está checkeado

**Problema**: El hover del `motion.li` no mueve el texto en ningún caso (se eliminó `textVariants` por error). El usuario QUIERE que el texto se desplace 24px a la derecha al hacer hover, pero SOLO cuando el todo NO está checkeado.

**Solución**:
- Restaurar `motion.li` y `motion.span` con `textVariants`.
- `whileHover={todo.check ? undefined : "hover"}` — condicional: si está checkeado, no hay hover.
- Mantener `pl-7` cuando `checked`.

**Componentes afectados**:
- `Todo.tsx` — restaurado `motion.li` + `motion.span`, hover condicional
- `TodoOverlay.tsx` — sync con Todo

**No requiere** cambios en backend.

---

## 2. Botón de check en TodoModal no funciona

**Problema**: El `updateMutation.onSuccess` invalidaba `["todos"]` en lugar de `["todos", cardId]`. React Query v5 no hace prefix match por defecto cuando la key es parcial, entonces el refetch nunca se disparaba.

**Solución**:
- Cambiar `invalidateQueries({ queryKey: ["todos"] })` → `["todos", todo!.cardId]`.
- Se mantiene `data.check = checked` en `handleSave` (agregado en el batch anterior).

**Componentes afectados**:
- `TodoModal.tsx` — fix de invalidación

**Endpoint existente**: `PUT /api/board/card/todo/:id`

---

## 3. Reordenar todos verticalmente con `useSortable`

**Problema**: No había animación visual al reordenar todos dentro de una card durante el drag.

**Solución**:
- Reemplazar `useDraggable` por `useSortable` de `@dnd-kit/react/sortable`.
- Pasar `index` como prop al Todo desde Card e InBoxCard.
- `handleDragEnd` en BoardScreen NO necesitó cambios: la lógica existente (remover de source, insertar en target, llamar `reorderTodos`) ya es compatible con sortable. El sortable solo se encarga del feedback visual.

**Dependencias**: ninguna nueva. `import { useSortable } from '@dnd-kit/react/sortable'` funciona directamente.

**Componentes afectados**:

| Archivo | Cambio |
|---------|--------|
| `Todo.tsx` | `useDraggable` → `useSortable({ id, index })`. Prop `index` agregada. |
| `TodoOverlay.tsx` | Sync con Todo |
| `Card.tsx` | `<Todo todo={todo} index={idx} />` |
| `InBoxCard.tsx` | `<Todo todo={todo} index={idx} />` |

**Endpoint existente**: `PUT /api/board/card/todo/reorder`

---

## Resumen de cambios implementados

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `Todo.tsx` | Restaurado `motion.li` + `textVariants`, hover solo cuando `!todo.check` |
| 1 | `TodoOverlay.tsx` | Sync con Todo |
| 2 | `TodoModal.tsx` | `invalidateQueries(["todos"])` → `["todos", todo!.cardId]` |
| 3 | `Todo.tsx` | `useDraggable` → `useSortable({ id, index })`. Prop `index`. |
| 3 | `TodoOverlay.tsx` | Sync con Todo (mismo cambio sortable) |
| 3 | `Card.tsx` | Pasa `index` a cada `Todo` |
| 3 | `InBoxCard.tsx` | Pasa `index` a cada `Todo` |

**No se crearon** componentes, archivos ni endpoints nuevos.
