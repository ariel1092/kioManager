# 🔧 Correcciones para Deployment en Render

Este documento explica cómo corregir los errores comunes que aparecen en los logs de Render.

---

## ❌ Error 1: Rate Limiting - X-Forwarded-For

### Error:
```
ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false
```

### Solución:
✅ **Ya corregido en el código** - Se agregó `app.set('trust proxy', 1)` en `src/index.ts`

Si el error persiste después de hacer push:
1. Hacer push de los cambios a GitHub
2. Render debería detectar los cambios y hacer redeploy automáticamente

---

## ❌ Error 2: Base de Datos - Puerto Incorrecto

### Error:
```
Can't reach database server at `db.kivwbktcqtfekijicizy.supabase.co:5432`
```

### Problema:
El backend está intentando conectarse usando el puerto **5432** (conexión directa) en lugar del puerto **6543** (Connection Pooling).

### Solución:

#### Paso 1: Verificar DATABASE_URL en Render

1. Ve a tu servicio backend en Render: `https://dashboard.render.com`
2. Click en tu servicio **`kiomanager`** (o `sistema-kiosco-backend`)
3. Click en **"Environment"** (menú lateral)
4. Busca la variable `DATABASE_URL`

#### Paso 2: Verificar el Formato

La URL debe tener este formato:
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Características correctas:**
- ✅ Debe terminar en `:6543` (Connection Pooling)
- ✅ Debe incluir `pooler.supabase.com`
- ✅ Debe incluir `aws-0-[REGION]` (ej: `sa-east-1`)

**Características incorrectas:**
- ❌ NO debe terminar en `:5432` (conexión directa)
- ❌ NO debe usar `db.supabase.co`

#### Paso 3: Actualizar DATABASE_URL

Si la URL está incorrecta:

1. En Supabase, ve a: **Settings** → **Database**
2. Click en **"Connection String"** → **"Connection Pooling"**
3. Selecciona **"Transaction"** o **"Session"**
4. Copia la URL completa
5. En Render, edita la variable `DATABASE_URL`:
   - Click en el lápiz (editar) junto a `DATABASE_URL`
   - Pega la nueva URL
   - Click en **"Save Changes"**
6. Render reiniciará automáticamente el servicio

#### Ejemplo de URL Correcta:

```
postgresql://postgres.kivwbktcqtfekijicizy:210725FmMm@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

#### Ejemplo de URL Incorrecta (NO usar):

```
postgresql://postgres:210725FmMm@db.kivwbktcqtfekijicizy.supabase.co:5432/postgres
```

---

## ✅ Verificar que Funciona

Después de actualizar la `DATABASE_URL`:

1. Esperar 2-3 minutos a que Render reinicie el servicio
2. Verificar los logs en Render (deberían desaparecer los errores de conexión)
3. Probar el login en el frontend:
   - Email: `dueno@kiosco.com`
   - Password: `admin123`

---

## 🔍 Cómo Verificar la URL Correcta

### Desde Supabase:

1. Ir a: **https://supabase.com/dashboard**
2. Seleccionar tu proyecto
3. Click en **Settings** (ícono de engranaje)
4. Click en **Database** (menú lateral)
5. Scroll hasta **"Connection String"**
6. Click en **"Connection Pooling"**
7. Seleccionar **"Transaction"** o **"Session"**
8. Copiar la URL que aparece

### Formato Esperado:

```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

Donde:
- `[PROJECT_REF]` = Tu Project Reference (ej: `kivwbktcqtfekijicizy`)
- `[PASSWORD]` = Tu contraseña de Supabase
- `[REGION]` = Tu región (ej: `sa-east-1`)

---

## 📝 Notas Importantes

1. **Connection Pooling es necesario** para Render porque:
   - Permite múltiples conexiones simultáneas
   - Es más eficiente para aplicaciones web
   - Es el método recomendado por Supabase para producción

2. **Conexión directa (5432)** no funciona bien en Render porque:
   - Tiene límites de conexiones
   - Puede causar timeouts
   - No es óptimo para aplicaciones web

3. **La URL debe coincidir exactamente** con la que obtienes de Supabase en "Connection Pooling"

---

## 🆘 Si el Error Persiste

1. **Verificar que la URL esté correcta** en Render
2. **Verificar que Supabase esté activo** (no suspendido)
3. **Verificar que la contraseña sea correcta** en la URL
4. **Esperar 2-3 minutos** después de cambiar la variable (Render necesita tiempo para reiniciar)
5. **Revisar los logs** en Render para ver si hay otros errores

---

## 📚 Referencias

- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Express Trust Proxy](https://expressjs.com/en/guide/behind-proxies.html)
- [Render Environment Variables](https://render.com/docs/environment-variables)

