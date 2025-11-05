#!/bin/bash

# Script de setup inicial para el sistema de kiosco
# Este script ayuda a configurar el sistema rápidamente

echo "🚀 Configurando Sistema de Gestión de Kiosco"
echo "=============================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar Node.js
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado. Por favor instálalo primero.${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js encontrado: $NODE_VERSION${NC}"
echo ""

# Verificar PostgreSQL
echo "🐘 Verificando PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL no encontrado en PATH. Verifica que esté instalado.${NC}"
else
    echo -e "${GREEN}✅ PostgreSQL encontrado${NC}"
fi
echo ""

# Instalar dependencias del backend
echo "📥 Instalando dependencias del backend..."
if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✅ Dependencias del backend instaladas${NC}"
else
    echo -e "${RED}❌ No se encontró package.json${NC}"
    exit 1
fi
echo ""

# Verificar archivo .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  No se encontró archivo .env${NC}"
    echo "Por favor crea un archivo .env con:"
    echo "DATABASE_URL=\"postgresql://usuario:password@localhost:5432/sistema_kiosco?schema=public\""
    echo "PORT=3000"
    echo "NODE_ENV=development"
    echo "JWT_SECRET=tu-secret-key-super-segura"
    echo "JWT_EXPIRES_IN=24h"
    echo ""
    read -p "¿Deseas continuar sin .env? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ Archivo .env encontrado${NC}"
fi
echo ""

# Generar Prisma Client
echo "🔧 Generando Prisma Client..."
npm run db:generate
echo -e "${GREEN}✅ Prisma Client generado${NC}"
echo ""

# Ejecutar migraciones
echo "🗄️  Ejecutando migraciones de base de datos..."
read -p "¿Ejecutar migraciones ahora? (s/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    npm run db:migrate
    echo -e "${GREEN}✅ Migraciones ejecutadas${NC}"
else
    echo -e "${YELLOW}⚠️  Migraciones no ejecutadas. Ejecuta manualmente: npm run db:migrate${NC}"
fi
echo ""

# Instalar dependencias del frontend
echo "📥 Instalando dependencias del frontend..."
if [ -d "frontend" ]; then
    cd frontend
    npm install
    cd ..
    echo -e "${GREEN}✅ Dependencias del frontend instaladas${NC}"
else
    echo -e "${YELLOW}⚠️  Carpeta frontend no encontrada${NC}"
fi
echo ""

echo -e "${GREEN}✨ Setup completado!${NC}"
echo ""
echo "Próximos pasos:"
echo "1. Asegúrate de que PostgreSQL esté corriendo"
echo "2. Crea la base de datos: createdb sistema_kiosco"
echo "3. Ejecuta las migraciones: npm run db:migrate"
echo "4. Crea un usuario inicial (ver GUIA_PRUEBAS.md)"
echo "5. Inicia el backend: npm run dev"
echo "6. Inicia el frontend: cd frontend && npm run dev"
echo ""
echo "Para más información, consulta GUIA_PRUEBAS.md"



