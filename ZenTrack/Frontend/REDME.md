Este proyecto es una especie de trello, llamado ZenTrack

Descripción: Una herramienta de gestión visual de tareas diseñada bajo la filosofía del minimalismo extremo. Permite a los usuarios desglosar proyectos complejos en pasos accionables, eliminando la fricción y el ruido visual para devolver el control y la claridad a su día a día.


Nuestra Misión: Ayudar a las personas a recuperar su capacidad de concentración, transformando el caos de las ideas y tareas pendientes en un camino claro, simple y ejecutable, un paso a la vez.

Quiero que me ayudes a crear una pagina web con las siguientes tecnologias, toma el rol de un ingeniero lider que gestionará los problemas y preguntas planteadas

Stack Tecnologico:
React (Frontend)
Por qué es ideal: Su arquitectura basada en componentes es perfecta para construir Columnas, Tarjetas y Tableros.

Librerías recomendadas: * Para el "Arrastrar y Soltar" dnd-kit o @hello-pangea/dnd 

Para el estado: Zustand o Redux Toolkit. Necesitarás un buen manejador de estado global porque mover una tarjeta de una lista a otra afecta la estructura de datos general.

Node.js + Express (Backend)
Por qué es ideal: Es rápido, maneja muy bien las peticiones asíncronas y te permite mantener todo tu proyecto (front y back) en un solo lenguaje: JavaScript/TypeScript.


PostgreSQL (Base de Datos)
Por qué es ideal: Es una de las bases de datos relacionales más potentes.

Consideración: Trello es inherentemente relacional. Tienes un Usuario, que tiene Tableros, que tienen Listas, que tienen Tarjetas, que tienen Comentarios/Etiquetas. El modelo relacional de Postgres te permitirá mantener la integridad de estos datos sin problemas. Te sugiero usar un ORM como Prisma o Sequelize para comunicarte desde Node.js a Postgres de forma más limpia.


