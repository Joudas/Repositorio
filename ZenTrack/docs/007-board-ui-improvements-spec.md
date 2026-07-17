# Especificación: Board UI Improvements

## 1. InBox redimensionable

### Estado actual
`InBox.tsx` tiene ancho fijo `w-[22%]`. No hay forma de cambiar el tamaño. El layout padre usa `flex flex-1`, por lo que el espacio restante se lo lleva `Main`.

### Cambio
- Reemplazar `w-[22%]` fijo por un ancho controlado por estado React + drag handle en el borde derecho.
- El drag handle será un div invisible de 4px en el borde derecho del InBox, que al hacer `mousedown` activa el seguimiento del mouse.
- Se usa `useEffect` con listener `mousemove`/`mouseup` en `document` para cambiar el ancho mientras se arrastra.
- El ancho mínimo es `200px` y máximo `50vw` (mitad de la pantalla).

### Archivos a modificar
- `Frontend/src/features/board/components/InBox.tsx`
- `Frontend/src/features/board/BoardScreen.tsx` (pasar ancho como prop o que InBox lo maneje internamente con estado local)

### Interfaces

No se requieren cambios de tipos existentes. El InBox mantiene su ancho como estado interno.

---

## 2. Persistencia en autenticación

### Estado actual
- `authStore.ts` usa Zustand en memoria. Al recargar la página, `user` arranca como `null` y `isLoading` como `true`.
- `checkSession()` llama `GET /api/auth/me` en el mount del `AppWrapper`, y el token JWT HttpOnly se envía automáticamente con `credentials: "include"`.
- Funcionalmente ya hay persistencia (la cookie HttpOnly sobrevive refrescos), pero hay un *flash* de carga (spinner) en cada recarga hasta que `getMe()` responde.

### Cambio
- Agregar `zustand/middleware` persist con `localStorage` para guardar el objeto `user`.
- En `authStore`, envolver el store con `persist`:
  - `name: "zentrack-auth"`.
  - Solo persistir `user` (no `isLoading`).
- Modificar `isLoading` para que arranque en `false` si ya hay `user` persistido, y `true` si no.
- `checkSession()` se ejecuta igual en el mount: si el token expiró, limpia `user` del store (y por lo tanto de localStorage).

### Archivos a modificar
- `Frontend/src/stores/authStore.ts`

---

## 3. Login/Register redirige a /board

### Estado actual
- `LoginScreen.tsx`: `navigate("/board")` está **comentado** dentro de un `setTimeout` innecesario de 1 segundo.
- `RegisterScreen.tsx`: ya navega a `/board` en `onSuccess`.

### Cambio
- En `LoginScreen.tsx`:
  - Eliminar el `setTimeout`.
  - Descomentar `navigate("/board")` en el `onSuccess` del mutation.
  - Asegurar que el navigation ocurra después de setear el estado del store.

### Archivos a modificar
- `Frontend/src/features/auth/login/LoginScreen.tsx`

---

## 4. SVG para "Switch Board" en InBoxBar

### Estado actual
`InBoxBar.tsx` usa el mismo icono `<TbInbox />` para los botones "InBox" y "Switch Board". El botón "Switch Board" tiene la condición `false` hardcodeada para su estado activo.

### Cambio
- Reemplazar el `<TbInbox />` del botón "Switch Board" por `<TbLayoutBoard />` (o `<TbArrowsShuffle />`) de `react-icons/tb`.
- El icono debe representar visualmente "cambiar de board".

### Archivos a modificar
- `Frontend/src/features/board/components/InBoxBar.tsx`

---

## 5. motion li: animación hover con checkbox redondo

### Estado actual
`Card.tsx` tiene un `motion.li` con:
- `containerVariants` vacío (rest: {}, hover: {}).
- `checkboxVariants`: checkbox aparece desde x: -20 con spring.
- `textVariants`: texto se mueve x: 0 → x: 12 en hover.

**Problemas:**
1. **Doble `whileHover`**: tanto el `motion.div` padre como el `motion.li` hijo tienen `whileHover="hover"`, lo que causa conflicto en la propagación de variantes.
2. **Checkbox no redondo**: el contenedor del checkbox usa `rounded` (border radius genérico de Tailwind ~4px), no `rounded-full`.
3. **Sin separación visual**: el texto y checkbox compiten por espacio porque el `overflow-hidden` del `li` y las posiciones absolutas no están bien coordinadas.
4. **Estructura anidada innecesaria**: el `motion.div` externo y el `motion.li` pueden simplificarse a un solo elemento.

### Cambio

**Simplificar estructura del card:**
- Eliminar el `motion.div` externo (el que wrappea el li). Mover `whileHover` al `motion.li` directamente.
- Un solo nivel de `variants`.

**Corregir checkbox:**
- Contenedor del checkbox: cambiar `rounded` por `rounded-full`.
- Tamaño: `w-5 h-5` está bien, pero con `rounded-full` + `flex items-center justify-center` se ve circular.

**Corregir animación del texto:**
- Mantener `x: 0` → `x: 8` (reducido de 12 para que no se salga del contenedor).
- El texto se mueve a la derecha para dar espacio al checkbox.
- Asegurar que el `li` tenga `overflow-hidden` para ocultar el checkbox cuando no está en hover.

**Ajustar variantes:**
- Pasar `containerVariants` al `motion.li` como variante principal.
- `checkboxVariants` y `textVariants` son hijos de `containerVariants` y responden al estado `hover` heredado.

### Archivos a modificar
- `Frontend/src/features/board/components/Card.tsx`

---

## Orden de implementación sugerido

1. **Login redirect** (cambio mínimo, descomentar 1 línea)
2. **Persistencia auth** (zustand persist, +1 import)
3. **SVG Switch Board** (reemplazar 1 icono)
4. **InBox redimensionable** (nueva lógica de drag)
5. **motion li animation** (reestructurar variantes)

---

¿Apruebas esta especificación?
