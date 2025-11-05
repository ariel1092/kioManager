# 🔒 Guía de Seguridad del Sistema

Este documento describe las medidas de seguridad implementadas en el sistema de gestión de kiosco.

## 🛡️ Medidas de Seguridad Implementadas

### 1. Autenticación y Autorización

- **JWT (JSON Web Tokens)**: Tokens seguros para autenticación
- **Expiración de tokens**: Tokens expiran después de un período configurable
- **RBAC (Role-Based Access Control)**: Control de acceso basado en roles (DUENO/EMPLEADO)
- **Middleware de autenticación**: Verificación de tokens en todas las rutas protegidas

### 2. Rate Limiting (Límite de Solicitudes)

- **Login**: Máximo 5 intentos por IP cada 15 minutos
- **Registro de usuarios**: Máximo 10 solicitudes por IP cada hora
- **Cambio de contraseña**: Máximo 10 solicitudes por IP cada hora
- **API general**: Máximo 100 solicitudes por IP cada 15 minutos

**Ubicación de logs**: Los intentos de rate limit excedido se registran en `logs/security/`

### 3. Validación de Entrada

- **Zod**: Validación estricta de esquemas para todos los endpoints
- **Sanitización**: Limpieza de inputs para prevenir XSS
- **Validación de tipos**: Verificación de tipos de datos
- **Validación de UUIDs**: Verificación de formato UUID para IDs

### 4. Logs de Seguridad

El sistema registra automáticamente:

- ✅ **Login exitoso**: Registra IP, usuario, fecha/hora
- ⚠️ **Login fallido**: Registra IP, email intentado, razón del fallo
- ⚠️ **Acceso no autorizado**: Registra intentos de acceso sin permisos
- ⚠️ **Rate limit excedido**: Registra cuando se excede el límite de solicitudes
- 🚨 **Actividad sospechosa**: Registra patrones anómalos

**Ubicación de logs**: `logs/security/security-YYYY-MM-DD.log`

**Formato de logs**: JSON estructurado para fácil análisis

### 5. Protección HTTP (Helmet)

- **XSS Protection**: Previene ataques de Cross-Site Scripting
- **Content Security Policy**: Política de seguridad de contenido
- **Strict Transport Security**: Fuerza HTTPS (en producción)
- **X-Frame-Options**: Previene clickjacking
- **X-Content-Type-Options**: Previene MIME sniffing

### 6. Sanitización de Datos

- **Strings**: Limpieza de caracteres peligrosos (`<`, `>`, `javascript:`, etc.)
- **Emails**: Normalización y validación de formato
- **Números**: Validación y conversión segura

### 7. Manejo de Errores

- **Mensajes genéricos**: No revela detalles internos del sistema
- **Logs detallados**: Errores registrados en servidor para debugging
- **Status codes apropiados**: Códigos HTTP correctos para cada situación

## 📋 Recomendaciones de Producción

### HTTPS

Para producción, es **CRÍTICO** configurar HTTPS:

1. **Obtener certificado SSL/TLS**:
   - Let's Encrypt (gratis)
   - Certificado comercial
   - Certificado interno (para intranets)

2. **Configurar servidor web**:
   - Nginx como reverse proxy
   - Apache con mod_ssl
   - Node.js con HTTPS directamente

3. **Variables de entorno**:
```env
HTTPS_ENABLED=true
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
```

### Variables de Entorno Seguras

```env
# JWT
JWT_SECRET=<SECRETO_MUY_SEGURO_ALEATORIO>
JWT_EXPIRES_IN=24h

# Base de datos
DATABASE_URL=postgresql://usuario:password@host:puerto/database

# Rate Limiting (opcional, ajustar según necesidad)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Firewall

- Configurar firewall para permitir solo puertos necesarios
- Bloquear acceso directo a la base de datos desde internet
- Usar VPN para acceso administrativo

### Backups

- Backups regulares de la base de datos
- Backups encriptados
- Almacenamiento en ubicación segura

### Monitoreo

- Monitorear logs de seguridad regularmente
- Configurar alertas para actividades sospechosas
- Revisar intentos de login fallidos

## 🔍 Análisis de Logs de Seguridad

### Ejemplo de log de login fallido:

```json
{
  "timestamp": "2025-11-15T10:30:00.000Z",
  "level": "warning",
  "type": "login_failed",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "email": "usuario@ejemplo.com",
  "message": "Intento de login fallido: Credenciales inválidas",
  "details": {
    "email": "usuario@ejemplo.com",
    "reason": "Credenciales inválidas"
  }
}
```

### Ejemplo de log de actividad sospechosa:

```json
{
  "timestamp": "2025-11-15T10:35:00.000Z",
  "level": "error",
  "type": "suspicious",
  "ip": "192.168.1.100",
  "userId": "user-123",
  "message": "Actividad sospechosa: Múltiples intentos de acceso fallidos",
  "details": {
    "attempts": 10,
    "timeWindow": "5 minutos"
  }
}
```

## 🚨 Respuesta a Incidentes

Si detectas actividad sospechosa:

1. **Revisar logs** en `logs/security/`
2. **Identificar IP** del atacante
3. **Bloquear IP** en firewall si es necesario
4. **Cambiar contraseñas** de usuarios afectados
5. **Notificar** a usuarios si hay compromiso de datos

## 📚 Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Última actualización**: Noviembre 2025




