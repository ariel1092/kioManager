# 🎫 Guía de Tickets de Venta

Sistema de generación e impresión de tickets de venta para el Sistema de Gestión de Kiosco.

## 📋 Características

- ✅ Generación automática de tickets al completar una venta
- ✅ Vista previa del ticket antes de imprimir
- ✅ Formato optimizado para impresoras térmicas (80mm)
- ✅ Reimpresión de tickets desde el historial
- ✅ Personalización básica (nombre del kiosco, mensaje)

## 🖨️ Cómo Imprimir Tickets

### Opción 1: Después de Completar una Venta

1. **Registra una venta** desde el módulo de Ventas
2. Al completarse, se abre el modal "Venta Completada"
3. Haz clic en **"Imprimir Ticket"** (botón verde)
4. Se abrirá la ventana de impresión del navegador
5. Selecciona tu impresora térmica y haz clic en "Imprimir"

### Opción 2: Reimprimir desde el Historial

1. Ve a la página de **Ventas**
2. En la tabla de ventas, busca la venta que deseas reimprimir
3. Haz clic en el icono de impresora (🖨️) en la columna "Acciones"
4. Se abrirá la ventana de impresión

### Opción 3: Vista Previa

1. En el modal "Venta Completada", haz clic en **"Ver Ticket"**
2. Se mostrará una vista previa del ticket
3. Desde ahí puedes hacer clic en **"Imprimir"**

## ⚙️ Configuración de Impresora

### Para Impresoras Térmicas (80mm)

**Recomendaciones:**
- **Ancho de papel:** 80mm (3.15 pulgadas)
- **Márgenes:** Mínimos o sin márgenes
- **Calidad:** Borrador (ahorra papel)
- **Encabezados y pies de página:** Desactivados

**Pasos en Windows:**
1. Abre "Configuración de impresora"
2. Selecciona tu impresora térmica
3. Configura:
   - Tamaño: 80mm x Rollo
   - Márgenes: Mínimos
   - Calidad: Borrador

**Pasos al Imprimir:**
1. En la ventana de impresión del navegador
2. Haz clic en "Más configuraciones"
3. Ajusta:
   - Márgenes: Mínimos
   - Escala: 100%
   - Encabezados y pies: Desactivados

## 🎨 Personalización del Ticket

Actualmente, el ticket muestra:
- Nombre del kiosco (por defecto: "Kiosco")
- Dirección (opcional)
- Teléfono (opcional)
- Email (opcional)
- Número de ticket
- Fecha y hora
- Lista de productos con cantidades y precios
- Total de la venta
- Método de pago
- Mensaje personalizado (por defecto: "Gracias por su compra")

### Personalizar en el Código

Edita `frontend/src/components/ventas/ModalVentaCompletada.tsx`:

```typescript
const config = {
  nombreKiosco: 'Tu Kiosco',
  direccion: 'Calle Principal 123',
  telefono: '011-1234-5678',
  email: 'contacto@tukiosco.com',
  mensajePersonalizado: 'Gracias por su compra',
};
```

## 📱 Formato del Ticket

El ticket está diseñado para impresoras térmicas de 80mm y incluye:

### Encabezado
- Nombre del kiosco (en negrita, grande)
- Dirección, teléfono, email (si están configurados)

### Detalles de la Venta
- Número de ticket
- Fecha y hora

### Productos
- Nombre del producto
- Cantidad × Precio unitario
- Subtotal por producto

### Totales
- Total de la venta (destacado)

### Método de Pago
- Efectivo, Tarjeta, Transferencia, etc.

### Mensaje
- Mensaje personalizado configurable

### Pie
- Año actual
- Sistema de Gestión de Kiosco

## 🔧 Solución de Problemas

### El ticket no se imprime correctamente

**Problema:** El ticket se corta o no se ve completo
**Solución:**
- Verifica que la impresora esté configurada para papel de 80mm
- Ajusta los márgenes a "Mínimos" en la ventana de impresión
- Verifica que no haya encabezados o pies de página activos

### El ticket se ve muy pequeño

**Problema:** El texto es muy pequeño en la impresión
**Solución:**
- Asegúrate de usar la opción "Tamaño real" en la impresión
- No uses "Ajustar a página" o "Reducir"
- Verifica la configuración de la impresora

### No se abre la ventana de impresión

**Problema:** El navegador bloquea ventanas emergentes
**Solución:**
1. Permite ventanas emergentes para este sitio
2. En Chrome: Configuración → Privacidad y seguridad → Configuración del sitio → Ventanas emergentes y redirecciones
3. Agrega tu sitio a la lista de permitidos

### El ticket no tiene el formato correcto

**Problema:** El ticket se ve diferente al esperado
**Solución:**
- Verifica que estés usando una impresora térmica de 80mm
- No uses impresoras de inyección de tinta para tickets
- Considera usar una impresora térmica dedicada (Epson TM-T20, Star TSP143, etc.)

## 📦 Impresoras Recomendadas

### Impresoras Térmicas de 80mm

1. **Epson TM-T20** (muy popular)
2. **Star TSP143** (buena relación precio/calidad)
3. **Bixolon SRP-350** (económica)
4. **Zjiang ZJ-5870** (económica)

### Configuración Genérica

Para cualquier impresora térmica:
- Ancho: 80mm
- Tipo: Rollo térmico
- Resolución: 203 DPI (estándar)

## 🚀 Próximas Mejoras

- [ ] Panel de configuración para personalizar el ticket sin editar código
- [ ] Logo del kiosco en el ticket
- [ ] Código QR en el ticket
- [ ] Integración directa con impresoras térmicas (sin ventana de impresión)
- [ ] Plantillas de ticket predefinidas
- [ ] Impresión automática al completar venta (opcional)

## 📝 Notas Técnicas

- El ticket se genera como HTML y se imprime usando la API nativa del navegador
- Compatible con Chrome, Edge, Firefox, Safari
- El formato está optimizado para impresoras térmicas de 80mm
- Los estilos CSS están diseñados para impresión en papel térmico

---

**¿Necesitas ayuda?** Consulta la documentación o contacta al soporte técnico.

