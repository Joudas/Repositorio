# 011 — Drag & Drop con @dnd-kit/react v0.5.0

## Estado Actual

### dnd-kit instalado
- `@dnd-kit/react@0.5.0`
- Sin sortable (`useSortable` no existe en esta versión)
- Exporta: `DragDropProvider`, `DragOverlay`, `KeyboardSensor`, `PointerSensor`, `useDragDropManager`, `useDragDropMonitor`, `useDragOperation`, `useDraggable`, `useDroppable`, `useInstance`

### Componentes actuales (rotos)

#### `BoardScreen.tsx`
- Tiene `DragDropProvider` envolviendo InBox + Main
- `onDragEnd` usa un booleano `isDropped` que no distingue contenedores
- Pasa `isDropped` como prop a InBox y Main

#### `Card.tsx`
- `useDroppable({ id: "a" })` — ID hardcodeado, siempre el mismo
- Render condicional con `isDropped`: muestra `<Draggable>` o lo mete dentro de `<Droppable>`
- No usa el ID real de la card

#### `InBoxCard.tsx`  
- `useDroppable({ id: "droppable" })` — ID hardcodeado
- Mismo patrón condicional con `isDropped`

#### `Todo.tsx`
- `useDraggable({ id: todo.id })` — **correcto**, único componente bien configurado
- El `ref` está en el `<motion.li>`, lo cual funciona

#### `dnd/Draggable.tsx`
- Solo mapea `<Todo>` items, no tiene lógica dnd propia
- Podría eliminarse si cada Todo se renderiza directamente

#### `dnd/Droppable.tsx`
- Fragment vacío, no usa `useDroppable`
- No sirve para nada

### Problemas detectados

1. **IDs de drop zone hardcodeados** — todas las cards y el inbox compiten por el mismo target
2. **`isDropped` booleano global** — no trackea qué todo va a dónde
3. **No hay `cardId` en el tipo `Todo`** — la UI no sabe a qué card pertenece cada todo sin inferirlo del contexto de render
4. **Backend no soporta mover todos entre cards** — `PUT /:id` no acepta `cardId` en el schema ni en los campos actualizables
5. **Draggable/Droppable wrappers inútiles** — añaden complejidad sin valor

### Lo que sí funciona
- `DragDropProvider` wrapping básico en BoardScreen
- `useDraggable` en Todo.tsx con IDs reales
- Backend tiene `position` + `PUT /reorder` para orden dentro de una card
- `PUT /:id` acepta campos dinámicos (extensible para mover)

---

## Diseño Propuesto

### Arquitectura

Contenedores con `useDroppable` + items con `useDraggable`. Sin sortable (`@dnd-kit/react` no lo tiene). El reorden dentro de un mismo contenedor se maneja con el `position` existente + `PUT /reorder`.

```
BoardScreen
  └─ DragDropProvider
       ├─ InBox (drop zone: card.id del inbox)
       │    └─ InBoxCard
       │         └─ [Todo × N] (draggable)
       └─ Main
            └─ [Card × N] (cada card es drop zone con su propio card.id)
                 └─ [Todo × N] (draggable)
```

### Flujo de datos

1. Usuario arrastra un Todo
2. `useDraggable` expone `todo.id` como source
3. Usuario suelta sobre una Card o InBox
4. `useDroppable` expone `card.id` como target
5. `onDragEnd` en `DragDropProvider`:
   - `source.id` = todo ID
   - `target.id` = card ID de destino
   - Si source y target pertenecen a cards distintas → mover entre cards
   - Si source y target son la misma card → reordenar
6. Llamada a API (`PUT /api/board/card/todo/move/:id` o `PUT /reorder`)
7. Invalidar queries de React Query → refetch

### Visual Feedback

- `useDroppable` retorna `isDropTarget` → highlight en la card cuando un item está sobre ella
- Opcional: `DragOverlay` para ghost del item mientras se arrastra (mejora futura)

---

## Cambios Necesarios

### Backend

#### 1. Agregar `cardId` al select de GET /g/:cardId
```typescript
// Backend/src/apis/todo.ts — GET /g/:cardId
select: {
  id: true, title: true, description: true, position: true,
  check: true, energy: true, comments: true, endDate: true,
  cardId: true,  // ← agregar
}
```

#### 2. Nuevo endpoint: PUT /move/:id
Mueve un todo de una card a otra con posición opcional.

```
PUT /api/board/card/todo/move/:id
Body: { targetCardId: string, position?: number }
Ownership: todo → card source → board → user + targetCard → board → user
```

Steps:
1. Verificar ownership del todo + su card origen
2. Verificar ownership de la card destino
3. Si position no se envía, asignar `last.position + 1` en la card destino
4. Actualizar `cardId` + `position` del todo
5. Retornar el todo actualizado

#### 3. Schema para move
```typescript
// Backend/src/schemas/todo.ts
export const moveTodoSchema = z.object({
  targetCardId: z.string(),
  position: z.number().int().optional(),
});
```

#### 4. (Opcional) Agregar `cardId` a updateTodoSchema como campo opcional
Alternativa al endpoint dedicado. Prefiero el endpoint dedicado por claridad.

### Frontend

#### 1. Tipo `Todo` — agregar `cardId`
```typescript
// Frontend/src/type/Todo.ts
export type Todo = {
  id: string;
  title: string;
  description: string | null;
  energy: "BAJA" | "MEDIA" | "ALTA";
  comments: [] | null;
  position: number;
  check: boolean;
  endDate: string | null;
  cardId: string;  // ← agregar
}
```

#### 2. `BoardScreen.tsx` — onDragEnd real
```typescript
// Quitar isDropped state
// onDragEnd:
//   source = event.operation.source?.id (todo ID)
//   target = event.operation.target?.id (card ID)
//   Si source && target y source.cardId !== target:
//     → llamar moveTodo(source, target)
//   Si source && target y source.cardId === target:
//     → es reorden dentro de la misma card (feature futura)
//   Invalidar queries ["todos", cardId] para source y target
```

#### 3. `Card.tsx` — droppable con ID real
```typescript
const { ref, isDropTarget } = useDroppable({ id: card.id });
// ref en el contenedor principal
// isDropTarget → clase condicional para highlight
// Quitar: isDropped prop, Draggable/Droppable wrapper
// Renderizar todos directamente: todos?.map(todo => <Todo todo={todo} />)
```

#### 4. `InBoxCard.tsx` — droppable con ID real
```typescript
const { ref, isDropTarget } = useDroppable({ id: card.id });
// Mismo patrón que Card.tsx
// Quitar: isDropped prop, Draggable/Droppable wrapper
// Renderizar todos directamente
```

#### 5. `Todo.tsx` — sin cambios (ya tiene useDraggable correcto)
Solo asegurar que `useDraggable({ id: todo.id })` funciona. El `ref` ya está en `<motion.li>`.

#### 6. Eliminar `dnd/Draggable.tsx` y `dnd/Droppable.tsx`
Dejan de ser necesarios. Los todos se renderizan directamente en Card e InBoxCard.

#### 7. `Main.tsx` e `InBox.tsx` — quitar prop `isDropped`
Ya no se pasa.

#### 8. Servicio `moveTodo`
```typescript
// Frontend/src/services/todo.ts
export const moveTodo = async (id: string, targetCardId: string): Promise<Todo> => {
  return api.put<Todo>(`/api/board/card/todo/move/${id}`, { targetCardId });
};
```

#### 9. Llamada en onDragEnd
En BoardScreen, dentro de `onDragEnd`:
```typescript
const sourceId = event.operation.source?.id as string;
const targetId = event.operation.target?.id as string;
if (!sourceId || !targetId) return;

// Obtener el todo del cache para saber su cardId actual
// (o tener el map de todoId → cardId disponible)

await moveTodo(sourceId, targetId);
// Invalidar queries de la card origen y destino
```

---

## Plan de Implementación

### Lote 1 — Backend + tipos
1. Agregar `cardId` al select de `GET /g/:cardId` en todo.ts
2. Crear schema `moveTodoSchema` en todo.ts
3. Agregar endpoint `PUT /move/:id` en todo.ts
4. Agregar `cardId` al tipo `Todo` en Frontend
5. Agregar `moveTodo` service en Frontend

### Lote 2 — Frontend refactor
1. Quitar `isDropped` de BoardScreen, usar IDs reales en onDragEnd
2. Refactor `Card.tsx`: droppable con `card.id`, render directo de todos, highlight con `isDropTarget`
3. Refactor `InBoxCard.tsx`: mismo patrón
4. Eliminar `Draggable.tsx` y `Droppable.tsx`
5. Quitar prop `isDropped` de Main.tsx e InBox.tsx
6. Llamar `moveTodo` en onDragEnd e invalidar queries

### Lote 3 — Reorden dentro del mismo contenedor
- Usar `PUT /reorder` existente
- Detectar en onDragEnd si source y target pertenecen a la misma card
- Calcular nueva posición basada en la posición del drop
- Llamar `PUT /reorder` con los IDs ordenados
- Optimistic update antes de la llamada (mejora futura)

### No incluido en este alcance
- `DragOverlay` para ghost visual mientras se arrastra
- Animaciones de reorden animadas
- Test unitarios del DnD
