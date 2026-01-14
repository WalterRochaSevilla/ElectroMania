FROM node:20-alpine AS development

WORKDIR /usr/src/app

RUN apk add --no-cache libc6-compat netcat-openbsd

# npm global
RUN npm install -g npm@latest

# ⚠️ IMPORTANTE: cambiar permisos
RUN chown -R node:node /usr/src/app

# 👇 USAR USUARIO NODE
USER node

# Copiamos solo manifests
COPY --chown=node:node package*.json ./

# Instalamos deps
RUN npm ci

# Copiamos el resto del código
COPY --chown=node:node . .

RUN mkdir -p /usr/src/app/.angular/cache

EXPOSE 4200
