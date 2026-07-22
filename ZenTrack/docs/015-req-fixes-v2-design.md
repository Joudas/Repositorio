# 015 — Fixes desde Requirements.md (v2)

## 1. Check icon invisible cuando no está checkeado

**Problema**: `CheckBox.tsx` arranca con `opacity: 0` en estado `rest`. El círculo vacío no se ve hasta el hover.

**Solución**: `checkboxVariants` ahora solo anima `x` (slide horizontal), sin opacidad ni scale. El icono siempre es visible.

## 2. Check en TodoModal no funciona

**Problema**: La mutation no tenía `onError`. Si el PUT fallaba, el error se tragaba silenciosamente.

**Solución**: Agregado `onError` con `console.error` para debug.

## 3+4. Source item se mueve + error removeChild

**Problema**: `useSortable` causaba que el item arrastrado siguiera al cursor en vez de quedarse en origen, y generaba `NotFoundError: removeChild` al soltar por conflicto con React.

**Solución**: Revertido `useSortable` → `useDraggable`. Eliminada prop `index`.

## Cambios implementados

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `CheckBox.tsx` | `checkboxVariants` solo `x`, sin `opacity`/`scale` |
| 2 | `TodoModal.tsx` | `onError` agregado a `updateMutation` |
| 3+4 | `Todo.tsx` | `useSortable` → `useDraggable`, eliminado `index` |
| 3+4 | `TodoOverlay.tsx` | Sync con Todo |
| 3+4 | `Card.tsx` | Eliminado `index={idx}` |
| 3+4 | `InBoxCard.tsx` | Eliminado `index={idx}` |
