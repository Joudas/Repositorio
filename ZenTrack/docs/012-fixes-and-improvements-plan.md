# Plan de Implementación — 012: Correcciones y Mejoras (v2)

Basado en `docs/Requirements.md` actualizado después de pruebas.

---

## Resumen

4 nuevos cambios. Los 7 anteriores ya están implementados y compilando.

---

## 1. Botón del Header no abre el menú

**Problema**: El botón de "Create" (y potencialmente el de Settings) en `Header.tsx` ya no despliega el menú correspondiente. Funcionaba antes de los cambios recientes.

**Causa probable**: Race condition entre el `useHandleClick` del Header y los `useHandleClick` anidados de `FormBoard`/`Settings`. O el `motion.button` de Motion no propaga el onClick correctamente en ciertos casos.

**Cambios**:
- `Frontend/src/features/board/components/Header.tsx`:
  - Simplificar el toggle. Separar los `containerRef` para que Create y Settings tengan su propio scope y no compartan el mismo detector de click outside.
  - Cambiar el `Button` por un `button` nativo si Motion interfiere.
- `Frontend/src/features/board/components/FormBoard.tsx`:
  - Revisar que su `useHandleClick` no esté en conflicto con el del Header.
- `Frontend/src/features/board/components/Settings.tsx`:
  - Idem.

**Archivos**: 3 (`Header.tsx`, `FormBoard.tsx`, `Settings.tsx`)

---

## 2. CheckBox — optimístico sin refetch

**Problema**: Marcar/desmarcar un check tarda porque hace invalidateQueries + refetch del backend antes de mostrar el cambio visual.

**Causa**: Mi implementación anterior usa `onSuccess: () => invalidateQueries(...)`. Esto espera a que el servidor responda y luego refetch.

**Cambios**:
- `Frontend/src/features/board/components/CheckBox.tsx`:
  - En lugar de invalidar en `onSuccess`, hacer **optimistic update directo**: apenas se clickea, actualizar el cache de React Query con el nuevo estado.
  - Llamar `updateTodo` en background sin invalidar.
  - Solo invalidar si la API falla (rollback).
  - Así el check se marca/desmarca instantáneamente.

**Archivo**: 1 (`CheckBox.tsx`)

---

## 3. Crear Todo — indicador de carga

**Problema**: Al crear un todo, tarda en aparecer porque espera la respuesta del servidor sin feedback visual.

**Cambios**:
- `Frontend/src/features/board/components/TodoAdd.tsx`:
  - Mientras la mutation está en progreso (`isPending`), mostrar un placeholder/spinner gris en la posición donde aparecerá el todo.
  - Opción alternativa: **optimistic update** — agregar el todo al cache de React Query inmediatamente con un id temporal, llamar la API en background, y reemplazar el id temporal con el real al recibir la respuesta.
  - De ambas, la alternativa optimística da mejor UX porque el todo aparece al instante.
  - Usar `onMutate` para agregar al cache, `onError` para revertir, `onSettled` para invalidar y sincronizar.

**Archivo**: 1 (`TodoAdd.tsx`)

---

## 4. Eliminar Cards — menú en cabecera

**Problema**: No hay forma de eliminar una card desde la UI.

**Cambios**:
- `Frontend/src/features/board/components/Card.tsx`:
  - Agregar un menú (ícono de tres puntos `...` o el engranaje) en el header de la card, entre el título y el botón de contraer.
  - Al hacer click en el ícono, abrir un dropdown con opción "Delete Card".
  - "Delete Card" llama a `deleteCard(card.id)` y redirige o refresca.
- `Frontend/src/features/board/components/Main.tsx`:
  - Pasar `board.id` a Card (para invalidar query después de eliminar).
- `Frontend/src/services/card.ts`:
  - Agregar función `deleteCard(id: string)` si no existe (o arreglar las funciones existentes que están mal nombradas `deleteBoard`/`updateBoard` para card).

**Archivos**: 3 (`Card.tsx`, `Main.tsx`, `card.ts` service)

---

## Resumen de Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| `Header.tsx` | Fix toggle menú Create/Settings |
| `FormBoard.tsx` | Revisar conflicto useHandleClick |
| `Settings.tsx` | Revisar conflicto useHandleClick |
| `CheckBox.tsx` | Optimistic update sin refetch |
| `TodoAdd.tsx` | Optimistic update para creación instantánea |
| `Card.tsx` | Menú con opción "Delete Card" |
| `Main.tsx` | Pasar boardId a Card |
| `card.ts` (service) | Agregar deleteCard, renombrar funciones mal nombradas |

**Total**: 8 archivos (solo frontend)
**Líneas estimadas**: ~120 añadidas, ~30 eliminadas
**Riesgo**: Bajo-Medio

---

¿Aprobás este plan?
