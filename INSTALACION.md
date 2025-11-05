# 🚀 Guía de Instalación Simplificada

Sistema de Gestión de Kiosco - Scripts de instalación automatizados.

## 📋 Índice

1. [Instalación Automatizada](#instalación-automatizada)
2. [Instalación con Docker](#instalación-con-docker)
3. [Instalación Manual](#instalación-manual)
4. [Troubleshooting](#troubleshooting)

---

## 🔧 Instalación Automatizada

### Windows

#### Opción 1: PowerShell (Recomendado)

```powershell
.\scripts\instalar.ps1
```

**Características:**
- ✅ Verifica Node.js, npm y PostgreSQL
- ✅ Instala dependencias del backend y frontend
- ✅ Crea archivos `.env` con valores predeterminados
- ✅ Genera Prisma Client
- ✅ Ejecuta migraciones (opcional)
- ✅ Ejecuta seed (opcional)
- ✅ Crea usuario inicial (opcional)

#### Opción 2: Command Prompt (Batch)

```cmd
scripts\instalar.bat
```

**Características:**
- ✅ Instala dependencias del backend y frontend
- ✅ Crea archivos `.env` con valores predeterminados
- ✅ Genera Prisma Client

### Linux/Mac

```bash
chmod +x scripts/instalar.sh
./scripts/instalar.sh
```

**Características:**
- ✅ Verifica Node.js, npm y PostgreSQL
- ✅ Instala dependencias del backend y frontend
- ✅ Crea archivos `.env` con valores predeterminados
- ✅ Genera JWT_SECRET seguro
- ✅ Genera Prisma Client
- ✅ Ejecuta migraciones (opcional)
- ✅ Ejecuta seed (opcional)
- ✅ Crea usuario inicial (opcional)

---

## 🐳 Instalación con Docker

### Windows (PowerShell)

```powershell
.\scripts\instalar-docker.ps1
```

### Linux/Mac

```bash
chmod +x scripts/instalar-docker.sh
./scripts/instalar-docker.sh
```

### Opciones de Docker

#### 1. Solo Base de Datos (Recomendado para desarrollo)

```bash
docker-compose -f docker-compose.dev.yml up -d db
```

**Ventajas:**
- ✅ Base de datos lista en segundos
- ✅ No necesitas instalar PostgreSQL localmente
- ✅ Desarrollo local con hot-reload
- ✅ Fácil de limpiar y reiniciar

**Después de iniciar la base de datos:**
```bash
# Instalar dependencias
npm install
cd frontend && npm install && cd ..

# Generar Prisma Client
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Iniciar backend
npm run dev

# En otra terminal, iniciar frontend
cd frontend && npm run dev
```

#### 2. Aplicación Completa (Producción)

```bash
docker-compose up -d
```

**Incluye:**
- ✅ Base de datos PostgreSQL
- ✅ Backend API
- ✅ Frontend (opcional, con profile `dev`)

**Ver logs:**
```bash
# Logs de todos los servicios
docker-compose logs -f

# Logs solo del backend
docker-compose logs -f app

# Logs solo de la base de datos
docker-compose logs -f db
```

**Detener servicios:**
```bash
docker-compose down
```

**Detener y eliminar volúmenes (⚠️ Borra datos):**
```bash
docker-compose down -v
```

---

## 📝 Instalación Manual

### Prerrequisitos

- **Node.js** 18 o superior
- **PostgreSQL** 14 o superior (o Docker)
- **npm** o **yarn**

### Paso 1: Instalar Dependencias

```bash
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

### Paso 2: Configurar Variables de Entorno

Crea `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sistema_kiosco?schema=public"
PORT=3000
NODE_ENV=development
JWT_SECRET=tu-clave-secreta-super-segura
JWT_EXPIRES_IN=24h
```

**Generar JWT_SECRET seguro:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Node.js (cualquier plataforma)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Crea `frontend/.env.local` (opcional):

```env
VITE_API_URL=http://localhost:3000/api
```

### Paso 3: Configurar Base de Datos

```bash
# Crear base de datos
createdb sistema_kiosco

# O con psql
psql -U postgres -c "CREATE DATABASE sistema_kiosco;"
```

### Paso 4: Generar Prisma Client

```bash
npm run db:generate
```

### Paso 5: Ejecutar Migraciones

```bash
npm run db:migrate
```

### Paso 6: Ejecutar Seed (Opcional)

```bash
npm run db:seed
```

Esto creará:
- ✅ Productos de ejemplo
- ✅ Proveedores de ejemplo
- ✅ Lotes de ejemplo
- ✅ Compras y pagos de ejemplo

### Paso 7: Crear Usuario Inicial

```bash
npm run create-user-dueno
```

O crear manualmente:
```bash
curl -X POST http://localhost:3000/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Dueño",
    "email": "dueno@kiosco.com",
    "password": "admin123",
    "rol": "DUENO"
  }'
```

### Paso 8: Iniciar Servidores

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Acceder al sistema:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

---

## 🔍 Troubleshooting

### Error: "Node.js no está instalado"

**Solución:**
1. Descargar Node.js desde https://nodejs.org/
2. Instalar versión LTS (18 o superior)
3. Reiniciar terminal/PowerShell
4. Verificar: `node --version`

### Error: "PostgreSQL no se encontró"

**Opciones:**
1. **Instalar PostgreSQL:**
   - Windows: https://www.postgresql.org/download/windows/
   - Linux: `sudo apt-get install postgresql` (Ubuntu/Debian)
   - Mac: `brew install postgresql`

2. **Usar Docker:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d db
   ```

### Error: "Cannot connect to database"

**Verificar:**
1. PostgreSQL está corriendo:
   ```bash
   # Windows
   Get-Service postgresql*
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. Credenciales en `.env` son correctas
3. Base de datos existe:
   ```bash
   psql -U postgres -l
   ```

4. Puerto 5432 está disponible

### Error: "Port 3000 already in use"

**Solución:**
1. Encontrar proceso:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Linux/Mac
   lsof -i :3000
   ```

2. Terminar proceso o cambiar puerto en `.env`:
   ```env
   PORT=3001
   ```

### Error: "Prisma Client not generated"

**Solución:**
```bash
npm run db:generate
```

### Error: "Migration failed"

**Solución:**
1. Verificar conexión a la base de datos
2. Verificar que la base de datos existe
3. Resetear base de datos (⚠️ Borra datos):
   ```bash
   npm run db:reset
   ```

### Error: "Permission denied" (Linux/Mac)

**Solución:**
```bash
chmod +x scripts/instalar.sh
chmod +x scripts/instalar-docker.sh
```

### Docker: "Container name already in use"

**Solución:**
```bash
docker-compose down
# O
docker rm -f sistema-kiosco-db sistema-kiosco-app
```

---

## 📚 Documentación Adicional

- **README.md**: Información general del proyecto
- **QUICKSTART.md**: Guía rápida de inicio
- **GUIA_INSTALACION.md**: Guía detallada de instalación
- **GUIA_PRUEBAS.md**: Guía de pruebas del sistema
- **VARIABLES_ENTORNO.md**: Documentación de variables de entorno
- **SEGURIDAD.md**: Medidas de seguridad implementadas

---

## ✅ Verificación de Instalación

### Health Check

```bash
curl http://localhost:3000/api/health
```

Debería responder: `{"status":"ok","timestamp":"..."}`

### Prisma Studio

```bash
npm run db:studio
```

Abre una interfaz visual para explorar la base de datos en http://localhost:5555

### Login

1. Abre http://localhost:5173
2. Login con:
   - Email: `dueno@kiosco.com` (o el que creaste)
   - Password: `admin123` (o la que configuraste)

---

## 🎉 ¡Listo!

Si llegaste hasta aquí, el sistema está instalado y funcionando. 

**Próximos pasos:**
1. Explora el dashboard
2. Crea productos y proveedores
3. Registra tu primera venta
4. Revisa los reportes

**¿Necesitas ayuda?**
- Revisa la documentación en `/docs`
- Consulta `GUIA_PRUEBAS.md` para ejemplos
- Revisa los logs del backend para errores

