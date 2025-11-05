# Dockerfile para producción
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar TODAS las dependencias (incluyendo devDependencies para compilar)
RUN npm ci

# Copiar código fuente
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Limpiar dependencias de desarrollo (opcional, para reducir tamaño de imagen)
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "start"]


