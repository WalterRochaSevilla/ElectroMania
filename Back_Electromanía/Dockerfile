######################
### DEVELOPMENT ######
######################
FROM node:20-alpine AS development
WORKDIR /usr/src/app

# Dependencias básicas para desarrollo
RUN apk add --no-cache \
    bash \
    netcat-openbsd \
    libc6-compat

RUN mkdir -p /usr/src/app/uploads/tmp && \
    mkdir -p /usr/src/app/uploads/products

RUN npm install -g pnpm

# Solo copiar archivos de dependencias
COPY pnpm-lock.yaml package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate

# NO copiar el código fuente aquí (se monta como volumen)
# COPY . .

ENV NODE_ENV=development

EXPOSE 3000

# Comando por defecto (se sobrescribe en docker-compose)
CMD ["pnpm", "start:dev"]

######################
### TEST #############
######################
FROM node:20-alpine AS test
WORKDIR /usr/src/app

RUN apk add --no-cache libc6-compat

RUN npm install -g pnpm

COPY pnpm-lock.yaml package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate

COPY . .

CMD ["pnpm", "run", "test"]