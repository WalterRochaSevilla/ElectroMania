######################
### DEVELOPMENT ######
######################
FROM node:20-alpine AS development
WORKDIR /usr/src/app

# Chromium ligero para desarrollo
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    bash \
    netcat-openbsd \
    libc6-compat

RUN mkdir -p /usr/src/app/uploads/tmp && \
    mkdir -p /usr/src/app/uploads/products

RUN npm install -g pnpm

COPY pnpm-lock.yaml package*.json ./
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate

COPY . .

# Usar Chromium de Alpine
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

EXPOSE 3000

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

RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate

COPY . .

CMD ["pnpm", "run", "test"]

######################
### BUILD ############
######################
FROM node:20-alpine AS build
WORKDIR /usr/src/app

RUN apk add --no-cache libc6-compat openssl

RUN npm install -g pnpm

RUN pnpm config set network-timeout 300000 && \
    pnpm config set fetch-retries 5 && \
    pnpm config set fetch-retry-mintimeout 20000 && \
    pnpm config set fetch-retry-maxtimeout 120000

COPY pnpm-lock.yaml package.json ./
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile || \
    (sleep 10 && pnpm install --frozen-lockfile) || \
    (sleep 30 && pnpm install --frozen-lockfile)

RUN pnpm exec prisma generate

COPY . .

RUN pnpm run build

RUN pnpm store prune

######################
### DEPS PROD ########
######################
FROM node:20-alpine AS dependencies
WORKDIR /usr/src/app

RUN apk add --no-cache libc6-compat openssl

RUN npm install -g pnpm

RUN pnpm config set network-timeout 300000 && \
    pnpm config set fetch-retries 5 && \
    pnpm config set fetch-retry-mintimeout 20000 && \
    pnpm config set fetch-retry-maxtimeout 120000

COPY pnpm-lock.yaml package.json ./
COPY prisma ./prisma

RUN pnpm install --prod --frozen-lockfile

RUN pnpm exec prisma generate

######################
### PRODUCTION #######
######################
FROM ghcr.io/puppeteer/puppeteer:23.10.4 AS production

# La imagen oficial ya incluye:
# ✅ Chrome/Chromium optimizado
# ✅ Todas las dependencias
# ✅ Usuario no-root (pptruser)
# ✅ Debian base (más compatible)

WORKDIR /usr/src/app

# Instalar herramientas adicionales necesarias
USER root

RUN apt-get update && apt-get install -y \
    dumb-init \
    openssl \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Cambiar permisos para pptruser
RUN mkdir -p /usr/src/app/uploads/tmp /usr/src/app/uploads/products && \
    chown -R pptruser:pptruser /usr/src/app

USER pptruser

# Copiar node_modules de producción
COPY --chown=pptruser:pptruser --from=dependencies /usr/src/app/node_modules ./node_modules

# Copiar código compilado
COPY --chown=pptruser:pptruser --from=build /usr/src/app/dist ./dist
COPY --chown=pptruser:pptruser --from=build /usr/src/app/prisma ./prisma
COPY --chown=pptruser:pptruser --from=build /usr/src/app/package.json ./

# Script de inicio
COPY --chown=pptruser:pptruser docker-entrypoint.sh ./
USER root
RUN chmod +x docker-entrypoint.sh
USER pptruser

# Variables de entorno (ya configuradas en la imagen base)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# La imagen base ya define PUPPETEER_EXECUTABLE_PATH

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]