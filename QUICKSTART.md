# ⚡ Quick Start - Sistema de Gestión de Kiosco

Guía rápida para poner en marcha el sistema en 5 minutos.

## 🚀 Inicio Rápido

### 1️⃣ Instalar Dependencias

```bash
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

### 2️⃣ Configurar Base de Datos

```bash
# Crear base de datos
createdb sistema_kiosco

# O con psql:
psql -U postgres -c "CREATE DATABASE sistema_kiosco;"
```

### 3️⃣ Configurar Variables de Entorno

Crea `.env` en la raíz:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sistema_kiosco?schema=public"
PORT=3000
NODE_ENV=development
JWT_SECRET=mi-clave-secreta-super-segura-123
JWT_EXPIRES_IN=24h
```

⚠️ **Ajusta** `postgres:postgres` con tus credenciales de PostgreSQL.

### 4️⃣ Ejecutar Migraciones

```bash
npm run db:generate
npm run db:migrate
```

### 5️⃣ Crear Usuario Inicial

```bash
npm run create-user
```

O manualmente:
```bash
curl -X POST http://localhost:3000/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Dueño",
    "email": "dueño@kiosco.com",
    "password": "admin123",
    "rol": "DUENO"
  }'
```

### 6️⃣ Iniciar Servidores

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7️⃣ Acceder al Sistema

1. Abre: `http://localhost:5173`
2. Login con:
   - Email: `dueño@kiosco.com`
   - Password: `admin123`

## ✅ Verificación Rápida

```bash
# Health check
curl http://localhost:3000/api/health

# Debería responder: {"status":"ok","timestamp":"..."}
```

## 📚 Próximos Pasos

1. Crear productos y proveedores
2. Registrar tu primera venta
3. Ver reportes y métricas
4. Crear usuarios empleados

Para más detalles, consulta `GUIA_PRUEBAS.md`

