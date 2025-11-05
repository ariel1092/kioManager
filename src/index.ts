import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './infrastructure/api/routes';
import { apiRateLimiter } from './infrastructure/middleware/rateLimiter';

/**
 * Servidor principal de la aplicación
 * 
 * Arquitectura Hexagonal implementada:
 * - Domain: Entidades y lógica de negocio
 * - Application: Casos de uso
 * - Infrastructure: API REST, Repositorios con Prisma
 */
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar trust proxy para Render (necesario para rate limiting detrás de proxy)
app.set('trust proxy', 1);

// Middleware de seguridad
app.use(helmet()); // Protección contra vulnerabilidades comunes

// CORS configurado para producción y desarrollo
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : process.env.NODE_ENV === 'production'
  ? [] // En producción, solo permitir orígenes explícitos
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // En desarrollo, permitir todos
      if (process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      
      // En producción, verificar si está en la lista
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS: Origin no permitido: ${origin}`);
        callback(null, true); // Permitir temporalmente para debugging
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' })); // Limitar tamaño de JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Limitar tamaño de URL encoded

// Rate limiting general
app.use('/api', apiRateLimiter);

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error no manejado:', err);
  
  // Si es un error de AppError, usar su statusCode
  if (err.statusCode) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
    return;
  }

  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error desconocido',
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📚 API disponible en http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});

export default app;

