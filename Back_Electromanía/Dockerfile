######################
### DEVELOPMENT ######
######################
FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Dependencias del sistema
RUN apk add --no-cache libc6-compat netcat-openbsd

# pnpm
RUN npm install -g pnpm

# ❌ SIN --chown
COPY pnpm-lock.yaml package*.json ./

COPY prisma ./prisma

# Dev deps
RUN pnpm install --frozen-lockfile

# Código (bind mount lo sobreescribe en runtime)
COPY . .

EXPOSE 3000
# ❌ SIN USER
# ❌ SIN CMD


######################
### BUILD ###########
######################
FROM node:20-alpine AS build

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY pnpm-lock.yaml package*.json ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate
RUN pnpm run build

ENV NODE_ENV=production
RUN pnpm install --prod --frozen-lockfile && pnpm cache clean --force


######################
### PRODUCTION #######
######################
FROM node:20-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

# ✅ usuario no-root SOLO en prod
RUN addgroup -S app && adduser -S app -G app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./

USER app

EXPOSE 3000
CMD ["node", "dist/main.js"]
