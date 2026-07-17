# Especificación: Todo API — Corrección de bugs y finalización

## 1. Error crítico: falta `await` en Prisma queries

### Problema
En `todo.ts`, tres handlers de ruta ejecutan queries de Prisma **sin `await`**:

```ts
// POST / — línea 31
const todo = prisma.todo.create({...});     // ❌ falta await
res.status(201).json(todo);                  // envía el Promise, no los datos

// GET /:id — línea 51
const todos = prisma.todo.findFirst({...});  // ❌ falta await
res.status(201).json(todos);

// GET /g/:id — línea 76
const todos = prisma.todo.findMany({...});   // ❌ falta await
res.json(todos);
```

Sin `await`, `prisma.todo.create()` devuelve un Promise. Express serializa ese Promise como `{ spec: { action: "findMany", args: {...}, model: "Todo" } }` — exactamente el error que ves.

### Solución
Agregar `await` en las 3 queries.

---

## 2. Errores en helpers `existBoard` y `existCard`

### Problema
Ambas funciones tienen la lógica **invertida**:

```ts
const existCard = async (cardId, boardId) => {
    const card = await prisma.card.findFirst({
        where: {id: cardId, boardId},
    })
    if (!card) return false;  // si NO existe → false (OK)
    // si SÍ existe → undefined (IMPLÍCITO) → falsy
}
```

Cuando la card EXISTE, la función retorna `undefined` (falsy), por lo que `if (await existCard(...))` NUNCA se ejecuta. Además, cuando la card NO existe, retorna `false`, que es el mismo comportamiento. La función no puede diferenciar entre "existe" y "no existe".

### Solución
Invertir la lógica: retornar `true` cuando existe, `false` cuando no:

```ts
const existCard = async (cardId: string, boardId: string): Promise<boolean> => {
    const card = await prisma.card.findFirst({
        where: { id: cardId, boardId },
    });
    return !!card;
};
```

---

## 3. GET /:id usa `todoId` en lugar de `id`

### Problema
```ts
// línea 52
where: { todoId }  // ❌ el campo en Prisma se llama "id", no "todoId"
```

Esto tira error de Prisma porque `todoId` no existe en el modelo Todo.

### Solución
Cambiar a `where: { id: todoId }`.

---

## 4. PUT `/` (update) está incompleto

### Problema
El handler de `PUT /` en `todo.ts` (líneas 131-146):
- Destructurea `{ todoId, title }` del body, pero `updateTodoSchema` no incluye `todoId`
- Referencia `boardId` y `cardId` que no están en scope (no se destructurearon)
- No ejecuta `prisma.todo.update`
- No envía respuesta

### Solución
Completar el handler con:
1. El schema `updateTodoSchema` debe incluir `todoId` y `cardId`
2. Verificar ownership: todo → card → board → user
3. Construir data dinámica (mismo patrón que card PUT)
4. Ejecutar `prisma.todo.update` y responder

---

## 5. Falta `return` después de errores en POST y reorder

### Problema
```ts
if (await existBoard(boardId, userId)) res.status(404).json({ error: "Board not found" });
// ❌ falta return — el código sigue ejecutándose
```

Después de enviar un error, el código continúa ejecutando el resto del handler.

### Solución
Agregar `return` después de cada `res.status().json()` de error.

---

## 6. Frontend: tipos y servicios incorrectos

### Problema
- `services/todo.ts` tiene `postTodo` que apunta a `/api/board/card/todo` con body `{ name }` (debería ser `{ cardId, title }`)
- `deleteTodo` usa `api.put` y `updateTodo` usa `api.delete` — están invertidos
- `type/Todo.ts` tiene `energy: "BAJA" | "MEDIA" | "ALTA"` pero `services/todo.ts` define `Energy` como objeto con propiedad `name`
- `Todo.tsx` importa `Todo` de `@/type/Todo` pero el servicio `getTodo` usa el tipo de `services/todo`

### Solución
Unificar el tipo `Todo` en `services/todo.ts` y eliminar `type/Todo.ts`. Corregir las URLs y métodos HTTP.

---

## 7. Resumen de cambios por archivo

### Backend: `apis/todo.ts`
| Línea | Problema | Cambio |
|---|---|---|
| 31 | Falta `await` en `prisma.todo.create` | Agregar `await` |
| 51 | Falta `await` en `prisma.todo.findFirst` | Agregar `await` |
| 52 | `where: { todoId }` → debe ser `id` | Cambiar a `where: { id: todoId }` |
| 76 | Falta `await` en `prisma.todo.findMany` | Agregar `await` |
| 18, 21 | `existBoard`/`existCard` sin `return` tras error | Agregar `return` |
| 104, 107 | Lo mismo en PUT /reorder | Agregar `return` |
| 131-146 | PUT `/` incompleto | Implementar update completo |
| 149-161 | Helpers con lógica invertida | Retornar `!!card` / `!!board` |

### Backend: `schemas/todo.ts`
| Problema | Cambio |
|---|---|
| `updateTodoSchema` sin `todoId` ni `cardId` | Agregar campos para la verificación de ownership |
| `createTodoSchema` espera `boardId` en POST pero el handler lo usa | Mantener `cardId` y `title` como requeridos |

### Frontend: `services/todo.ts`
| Problema | Cambio |
|---|---|
| `postTodo` usa `{ name }` | Cambiar a `{ cardId, title }` |
| `deleteTodo` usa `api.put`, `updateTodo` usa `api.delete` | Intercambiar métodos |
| Tipo `Energy` como objeto | Simplificar a union type |
| URL `/api/board/card/todo` | Debe coincidir con backend |

### Frontend: `features/board/components/Card.tsx`
| Problema | Cambio |
|---|---|
| `getTodo(card.id)` espera `Promise<Todo[]>` | Ya funciona si el backend responde bien |
| `console.log(todo.data)` innecesario | Limpiar |

---

¿Apruebas esta especificación?
