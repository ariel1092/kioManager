#!/bin/bash
# Script de Deployment para Producción
# Uso: ./scripts/deploy.sh

set -e

echo "🚀 Iniciando deployment..."

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Error: docker-compose.prod.yml no encontrado"
    exit 1
fi

# Verificar que existe .env
if [ ! -f ".env" ]; then
    echo "❌ Error: Archivo .env no encontrado"
    echo "Crea un archivo .env con las variables de entorno necesarias"
    exit 1
fi

# Detener contenedores anteriores
echo "🛑 Deteniendo contenedores anteriores..."
docker-compose -f docker-compose.prod.yml down

# Construir imágenes
echo "🔨 Construyendo imágenes..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Ejecutar migraciones
echo "🗄️  Ejecutando migraciones..."
docker-compose -f docker-compose.prod.yml run --rm backend npx prisma migrate deploy

# Iniciar servicios
echo "▶️  Iniciando servicios..."
docker-compose -f docker-compose.prod.yml up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado
echo "📊 Estado de los servicios:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "✅ Deployment completado!"
echo ""
echo "📋 Próximos pasos:"
echo "  1. Verificar logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  2. Probar API: curl http://localhost:3000/api/health"
echo "  3. Probar Frontend: http://localhost:5173"


