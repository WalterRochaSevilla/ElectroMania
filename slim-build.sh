#!/bin/bash

set -e

echo "🧹 Limpiando directorios temporales y cache de Docker..."

# Limpiar /tmp/mint-state (puede ocupar varios GB)
sudo rm -rf /tmp/mint-state /tmp/.mint-state 2>/dev/null || true

# Limpiar directorio temporal personalizado si existe
rm -rf /home/matheo/docker-tmp/mint-state 2>/dev/null || true

# Limpiar build cache de Docker para liberar espacio
echo "🗑️  Limpiando build cache de Docker..."
docker builder prune -f

# Crear directorio temporal en /home (donde hay más espacio)
mkdir -p /home/matheo/docker-tmp/mint-state

echo ""
echo "💾 Espacio disponible antes del build:"
df -h /tmp | tail -1
df -h /home | tail -1
echo ""
docker system df

if [ ! -f .prod.env ]; then
  echo "❌ Archivo .env no encontrado"
  exit 1
fi

# echo "🔨 Construyendo imagen de producción..."
# docker-compose -f docker-compose.prod.yml build --no-cache

echo ""
echo "📦 Optimizando produccion con docker-slim..."

docker-slim build \
  --target electromania-backend:latest \
  --tag electromania-backend:slim \
  --network electromania_app-network \
  --http-probe=true \
  --http-probe-cmd='GET:/health' \
  --http-probe-cmd='POST:/auth/login' \
  --env-file .prod.env \
  --continue-after=20 \
  --show-clogs \
  --include-path=/app/dist \
  --include-path=/app/node_modules/@prisma \
  --include-path=/app/node_modules/.prisma \
  --include-path=/app/node_modules/prisma \
  --include-path=/app/node_modules/.pnpm/iconv-lite@0.7.2 \
  --include-path=/app/node_modules/.pnpm/raw-body@3.0.2 \
  --include-path=/app/node_modules/.pnpm/body-parser@2.2.2 \
  --include-path=/app/node_modules/.pnpm/@nestjs+platform-express@11.1.13_@nestjs+common@11.1.13_class-transformer@0.5.1_class-v_8a6890e94319366d15d9052fb39c8aca \
  --include-path=/app/prisma \
  --include-path=/app/uploads \
  --include-path=/app/docker-entrypoint.sh \
  --include-exe=/usr/local/bin/node \
  --include-exe=/usr/bin/dumb-init \
  --include-exe=/bin/nc

echo ""
echo "✅ Imagen optimizada creada: electromania-backend:slim"
echo ""
echo "📊 Comparación de tamaños:"
docker images electromania-backend --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}"


echo "Optimizando Frontend..."
docker-slim build \
           --target electromania-frontend:latest \
           --tag electromania-frontend:slim \
           --network electromania_app-network \
           --env-file .prod.env \
           --http-probe=true \
           --http-probe-cmd='GET:/health' \
           --continue-after=20 \
           --show-clogs \
           --include-path=/app/node_modules \
           --include-path=/app/dist \
           --include-path=/app/prisma \
           --include-path=/app/uploads \
           --include-exe=/usr/local/bin/node \
           --include-exe=/usr/bin/dumb-init \
           --include-exe=/bin/sh \
           --include-exe=/bin/nc

echo ""
echo "✅ Imagen optimizada creada: electromania-backend:slim"
echo ""
echo "📊 Comparación de tamaños:"
docker images electromania-frontend --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}"

echo ""
echo "🧹 Limpiando después del build..."

# Limpiar archivos temporales de docker-slim
rm -rf /home/matheo/docker-tmp/mint-state

# Eliminar imagen no optimizada (opcional, descomenta si quieres)
# echo "🗑️  Eliminando imagen no optimizada..."
# docker rmi electromania-backend:latest

# Limpiar imágenes dangling (sin tag)
echo "🗑️  Limpiando imágenes sin usar..."
docker image prune -f

# Limpiar build cache nuevamente
echo "🗑️  Limpiando build cache..."
docker builder prune -f

echo ""
echo "💾 Espacio disponible después de la limpieza:"
df -h /tmp | tail -1
df -h /home | tail -1
echo ""
docker system df