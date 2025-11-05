# 🚀 Guía de Deployment en Producción

Guía completa para desplegar el Sistema de Gestión de Kiosco en un servidor de producción.

## 📋 Prerrequisitos

1. **Servidor VPS** (Ubuntu 22.04 LTS recomendado)
2. **Dominio** (opcional, pero recomendado)
3. **Acceso SSH** al servidor
4. **Conocimientos básicos** de Linux

---

## 🎯 Opción Recomendada: VPS con Docker

### Paso 1: Contratar VPS

**DigitalOcean (Recomendado):**
- **Plan:** Basic, Regular Intel
- **Especificaciones:** 2GB RAM, 1 CPU, 20GB SSD
- **Precio:** ~$12 USD/mes
- **Ubicación:** Más cercana a Argentina

**Alternativas:**
- **Hetzner:** €4/mes (muy económico)
- **Vultr:** $5/mes
- **Linode:** $5/mes

---

### Paso 2: Configurar Servidor

#### 2.1 Conectar por SSH

```bash
ssh root@tu-servidor-ip
```

#### 2.2 Ejecutar Script de Configuración

```bash
# Opción A: Desde el servidor
curl -o setup.sh https://raw.githubusercontent.com/tu-repo/sistema-kiosco/main/scripts/setup-servidor.sh
chmod +x setup.sh
./setup.sh

# Opción B: Copiar script localmente
scp scripts/setup-servidor.sh root@tu-servidor:/root/
ssh root@tu-servidor
chmod +x setup-servidor.sh
./setup-servidor.sh
```

El script instalará:
- ✅ Docker
- ✅ Docker Compose
- ✅ Nginx
- ✅ Certbot (para SSL)
- ✅ Firewall (UFW)

---

### Paso 3: Subir Código al Servidor

#### Opción A: Git (Recomendado)

```bash
cd /opt
git clone https://github.com/tu-usuario/sistema-kiosco.git
cd sistema-kiosco
```

#### Opción B: SCP (desde tu PC)

```bash
scp -r sistema-kiosco/ root@tu-servidor:/opt/
ssh root@tu-servidor
cd /opt/sistema-kiosco
```

---

### Paso 4: Configurar Variables de Entorno

```bash
cd /opt/sistema-kiosco
cp .env.example .env
nano .env
```

**Configurar `.env`:**

```env
# Base de Datos
POSTGRES_USER=postgres
POSTGRES_PASSWORD=contraseña-super-segura-aqui
POSTGRES_DB=sistema_kiosco

# Backend
DATABASE_URL=postgresql://postgres:contraseña-super-segura-aqui@db:5432/sistema_kiosco?schema=public
PORT=3000
NODE_ENV=production
JWT_SECRET=genera-una-clave-secreta-super-segura-aqui
JWT_EXPIRES_IN=24h

# Frontend
VITE_API_URL=https://tu-dominio.com/api
```

**Generar JWT_SECRET seguro:**
```bash
openssl rand -base64 32
```

---

### Paso 5: Configurar Nginx

#### 5.1 Crear Configuración de Nginx

```bash
# Editar configuración
nano /etc/nginx/sites-available/sistema-kiosco
```

O usar el script automatizado:
```bash
./scripts/nginx-config.sh tu-dominio.com
```

#### 5.2 Habilitar Sitio

```bash
ln -s /etc/nginx/sites-available/sistema-kiosco /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

### Paso 6: Obtener Certificado SSL

```bash
# Obtener certificado SSL gratuito
certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Renovar automáticamente (se configura automáticamente)
certbot renew --dry-run
```

---

### Paso 7: Deployar Aplicación

```bash
cd /opt/sistema-kiosco

# Opción A: Usar script de deployment
./scripts/deploy.sh

# Opción B: Manual
docker-compose -f docker-compose.prod.yml up -d --build
```

---

### Paso 8: Verificar Deployment

```bash
# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Ver estado de contenedores
docker-compose -f docker-compose.prod.yml ps

# Probar API
curl http://localhost:3000/api/health

# Probar Frontend
curl http://localhost:5173
```

---

### Paso 9: Crear Usuario Inicial

```bash
# Conectarse al contenedor del backend
docker exec -it sistema-kiosco-backend-prod sh

# Ejecutar script de creación de usuario
node scripts/crear-usuario-dueno.js

# O crear manualmente via API
curl -X POST https://tu-dominio.com/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Dueño",
    "email": "dueno@kiosco.com",
    "password": "admin123",
    "rol": "DUENO"
  }'
```

---

## 🔄 Actualizaciones

### Actualizar Aplicación

```bash
cd /opt/sistema-kiosco

# 1. Obtener último código
git pull origin main

# 2. Reconstruir y reiniciar
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Ejecutar migraciones si hay
docker-compose -f docker-compose.prod.yml run --rm backend npx prisma migrate deploy
```

---

## 💾 Backups

### Configurar Backup Automático

Crear script `/opt/sistema-kiosco/scripts/backup-automatico.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/opt/sistema-kiosco/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup de base de datos
docker exec sistema-kiosco-db-prod pg_dump -U postgres sistema_kiosco > $BACKUP_DIR/backup_$DATE.sql

# Mantener solo últimos 7 días
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

Agregar a crontab:
```bash
crontab -e
# Backup diario a las 2 AM
0 2 * * * /opt/sistema-kiosco/scripts/backup-automatico.sh
```

---

## 📊 Monitoreo

### Ver Logs

```bash
# Todos los servicios
docker-compose -f docker-compose.prod.yml logs -f

# Solo backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Solo frontend
docker-compose -f docker-compose.prod.yml logs -f frontend

# Solo base de datos
docker-compose -f docker-compose.prod.yml logs -f db
```

### Verificar Estado

```bash
# Estado de contenedores
docker-compose -f docker-compose.prod.yml ps

# Uso de recursos
docker stats

# Espacio en disco
df -h
```

---

## 🔒 Seguridad

### Checklist de Seguridad:

- [x] SSL/HTTPS configurado
- [x] Firewall activado (solo puertos 22, 80, 443)
- [x] JWT_SECRET fuerte y único
- [x] Contraseña de PostgreSQL segura
- [x] Variables de entorno no expuestas
- [x] Backups automáticos configurados
- [x] Logs de seguridad activos

### Actualizar Sistema

```bash
# Actualizar paquetes del sistema
apt update && apt upgrade -y

# Actualizar contenedores Docker
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🆘 Troubleshooting

### La aplicación no inicia

```bash
# Ver logs de errores
docker-compose -f docker-compose.prod.yml logs

# Verificar variables de entorno
docker-compose -f docker-compose.prod.yml config

# Reiniciar contenedores
docker-compose -f docker-compose.prod.yml restart
```

### Error de conexión a base de datos

```bash
# Verificar que la base de datos esté corriendo
docker-compose -f docker-compose.prod.yml ps db

# Ver logs de la base de datos
docker-compose -f docker-compose.prod.yml logs db

# Verificar conexión
docker exec -it sistema-kiosco-db-prod psql -U postgres -d sistema_kiosco
```

### Error 502 Bad Gateway

```bash
# Verificar que backend esté corriendo
docker-compose -f docker-compose.prod.yml ps backend

# Verificar logs de Nginx
tail -f /var/log/nginx/error.log

# Verificar configuración de Nginx
nginx -t
```

---

## 📚 Recursos Adicionales

- **DigitalOcean Tutorials:** https://www.digitalocean.com/community/tutorials
- **Docker Documentation:** https://docs.docker.com
- **Nginx Documentation:** https://nginx.org/en/docs/
- **Let's Encrypt:** https://letsencrypt.org

---

## 💰 Costos Estimados

### Servidor VPS
- **VPS:** $12 USD/mes (~$12,000 ARS/mes)
- **Dominio:** $1-2 USD/mes (~$1,000 ARS/mes)
- **SSL:** Gratis (Let's Encrypt)
- **Total:** ~$13-14 USD/mes

**Puedes alojar 5-10 clientes en un solo servidor**

**Costo por cliente:** $1.30 - $2.80 USD/mes

---

## 🎯 Próximos Pasos

1. **Contratar VPS** (DigitalOcean recomendado)
2. **Configurar servidor** (usar script automatizado)
3. **Deployar aplicación** (usar docker-compose.prod.yml)
4. **Configurar dominio y SSL**
5. **Probar en producción**
6. **Configurar backups automáticos**

---

**¿Necesitas ayuda con algún paso específico?**

