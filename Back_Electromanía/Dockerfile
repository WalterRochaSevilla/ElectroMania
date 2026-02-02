FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Chromium + deps necesarias
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont


RUN mkdir -p /usr/src/app/uploads/tmp
RUN mkdir -p /usr/src/app/uploads/products


RUN apk add --no-cache libc6-compat netcat-openbsd
RUN npm install -g pnpm

COPY pnpm-lock.yaml package*.json ./
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile

RUN pnpm prisma generate

COPY . .

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

EXPOSE 3000

CMD ["pnpm", "start:dev"]

######################
### TEST ###########
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

# Ejecutar tests (sin build, sin dist)
CMD ["pnpm", "run", "test"]


######################
### BUILD ###########
######################
FROM node:20-alpine AS build

WORKDIR /usr/src/app

RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm

COPY pnpm-lock.yaml package.json ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

RUN pnpm prisma generate

COPY . .

RUN pnpm run build
RUN pnpm prune --prod


######################
### PRODUCTION ######
######################
FROM node:20-alpine AS production

WORKDIR /usr/src/app

RUN addgroup -S app && adduser -S app -G app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package.json ./

USER app

EXPOSE 3000

# ⚠️ prisma generate en runtime (ya con env)
CMD ["node","dist/main.js"]

