######################
### DEVELOPMENT ######
######################
FROM node:20-alpine AS development

WORKDIR /usr/src/app

RUN apk add --no-cache \
  libc6-compat \
  netcat-openbsd \
  bash

RUN npm install -g npm@latest

# Instalar deps
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

EXPOSE 4200

CMD ["npm", "run", "start:dev"]
