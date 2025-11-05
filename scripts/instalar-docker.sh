#!/bin/bash
# Script de Instalación con Docker (Linux/Mac)
# Sistema de Gestión de Kiosco

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Sistema de Gestión de Kiosco${NC}"
echo -e "${CYAN}  Instalación con Docker${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Verificar Docker
echo -e "${YELLOW}🔍 Verificando Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado. Por favor instálalo desde https://www.docker.com/get-started${NC}"
    exit 1
fi

DOCKER_VERSION=$(docker --version)
echo -e "${GREEN}✅ Docker encontrado: $DOCKER_VERSION${NC}"

# Verificar Docker Compose
echo -e "${YELLOW}🔍 Verificando Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose no está instalado.${NC}"
    exit 1
fi

COMPOSE_VERSION=$(docker-compose --version)
echo -e "${GREEN}✅ Docker Compose encontrado: $COMPOSE_VERSION${NC}"

# Verificar que Docker esté corriendo
echo -e "${YELLOW}🔍 Verificando que Docker esté corriendo...${NC}"
if ! docker ps &> /dev/null; then
    echo -e "${RED}❌ Docker no está corriendo. Por favor inicia el servicio de Docker.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker está corriendo${NC}"

# Configurar variables de entorno si no existen
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creando archivo .env para Docker...${NC}"
    
    # Generar JWT_SECRET seguro
    JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
    
    cat > .env << EOF
# Base de Datos (Docker usa estas credenciales)
DATABASE_URL="postgresql://postgres:postgres@db:5432/sistema_kiosco?schema=public"

# Servidor
PORT=3000
NODE_ENV=production

# JWT
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=24h
EOF
    
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
fi

# Preguntar modo de instalación
echo ""
echo -e "${YELLOW}Selecciona el modo de instalación:${NC}"
echo "  1. Solo base de datos (recomendado para desarrollo)"
echo "  2. Aplicación completa (backend + base de datos)"
read -p "  Opción (1 o 2): " mode

if [ "$mode" = "1" ]; then
    echo ""
    echo -e "${YELLOW}🐳 Iniciando solo la base de datos...${NC}"
    docker-compose -f docker-compose.dev.yml up -d db
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Base de datos iniciada${NC}"
        echo ""
        echo -e "${YELLOW}📋 Próximos pasos:${NC}"
        echo "  1. Instala dependencias: npm install"
        echo "  2. Instala dependencias del frontend: cd frontend && npm install"
        echo "  3. Genera Prisma Client: npm run db:generate"
        echo "  4. Ejecuta migraciones: npm run db:migrate"
        echo "  5. Inicia el backend: npm run dev"
        echo "  6. Inicia el frontend (en otra terminal): cd frontend && npm run dev"
    else
        echo -e "${RED}❌ Error al iniciar la base de datos${NC}"
        exit 1
    fi
elif [ "$mode" = "2" ]; then
    echo ""
    echo -e "${YELLOW}🐳 Iniciando aplicación completa...${NC}"
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Aplicación iniciada${NC}"
        echo ""
        echo -e "${YELLOW}📋 Información:${NC}"
        echo "  - Backend: http://localhost:3000"
        echo "  - Base de datos: localhost:5432"
        echo ""
        echo "Para ver los logs:"
        echo "  docker-compose logs -f app"
    else
        echo -e "${RED}❌ Error al iniciar la aplicación${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Opción inválida${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}  ✅ Instalación con Docker Completada${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""


