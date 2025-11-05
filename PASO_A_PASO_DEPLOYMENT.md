# 🚀 Deployment Gratuito - Paso a Paso

Guía visual paso a paso para desplegar el Sistema de Gestión de Kiosco de forma **100% gratuita**.

---

## 📋 PREREQUISITOS

Antes de empezar, necesitas:

- ✅ Cuenta de GitHub (gratis)
- ✅ Email para crear cuentas
- ✅ 30-45 minutos de tiempo

---

## 🎯 PASO 1: Crear Base de Datos Gratuita (Supabase)

### 1.1 Ir a Supabase

1. Abre tu navegador
2. Ve a: **https://supabase.com**
3. Click en **"Start your project"**

### 1.2 Crear cuenta

1. Click en **"Sign in with GitHub"** (recomendado)
   - O usa tu email
2. Autorizar GitHub si es necesario

### 1.3 Crear nuevo proyecto

1. En el dashboard, click en **"New Project"**
2. Llenar formulario:
   - **Name:** `sistema-kiosco`
   - **Database Password:** 
     - Click en **"Generate a strong password"**
     - ⚠️ **COPIAR Y GUARDAR** esta contraseña (la necesitarás después)
   - **Region:** Seleccionar la más cercana a Argentina
   - **Pricing Plan:** Free (gratis)
3. Click en **"Create new project"**
4. ⏳ Esperar 2-3 minutos a que se cree

### 1.4 Obtener Connection String

1. Una vez creado, en el dashboard de Supabase:
2. Click en **⚙️ Settings** (icono de engranaje, arriba a la izquierda)
3. Click en **"Database"** (en el menú lateral)
4. Scroll hasta **"Connection string"**
5. Seleccionar **"URI"** (no "Connection pooling")
6. Copiar la URL que aparece:
   ```
   postgresql://postgres.[ref]:[password]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   ```
7. **⚠️ IMPORTANTE:** 
   - La URL tiene `[password]` - reemplázala con la contraseña que generaste
   - Debería quedar así:
     ```
     postgresql://postgres.xxxxx:TuPassword123@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
     ```
8. **GUARDAR** esta URL completa (la necesitarás en el Paso 3)

---

## 🎯 PASO 2: Subir Código a GitHub

### 2.1 Verificar que tienes Git instalado

**En Windows (PowerShell):**
```powershell
git --version
```

Si no tienes Git, descárgalo de: https://git-scm.com/download/win

### 2.2 Crear repositorio en GitHub

1. Ir a: **https://github.com**
2. Login con tu cuenta
3. Click en **"+"** (arriba a la derecha) → **"New repository"**
4. Llenar formulario:
   - **Repository name:** `sistema-kiosco`
   - **Description:** (opcional) "Sistema de Gestión de Kiosco"
   - **Visibility:** ✅ **Public** (necesario para plan gratuito de Render)
   - ❌ NO marcar "Add a README file"
5. Click en **"Create repository"**

### 2.3 Subir código desde tu PC

**Abre PowerShell en la carpeta del proyecto:**

```powershell
# Verificar que estás en la carpeta correcta
cd C:\Users\feder\OneDrive\Desktop\sistema-kiosco

# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit: Sistema de Gestión de Kiosco"

# Agregar repositorio remoto (reemplaza TU-USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/sistema-kiosco.git

# Subir código
git branch -M main
git push -u origin main
```

**Si te pide autenticación:**
- Usa tu **Personal Access Token** de GitHub
- O usa **GitHub Desktop** (más fácil)

### 2.4 Verificar que se subió

1. Refrescar la página de GitHub
2. Deberías ver todos tus archivos

---

## 🎯 PASO 3: Desplegar Backend en Render

### 3.1 Crear cuenta en Render

1. Ir a: **https://render.com**
2. Click en **"Get Started for Free"**
3. Click en **"Sign in with GitHub"** (recomendado)
4. Autorizar Render para acceder a GitHub

### 3.2 Crear nuevo Web Service (Backend)

1. En el dashboard de Render, click en **"New +"** (arriba a la derecha)
2. Seleccionar **"Web Service"**

3. Conectar repositorio:
   - Si no está conectado, click en **"Connect account"**
   - Seleccionar tu repositorio: **`sistema-kiosco`**
   - Click en **"Connect"**

4. Configurar el servicio:
   - **Name:** `sistema-kiosco-backend`
   - **Region:** Seleccionar la más cercana a Argentina
   - **Branch:** `main`
   - **Root Directory:** (dejar vacío)
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** ✅ **Free** (gratis)

5. Click en **"Advanced"** para agregar variables de entorno

6. Agregar Variables de Entorno:
   Click en **"Add Environment Variable"** y agregar:

   **Variable 1:**
   - Key: `DATABASE_URL`
   - Value: La URL de Supabase que copiaste en el Paso 1.4
   - Ejemplo: `postgresql://postgres.xxxxx:TuPassword123@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`

   **Variable 2:**
   - Key: `NODE_ENV`
   - Value: `production`

   **Variable 3:**
   - Key: `PORT`
   - Value: `3000`

   **Variable 4:**
   - Key: `JWT_SECRET`
   - Value: (generar una clave segura)
     - En PowerShell:
       ```powershell
       node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
       ```
     - Copiar el resultado y pegarlo como valor

   **Variable 5:**
   - Key: `JWT_EXPIRES_IN`
   - Value: `24h`

7. Click en **"Create Web Service"**

8. ⏳ Esperar 5-10 minutos a que se despliegue
   - Verás el progreso en tiempo real
   - Cuando termine, verás "Live" en verde

### 3.3 Obtener URL del Backend

1. Una vez desplegado, verás la URL del servicio:
   ```
   https://sistema-kiosco-backend.onrender.com
   ```
2. **⚠️ IMPORTANTE:** 
   - **COPIAR** esta URL
   - Click en la URL para verificar que funciona
   - Debería mostrar algún mensaje o error (eso es normal, aún no está configurado)

---

## 🎯 PASO 4: Ejecutar Migraciones de Base de Datos

### 4.1 Opción A: Desde tu PC (Recomendado)

1. En tu PC, crear archivo `.env` (si no existe):
   ```env
   DATABASE_URL=postgresql://postgres.xxxxx:TuPassword123@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=tu-jwt-secret-aqui
   JWT_EXPIRES_IN=24h
   ```
   ⚠️ **Usar la misma URL de Supabase que usaste en Render**

2. En PowerShell, ejecutar:
   ```powershell
   # Generar Prisma Client
   npm run db:generate

   # Ejecutar migraciones
   npm run db:migrate
   ```

3. Si todo sale bien, deberías ver:
   ```
   ✅ Applied migration: 20251105065330_
   ✅ Applied migration: 20251105093233_proveedores_module
   ```

### 4.2 Opción B: Desde Supabase SQL Editor

1. En Supabase, ir a **SQL Editor** (menú lateral)
2. Click en **"New query"**
3. Copiar y pegar el contenido de `prisma/migrations/.../migration.sql`
4. Ejecutar cada migración

---

## 🎯 PASO 5: Desplegar Frontend en Render

### 5.1 Crear nuevo Static Site (Frontend)

1. En Render, click en **"New +"** → **"Static Site"**

2. Conectar repositorio:
   - Seleccionar: **`sistema-kiosco`**
   - Click en **"Connect"**

3. Configurar:
   - **Name:** `sistema-kiosco-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
   - **Instance Type:** ✅ **Free** (gratis)

4. Click en **"Advanced"** → **"Environment"**

5. Agregar Variable de Entorno:
   Click en **"Add Environment Variable"**:
   - Key: `VITE_API_URL`
   - Value: `https://sistema-kiosco-backend.onrender.com/api`
     ⚠️ **Usar la URL real de tu backend del Paso 3.3**

6. Click en **"Create Static Site"**

7. ⏳ Esperar 3-5 minutos a que se despliegue

### 5.2 Obtener URL del Frontend

1. Una vez desplegado, verás la URL:
   ```
   https://sistema-kiosco-frontend.onrender.com
   ```
2. **🎉 Esta es la URL final de tu aplicación!**

---

## 🎯 PASO 6: Configurar CORS en Backend

### 6.1 Actualizar Variable de Entorno en Render

1. En Render, ir a tu servicio **`sistema-kiosco-backend`**
2. Click en **"Environment"** (menú lateral)
3. Click en **"Add Environment Variable"**
4. Agregar:
   - Key: `ALLOWED_ORIGINS`
   - Value: `https://sistema-kiosco-frontend.onrender.com`
     ⚠️ **Usar la URL real de tu frontend del Paso 5.2**
5. Click en **"Save Changes"**

6. Render reiniciará automáticamente el servicio

---

## 🎯 PASO 7: Probar Deployment

### 7.1 Verificar Backend

1. Abrir en navegador:
   ```
   https://sistema-kiosco-backend.onrender.com/api/health
   ```
2. Debería responder:
   ```json
   {"status":"ok","timestamp":"..."}
   ```

### 7.2 Verificar Frontend

1. Abrir en navegador:
   ```
   https://sistema-kiosco-frontend.onrender.com
   ```
2. Debería cargar la aplicación

### 7.3 Crear Usuario Inicial

**Opción A: Desde la aplicación (si hay botón de registro)**
1. Ir al frontend
2. Click en **"Registrar"** o **"Sign Up"**
3. Crear usuario:
   - Nombre: Dueño
   - Email: dueno@kiosco.com
   - Password: admin123
   - Rol: DUENO

**Opción B: Desde la API (PowerShell)**
```powershell
# Reemplazar con tu URL real
$url = "https://sistema-kiosco-backend.onrender.com/api/auth/registrar"
$body = @{
    nombre = "Dueño"
    email = "dueno@kiosco.com"
    password = "admin123"
    rol = "DUENO"
} | ConvertTo-Json

Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
```

---

## ✅ CHECKLIST FINAL

- [ ] ✅ Base de datos creada en Supabase
- [ ] ✅ Connection String copiado
- [ ] ✅ Código subido a GitHub
- [ ] ✅ Backend desplegado en Render
- [ ] ✅ Migraciones ejecutadas
- [ ] ✅ Frontend desplegado en Render
- [ ] ✅ CORS configurado
- [ ] ✅ Backend responde en `/api/health`
- [ ] ✅ Frontend carga correctamente
- [ ] ✅ Usuario inicial creado
- [ ] ✅ Puedes hacer login

---

## 🎉 ¡FELICIDADES!

Tu Sistema de Gestión de Kiosco está **100% desplegado y funcionando gratis**! 🚀

**URLs finales:**
- Frontend: `https://sistema-kiosco-frontend.onrender.com`
- Backend: `https://sistema-kiosco-backend.onrender.com/api`

---

## ⚠️ IMPORTANTE: Limitaciones del Plan Gratuito

### Render (Backend)
- ✅ Se "duerme" después de **15 minutos sin uso**
- ✅ Primera petición puede tardar **30-60 segundos** (cuando se "despierta")
- ✅ 512 MB RAM
- ✅ 750 horas/mes gratis

### Supabase (Base de Datos)
- ✅ 500 MB de base de datos
- ✅ 2 GB de transferencia/mes
- ✅ Ideal para desarrollo y clientes pequeños

---

## 🆘 Problemas Comunes

### Backend no responde
- Esperar 30-60 segundos (puede estar "dormido")
- Verificar logs en Render
- Verificar variables de entorno

### Frontend no carga
- Verificar que `VITE_API_URL` esté correcta
- Verificar que el backend esté funcionando
- Revisar consola del navegador (F12)

### Error de conexión a base de datos
- Verificar que la URL de Supabase sea correcta
- Verificar que la contraseña sea correcta
- Verificar que el proyecto de Supabase esté activo

---

## 📚 Próximos Pasos

1. ✅ Probar todas las funcionalidades
2. ✅ Crear usuario empleado
3. ✅ Agregar productos y proveedores
4. ✅ Hacer una venta de prueba
5. ✅ Verificar reportes

---

**¿Listo para empezar? ¡Empecemos con el Paso 1!** 🚀

