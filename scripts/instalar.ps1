# Script de Instalación para Windows (PowerShell)
# Sistema de Gestión de Kiosco

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sistema de Gestión de Kiosco" -ForegroundColor Cyan
Write-Host "  Instalación Automatizada" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
    
    $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($majorVersion -lt 18) {
        Write-Host "❌ Se requiere Node.js 18 o superior. Versión actual: $nodeVersion" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar npm
Write-Host "🔍 Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm no está instalado." -ForegroundColor Red
    exit 1
}

# Verificar PostgreSQL
Write-Host "🔍 Verificando PostgreSQL..." -ForegroundColor Yellow
$pgFound = $false
try {
    $pgVersion = psql --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL encontrado: $pgVersion" -ForegroundColor Green
        $pgFound = $true
    }
} catch {
    # Intentar verificar si está corriendo
    $pgRunning = Get-Process -Name "postgres" -ErrorAction SilentlyContinue
    if ($pgRunning) {
        Write-Host "✅ PostgreSQL parece estar corriendo" -ForegroundColor Green
        $pgFound = $true
    }
}

if (-not $pgFound) {
    Write-Host "⚠️  PostgreSQL no se encontró en PATH." -ForegroundColor Yellow
    Write-Host "   Opciones:" -ForegroundColor Yellow
    Write-Host "   1. Instalar PostgreSQL desde https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "   2. Usar Docker: docker-compose up -d db" -ForegroundColor Yellow
    $continue = Read-Host "   ¿Deseas continuar de todas formas? (S/N)"
    if ($continue -ne "S" -and $continue -ne "s") {
        exit 1
    }
}

# Instalar dependencias del backend
Write-Host ""
Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar dependencias del backend" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencias del backend instaladas" -ForegroundColor Green

# Instalar dependencias del frontend
Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar dependencias del frontend" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ Dependencias del frontend instaladas" -ForegroundColor Green
Set-Location ..

# Configurar variables de entorno
Write-Host ""
Write-Host "⚙️  Configurando variables de entorno..." -ForegroundColor Yellow

if (-not (Test-Path ".env")) {
    Write-Host "📝 Creando archivo .env..." -ForegroundColor Yellow
    
    # Generar JWT_SECRET seguro
    $jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    
    $envContent = @"
# Base de Datos
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sistema_kiosco?schema=public"

# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=$jwtSecret
JWT_EXPIRES_IN=24h
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Archivo .env creado" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANTE: Edita .env y ajusta DATABASE_URL con tus credenciales de PostgreSQL" -ForegroundColor Yellow
} else {
    Write-Host "✅ Archivo .env ya existe" -ForegroundColor Green
}

# Configurar frontend .env.local
if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "📝 Creando archivo frontend/.env.local..." -ForegroundColor Yellow
    $frontendEnvContent = @"
# API URL
VITE_API_URL=http://localhost:3000/api
"@
    $frontendEnvContent | Out-File -FilePath "frontend\.env.local" -Encoding UTF8
    Write-Host "✅ Archivo frontend/.env.local creado" -ForegroundColor Green
} else {
    Write-Host "✅ Archivo frontend/.env.local ya existe" -ForegroundColor Green
}

# Generar Prisma Client
Write-Host ""
Write-Host "🔧 Generando Prisma Client..." -ForegroundColor Yellow
npm run db:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al generar Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma Client generado" -ForegroundColor Green

# Verificar base de datos y ejecutar migraciones
Write-Host ""
Write-Host "🗄️  Configurando base de datos..." -ForegroundColor Yellow
Write-Host "⚠️  Asegúrate de que PostgreSQL esté corriendo y la base de datos 'sistema_kiosco' exista" -ForegroundColor Yellow
Write-Host "   Si no existe, créala con: createdb sistema_kiosco" -ForegroundColor Yellow
$continue = Read-Host "   ¿Deseas ejecutar las migraciones ahora? (S/N)"

if ($continue -eq "S" -or $continue -eq "s") {
    Write-Host "🔄 Ejecutando migraciones..." -ForegroundColor Yellow
    npm run db:migrate
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migraciones ejecutadas exitosamente" -ForegroundColor Green
        
        # Preguntar si desea ejecutar seed
        $runSeed = Read-Host "   ¿Deseas ejecutar el seed para datos de ejemplo? (S/N)"
        if ($runSeed -eq "S" -or $runSeed -eq "s") {
            Write-Host "🌱 Ejecutando seed..." -ForegroundColor Yellow
            npm run db:seed
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Seed ejecutado exitosamente" -ForegroundColor Green
            }
        }
        
        # Preguntar si desea crear usuario inicial
        $createUser = Read-Host "   ¿Deseas crear un usuario dueño inicial? (S/N)"
        if ($createUser -eq "S" -or $createUser -eq "s") {
            Write-Host "👤 Creando usuario inicial..." -ForegroundColor Yellow
            npm run create-user-dueno
        }
    } else {
        Write-Host "❌ Error al ejecutar migraciones. Verifica la conexión a la base de datos." -ForegroundColor Red
    }
} else {
    Write-Host "⏭️  Migraciones omitidas. Ejecuta manualmente: npm run db:migrate" -ForegroundColor Yellow
}

# Resumen
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Instalación Completada" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "  1. Edita el archivo .env con tus credenciales de PostgreSQL" -ForegroundColor White
Write-Host "  2. Asegúrate de que la base de datos 'sistema_kiosco' exista" -ForegroundColor White
Write-Host "  3. Ejecuta las migraciones: npm run db:migrate" -ForegroundColor White
Write-Host "  4. Inicia el backend: npm run dev" -ForegroundColor White
Write-Host "  5. Inicia el frontend (en otra terminal): cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentación:" -ForegroundColor Yellow
Write-Host "  - README.md: Información general" -ForegroundColor White
Write-Host "  - QUICKSTART.md: Guía rápida" -ForegroundColor White
Write-Host "  - GUIA_INSTALACION.md: Guía detallada" -ForegroundColor White
Write-Host ""

