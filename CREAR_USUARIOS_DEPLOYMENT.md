# 👤 Guía para Crear Usuarios en el Deployment

Esta guía explica cómo crear usuarios (admin y empleado) después de desplegar el sistema en Render.

---

## 📋 Opciones Disponibles

Tienes 3 opciones para crear usuarios:

1. **Opción A: Scripts locales** (Recomendado) - Ejecutar scripts desde tu PC
2. **Opción B: API REST** - Usar curl o PowerShell
3. **Opción C: Prisma Studio** - Interfaz gráfica

---

## 🎯 OPCIÓN A: Scripts Locales (Recomendado)

### Requisitos Previos

1. Tener Node.js instalado en tu PC
2. Tener la `DATABASE_URL` de Supabase (la misma que usaste en Render)
3. Haber clonado el repositorio

### Pasos

#### 1. Configurar Variables de Entorno

1. Crear archivo `.env` en la raíz del proyecto (si no existe):
   ```env
   DATABASE_URL=postgresql://postgres.xxxxx:TuPassword123@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   NODE_ENV=production
   ```

   ⚠️ **Usar la misma URL de Supabase que configuraste en Render**

#### 2. Instalar Dependencias

```powershell
npm install
```

#### 3. Generar Prisma Client

```powershell
npm run db:generate
```

#### 4. Crear Usuario Dueño (Admin)

```powershell
npm run create-user-dueno
```

**Credenciales por defecto:**
- Email: `dueno@kiosco.com`
- Password: `admin123`
- Rol: `DUENO`

#### 5. Crear Usuario Empleado

```powershell
npm run create-user-empleado
```

**Credenciales por defecto:**
- Email: `empleado@kiosco.com`
- Password: `empleado123`
- Rol: `EMPLEADO`

---

## 🎯 OPCIÓN B: API REST (Desde PowerShell)

### Crear Usuario Dueño

```powershell
# Reemplazar con tu URL real del backend
$url = "https://sistema-kiosco-backend.onrender.com/api/auth/registrar"

$body = @{
    nombre = "Dueño del Kiosco"
    email = "dueno@kiosco.com"
    password = "admin123"
    rol = "DUENO"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
Write-Host "Usuario creado:" -ForegroundColor Green
$response | ConvertTo-Json
```

### Crear Usuario Empleado

```powershell
$url = "https://sistema-kiosco-backend.onrender.com/api/auth/registrar"

$body = @{
    nombre = "Empleado del Kiosco"
    email = "empleado@kiosco.com"
    password = "empleado123"
    rol = "EMPLEADO"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
Write-Host "Usuario creado:" -ForegroundColor Green
$response | ConvertTo-Json
```

---

## 🎯 OPCIÓN C: Prisma Studio (Interfaz Gráfica)

### 1. Configurar Variables de Entorno

Crear archivo `.env` con la `DATABASE_URL` de producción:

```env
DATABASE_URL=postgresql://postgres.xxxxx:TuPassword123@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

### 2. Abrir Prisma Studio

```powershell
npm run db:studio
```

### 3. Crear Usuario Manualmente

1. En Prisma Studio, ir a la tabla **`Usuario`**
2. Click en **"Add record"**
3. Llenar los campos:
   - **id**: (dejar vacío, se genera automáticamente)
   - **nombre**: `Dueño del Kiosco`
   - **email**: `dueno@kiosco.com`
   - **password**: Necesitas hashearla primero
   
   ⚠️ **Problema**: Prisma Studio no hashea contraseñas automáticamente.

**Solución**: Usar la terminal para hashear la contraseña primero:

```powershell
# Instalar bcryptjs si no está instalado
npm install bcryptjs

# Ejecutar en Node.js
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"
```

4. Copiar el hash generado y pegarlo en el campo **`password`**
5. **rol**: Seleccionar `DUENO`
6. **activo**: `true`
7. **createdAt**: Click en el botón de fecha actual
8. **updatedAt**: Click en el botón de fecha actual
9. Click en **"Save 1 change"**

---

## 🔐 Cambiar Contraseñas por Defecto

### Desde el Frontend (Recomendado)

1. Iniciar sesión con las credenciales por defecto
2. Ir a **Usuarios** → Click en tu usuario → **Cambiar Contraseña**
3. Ingresar nueva contraseña segura

### Desde la API

```powershell
# Primero, obtener el token de login
$loginUrl = "https://sistema-kiosco-backend.onrender.com/api/auth/login"
$loginBody = @{
    email = "dueno@kiosco.com"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.data.token

# Cambiar contraseña
$changePasswordUrl = "https://sistema-kiosco-backend.onrender.com/api/usuarios/TU_USER_ID/contrasena"
$changePasswordBody = @{
    nuevaPassword = "TuNuevaPasswordSegura123!"
    passwordActual = "admin123"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri $changePasswordUrl -Method Put -Body $changePasswordBody -Headers $headers
```

---

## ✅ Verificar Usuarios Creados

### Desde el Frontend

1. Iniciar sesión con las credenciales creadas
2. Ir a **Usuarios** (solo visible para DUENO)
3. Verificar que los usuarios aparecen en la lista

### Desde la API

```powershell
# Primero, obtener el token de login
$loginUrl = "https://sistema-kiosco-backend.onrender.com/api/auth/login"
$loginBody = @{
    email = "dueno@kiosco.com"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.data.token

# Listar usuarios
$listUrl = "https://sistema-kiosco-backend.onrender.com/api/usuarios"
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri $listUrl -Method Get -Headers $headers
```

---

## 📝 Credenciales por Defecto (Cambiar después)

### Usuario Dueño (Admin)
- **Email**: `dueno@kiosco.com`
- **Password**: `admin123`
- **Rol**: `DUENO`
- **Permisos**: Todos (crear, editar, eliminar, ver reportes)

### Usuario Empleado
- **Email**: `empleado@kiosco.com`
- **Password**: `empleado123`
- **Rol**: `EMPLEADO`
- **Permisos**: Solo ventas y visualización (no puede ver reportes ni compras)

---

## 🔒 Seguridad

⚠️ **IMPORTANTE**: Cambiar las contraseñas por defecto inmediatamente después de crear los usuarios en producción.

1. Usar contraseñas fuertes (mínimo 8 caracteres, mayúsculas, minúsculas, números)
2. No compartir credenciales
3. Usar diferentes contraseñas para cada usuario
4. Considerar usar un gestor de contraseñas

---

## 🆘 Solución de Problemas

### Error: "Ya existe un usuario con este email"

Los scripts verifican si el usuario ya existe. Si ya lo creaste, puedes:
- Usar otro email
- O eliminar el usuario existente desde Prisma Studio o la API

### Error: "Cannot connect to database"

- Verificar que la `DATABASE_URL` en `.env` es correcta
- Verificar que Supabase está accesible
- Verificar que la IP no está bloqueada (si aplica)

### Error: "Prisma Client not generated"

Ejecutar:
```powershell
npm run db:generate
```

---

## 📚 Referencias

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Deployment](./PASO_A_PASO_DEPLOYMENT.md)

