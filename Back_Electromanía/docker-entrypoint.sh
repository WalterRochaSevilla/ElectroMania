#!/bin/sh
set -e

echo "🚀 Starting Electromania Backend..."



if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "🔄 Ejecutando migraciones..."
    cd /app && node node_modules/prisma/build/index.js migrate deploy
    echo "✅ Migraciones completadas"
fi

echo "🎯 Iniciando aplicación..."
exec node dist/src/main.js