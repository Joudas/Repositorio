# Especificación: Card API — Posiciones, rutas y autorización

## 1. Manejo de posiciones de tarjetas

### Problema
Las tarjetas tienen un campo `position: Int` en el schema, pero no hay lógica que lo gestione. El cliente ya no envía `position` al crear — el backend la asigna automáticamente.

### Solución propuesta

**Al crear una tarjeta** → el backend asigna `position` automáticamente como el siguiente número disponible dentro del board:

```ts
// Obtener la última posición en ese board
const lastCard = await prisma.card.findFirst({
  where: { boardId },
  orderBy: { position: "desc" },
  select: { position: true },
});

const nextPosition = (lastCard?.position ?? -1) + 1;
```

Esto evita que el cliente tenga que calcular la posición y elimina colisiones.

**Al reordenar (drag & drop)** → endpoint específico `PUT /api/card/reorder` que recibe un array de `{ id, position }` y hace una transacción:

```ts
await prisma.$transaction(
  updates.map(({ id, position }) =>
    prisma.card.update({
      where: { id },
      data: { position },
    })
  )
);
```

Esto permite reordenar múltiples tarjetas en una sola request, atómico.

**Validaciones:**
- Las posiciones se re-asignan secuencialmente (0, 1, 2, …) en el reorder para evitar huecos.
- El boardId se verifica contra el userId (ownership chain).

---

## 2. Diseño de rutas para card.ts

### Problema actual
- `POST /:id` — usa `:id` como `boardId`, inconsistente (no es un recurso anidado ni standalone claro).
- `GET /:id` — devuelve tarjetas por `boardId`, cuyo nombre sugiere que devuelve una card por su id.
- `PUT /:id` — solo actualiza `title`, ignora el resto de campos.
- `DELETE /:id` — no verifica ownership (cualquiera que sepa el id borra la card).

### Rutas propuestas

```
REST Resource: /api/card

POST   /api/card                    → Crear una card (boardId en body)
GET    /api/card/:id                → Obtener una card por su ID
GET    /api/card/board/:boardId     → Obtener todas las cards de un board
PUT    /api/card/:id                → Actualizar una card (todos los campos editables)
PUT    /api/card/reorder            → Reordenar cards (batch position update)
DELETE /api/card/:id                → Eliminar una card
```

**Justificación:**
- `POST /api/card` con `boardId` en el body es más RESTful y evita rutas anidadas profundas.
- `GET /api/card/:id` y `GET /api/card/board/:boardId` separan dos responsabilidades distintas (una card vs todas las cards de un board).
- `PUT /api/card/reorder` es un endpoint de acción porque reordenar es una operación conceptualmente diferente a actualizar una card individual.
- `PUT /api/card/:id` acepta partial update de todos los campos editables.

---

## 3. Autorización (ownership chain)

### Problema
En `board.ts` la autorización se hace verificando `userId` directamente en la tabla Board. En `card.ts` no se verifica que la card pertenezca a un board del usuario autenticado.

### Solución — Cadena de ownership

Para operaciones sobre una Card, la verificación es:

```
userId (JWT) → Board.userId (el board es del usuario) → Card.boardId (la card está en ese board)
```

En la práctica, antes de modificar/eliminar una card:

```ts
const card = await prisma.card.findFirst({
  where: { id },
  include: { board: { select: { userId: true } } },
});

if (!card) { res.status(404).json({ error: "Card no encontrada" }); return; }
if (card.board.userId !== req.userId) {
  res.status(403).json({ error: "No autorizado" }); return;
}
```

Esto asegura que solo el dueño del board puede modificar sus tarjetas.

**Para operaciones sobre múltiples cards de un board** (GET /board/:boardId, POST, reorder):

```ts
const board = await prisma.board.findFirst({
  where: { id: boardId, userId: req.userId },
});
if (!board) { res.status(404).json({ error: "Board no encontrado" }); return; }
```

---

## 4. PUT — Actualización de campos dinámicos

### Problema
`PUT /:id` actualiza solo `title` hardcodeado. No escala.

### Solución
Extraer del body solo los campos que existen en el modelo Card y sean editables:

```ts
const updatableFields = [
  "title", "description", "position", "energy",
  "comments", "color", "endDate",
] as const;

const data: Record<string, unknown> = {};
for (const field of updatableFields) {
  if (req.body[field] !== undefined) {
    data[field] = req.body[field];
  }
}

if (Object.keys(data).length === 0) {
  res.status(400).json({ error: "No hay campos para actualizar" });
  return;
}

const card = await prisma.card.update({
  where: { id },
  data,
  select: { id: true, title: true, description: true, comments: true,
           position: true, energy: true, color: true, endDate: true },
});
```

Esto permite enviar `PUT /api/card/:id` con **parcial** de cualquier combinación de campos: solo `{ comments }`, solo `{ title, energy }`, o todos juntos.

---

## 5. Esquema de rutas completo para card.ts

| Método | Ruta                    | Auth             | Body / Query                          | Respuesta              |
|--------|-------------------------|------------------|---------------------------------------|------------------------|
| POST   | `/api/card`             | requireAuth      | `{ boardId, title }` (`position` auto)| 201 + card             |
| GET    | `/api/card/:id`         | requireAuth      | —                                     | 200 + card             |
| GET    | `/api/card/board/:boardId` | requireAuth   | —                                     | 200 + Card[]           |
| PUT    | `/api/card/:id`         | requireAuth      | `{ title?, description?, ... }`       | 200 + card actualizada |
| PUT    | `/api/card/reorder`     | requireAuth      | `{ boardId, cards: [{ id, position }] }` | 200 + Card[]       |
| DELETE | `/api/card/:id`         | requireAuth      | —                                     | 204                    |

---

## 6. Schema — model Card actualizado

Se agregó `color String?` al modelo Card y se aseguró que todos los campos opcionales estén marcados con `?`:

```prisma
model Card {
  id          String    @id @default(uuid())
  title       String
  description String?
  position    Int
  energy      Energy?   @default(MEDIA)
  comments    String?
  color       String?           // ← nuevo

  endDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  boardId     String
  board       Board     @relation(fields: [boardId], references: [id], onDelete: Cascade)
  todos       Todo[]
}
```

---

## 7. Esquema Zod actualizado

- `createCardSchema` — incluye `boardId` (requerido), `title`, más opcionales: `description`, `energy`, `comments`, `color`, `endDate`.
- `updateCardSchema` — todos los campos editables como opcionales.
- `reorderCardsSchema` — nuevo, con `boardId` + array de `{ id, position }`.

---

## 9. Pendiente: list.ts

El archivo `list.ts` usa un modelo `List` que ya no existe en el schema. Habría que eliminarlo o reescribirlo para que funcione con el modelo `Todo`.

---

¿Apruebas esta especificación?
