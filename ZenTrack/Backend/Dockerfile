# 1. Usamos una versión ligera y moderna de Node.js
FROM node:20-alpine

# 2. Creamos y definimos el directorio de trabajo en el contenedor
WORKDIR /app

# 3. Copiamos los archivos de configuración de dependencias
#    Incluimos prisma.config.ts porque Prisma 7 lo necesita para generate
COPY package.json pnpm-lock.yaml* prisma.config.ts ./

# 4. Instalamos pnpm de forma global e instalamos las dependencias
RUN npm install -g pnpm && pnpm install

# 5. Copiamos la carpeta de Prisma (schema + migrations)
COPY prisma ./prisma

# 6. Generamos el Prisma Client dentro del contenedor
RUN pnpm prisma generate

# 7. Copiamos el resto del código fuente del backend
COPY . .

# 8. Compilamos el código de TypeScript a JavaScript de producción
RUN pnpm run build

# 9. Eliminamos dependencias de desarrollo (solo queda lo necesario para correr)
RUN pnpm prune --prod && rm -rf src/ tsconfig.json

# 10. Exponemos el puerto en el que correrá Express (configurable con PORT)
EXPOSE 3001

# 11. Comando para arrancar la aplicación en producción
CMD ["pnpm", "run", "start"]
