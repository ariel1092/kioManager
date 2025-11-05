# Dockerfile para producción
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Generar Prisma Client
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]

