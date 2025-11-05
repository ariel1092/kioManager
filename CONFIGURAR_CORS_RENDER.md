# 🔧 Configurar CORS en Render - Guía Paso a Paso

Esta guía te ayudará a configurar correctamente CORS para que el frontend pueda comunicarse con el backend.

---

## 📍 Paso 1: Obtener la URL del Frontend

### Opción A: Desde el Dashboard de Render

1. Ve a: **https://dashboard.render.com**
2. En el listado de servicios, busca tu servicio frontend:
   - Nombre probable: `kiomanager-front` o `sistema-kiosco-frontend`
3. Click en el servicio
4. Verás la URL en la parte superior:
   ```
   https://kiomanager-front.onrender.com
   ```
   ⚠️ **Copia esta URL completa** (incluye `https://`)

### Opción B: Desde el Log del Deployment

1. Ve a tu servicio frontend en Render
2. Click en **"Events"** o **"Logs"**
3. Busca una línea que diga:
   ```
   Available at your primary URL https://kiomanager-front.onrender.com
   ```
   ⚠️ **Esta es tu URL del frontend**

---

## 📍 Paso 2: Configurar ALLOWED_ORIGINS en el Backend

### 2.1 Ir al Servicio Backend

1. En Render, ve a tu servicio backend:
   - Nombre probable: `kiomanager` o `sistema-kiosco-backend`
2. Click en el servicio

### 2.2 Ir a Environment Variables

1. En el menú lateral, click en **"Environment"**
2. Verás una lista de variables de entorno

### 2.3 Agregar o Actualizar ALLOWED_ORIGINS

**Si la variable NO existe:**
1. Click en **"Add Environment Variable"**
2. Configurar:
   - **Key:** `ALLOWED_ORIGINS`
   - **Value:** `https://kiomanager-front.onrender.com`
     ⚠️ **Usa la URL real de tu frontend del Paso 1**
3. Click en **"Save Changes"**

**Si la variable YA existe:**
1. Busca `ALLOWED_ORIGINS` en la lista
2. Click en el **lápiz** (editar) junto a la variable
3. Actualiza el valor con la URL del frontend:
   ```
   https://kiomanager-front.onrender.com
   ```
4. Click en **"Save Changes"**

### 2.4 Esperar el Redeploy

- Render detectará el cambio automáticamente
- Verás un mensaje: **"Redeploying..."**
- Espera 2-3 minutos a que termine

---

## ✅ Paso 3: Verificar que Funciona

### 3.1 Verificar en el Frontend

1. Abre el frontend en el navegador:
   ```
   https://kiomanager-front.onrender.com
   ```
2. Abre la consola del navegador (F12)
3. Intenta hacer login
4. **No deberías ver errores de CORS** en la consola

### 3.2 Verificar en los Logs del Backend

1. Ve a tu servicio backend en Render
2. Click en **"Logs"**
3. Deberías ver peticiones exitosas sin errores de CORS

---

## 🔍 Ejemplo de Configuración Correcta

### En Render (Backend):

**Variable de Entorno:**
- Key: `ALLOWED_ORIGINS`
- Value: `https://kiomanager-front.onrender.com`

### Si tienes múltiples orígenes:

Puedes separarlos con comas:
```
https://kiomanager-front.onrender.com,https://otro-dominio.com
```

---

## ❌ Errores Comunes

### Error 1: "Access-Control-Allow-Origin header is missing"

**Causa:** `ALLOWED_ORIGINS` no está configurado o tiene un valor incorrecto

**Solución:**
1. Verificar que `ALLOWED_ORIGINS` esté configurado en Render
2. Verificar que la URL sea exacta (incluye `https://`)
3. Esperar 2-3 minutos después de guardar

### Error 2: "401 Unauthorized"

**Causa:** El token no se está enviando correctamente

**Solución:**
- Ya está corregido en el código (interceptor automático)
- Asegúrate de hacer login primero
- Verificar que el token esté en localStorage

### Error 3: La URL del frontend cambió

**Causa:** Render puede generar URLs diferentes

**Solución:**
1. Verificar la URL actual en Render
2. Actualizar `ALLOWED_ORIGINS` con la nueva URL
3. Guardar y esperar el redeploy

---

## 📝 Checklist

- [ ] Obtuve la URL del frontend desde Render
- [ ] Configuré `ALLOWED_ORIGINS` en el backend con la URL correcta
- [ ] Guardé los cambios en Render
- [ ] Esperé 2-3 minutos para el redeploy
- [ ] Probé el login en el frontend
- [ ] No hay errores de CORS en la consola
- [ ] Las peticiones funcionan correctamente

---

## 🆘 Si Aún No Funciona

1. **Verificar la URL exacta:**
   - Copia la URL directamente desde Render
   - Asegúrate de incluir `https://` al inicio
   - No debe tener `/` al final

2. **Verificar los logs del backend:**
   - Busca mensajes de CORS
   - Verifica que el backend esté recibiendo las peticiones

3. **Limpiar cache del navegador:**
   - Ctrl + Shift + R (hard refresh)
   - O abrir en ventana incógnito

4. **Verificar que el frontend esté desplegado:**
   - La URL debe estar accesible
   - Debe mostrar la aplicación (no error 404)

---

## 📚 Referencias

- [Documentación de CORS en Express](https://expressjs.com/en/resources/middleware/cors.html)
- [Render Environment Variables](https://render.com/docs/environment-variables)

