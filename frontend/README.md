# 🎨 Frontend - Sistema de Gestión de Kiosco

Frontend moderno desarrollado con React + TypeScript + Vite para el sistema de gestión de kiosco.

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool moderna y rápida
- **React Router** - Navegación
- **TanStack Query** - Manejo de estado del servidor
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Tailwind CSS** - Estilos utility-first
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **date-fns** - Manejo de fechas

## 📦 Instalación

1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. Configurar variables de entorno (opcional):
```bash
# Crear archivo .env
VITE_API_URL=http://localhost:3000/api
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/             # Componentes de UI base
│   │   ├── Layout.tsx      # Layout principal
│   │   ├── Navbar.tsx      # Barra de navegación
│   │   └── Sidebar.tsx     # Menú lateral
│   ├── pages/              # Páginas principales
│   │   ├── Dashboard.tsx
│   │   ├── Productos.tsx
│   │   ├── Proveedores.tsx
│   │   ├── Ventas.tsx
│   │   ├── Stock.tsx
│   │   ├── Vencimientos.tsx
│   │   └── Reportes.tsx
│   ├── services/           # Servicios de API
│   │   └── api.ts          # Cliente HTTP
│   ├── types/              # Tipos TypeScript
│   │   └── index.ts
│   ├── config/             # Configuración
│   │   └── api.ts
│   ├── App.tsx             # Componente raíz
│   ├── main.tsx            # Punto de entrada
│   └── index.css            # Estilos globales
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 📚 Módulos Implementados

### 1. Dashboard
- Resumen general con métricas clave
- Alertas de stock bajo
- Lotes vencidos
- Estadísticas rápidas

### 2. Productos
- Listado de productos
- Crear nuevo producto
- Visualización de stock
- Alertas de stock bajo

### 3. Proveedores
- Listado de proveedores
- Crear nuevo proveedor
- Información de contacto

### 4. Ventas
- Registrar nueva venta
- Historial de ventas
- Cálculo automático de ganancias
- Resumen de ingresos

### 5. Stock
- Productos con stock bajo
- Alertas visuales
- Niveles de stock críticos

### 6. Vencimientos
- Lotes vencidos
- Lotes próximos a vencer
- Configuración de días de anticipación

### 7. Reportes
- Reporte de ganancias
- Filtros por fecha
- Métricas financieras
- Análisis de margen

## 🎨 Componentes UI

### Componentes Base
- `Button` - Botones con variantes
- `Input` - Inputs con validación
- `Card` - Tarjetas contenedoras
- `Modal` - Modales
- `Loading` - Indicador de carga
- `Alert` - Alertas informativas

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run preview` - Previsualiza build de producción
- `npm run lint` - Ejecuta linter

## 🌐 API Integration

El frontend se conecta automáticamente con el backend en `http://localhost:3000/api`.

El proxy está configurado en `vite.config.ts` para desarrollo.

## 📝 Notas de Desarrollo

- Todos los componentes están tipados con TypeScript
- Se usa React Query para caché y sincronización automática
- Los formularios usan React Hook Form con validación Zod
- Los estilos usan Tailwind CSS con configuración personalizada
- Los iconos provienen de Lucide React

## 🚀 Build para Producción

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`.

## 📄 Licencia

MIT

