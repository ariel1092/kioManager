# 🏪 Sistema de Gestión de Kiosco

Sistema integral de gestión para kiosco con control completo de stock, ventas, ganancias, proveedores y mercadería vencida.

## 🎯 Características

- ✅ **Backend**: API REST con arquitectura hexagonal (Node.js + TypeScript + Express + PostgreSQL)
- ✅ **Frontend**: Interfaz moderna con React + TypeScript + Vite + Tailwind CSS
- ✅ **Control de Stock**: Gestión completa de inventario con alertas de stock bajo
- ✅ **Control de Vencimientos**: Seguimiento de lotes vencidos y próximos a vencer
- ✅ **Ventas**: Registro de transacciones con cálculo automático de ganancias
- ✅ **Proveedores**: Gestión de relaciones comerciales
- ✅ **Reportes**: Análisis de ganancias y métricas financieras

## 🏗️ Arquitectura

Este proyecto sigue una **Arquitectura Hexagonal (Puertos y Adaptadores)**, garantizando:

- **Separación clara de responsabilidades**
- **Testabilidad**
- **Escalabilidad**
- **Mantenibilidad**

### Estructura del Proyecto

```
sistema-kiosco/
├── src/                    # Backend (API REST)
│   ├── domain/             # Capa de Dominio
│   ├── application/        # Capa de Aplicación
│   ├── infrastructure/     # Capa de Infraestructura
│   └── shared/             # Utilidades compartidas
├── frontend/               # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── services/       # Servicios de API
│   │   └── types/          # Tipos TypeScript
│   └── package.json
├── prisma/
│   └── schema.prisma       # Esquema de base de datos
└── package.json
```

## 🚀 Inicio Rápido

### Instalación Automatizada (Recomendado)

#### Windows (PowerShell)
```powershell
.\scripts\instalar.ps1
```

#### Windows (Command Prompt)
```cmd
scripts\instalar.bat
```

#### Linux/Mac
```bash
chmod +x scripts/instalar.sh
./scripts/instalar.sh
```

#### Con Docker (todas las plataformas)

**Solo base de datos (desarrollo):**
```bash
# Windows PowerShell
.\scripts\instalar-docker.ps1

# Linux/Mac
chmod +x scripts/instalar-docker.sh
./scripts/instalar-docker.sh
```

**O manualmente:**
```bash
# Solo base de datos
docker-compose -f docker-compose.dev.yml up -d db

# Aplicación completa
docker-compose up -d
```

### Instalación Manual

#### Prerrequisitos

- Node.js 18+
- PostgreSQL 14+ (o Docker)
- npm o yarn

#### Pasos

1. **Instalar dependencias:**
```bash
npm install
cd frontend && npm install && cd ..
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
```

3. **Generar Prisma Client:**
```bash
npm run db:generate
```

4. **Ejecutar migraciones:**
```bash
npm run db:migrate
```

5. **Crear usuario inicial (opcional):**
```bash
npm run create-user-dueno
```

6. **Iniciar servidores:**

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

El backend estará disponible en `http://localhost:3000`  
El frontend estará disponible en `http://localhost:5173`

## 📚 Módulos del Sistema

### 1. Productos y Stock
- Gestión de inventario
- Control de vencimientos
- Alertas de stock bajo
- Categorización de productos

### 2. Proveedores
- CRUD de proveedores
- Historial de compras
- Evaluación de proveedores

### 3. Ventas
- Registro de transacciones
- Cálculo automático de ganancias
- Reportes de ventas

### 4. Reportes
- Análisis de ganancias
- Productos vencidos
- Métricas de rendimiento

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Compila TypeScript
- `npm run start` - Inicia servidor de producción
- `npm test` - Ejecuta tests
- `npm run db:migrate` - Ejecuta migraciones
- `npm run db:studio` - Abre Prisma Studio

## 🔒 Seguridad

- Validación de datos con Zod
- Type safety con TypeScript
- Preparado para autenticación JWT

## 📄 Licencia

MIT

