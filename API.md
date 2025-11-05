# 📚 Documentación de la API - Sistema de Gestión de Kiosco

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### Health Check
```
GET /api/health
```
Verifica el estado del servidor.

**Respuesta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🛍️ Productos

### Crear Producto
```
POST /api/productos
```

**Body:**
```json
{
  "codigo": "PROD001",
  "nombre": "Coca Cola 500ml",
  "descripcion": "Bebida gaseosa",
  "categoria": "Bebidas",
  "precioCompra": 50.00,
  "precioVenta": 80.00,
  "stockMinimo": 10,
  "tieneVencimiento": false,
  "proveedorId": "uuid-del-proveedor"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "codigo": "PROD001",
    "nombre": "Coca Cola 500ml",
    "precioCompra": 50.00,
    "precioVenta": 80.00,
    "stockActual": 0,
    ...
  }
}
```

### Listar Productos
```
GET /api/productos?activos=true
```

**Query Parameters:**
- `activos` (opcional): `true` | `false` - Filtrar por productos activos

**Respuesta:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

### Productos con Stock Bajo
```
GET /api/productos/stock-bajo
```

Obtiene productos cuyo stock actual está por debajo del stock mínimo.

---

## 👥 Proveedores

### Crear Proveedor
```
POST /api/proveedores
```

**Body:**
```json
{
  "nombre": "Distribuidora ABC",
  "contacto": "Juan Pérez",
  "telefono": "+5491123456789",
  "email": "contacto@distribuidora.com",
  "direccion": "Av. Principal 123"
}
```

### Listar Proveedores
```
GET /api/proveedores?activos=true
```

---

## 💰 Ventas

### Registrar Venta
```
POST /api/ventas
```

**Body:**
```json
{
  "items": [
    {
      "productoId": "uuid-del-producto",
      "loteId": "uuid-del-lote",
      "cantidad": 2
    }
  ],
  "metodoPago": "efectivo",
  "notas": "Venta al contado"
}
```

**Nota:** Si el producto tiene vencimiento, `loteId` es obligatorio.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "numeroVenta": "V-1234567890-123",
    "fechaVenta": "2024-01-01T00:00:00.000Z",
    "total": 160.00,
    "ganancia": 60.00,
    "metodoPago": "efectivo",
    "items": [...]
  }
}
```

### Listar Ventas
```
GET /api/ventas?fechaInicio=2024-01-01&fechaFin=2024-01-31
```

**Query Parameters:**
- `fechaInicio` (opcional): Fecha de inicio (ISO 8601)
- `fechaFin` (opcional): Fecha de fin (ISO 8601)

---

## 📦 Lotes

### Lotes Vencidos
```
GET /api/lotes/vencidos
```

Obtiene todos los lotes que han vencido y aún tienen stock disponible.

### Lotes Por Vencer
```
GET /api/lotes/por-vencer?dias=30
```

Obtiene lotes que están próximos a vencer (por defecto 30 días).

**Query Parameters:**
- `dias` (opcional): Días de anticipación (default: 30)

---

## 📊 Reportes

### Reporte de Ganancias
```
GET /api/reportes/ganancias?fechaInicio=2024-01-01&fechaFin=2024-01-31
```

**Query Parameters:**
- `fechaInicio` (opcional): Fecha de inicio (default: hace 30 días)
- `fechaFin` (opcional): Fecha de fin (default: hoy)

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "totalVentas": 10000.00,
    "totalGanancias": 3500.00,
    "margenGanancia": 53.85,
    "cantidadVentas": 150,
    "fechaInicio": "2024-01-01T00:00:00.000Z",
    "fechaFin": "2024-01-31T23:59:59.999Z"
  }
}
```

---

## 🔒 Manejo de Errores

Todos los errores siguen este formato:

```json
{
  "error": "Mensaje de error",
  "details": [...] // Solo en errores de validación
}
```

**Códigos de Estado:**
- `200` - OK
- `201` - Creado
- `400` - Error de validación
- `404` - No encontrado
- `500` - Error interno del servidor

