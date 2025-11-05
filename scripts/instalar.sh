#!/bin/bash
# Script de Instalación para Linux/Mac
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
echo -e "${CYAN}  Instalación Automatizada${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Verificar Node.js
echo -e "${YELLOW}🔍 Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js encontrado: $NODE_VERSION${NC}"

# Verificar versión mínima (18+)
NODE_MAJOR=$(node --version | sed 's/v\([0-9]*\).*/\1/')
if [ "$NODE_MAJOR" -lt 18 ]; then
    echo -e "${RED}❌ Se requiere Node.js 18 o superior. Versión actual: $NODE_VERSION${NC}"
    exit 1
fi

# Verificar npm
echo -e "${YELLOW}🔍 Verificando npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado.${NC}"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ npm encontrado: $NPM_VERSION${NC}"

# Verificar PostgreSQL
echo -e "${YELLOW}🔍 Verificando PostgreSQL...${NC}"
if command -v psql &> /dev/null; then
    PG_VERSION=$(psql --version)
    echo -e "${GREEN}✅ PostgreSQL encontrado: $PG_VERSION${NC}"
elif pg_isready -h localhost -p 5432 &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL parece estar corriendo${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL no se encontró en PATH.${NC}"
    echo -e "${YELLOW}   Opciones:${NC}"
    echo -e "${YELLOW}   1. Instalar PostgreSQL desde https://www.postgresql.org/download/${NC}"
    echo -e "${YELLOW}   2. Usar Docker: docker-compose up -d db${NC}"
    read -p "   ¿Deseas continuar de todas formas? (S/N): " continue
    if [[ ! "$continue" =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Instalar dependencias del backend
echo ""
echo -e "${YELLOW}📦 Instalando dependencias del backend...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar dependencias del backend${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencias del backend instaladas${NC}"

# Instalar dependencias del frontend
echo -e "${YELLOW}📦 Instalando dependencias del frontend...${NC}"
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar dependencias del frontend${NC}"
    cd ..
    exit 1
fi
echo -e "${GREEN}✅ Dependencias del frontend instaladas${NC}"
cd ..

# Configurar variables de entorno
echo ""
echo -e "${YELLOW}⚙️  Configurando variables de entorno...${NC}"

if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creando archivo .env...${NC}"
    
    # Generar JWT_SECRET seguro
    JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
    
    cat > .env << EOF
# Base de Datos
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sistema_kiosco?schema=public"

# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=24h
EOF
    
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANTE: Edita .env y ajusta DATABASE_URL con tus credenciales de PostgreSQL${NC}"
else
    echo -e "${GREEN}✅ Archivo .env ya existe${NC}"
fi

# Configurar frontend .env.local
if [ ! -f frontend/.env.local ]; then
    echo -e "${YELLOW}📝 Creando archivo frontend/.env.local...${NC}"
    cat > frontend/.env.local << EOF
# API URL
VITE_API_URL=http://localhost:3000/api
EOF
    echo -e "${GREEN}✅ Archivo frontend/.env.local creado${NC}"
else
    echo -e "${GREEN}✅ Archivo frontend/.env.local ya existe${NC}"
fi

# Generar Prisma Client
echo ""
echo -e "${YELLOW}🔧 Generando Prisma Client...${NC}"
npm run db:generate
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al generar Prisma Client${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Prisma Client generado${NC}"

# Verificar base de datos y ejecutar migraciones
echo ""
echo -e "${YELLOW}🗄️  Configurando base de datos...${NC}"
echo -e "${YELLOW}⚠️  Asegúrate de que PostgreSQL esté corriendo y la base de datos 'sistema_kiosco' exista${NC}"
echo -e "${YELLOW}   Si no existe, créala con: createdb sistema_kiosco${NC}"
read -p "   ¿Deseas ejecutar las migraciones ahora? (S/N): " continue

if [[ "$continue" =~ ^[Ss]$ ]]; then
    echo -e "${YELLOW}🔄 Ejecutando migraciones...${NC}"
    npm run db:migrate
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Migraciones ejecutadas exitosamente${NC}"
        
        # Preguntar si desea ejecutar seed
        read -p "   ¿Deseas ejecutar el seed para datos de ejemplo? (S/N): " runSeed
        if [[ "$runSeed" =~ ^[Ss]$ ]]; then
            echo -e "${YELLOW}🌱 Ejecutando seed...${NC}"
            npm run db:seed
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✅ Seed ejecutado exitosamente${NC}"
            fi
        fi
        
        # Preguntar si desea crear usuario inicial
        read -p "   ¿Deseas crear un usuario dueño inicial? (S/N): " createUser
        if [[ "$createUser" =~ ^[Ss]$ ]]; then
            echo -e "${YELLOW}👤 Creando usuario inicial...${NC}"
            npm run create-user-dueno
        fi
    else
        echo -e "${RED}❌ Error al ejecutar migraciones. Verifica la conexión a la base de datos.${NC}"
    fi
else
    echo -e "${YELLOW}⏭️  Migraciones omitidas. Ejecuta manualmente: npm run db:migrate${NC}"
fi

# Resumen
echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}  ✅ Instalación Completada${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos pasos:${NC}"
echo -e "  1. Edita el archivo .env con tus credenciales de PostgreSQL"
echo -e "  2. Asegúrate de que la base de datos 'sistema_kiosco' exista"
echo -e "  3. Ejecuta las migraciones: npm run db:migrate"
echo -e "  4. Inicia el backend: npm run dev"
echo -e "  5. Inicia el frontend (en otra terminal): cd frontend && npm run dev"
echo ""
echo -e "${YELLOW}📚 Documentación:${NC}"
echo -e "  - README.md: Información general"
echo -e "  - QUICKSTART.md: Guía rápida"
echo -e "  - GUIA_INSTALACION.md: Guía detallada"
echo ""



