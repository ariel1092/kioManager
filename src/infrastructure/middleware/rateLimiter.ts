import rateLimit from 'express-rate-limit';

/**
 * Rate Limiter para autenticación
 * Previene ataques de fuerza bruta limitando intentos de login
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos por IP
  message: {
    error: 'Demasiados intentos de login. Por favor intenta nuevamente en 15 minutos.',
  },
  standardHeaders: true, // Retorna rate limit info en headers `RateLimit-*`
  legacyHeaders: false, // Desactiva `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // No contar requests exitosos
});

/**
 * Rate Limiter general para API
 * Previene abuso de la API
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por IP
  message: {
    error: 'Demasiadas solicitudes. Por favor intenta nuevamente más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate Limiter estricto para operaciones sensibles
 * Para endpoints como crear usuarios, cambios de contraseña, etc.
 */
export const strictRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Máximo 10 requests por IP
  message: {
    error: 'Demasiadas solicitudes. Por favor intenta nuevamente en 1 hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});



