import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

/**
 * Middleware para sanitizar inputs y prevenir XSS
 */
export const sanitizeInput = [
  // Sanitizar strings - remover caracteres peligrosos
  body('*').customSanitizer((value) => {
    if (typeof value === 'string') {
      // Remover caracteres peligrosos pero mantener espacios y caracteres normales
      return value.trim().replace(/[<>]/g, '');
    }
    return value;
  }),
];

/**
 * Middleware para validar resultados de sanitización
 */
export const validateSanitization = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Datos inválidos detectados',
      details: errors.array(),
    });
    return;
  }
  next();
};

/**
 * Función helper para sanitizar strings
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript: protocol
    .replace(/on\w+=/gi, ''); // Remover event handlers
}

/**
 * Función helper para sanitizar números
 */
export function sanitizeNumber(input: any): number | null {
  const num = Number(input);
  if (isNaN(num) || !isFinite(num)) {
    return null;
  }
  return num;
}

/**
 * Función helper para sanitizar emails
 */
export function sanitizeEmail(input: string): string {
  return sanitizeString(input).toLowerCase().trim();
}



