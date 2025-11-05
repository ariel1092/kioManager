# 🆓 Guía de Deployment Gratuito - Paso a Paso

Guía completa para desplegar el Sistema de Gestión de Kiosco de forma **100% gratuita**.

## 📋 Opciones Gratuitas Recomendadas

### Opción 1: Render (Recomendado) ⭐
- **Backend:** Gratis (se duerme después de 15 min sin uso)
- **Frontend:** Gratis
- **Base de datos:** Supabase (PostgreSQL gratuito)
- **Ventaja:** Muy fácil de configurar

### Opción 2: Railway
- **Backend + Frontend:** Plan gratuito ($5 crédito/mes)
- **Base de datos:** PostgreSQL incluido
- **Ventaja:** No se duerme

### Opción 3: Fly.io
- **Backend:** Gratis (limitado)
- **Base de datos:** Supabase (PostgreSQL gratuito)
- **Ventaja:** Más control

---

## 🎯 Opción Recomendada: Render + Supabase

**Ventajas:**
- ✅ 100% gratuito
- ✅ Muy fácil de configurar
- ✅ PostgreSQL robusto (Supabase)
- ✅ SSL automático
- ✅ Deployment desde GitHub

**Desventajas:**
- ❌ Se "duerme" después de 15 min sin uso (solo en plan gratuito)
- ❌ Primera petición puede tardar 30-60 segundos

**Ideal para:** Demos, pruebas, clientes pequeños

---

## 🚀 PASO 1: Crear Base de Datos Gratuita (Supabase)

### 1.1 Crear cuenta en Supabase

1. Ir a: https://supabase.com
2. Click en **"Start your project"**
3. Login con GitHub (recomendado)

### 1.2 Crear nuevo proyecto

1. Click en **"New Project"**
2. Llenar formulario:
   - **Name:** `sistema-kiosco` (o el nombre que quieras)
   - **Database Password:** Generar una contraseña segura (⚠️ GUARDARLA)
   - **Region:** Elegir la más cercana a Argentina
   - **Pricing Plan:** Free (gratis)

3. Click en **"Create new project"**
4. Esperar 2-3 minutos a que se cree

### 1.3 Obtener Connection String

1. En el dashboard de Supabase, ir a **Settings** → **Database**
2. Scroll hasta **"Connection string"**
3. Seleccionar **"URI"**
4. Copiar la URL que se ve así:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. **⚠️ IMPORTANTE:** Reemplazar `[YOUR-PASSWORD]` con la contraseña que generaste
6. Guardar esta URL (la necesitarás después)

**Ejemplo:**
```
postgresql://postgres:TuPassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

---

## 🚀 PASO 2: Preparar Código para GitHub

### 2.1 Crear repositorio en GitHub

1. Ir a: https://github.com
2. Click en **"New repository"**
3. Nombre: `sistema-kiosco`
4. Seleccionar **"Public"** (para plan gratuito)
5. Click en **"Create repository"**

### 2.2 Subir código a GitHub

**Desde tu PC (Terminal/PowerShell):**

```bash
# Si aún no tienes git inicializado
git init
git add .
git commit -m "Initial commit"

# Agregar repositorio remoto
git remote add origin https://github.com/TU-USUARIO/sistema-kiosco.git

# Subir código
git branch -M main
git push -u origin main
```

**Nota:** Si tienes archivos `.env`, asegúrate de que estén en `.gitignore` (ya debería estar)

---

## 🚀 PASO 3: Desplegar Backend en Render

### 3.1 Crear cuenta en Render

1. Ir a: https://render.com
2. Click en **"Get Started for Free"**
3. Login con GitHub (recomendado)

### 3.2 Crear nuevo Web Service (Backend)

1. En el dashboard, click en **"New +"** → **"Web Service"**
2. Conectar tu repositorio de GitHub:
   - Seleccionar **"Connect account"** si no está conectado
   - Seleccionar tu repositorio: `sistema-kiosco`
   - Click en **"Connect"**

3. Configurar el servicio:
   - **Name:** `sistema-kiosco-backend`
   - **Region:** Seleccionar la más cercana
   - **Branch:** `main`
   - **Root Directory:** (dejar vacío)
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free (gratis)

4. Configurar Variables de Entorno:
   Click en **"Advanced"** → **"Add Environment Variable"**
   
   Agregar estas variables:
   
   ```
   DATABASE_URL=postgresql://postgres:TuPassword@db.xxxxx.supabase.co:5432/postgres
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=genera-una-clave-secreta-aqui
   JWT_EXPIRES_IN=24h
   ```
   
   **⚠️ IMPORTANTE:**
   - `DATABASE_URL`: La URL de Supabase que copiaste antes
   - `JWT_SECRET`: Generar una clave segura:
     ```bash
     # En tu PC
     node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
     ```

5. Click en **"Create Web Service"**

6. Esperar a que se despliegue (5-10 minutos)

### 3.3 Obtener URL del Backend

1. Una vez desplegado, verás la URL del servicio:
   ```
   https://sistema-kiosco-backend.onrender.com
   ```
2. **⚠️ IMPORTANTE:** Guardar esta URL (la necesitarás para el frontend)

---

## 🚀 PASO 4: Ejecutar Migraciones de Base de Datos

### 4.1 Conectar a Supabase desde tu PC

**Opción A: Usar Prisma Studio (Recomendado)**

1. En tu PC, crear archivo `.env` temporal:
   ```env
   DATABASE_URL=postgresql://postgres:TuPassword@db.xxxxx.supabase.co:5432/postgres
   ```

2. Ejecutar migraciones:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

**Opción B: Usar Supabase SQL Editor**

1. En Supabase, ir a **SQL Editor**
2. Ejecutar las migraciones manualmente (más complejo)

---

## 🚀 PASO 5: Desplegar Frontend en Render

### 5.1 Crear nuevo Static Site (Frontend)

1. En Render, click en **"New +"** → **"Static Site"**
2. Conectar repositorio:
   - Seleccionar: `sistema-kiosco`
   - Click en **"Connect"**

3. Configurar:
   - **Name:** `sistema-kiosco-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
   - **Plan:** Free (gratis)

4. Configurar Variable de Entorno:
   Click en **"Environment"** → **"Add Environment Variable"**
   
   ```
   VITE_API_URL=https://sistema-kiosco-backend.onrender.com/api
   ```
   
   **⚠️ IMPORTANTE:** Reemplazar con la URL real de tu backend

5. Click en **"Create Static Site"**

6. Esperar a que se despliegue (3-5 minutos)

### 5.2 Obtener URL del Frontend

1. Una vez desplegado, verás la URL:
   ```
   https://sistema-kiosco-frontend.onrender.com
   ```
2. Esta es la URL final de tu aplicación 🎉

---

## 🚀 PASO 6: Probar Deployment

### 6.1 Verificar que todo funciona

1. **Backend:**
   - Abrir: `https://sistema-kiosco-backend.onrender.com/api/health`
   - Debería responder: `{"status":"ok",...}`

2. **Frontend:**
   - Abrir: `https://sistema-kiosco-frontend.onrender.com`
   - Debería cargar la aplicación

3. **Crear usuario inicial:**
   - Ir al frontend
   - Click en **"Registrar"** (si existe)
   - O usar la API directamente:
     ```bash
     curl -X POST https://sistema-kiosco-backend.onrender.com/api/auth/registrar \
       -H "Content-Type: application/json" \
       -d '{
         "nombre": "Dueño",
         "email": "dueno@kiosco.com",
         "password": "admin123",
         "rol": "DUENO"
       }'
     ```

---

## 🔧 Configuración Adicional

### Configurar CORS en Backend

Si tienes problemas de CORS, en `src/index.ts`:

```typescript
app.use(cors({
  origin: ['https://sistema-kiosco-frontend.onrender.com'],
  credentials: true
}));
```

### Variables de Entorno en Frontend

Asegúrate de que `VITE_API_URL` esté configurada correctamente en Render.

---

## 📊 URLs Finales

Una vez desplegado, tendrás:

- **Frontend:** `https://sistema-kiosco-frontend.onrender.com`
- **Backend API:** `https://sistema-kiosco-backend.onrender.com/api`
- **Base de datos:** En Supabase (no accesible directamente)

---

## ⚠️ Limitaciones del Plan Gratuito

### Render (Backend)
- ✅ Se "duerme" después de 15 minutos sin uso
- ✅ Primera petición puede tardar 30-60 segundos
- ✅ 512 MB RAM
- ✅ 750 horas/mes gratis

### Supabase (Base de Datos)
- ✅ 500 MB de base de datos
- ✅ 2 GB de transferencia/mes
- ✅ Ideal para desarrollo y clientes pequeños

---

## 🎯 Próximos Pasos

1. ✅ Crear cuenta en Supabase
2. ✅ Crear base de datos
3. ✅ Subir código a GitHub
4. ✅ Desplegar backend en Render
5. ✅ Ejecutar migraciones
6. ✅ Desplegar frontend en Render
7. ✅ Probar aplicación

---

## 🆘 Troubleshooting

### Backend no inicia

1. Verificar logs en Render
2. Verificar que las variables de entorno estén correctas
3. Verificar que `DATABASE_URL` sea correcta

### Frontend no carga

1. Verificar que `VITE_API_URL` esté correcta
2. Verificar que el backend esté funcionando
3. Revisar la consola del navegador

### Error de conexión a base de datos

1. Verificar que la URL de Supabase sea correcta
2. Verificar que la contraseña sea correcta
3. Verificar que el proyecto de Supabase esté activo

---

## 📚 Recursos

- **Render Docs:** https://render.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Render Status:** https://status.render.com

---

**¿Listo para empezar? ¡Vamos paso a paso!** 🚀



