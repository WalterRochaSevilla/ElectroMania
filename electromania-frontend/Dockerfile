######################
### FRONTEND DEV #####
######################
FROM node:20-alpine As development

WORKDIR /usr/src/app

RUN apk add --no-cache libc6-compat netcat-openbsd

# npm global
RUN npm install -g npm@latest

# Copiamos solo manifests para cache
COPY package*.json ./

# Instalamos deps
RUN npm ci 

# Copiamos el resto del código
COPY . .

# Crear cache folder (opcional)
RUN mkdir -p /usr/src/app/.angular/cache

EXPOSE 4200

# ❌ SIN USER ❌
# ❌ SIN CMD ❌ (compose controla hot reload)
