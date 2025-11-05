@echo off
REM Script de Instalación para Windows (Batch)
REM Sistema de Gestión de Kiosco

echo ========================================
echo   Sistema de Gestión de Kiosco
echo   Instalación Automatizada
echo ========================================
echo.

REM Verificar Node.js
echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado. Por favor instálalo desde https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js encontrado: %NODE_VERSION%

REM Verificar npm
echo Verificando npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm no está instalado.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm encontrado: %NPM_VERSION%

REM Instalar dependencias del backend
echo.
echo Instalando dependencias del backend...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error al instalar dependencias del backend
    pause
    exit /b 1
)
echo [OK] Dependencias del backend instaladas

REM Instalar dependencias del frontend
echo Instalando dependencias del frontend...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error al instalar dependencias del frontend
    cd ..
    pause
    exit /b 1
)
echo [OK] Dependencias del frontend instaladas
cd ..

REM Configurar variables de entorno
echo.
echo Configurando variables de entorno...

if not exist .env (
    echo Creando archivo .env...
    (
        echo # Base de Datos
        echo DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sistema_kiosco?schema=public"
        echo.
        echo # Servidor
        echo PORT=3000
        echo NODE_ENV=development
        echo.
        echo # JWT
        echo JWT_SECRET=clave-secreta-cambiar-en-produccion
        echo JWT_EXPIRES_IN=24h
    ) > .env
    echo [OK] Archivo .env creado
    echo [ADVERTENCIA] Edita .env y ajusta DATABASE_URL con tus credenciales de PostgreSQL
) else (
    echo [OK] Archivo .env ya existe
)

REM Configurar frontend .env.local
if not exist frontend\.env.local (
    echo Creando archivo frontend/.env.local...
    (
        echo # API URL
        echo VITE_API_URL=http://localhost:3000/api
    ) > frontend\.env.local
    echo [OK] Archivo frontend/.env.local creado
) else (
    echo [OK] Archivo frontend/.env.local ya existe
)

REM Generar Prisma Client
echo.
echo Generando Prisma Client...
call npm run db:generate
if %errorlevel% neq 0 (
    echo [ERROR] Error al generar Prisma Client
    pause
    exit /b 1
)
echo [OK] Prisma Client generado

REM Resumen
echo.
echo ========================================
echo   Instalación Completada
echo ========================================
echo.
echo Próximos pasos:
echo   1. Edita el archivo .env con tus credenciales de PostgreSQL
echo   2. Asegúrate de que la base de datos 'sistema_kiosco' exista
echo   3. Ejecuta las migraciones: npm run db:migrate
echo   4. Inicia el backend: npm run dev
echo   5. Inicia el frontend (en otra terminal): cd frontend ^&^& npm run dev
echo.
pause


