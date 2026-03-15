######################
### DEVELOPMENT ######
######################
FROM node:20-alpine AS development
WORKDIR /usr/src/app

RUN apk add --no-cache \
    bash \
    netcat-openbsd \
    libc6-compat

RUN npm install -g pnpm

COPY pnpm-lock.yaml package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate

ENV NODE_ENV=development

EXPOSE 3000

CMD ["pnpm", "start:dev"]