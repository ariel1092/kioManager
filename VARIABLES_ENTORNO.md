# 🔧 Variables de Entorno - Sistema de Gestión de Kiosco

Guía completa de las variables de entorno necesarias para el sistema.

---

## 📁 Backend (`.env` o `.env.local`)

### Variables Requeridas

#### 1. **DATABASE_URL** (Obligatoria)
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/sistema_kiosco?schema=public"
```
**Descripción:** URL de conexión a PostgreSQL  
**Formato:** `postgresql://usuario:password@host:puerto/nombre_bd?schema=public`  
**Ejemplo:**
- Usuario: `postgres`
- Password: `postgres`
- Host: `localhost`
- Puerto: `5432`
- Base de datos: `sistema_kiosco`

**⚠️ Ajusta:** `usuario`, `password` y `sistema_kiosco` con tus valores reales.

---

#### 2. **PORT** (Opcional)
```env
PORT=3000
```
**Descripción:** Puerto donde correrá el servidor backend  
**Por defecto:** `3000`

---

#### 3. **NODE_ENV** (Opcional)
```env
NODE_ENV=development
```
**Descripción:** Entorno de ejecución  
**Valores posibles:** `development`, `production`, `test`  
**Por defecto:** `development`

---

#### 4. **JWT_SECRET** (Obligatoria para autenticación)
```env
JWT_SECRET=tu-clave-secreta-super-segura-cambiar-en-produccion
```
**Descripción:** Clave secreta para firmar tokens JWT  
**⚠️ IMPORTANTE:** 
- Debe ser una cadena larga y aleatoria
- Cambia esto en producción
- No compartas esta clave

**Generar clave segura:**
```bash
# Opción 1: Usando OpenSSL
openssl rand -base64 32

# Opción 2: Usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

#### 5. **JWT_EXPIRES_IN** (Opcional)
```env
JWT_EXPIRES_IN=24h
```
**Descripción:** Tiempo de expiración de los tokens JWT  
**Formato:** `"1h"`, `"24h"`, `"7d"`, etc.  
**Por defecto:** `24h`

---

## 🎨 Frontend (`frontend/.env.local`)

### Variables Opcionales

#### 1. **VITE_API_URL** (Opcional)
```env
VITE_API_URL=http://localhost:3000/api
```
**Descripción:** URL base de la API backend  
**Por defecto:** `http://localhost:3000/api`  
**Nota:** En Vite, todas las variables deben comenzar con `VITE_`

**Ejemplos:**
- Desarrollo local: `http://localhost:3000/api`
- Producción: `https://api.tudominio.com/api`

---

## 📝 Archivo `.env` de Ejemplo (Backend)

```env
# Base de Datos
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sistema_kiosco?schema=public"

# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=mi-clave-secreta-super-segura-generada-con-openssl-rand-base64-32
JWT_EXPIRES_IN=24h
```

---

## 📝 Archivo `frontend/.env.local` de Ejemplo

```env
# API URL
VITE_API_URL=http://localhost:3000/api
```

---

## 🔒 Seguridad

### ⚠️ Variables Sensibles

**NUNCA subas a git:**
- `DATABASE_URL` (contiene credenciales)
- `JWT_SECRET` (clave secreta)
- Cualquier archivo `.env` o `.env.local`

### ✅ Ya está en `.gitignore`

Los archivos `.env` y `.env.local` ya están configurados para no subirse a git.

---

## 🚀 Configuración Rápida

### 1. Backend

Crea `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sistema_kiosco?schema=public"
PORT=3000
NODE_ENV=development
JWT_SECRET=clave-secreta-123456789
JWT_EXPIRES_IN=24h
```

**Ajusta:**
- `postgres:postgres` → Tus credenciales de PostgreSQL
- `sistema_kiosco` → Nombre de tu base de datos
- `clave-secreta-123456789` → Genera una clave segura

### 2. Frontend

Crea `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
```

**Ajusta si:**
- El backend corre en otro puerto
- Usas un servidor de producción

---

## 🧪 Verificar Configuración

### Backend

```bash
# Verificar que las variables se cargan
node -e "require('dotenv').config(); console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'OK' : 'FALTA');"
```

### Frontend

Las variables de Vite se exponen automáticamente. Puedes acceder a ellas con:
```typescript
import.meta.env.VITE_API_URL
```

---

## 📚 Referencias

- [Dotenv Documentation](https://github.com/motdotla/dotenv)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Prisma Connection URLs](https://www.prisma.io/docs/concepts/database-connectors/postgresql)

