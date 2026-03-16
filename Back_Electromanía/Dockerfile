FROM node:20-alpine AS development

WORKDIR /usr/src/app

RUN apk add --no-cache bash netcat-openbsd libc6-compat git

RUN npm install -g pnpm

# Reemplaza 1000 con tu UID del host si es diferente
ARG UID=1000
RUN deluser node && adduser -u ${UID} -D -h /home/node node

COPY pnpm-lock.yaml package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate

#RUN ls -ld /usr/src/app && getfacl /usr/src/app

USER node

ENV NODE_ENV=development
EXPOSE 3000
CMD ["pnpm", "start:dev"]