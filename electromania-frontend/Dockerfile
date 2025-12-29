# Dockerfile.dev
FROM node:20-alpine

RUN addgroup -S app && adduser -S app -G app

WORKDIR /usr/src/app


COPY package*.json ./

RUN npm install

# Copia todo
COPY . .

RUN chown -R app:app /usr/src/app

USER app

# Expone el puerto de NestJS
EXPOSE 4200


CMD ["npm","run","start:dev"]
