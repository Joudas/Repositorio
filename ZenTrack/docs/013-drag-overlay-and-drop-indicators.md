# Plan de Implementación — 013: DragOverlay, Indicadores de Drop y Check Visible

## Requerimientos

1. **Check visible cuando el todo está completado**: El icono de check no debe ocultarse cuando `todo.check === true`, incluso sin hover.
2. **DragOverlay**: Al arrastrar un todo, mostrar una copia flotante que sigue el cursor.
3. **Rastro en card origen**: Mientras se arrastra, el todo original en la card de origen se ve atenuado/transparente indicando "esto se está moviendo de acá".
4. **Indicador en card destino**: Al pasar sobre una card, mostrar un recuadro/color diferente indicando "si soltás acá, el todo cae en esta card".
5. **Indicador de posición**: Al arrastrar sobre una card (incluyendo InBox), mostrar una línea indicando **exactamente en qué posición** (primero, segundo, etc.) se insertará el todo.
6. **Reorder posicional**: Al soltar el todo en una posición específica, guardar esa posición en la base de datos (no solo al final).

---

## Cambios Técnicos

### 1. CheckBox — visible cuando completed

**Archivo**: `Frontend/src/features/board/components/CheckBox.tsx`

**Cambio**: Actualmente el CheckBox usa variants de Motion que arrancan con `opacity: 0, x: -20` y solo se muestran en hover. Cuando `checked === true`, quitar la animación y mostrarlo siempre visible con color verde.

```tsx
// Si checked === true → siempre visible, sin variants
// Si checked === false → comportamiento actual (solo hover)
```

---

### 2. BoardScreen — estado global del drag

**Archivo**: `Frontend/src/features/board/BoardScreen.tsx`

**Estado nuevo** (con `useState`):

| Estado | Tipo | Descripción |
|--------|------|-------------|
| `activeTodo` | `Todo \| null` | El todo que se está arrastrando actualmente |
| `hoverPosition` | `{ cardId: string; index: number } \| null` | Posición de inserción calculada durante el drag |

**Eventos nuevos en `DragDropProvider`**:

- **`onDragStart`**: Guardar el `activeTodo` desde el cache de React Query usando el `source.id`
- **`onDragMove`**: Calcular la posición de inserción basada en la posición del cursor vs los bounding rects de los todos en la card destino
- **`onDragEnd`**: Usar la `hoverPosition` calculada para determinar el `position` en el `moveTodo`/`reorderTodos`, no solo agregar al final

**Render condicional**:
- `<DragOverlay>`: Mostrar el `activeTodo` como overlay flotante con estilo idéntico pero semi-transparente
- Pasar `hoverPosition` a Card/InBoxCard como prop

---

### 3. Todo — isDragSource para efecto visual

**Archivo**: `Frontend/src/features/board/components/Todo.tsx`

**Cambio**: Usar `isDragSource` de `useDraggable` para atenuar el todo original mientras se arrastra.

```tsx
const {ref, isDragSource} = useDraggable({ id });

// CSS condicional:
className={`... ${isDragSource ? "opacity-30 scale-95" : ""}`}
```

Además, cuando `isDragSource` está activo y el DropOverlay se renderiza, el `aria-hidden` se puede usar para mejorar la accesibilidad (como muestra la doc de dnd-kit).

---

### 4. Card e InBoxCard — isDropTarget + indicador de posición

**Archivos**: `Card.tsx`, `InBoxCard.tsx`

**Cambios**:

- Usar `isDropTarget` de `useDroppable` para cambiar el estilo del contenedor:
  - `Card.tsx`: El fondo de la card cambiar a un tono más claro/borde marcado cuando `isDropTarget === true`
  - `InBoxCard.tsx`: Igual, el área de drop se ilumina

- **Indicador de posición**: Renderizar una línea horizontal `div` en la posición `hoverPosition.index` dentro de la lista de todos. La línea se muestra solo cuando `hoverPosition.cardId === card.id` y hay un drag activo.

```tsx
{/* Línea indicadora de posición */}
{hoverPosition?.cardId === card.id && (
  <div 
    className="h-0.5 bg-brand-primary rounded-full my-1" 
    style={{ order: hoverPosition.index }}
  />
)}
```

Para esto, los todos y la línea deben estar en un contenedor flex-col donde `order` funcione, o usar un enfoque de renderizado condicional con el índice.

---

### 5. Cálculo de posición de inserción

En `BoardScreen.tsx`, en `onDragMove`:

```tsx
const handleDragMove = (event) => {
  const targetId = event.operation.target?.id as string;
  if (!targetId) return;
  
  // Obtener la posición Y del cursor
  const cursorY = event.operation.position?.y;
  if (!cursorY) return;
  
  // Obtener los elementos DOM de los todos en la card destino
  const todoElements = document.querySelectorAll(`[data-todo-card="${targetId}"]`);
  
  let insertIndex = 0;
  todoElements.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    if (cursorY > midY) {
      insertIndex = i + 1;
    }
  });
  
  setHoverPosition({ cardId: targetId, index: insertIndex });
};
```

Se necesita agregar `data-todo-card={cardId}` a cada elemento Todo para poder seleccionarlos.

---

### 6. Reorder posicional en onDragEnd

**Archivo**: `BoardScreen.tsx` — modificar `handleDragEnd`

**Cambio**: Usar `hoverPosition.index` para determinar la posición al mover/reordenar.

```tsx
// En lugar de agregar al final:
const position = hoverPosition?.cardId === targetId ? hoverPosition.index : undefined;

// Para same-card reorder, re-calcular posiciones de TODOS los todos
// Para cross-card move, asignar la posición calculada
```

Esto requiere actualizar el payload de `moveTodo` y `reorderTodos` para incluir la posición calculada.

---

## Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| `BoardScreen.tsx` | Estado de drag (activeTodo, hoverPosition), eventos onDragStart/onDragMove/onDragEnd, DragOverlay, cálculo de posición |
| `Todo.tsx` | isDragSource visual, data-todo-card attr |
| `TodoOverlay.tsx` | Mantener sincronizado con Todo.tsx |
| `Card.tsx` | isDropTarget visual, indicador de posición |
| `InBoxCard.tsx` | isDropTarget visual, indicador de posición |
| `CheckBox.tsx` | Check visible cuando completed |
| `todo.ts` (service) | Asegurar que moveTodo envía position |
| `todo.ts` (schemas backend) | Verificar que moveTodoSchema acepta position |
| `Card.tsx` (backend card service) | deleteCard ya agregado |

**Total**: 7-8 archivos (solo frontend + 1 schema check)
**Líneas estimadas**: ~200 añadidas, ~30 eliminadas
**Riesgo**: Medio — cambios en lógica de drag existente

---

## Consideraciones

- **@dnd-kit/react v0.5.0** no exporta `useSortable`. La posición se maneja manualmente.
- El `DragOverlay` se renderiza dentro de `<DragDropProvider>` en `BoardScreen`.
- No hay tests que romper (strict_tdd: false).
- La línea indicadora usa `order` CSS en un contenedor flex. Se necesita que todos y la línea compartan el mismo padre flex-col.
- La posición se recalcula en cada `onDragMove` — puede tener impacto perfomance con muchos todos. Si es necesario, debounce.

---

¿Aprobás este plan?
