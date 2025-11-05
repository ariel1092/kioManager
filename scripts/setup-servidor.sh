#!/bin/bash
# Script para Configurar Servidor desde Cero
# Uso: Ejecutar en un servidor Ubuntu 22.04 LTS limpio

set -e

echo "🖥️  Configurando servidor para Sistema de Gestión de Kiosco..."

# Actualizar sistema
echo "📦 Actualizando sistema..."
apt update && apt upgrade -y

# Instalar dependencias básicas
echo "📦 Instalando dependencias..."
apt install -y curl wget git nano ufw

# Instalar Docker
echo "🐳 Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Agregar usuario actual a grupo docker
usermod -aG docker $USER

# Instalar Docker Compose
echo "🐳 Instalando Docker Compose..."
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Instalar Nginx
echo "🌐 Instalando Nginx..."
apt install -y nginx

# Configurar firewall
echo "🔥 Configurando firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Instalar Certbot para SSL
echo "🔒 Instalando Certbot (SSL)..."
apt install -y certbot python3-certbot-nginx

# Crear directorio para aplicación
echo "📁 Creando directorio de aplicación..."
mkdir -p /opt/sistema-kiosco
chown -R $USER:$USER /opt/sistema-kiosco

echo ""
echo "✅ Servidor configurado!"
echo ""
echo "📋 Próximos pasos:"
echo "  1. Clonar o subir el código a /opt/sistema-kiosco"
echo "  2. Configurar .env con las variables de entorno"
echo "  3. Ejecutar: docker-compose -f docker-compose.prod.yml up -d"
echo "  4. Configurar Nginx como reverse proxy"
echo "  5. Obtener certificado SSL: certbot --nginx -d tu-dominio.com"



