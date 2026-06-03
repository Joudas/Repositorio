# Estándares de Desarrollo - Proyecto Web (React + MySQL)

## 🎨 Frontend (React + Tailwind)
- **Framework:** React con Vite (Priorizar componentes funcionales y Hooks).
- **Estilos:** Tailwind CSS siguiendo una metodología **Mobile-First**.
- **Componentes:** Crear componentes pequeños y reutilizables en `src/components`.
- **Estado:** Usar `useState` y `useContext` para estados globales sencillos (como el Auth).
- **Iconos:** Priorizar el uso de **Lucide React**.

## 🏗️ Arquitectura y Datos
- **Base de Datos:** MySQL. Las consultas deben ser optimizadas para evitar redundancia.
- **API:** Consumir el backend mediante **Fetch API** o **Axios** centralizado en un servicio.
- **Validaciones:** Usar lógica de validación tanto en cliente como en servidor.

## 🔑 Autenticación (JWT)
- Almacenar el token de forma segura (LocalStorage o Cookies según se defina).
- Implementar un **Higher Order Component (HOC)** o un **Private Route** para proteger las vistas del inventario.

## 🛠️ Reglas de Código
- **Idioma:** Código en ingles y comentarios en español (para consistencia con el equipo).
