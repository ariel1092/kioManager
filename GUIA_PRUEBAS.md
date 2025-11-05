# 🧪 Guía de Pruebas - Sistema de Gestión de Kiosco

Esta guía te ayudará a probar el sistema completo paso a paso.

## 📋 Prerrequisitos

- Node.js 18+ instalado
- PostgreSQL 14+ instalado y corriendo
- npm o yarn instalado
- Editor de código (opcional)

---

## 🚀 Paso 1: Configurar Base de Datos

### 1.1 Crear la base de datos

Abre una terminal y ejecuta:

```bash
# Opción 1: Usando psql
psql -U postgres -c "CREATE DATABASE sistema_kiosco;"

# Opción 2: Usando createdb
createdb sistema_kiosco
```

### 1.2 Verificar que PostgreSQL esté corriendo

```bash
# Verificar conexión
psql -U postgres -d sistema_kiosco -c "SELECT version();"
```

---

## 🔧 Paso 2: Configurar Backend

### 2.1 Instalar dependencias del backend

```bash
# Desde la raíz del proyecto
npm install
```

### 2.2 Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/sistema_kiosco?schema=public"
PORT=3000
NODE_ENV=development
JWT_SECRET=tu-secret-key-super-segura-cambiar-en-produccion
JWT_EXPIRES_IN=24h
```

**⚠️ IMPORTANTE:** 
- Reemplaza `usuario` y `password` con tus credenciales de PostgreSQL
- Cambia `JWT_SECRET` por una clave segura en producción

### 2.3 Generar Prisma Client

```bash
npm run db:generate
```

### 2.4 Ejecutar migraciones

```bash
npm run db:migrate
```

Esto creará todas las tablas en la base de datos:
- usuarios
- proveedores
- productos
- lotes
- compras
- compra_items
- ventas
- venta_items

---

## 🎨 Paso 3: Configurar Frontend

### 3.1 Instalar dependencias del frontend

```bash
cd frontend
npm install
```

### 3.2 Configurar variables de entorno (opcional)

Crea un archivo `.env` en `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
```

(Esto es opcional, ya que por defecto usa `http://localhost:3000/api`)

---

## 👤 Paso 4: Crear Usuario Inicial

### 4.1 Iniciar el servidor backend

En una terminal, desde la raíz del proyecto:

```bash
npm run dev
```

Deberías ver:
```
🚀 Servidor ejecutándose en http://localhost:3000
📚 API disponible en http://localhost:3000/api
💚 Health check: http://localhost:3000/api/health
```

### 4.2 Crear usuario dueño (Opción 1: Usando curl)

```bash
curl -X POST http://localhost:3000/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Dueño del Kiosco",
    "email": "dueño@kiosco.com",
    "password": "admin123",
    "rol": "DUENO"
  }'
```

### 4.3 Crear usuario empleado (Opcional)

```bash
curl -X POST http://localhost:3000/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Empleado Test",
    "email": "empleado@kiosco.com",
    "password": "empleado123",
    "rol": "EMPLEADO"
  }'
```

### 4.4 Verificar que los usuarios se crearon

```bash
# Verificar health check
curl http://localhost:3000/api/health
```

---

## 🖥️ Paso 5: Iniciar Frontend

### 5.1 Iniciar servidor de desarrollo

En una **nueva terminal**, desde la carpeta `frontend`:

```bash
cd frontend
npm run dev
```

Deberías ver:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## ✅ Paso 6: Probar el Sistema

### 6.1 Iniciar Sesión

1. Abre tu navegador en: `http://localhost:5173`
2. Serás redirigido a la página de login
3. Ingresa las credenciales del usuario dueño:
   - **Email:** `dueño@kiosco.com`
   - **Password:** `admin123`
4. Haz clic en "Iniciar Sesión"

### 6.2 Verificar Dashboard

- Deberías ver el Dashboard con métricas
- Verifica que veas:
  - Total de Productos
  - Total de Ventas
  - Ganancias Totales
  - Alertas de Stock

### 6.3 Probar Módulo de Productos (Solo DUEÑO)

1. Ve a **Productos** en el menú lateral
2. Haz clic en **"Nuevo Producto"**
3. Completa el formulario:
   - Código: `PROD001`
   - Nombre: `Coca Cola 500ml`
   - Precio Compra: `50`
   - Precio Venta: `80`
   - Stock Mínimo: `10`
4. Haz clic en **"Crear Producto"**
5. Verifica que el producto aparezca en la tabla

### 6.4 Probar Módulo de Proveedores (Solo DUEÑO)

1. Ve a **Proveedores** en el menú lateral
2. Haz clic en **"Nuevo Proveedor"**
3. Completa el formulario:
   - Nombre: `Distribuidora ABC`
   - Contacto: `Juan Pérez`
   - Teléfono: `+5491123456789`
   - Email: `contacto@distribuidora.com`
4. Haz clic en **"Crear Proveedor"**
5. Verifica que el proveedor aparezca en la lista

### 6.5 Probar Módulo de Ventas (Todos los usuarios)

1. Ve a **Ventas** en el menú lateral
2. Haz clic en **"Nueva Venta"**
3. En el formulario:
   - Selecciona un producto del dropdown
   - Ingresa la cantidad (ej: `2`)
   - Selecciona método de pago: `efectivo`
4. Haz clic en **"Registrar Venta"**
5. Verifica que:
   - La venta aparezca en el historial
   - El total y ganancias se calculen correctamente
   - El stock del producto se actualice

### 6.6 Probar Control de Stock

1. Ve a **Stock** en el menú lateral
2. Si hay productos con stock bajo, deberían aparecer aquí
3. Crea un producto con stock actual menor al stock mínimo para probar

### 6.7 Probar Vencimientos

1. Ve a **Vencimientos** en el menú lateral
2. Deberías ver:
   - Lotes vencidos (si hay)
   - Lotes próximos a vencer (si hay)
3. Puedes ajustar los días de anticipación

### 6.8 Probar Reportes (Solo DUEÑO)

1. Ve a **Reportes** en el menú lateral
2. Selecciona un rango de fechas
3. Haz clic en **"Generar Reporte"**
4. Verifica que se muestren:
   - Total de Ventas
   - Total de Ganancias
   - Margen de Ganancia
   - Cantidad de Ventas

### 6.9 Probar Permisos de Empleado

1. **Cerrar sesión** (botón en el sidebar)
2. Iniciar sesión con el usuario empleado:
   - **Email:** `empleado@kiosco.com`
   - **Password:** `empleado123`
3. Verifica que:
   - ✅ Puede ver Dashboard
   - ✅ Puede ver Ventas y registrar ventas
   - ✅ Puede ver Stock y Vencimientos
   - ❌ NO puede ver Productos, Proveedores, Reportes en el menú
   - ❌ Si intenta acceder directamente a `/productos`, será redirigido

---

## 🧪 Pruebas Adicionales con API

### Verificar Autenticación

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dueño@kiosco.com",
    "password": "admin123"
  }'

# Guarda el token que recibas en la respuesta
```

### Crear Producto via API (requiere token)

```bash
# Reemplaza YOUR_TOKEN con el token obtenido del login
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "codigo": "PROD002",
    "nombre": "Pepsi 500ml",
    "precioCompra": 45,
    "precioVenta": 75,
    "stockMinimo": 10
  }'
```

### Listar Productos

```bash
curl -X GET http://localhost:3000/api/productos \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Registrar Venta via API

```bash
# Primero obtén el ID de un producto del listado anterior
curl -X POST http://localhost:3000/api/ventas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [
      {
        "productoId": "PRODUCT_ID_AQUI",
        "cantidad": 3
      }
    ],
    "metodoPago": "efectivo"
  }'
```

---

## 🔍 Verificar Base de Datos

### Usar Prisma Studio (Interfaz Visual)

```bash
# Desde la raíz del proyecto
npm run db:studio
```

Esto abrirá una interfaz web en `http://localhost:5555` donde puedes:
- Ver todas las tablas
- Explorar datos
- Editar registros manualmente

### Consultas SQL Directas

```bash
# Conectar a PostgreSQL
psql -U postgres -d sistema_kiosco

# Ver usuarios
SELECT id, nombre, email, rol FROM usuarios;

# Ver productos
SELECT codigo, nombre, precio_compra, precio_venta, stock_actual FROM productos;

# Ver ventas del día
SELECT numero_venta, fecha_venta, total, ganancia 
FROM ventas 
WHERE DATE(fecha_venta) = CURRENT_DATE;

# Ver ventas por usuario
SELECT u.nombre, COUNT(v.id) as total_ventas, SUM(v.total) as total_ingresos
FROM ventas v
JOIN usuarios u ON v.usuario_id = u.id
GROUP BY u.id, u.nombre;
```

---

## 🐛 Solución de Problemas

### Error: "Cannot find module '@prisma/client'"

```bash
npm run db:generate
```

### Error: "Database connection failed"

1. Verifica que PostgreSQL esté corriendo:
   ```bash
   # Windows
   net start postgresql-x64-14
   
   # Linux/Mac
   sudo systemctl start postgresql
   ```

2. Verifica las credenciales en `.env`
3. Verifica que la base de datos exista

### Error: "Relation does not exist"

```bash
npm run db:migrate
```

### Error: "Token inválido o expirado"

1. Cierra sesión y vuelve a iniciar sesión
2. Verifica que el token esté en el header Authorization

### Error: "No tienes permisos"

- Verifica que estés usando una cuenta con el rol correcto
- Algunas acciones solo están disponibles para DUEÑO

### Frontend no se conecta al backend

1. Verifica que el backend esté corriendo en `http://localhost:3000`
2. Verifica la configuración de proxy en `frontend/vite.config.ts`
3. Verifica que no haya errores de CORS (el backend tiene CORS habilitado)

---

## ✅ Checklist de Pruebas

- [ ] Base de datos creada y migraciones ejecutadas
- [ ] Usuario dueño creado
- [ ] Usuario empleado creado (opcional)
- [ ] Backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 5173
- [ ] Login funciona correctamente
- [ ] Dashboard muestra datos correctos
- [ ] Productos: crear, listar (solo DUEÑO)
- [ ] Proveedores: crear, listar (solo DUEÑO)
- [ ] Ventas: registrar, listar (todos los usuarios)
- [ ] Stock: ver productos con stock bajo
- [ ] Vencimientos: ver lotes vencidos y por vencer
- [ ] Reportes: generar reporte de ganancias (solo DUEÑO)
- [ ] Permisos: verificar que empleado tiene acceso limitado
- [ ] Registro de ventas: verificar que cada venta registra el usuario

---

## 📝 Notas Finales

1. **Primera vez:** El sistema inicia sin datos, crea productos y proveedores primero
2. **Ventas:** Cada venta debe registrar el usuario que la realizó
3. **Roles:** Las restricciones de roles se aplican tanto en frontend como backend
4. **Tokens:** Los tokens JWT expiran en 24 horas (configurable)
5. **Producción:** Cambia `JWT_SECRET` y `NODE_ENV` para producción

---

## 🎉 ¡Sistema Listo!

Si completaste todos los pasos, tu sistema está funcionando correctamente. 

Para más información, consulta:
- `README.md` - Documentación general
- `API.md` - Documentación de la API
- `frontend/README.md` - Documentación del frontend

