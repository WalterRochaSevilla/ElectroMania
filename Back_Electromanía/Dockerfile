# Dockerfile.dev
FROM node:20-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm

# Instala dependencias
COPY pnpm-lock.yaml ./

COPY package*.json ./

COPY prisma ./prisma

RUN pnpm install

# Copia todo
COPY . .

# Expone el puerto de NestJS
EXPOSE 3000


CMD ["pnpm","run","start:dev"]
