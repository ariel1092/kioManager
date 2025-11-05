# 🌐 Guía de Hosting y Deployment

Opciones para alojar el Sistema de Gestión de Kiosco en producción.

## 📋 Opciones de Hosting

### 1. **VPS (Servidor Virtual Privado)** ⭐ RECOMENDADO

**Ventajas:**
- ✅ Control total sobre el servidor
- ✅ Precio accesible ($5-20 USD/mes)
- ✅ Puedes instalar lo que necesites
- ✅ Ideal para múltiples clientes

**Desventajas:**
- ❌ Requiere conocimientos técnicos
- ❌ Tú gestionas actualizaciones y seguridad

**Proveedores recomendados:**
- **DigitalOcean** ($6-12 USD/mes)
- **Linode** ($5-10 USD/mes)
- **Vultr** ($5-10 USD/mes)
- **Hetzner** (€4-8/mes) - Muy económico
- **AWS Lightsail** ($5-10 USD/mes)

**Especificaciones mínimas:**
- CPU: 1-2 cores
- RAM: 2GB (4GB recomendado)
- Disco: 20GB SSD
- OS: Ubuntu 22.04 LTS

---

### 2. **Cloud Platforms (Servicios Gestionados)**

#### 2.1 **Heroku** 🟢 FÁCIL

**Ventajas:**
- ✅ Deployment muy simple
- ✅ Base de datos gestionada
- ✅ Escalado automático
- ✅ SSL gratuito

**Desventajas:**
- ❌ Precio más alto ($7-25 USD/mes)
- ❌ Limitaciones de recursos en plan gratuito

**Precio:**
- **Hobby:** $7 USD/mes (app) + $9 USD/mes (PostgreSQL)
- **Standard:** $25 USD/mes (app) + $50 USD/mes (PostgreSQL)

**Ideal para:** Clientes que pagan bien, no quieres gestionar servidor

---

#### 2.2 **Railway** 🟢 MODERNO

**Ventajas:**
- ✅ Muy fácil de usar
- ✅ PostgreSQL incluido
- ✅ Deployment automático desde GitHub
- ✅ Precio razonable

**Desventajas:**
- ❌ Relativamente nuevo (menos maduro)

**Precio:**
- **Hobby:** $5 USD/mes + uso
- **Pro:** $20 USD/mes + uso

---

#### 2.3 **Render** 🟢 BUENA OPCIÓN

**Ventajas:**
- ✅ Gratis para proyectos pequeños
- ✅ PostgreSQL incluido
- ✅ SSL automático
- ✅ Deployment desde GitHub

**Desventajas:**
- ❌ Plan gratuito se "duerme" después de 15 min sin uso
- ❌ Plan pago: $7 USD/mes

---

#### 2.4 **AWS / Google Cloud / Azure**

**Ventajas:**
- ✅ Muy escalable
- ✅ Servicios gestionados
- ✅ Alta disponibilidad

**Desventajas:**
- ❌ Complejo de configurar
- ❌ Precio puede escalar rápido
- ❌ Requiere conocimientos avanzados

**Ideal para:** Clientes grandes, múltiples instancias

---

### 3. **VPS Argentinos** 🇦🇷

**Ventajas:**
- ✅ Pago en pesos
- ✅ Soporte en español
- ✅ Latencia baja para clientes argentinos

**Proveedores:**
- **DonWeb** ($2,000-5,000 ARS/mes)
- **Hostinger Argentina** ($1,500-3,000 ARS/mes)
- **Hostgator Argentina** ($2,000-4,000 ARS/mes)

**Consideraciones:**
- Verificar que soporten Node.js y PostgreSQL
- Revisar límites de recursos

---

## 🚀 Opción Recomendada: VPS con Docker

### ¿Por qué VPS?
- ✅ Precio accesible ($5-10 USD/mes ≈ $5,000-10,000 ARS/mes)
- ✅ Control total
- ✅ Puedes alojar múltiples clientes en un solo servidor
- ✅ Escalable

### Setup Recomendado

**Servidor:**
- Ubuntu 22.04 LTS
- 2GB RAM (mínimo)
- 1 CPU core (mínimo)
- 20GB SSD

**Stack:**
- Docker + Docker Compose
- Nginx (reverse proxy)
- PostgreSQL (en Docker)
- Node.js (en Docker)
- Certbot (SSL gratuito con Let's Encrypt)

---

## 📦 Deployment con Docker (Recomendado)

### Arquitectura Recomendada

```
┌─────────────────┐
│   Nginx (80/443)│  ← Reverse Proxy + SSL
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│Backend│ │Frontend │
│  :3000│ │  :5173  │
└───┬───┘ └─────────┘
    │
┌───▼────┐
│Postgres│
│  :5432 │
└────────┘
```

### Ventajas de Docker:
- ✅ Fácil deployment
- ✅ Aislamiento
- ✅ Escalable
- ✅ Versionado

---

## 🛠️ Setup Paso a Paso

### Opción 1: VPS con Docker (Recomendado)

#### Paso 1: Contratar VPS

**DigitalOcean (Recomendado):**
1. Ir a https://www.digitalocean.com
2. Crear cuenta
3. Crear Droplet:
   - **Ubuntu 22.04 LTS**
   - **Basic Plan**
   - **Regular Intel** (2GB RAM, 1 CPU)
   - **Ubicación:** Más cercana a Argentina
   - **Precio:** ~$12 USD/mes

**Alternativa económica:**
- **Hetzner** (€4/mes ≈ $4,500 ARS/mes)
- **Vultr** ($5/mes ≈ $5,000 ARS/mes)

#### Paso 2: Configurar Servidor

```bash
# Conectar por SSH
ssh root@tu-servidor-ip

# Actualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Instalar Nginx
apt install nginx -y

# Instalar Certbot (para SSL)
apt install certbot python3-certbot-nginx -y
```

#### Paso 3: Subir Código al Servidor

```bash
# Opción A: Git
git clone https://tu-repo.git /opt/sistema-kiosco
cd /opt/sistema-kiosco

# Opción B: SCP (desde tu PC)
scp -r sistema-kiosco/ root@tu-servidor:/opt/
```

#### Paso 4: Configurar Variables de Entorno

```bash
cd /opt/sistema-kiosco
nano .env
```

```env
# Producción
DATABASE_URL="postgresql://postgres:contraseña-segura@db:5432/sistema_kiosco?schema=public"
PORT=3000
NODE_ENV=production
JWT_SECRET=clave-super-segura-generada
JWT_EXPIRES_IN=24h
```

#### Paso 5: Configurar Docker Compose para Producción

Crear `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: sistema-kiosco-db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: contraseña-segura
      POSTGRES_DB: sistema_kiosco
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - sistema-kiosco-network

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: sistema-kiosco-backend
    restart: always
    environment:
      DATABASE_URL: postgresql://postgres:contraseña-segura@db:5432/sistema_kiosco?schema=public
      NODE_ENV: production
      PORT: 3000
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN}
    depends_on:
      - db
    networks:
      - sistema-kiosco-network
    command: sh -c "npx prisma generate && npx prisma migrate deploy && npm start"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: sistema-kiosco-frontend
    restart: always
    environment:
      VITE_API_URL: https://tu-dominio.com/api
    depends_on:
      - backend
    networks:
      - sistema-kiosco-network

volumes:
  postgres_data:

networks:
  sistema-kiosco-network:
```

#### Paso 6: Configurar Nginx (Reverse Proxy)

Crear `/etc/nginx/sites-available/sistema-kiosco`:

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    # Redirigir a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com www.tu-dominio.com;

    # Certificado SSL (se generará con Certbot)
    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Habilitar sitio
ln -s /etc/nginx/sites-available/sistema-kiosco /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Obtener certificado SSL
certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

#### Paso 7: Iniciar Aplicación

```bash
cd /opt/sistema-kiosco
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 💰 Costos Estimados

### Opción 1: VPS (DigitalOcean)
- **VPS:** $12 USD/mes (~$12,000 ARS/mes)
- **Dominio:** $1-2 USD/mes (~$1,000 ARS/mes)
- **SSL:** Gratis (Let's Encrypt)
- **Total:** ~$13-14 USD/mes (~$13,000 ARS/mes)

**Puedes alojar:** 5-10 clientes en un solo VPS

**Costo por cliente:** $1.30 - $2.80 USD/mes (~$1,300-2,800 ARS/mes)

---

### Opción 2: Heroku
- **App:** $7 USD/mes
- **PostgreSQL:** $9 USD/mes
- **Total:** $16 USD/mes (~$16,000 ARS/mes)

**Por cliente:** $16 USD/mes

---

### Opción 3: Railway
- **App + DB:** $5-20 USD/mes según uso
- **Total:** ~$10-25 USD/mes

---

## 🎯 Modelo de Negocio Recomendado

### Opción A: Incluir Hosting en el Precio

**Estrategia:**
- Vender sistema a $80,000 - $100,000 ARS (una vez)
- Incluir hosting por 1 año
- Después: $2,000 - $3,000 ARS/mes de hosting

**Ventajas:**
- ✅ Ingreso recurrente
- ✅ Control del servicio
- ✅ Actualizaciones más fáciles

---

### Opción B: Cliente Gestiona su Hosting

**Estrategia:**
- Vender sistema a $100,000 - $120,000 ARS
- Cliente gestiona su propio hosting
- Soporte técnico aparte

**Ventajas:**
- ✅ Menos responsabilidad
- ✅ Menos costos recurrentes
- ✅ Más simple

---

### Opción C: Hosting Opcional

**Estrategia:**
- Sistema: $80,000 ARS
- Hosting opcional: $2,500 ARS/mes
- Instalación: $10,000 ARS (si necesita)

---

## 📝 Checklist de Deployment

### Antes de Deployar:
- [ ] Dominio configurado
- [ ] DNS apuntando al servidor
- [ ] Variables de entorno configuradas
- [ ] SSL configurado
- [ ] Backup automático configurado
- [ ] Firewall configurado
- [ ] Usuario inicial creado
- [ ] Seed ejecutado (opcional)

### Después de Deployar:
- [ ] Probar login
- [ ] Probar registro de venta
- [ ] Probar impresión de ticket
- [ ] Probar reportes
- [ ] Verificar backups
- [ ] Monitorear logs

---

## 🔒 Seguridad en Producción

### Checklist de Seguridad:
- [ ] SSL/HTTPS activado
- [ ] Firewall configurado (solo puertos 80, 443, 22)
- [ ] JWT_SECRET fuerte y único
- [ ] Contraseña de PostgreSQL segura
- [ ] Actualizaciones automáticas
- [ ] Backups automáticos diarios
- [ ] Logs de seguridad activos

---

## 📚 Próximos Pasos

1. **Decidir opción de hosting** (VPS recomendado)
2. **Contratar servicio** (DigitalOcean, etc.)
3. **Configurar servidor** (Docker + Nginx)
4. **Deployar aplicación**
5. **Configurar SSL** (Let's Encrypt)
6. **Probar en producción**

---

## 💡 Recomendación Final

**Para empezar:**
- **VPS DigitalOcean** ($12 USD/mes)
- **Docker + Nginx**
- **Let's Encrypt** (SSL gratuito)

**Puedes alojar 5-10 clientes** en un solo VPS de $12 USD/mes, lo que significa:
- **Costo por cliente:** $1.20 - $2.40 USD/mes
- **Puedes cobrar:** $2,000 - $3,000 ARS/mes de hosting
- **Ganancia:** ~$1,000 - $1,500 ARS/mes por cliente

**¡Es un negocio escalable!** 🚀




