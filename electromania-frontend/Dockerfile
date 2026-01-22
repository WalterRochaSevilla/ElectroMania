######################
### DEVELOPMENT ######
######################
FROM node:20-alpine AS development

WORKDIR /usr/src/app

RUN apk add --no-cache libc6-compat netcat-openbsd

RUN npm install -g npm@latest

# copiar manifestos
COPY package.json package-lock.json ./

# instalar deps
RUN npm ci

# copiar código
COPY . .

# exponer puerto de angular
EXPOSE 4200

# comando para dev
CMD ["npm", "run", "start:dev"]



######################
### BUILD ###########
######################
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build --prod



######################
### PRODUCTION #######
######################
FROM nginx:alpine

# borrar config default
RUN rm /etc/nginx/conf.d/default.conf

# config SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copiar build
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
