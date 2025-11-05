# Script de Instalación con Docker (Windows PowerShell)
# Sistema de Gestión de Kiosco

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sistema de Gestión de Kiosco" -ForegroundColor Cyan
Write-Host "  Instalación con Docker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
Write-Host "🔍 Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker encontrado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está instalado. Por favor instálalo desde https://www.docker.com/get-started" -ForegroundColor Red
    exit 1
}

# Verificar Docker Compose
Write-Host "🔍 Verificando Docker Compose..." -ForegroundColor Yellow
try {
    $composeVersion = docker-compose --version
    Write-Host "✅ Docker Compose encontrado: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose no está instalado." -ForegroundColor Red
    exit 1
}

# Verificar que Docker esté corriendo
Write-Host "🔍 Verificando que Docker esté corriendo..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✅ Docker está corriendo" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está corriendo. Por favor inicia Docker Desktop." -ForegroundColor Red
    exit 1
}

# Configurar variables de entorno si no existen
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creando archivo .env para Docker..." -ForegroundColor Yellow
    
    # Generar JWT_SECRET seguro
    $jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    
    $envContent = @"
# Base de Datos (Docker usa estas credenciales)
DATABASE_URL="postgresql://postgres:postgres@db:5432/sistema_kiosco?schema=public"

# Servidor
PORT=3000
NODE_ENV=production

# JWT
JWT_SECRET=$jwtSecret
JWT_EXPIRES_IN=24h
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Archivo .env creado" -ForegroundColor Green
}

# Preguntar modo de instalación
Write-Host ""
Write-Host "Selecciona el modo de instalación:" -ForegroundColor Yellow
Write-Host "  1. Solo base de datos (recomendado para desarrollo)" -ForegroundColor White
Write-Host "  2. Aplicación completa (backend + base de datos)" -ForegroundColor White
$mode = Read-Host "   Opción (1 o 2)"

if ($mode -eq "1") {
    Write-Host ""
    Write-Host "🐳 Iniciando solo la base de datos..." -ForegroundColor Yellow
    docker-compose -f docker-compose.dev.yml up -d db
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Base de datos iniciada" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
        Write-Host "  1. Instala dependencias: npm install" -ForegroundColor White
        Write-Host "  2. Instala dependencias del frontend: cd frontend && npm install" -ForegroundColor White
        Write-Host "  3. Genera Prisma Client: npm run db:generate" -ForegroundColor White
        Write-Host "  4. Ejecuta migraciones: npm run db:migrate" -ForegroundColor White
        Write-Host "  5. Inicia el backend: npm run dev" -ForegroundColor White
        Write-Host "  6. Inicia el frontend (en otra terminal): cd frontend && npm run dev" -ForegroundColor White
    } else {
        Write-Host "❌ Error al iniciar la base de datos" -ForegroundColor Red
        exit 1
    }
} elseif ($mode -eq "2") {
    Write-Host ""
    Write-Host "🐳 Iniciando aplicación completa..." -ForegroundColor Yellow
    docker-compose up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Aplicación iniciada" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Información:" -ForegroundColor Yellow
        Write-Host "  - Backend: http://localhost:3000" -ForegroundColor White
        Write-Host "  - Base de datos: localhost:5432" -ForegroundColor White
        Write-Host ""
        Write-Host "Para ver los logs:" -ForegroundColor Yellow
        Write-Host "  docker-compose logs -f app" -ForegroundColor White
    } else {
        Write-Host "❌ Error al iniciar la aplicación" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Opción inválida" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Instalación con Docker Completada" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""


