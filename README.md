# 🚀 Fullstack Application – Deployment Guide

Repositorio oficial del proyecto.  
Este documento describe **de forma clara y obligatoria** cómo configurar y desplegar la aplicación en **desarrollo** y **producción**, con o sin Docker.

---

## 📌 Tabla de Contenidos

- [🚀 Fullstack Application – Deployment Guide](#-fullstack-application--deployment-guide)
  - [📌 Tabla de Contenidos](#-tabla-de-contenidos)
  - [📦 Requisitos](#-requisitos)
    - [Sin Docker](#sin-docker)
    - [Con Docker (Recomendado)](#con-docker-recomendado)
  - [🔐 Variables de Entorno](#-variables-de-entorno)
    - [Archivos requeridos por entorno](#archivos-requeridos-por-entorno)
  - [▶️ Ejecución sin Docker](#️-ejecución-sin-docker)
    - [Orden de ejecución (OBLIGATORIO)](#orden-de-ejecución-obligatorio)
  - [🐳 Ejecución con Docker (Recomendado)](#-ejecución-con-docker-recomendado)
    - [Desarrollo](#desarrollo)
    - [Producción](#producción)
  - [🧬 Optimización de Imágenes (Docker Slim)](#-optimización-de-imágenes-docker-slim)
    - [Requisitos](#requisitos)
    - [Flujo correcto (OBLIGATORIO)](#flujo-correcto-obligatorio)
  - [✅ Buenas Prácticas](#-buenas-prácticas)
  - [🛑 Notas Importantes](#-notas-importantes)

---

## 📦 Requisitos

### Sin Docker

- Node.js (versión definida por el proyecto)
- Gestor de paquetes (`npm` o `pnpm`)
- Base de datos instalada y corriendo
- Acceso a variables de entorno

### Con Docker (Recomendado)

- Docker
- Docker Compose
- (Opcional) `docker-slim`

---

## 🔐 Variables de Entorno

⚠️ **La aplicación NO iniciará sin un archivo `.env` válido.**

### Archivos requeridos por entorno

| Entorno | Archivo |
| :------: | :-------: |
| Desarrollo | `.dev.env` |
| Producción | `.prod.env` |

Existe un archivo de referencia:

```bash
.env.template
````

Este archivo define **todas las variables necesarias** y debe usarse como base:

```bash
cp .env.template .dev.env
cp .env.template .prod.env
```

❌ **Nunca subir a GitHub**:

- `.dev.env`
- `.prod.env`

---

## ▶️ Ejecución sin Docker

Este método es recomendado **solo para desarrollo local**.

### Orden de ejecución (OBLIGATORIO)

1. ### Levantar la base de datos

   - La base de datos debe estar activa antes de iniciar el backend.
   - Las credenciales deben coincidir con `.dev.env`.

2. ### Iniciar el Backend

   ```bash
   cd backend
   npm install
   npm run start
   ```

3. ### Ejecutar migraciones

   > El backend debe estar correctamente conectado.

   ```bash
   npx prisma migrate deploy
   ```

   *(o el sistema de migraciones configurado en el proyecto)*

4. ### Iniciar el Frontend

   ```bash
   cd frontend
   npm install
   npm run start
   ```

---

## 🐳 Ejecución con Docker (Recomendado)

Este método asegura consistencia entre entornos y es el **flujo recomendado para producción**.

### Desarrollo

```bash
docker compose -f docker-compose.dev.yml up --build
```

### Producción

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Esto levantará automáticamente:

- Base de datos
- Backend
- Frontend
- Redes y volúmenes necesarios

---

## 🧬 Optimización de Imágenes (Docker Slim)

Para producción, se pueden generar **imágenes Docker optimizadas**.

### Requisitos

- `docker-slim` instalado
- Permiso de ejecución para el script

```bash
chmod +x slim-build.sh
```

### Flujo correcto (OBLIGATORIO)

1. **Levantar producción**

   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

2. **Generar imágenes slim**

   ```bash
   ./slim-build.sh
   ```

Resultado:

- Imágenes más livianas
- Menor superficie de ataque
- Mejor rendimiento
- Funcionamiento estable

---

## ✅ Buenas Prácticas

- Usar Docker para evitar inconsistencias
- Mantener secretos fuera del repositorio
- Versionar únicamente `.env.template`
- Verificar migraciones antes de producción
- Optimizar imágenes solo en entornos estables

---

## 🛑 Notas Importantes

- El orden de arranque **no es opcional**
- Producción **requiere** `.prod.env`
- Docker Slim **requiere contenedores activos**
- No se recomienda producción sin Docker

---

📌 **Antes de realizar cualquier deploy en producción, revisa este README completo.**
