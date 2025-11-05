import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../../shared/auth/JwtService';
import { UnauthorizedError, ForbiddenError } from '../../shared/errors/AppError';
import { Rol } from '../../domain/entities/Usuario';
import { securityLogger } from './securityLogger';

/**
 * Extiende el Request de Express para incluir información del usuario autenticado
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        rol: Rol;
      };
    }
  }
}

/**
 * Middleware de autenticación
 * Verifica que el usuario tenga un token válido
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = jwtService.extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      securityLogger.logUnauthorized(req, req.path, 'Token no proporcionado');
      res.status(401).json({ error: 'Token de autenticación requerido' });
      return;
    }

    const payload = jwtService.verifyToken(token);
    req.user = payload;

    next();
  } catch (error) {
    securityLogger.logUnauthorized(req, req.path, error instanceof Error ? error.message : 'Token inválido');
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

/**
 * Middleware de autorización
 * Verifica que el usuario tenga el rol requerido
 */
export function authorize(...roles: Rol[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    if (!roles.includes(req.user.rol)) {
      securityLogger.logUnauthorized(req, req.path, `Rol requerido: ${roles.join(', ')}, Rol actual: ${req.user.rol}`);
      res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
      return;
    }

    next();
  };
}

