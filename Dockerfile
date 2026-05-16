# Usa una imagen base oficial de Node.js
FROM node:18-alpine AS builder

WORKDIR /app

# Copia los archivos de configuración
COPY package.json package-lock.json* ./

# Instala las dependencias
RUN npm ci

# Copia el resto del código
COPY . .

# Construye la aplicación Next.js
RUN npm run build

# Imagen de producción
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV PORT 4000

# Copia los archivos necesarios desde el builder
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
