# 🚀 Guía de Instalación - Sistema de Gestión de Kiosco

## Prerrequisitos

- **Node.js** 18 o superior
- **PostgreSQL** 14 o superior
- **npm** o **yarn**

## Instalación Paso a Paso

### 1. Clonar o descargar el proyecto

```bash
cd sistema-kiosco
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/sistema_kiosco?schema=public"
PORT=3000
NODE_ENV=development
```

**Nota:** Reemplazar `usuario`, `password` y `sistema_kiosco` con tus credenciales de PostgreSQL.

### 4. Crear base de datos

```bash
# Conectar a PostgreSQL y crear la base de datos
createdb sistema_kiosco

# O usar psql:
psql -U postgres -c "CREATE DATABASE sistema_kiosco;"
```

### 5. Generar Prisma Client

```bash
npm run db:generate
```

### 6. Ejecutar migraciones

```bash
npm run db:migrate
```

Esto creará todas las tablas necesarias en la base de datos.

### 7. Iniciar servidor de desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

---

## Usando Docker (Opcional)

### Opción 1: Solo Base de Datos

```bash
docker-compose up -d db
```

Esto iniciará solo PostgreSQL en el puerto 5432.

### Opción 2: Aplicación Completa

```bash
docker-compose up -d
```

Esto iniciará tanto la base de datos como la aplicación.

---

## Verificar Instalación

1. **Health Check:**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Prisma Studio** (Interface visual para la base de datos):
   ```bash
   npm run db:studio
   ```

---

## Scripts Disponibles

- `npm run dev` - Inicia servidor en modo desarrollo (con hot-reload)
- `npm run build` - Compila TypeScript a JavaScript
- `npm run start` - Inicia servidor en modo producción
- `npm test` - Ejecuta tests
- `npm run db:generate` - Genera Prisma Client
- `npm run db:migrate` - Ejecuta migraciones de base de datos
- `npm run db:studio` - Abre Prisma Studio
- `npm run lint` - Ejecuta linter
- `npm run format` - Formatea código con Prettier

---

## Estructura del Proyecto

```
sistema-kiosco/
├── src/
│   ├── domain/              # Capa de Dominio
│   │   ├── entities/        # Entidades de negocio
│   │   └── repositories/    # Interfaces de repositorios
│   ├── application/         # Capa de Aplicación
│   │   └── use-cases/       # Casos de uso
│   ├── infrastructure/      # Capa de Infraestructura
│   │   ├── api/            # API REST (controllers, routes)
│   │   ├── repositories/   # Implementaciones de repositorios
│   │   └── database/       # Configuración de base de datos
│   └── shared/             # Utilidades compartidas
├── prisma/
│   └── schema.prisma       # Esquema de base de datos
└── package.json
```

---

## Próximos Pasos

1. **Crear un proveedor:**
   ```bash
   curl -X POST http://localhost:3000/api/proveedores \
     -H "Content-Type: application/json" \
     -d '{"nombre": "Distribuidora ABC"}'
   ```

2. **Crear un producto:**
   ```bash
   curl -X POST http://localhost:3000/api/productos \
     -H "Content-Type: application/json" \
     -d '{
       "codigo": "PROD001",
       "nombre": "Coca Cola 500ml",
       "precioCompra": 50,
       "precioVenta": 80,
       "stockMinimo": 10
     }'
   ```

3. **Consultar la documentación de la API** en `API.md`

---

## Solución de Problemas

### Error: "Cannot find module '@prisma/client'"
```bash
npm run db:generate
```

### Error: "Database connection failed"
- Verificar que PostgreSQL esté corriendo
- Verificar las credenciales en `.env`
- Verificar que la base de datos exista

### Error: "Relation does not exist"
```bash
npm run db:migrate
```

---

## Soporte

Para más información, consulta:
- `README.md` - Documentación general
- `API.md` - Documentación de la API
- `prisma/schema.prisma` - Esquema de base de datos


