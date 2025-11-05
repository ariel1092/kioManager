import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

interface SecurityLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  type: 'login_failed' | 'login_success' | 'unauthorized' | 'suspicious' | 'rate_limit';
  ip: string;
  userAgent?: string;
  userId?: string;
  email?: string;
  message: string;
  details?: Record<string, any>;
}

/**
 * Logger de seguridad
 * Registra eventos de seguridad en archivos de log
 */
class SecurityLogger {
  private logDir: string;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs', 'security');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private getLogFileName(): string {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(this.logDir, `security-${today}.log`);
  }

  private writeLog(log: SecurityLog): void {
    try {
      const logLine = JSON.stringify(log) + '\n';
      fs.appendFileSync(this.getLogFileName(), logLine, 'utf8');
    } catch (error) {
      console.error('Error escribiendo log de seguridad:', error);
    }
  }

  /**
   * Log de intento de login fallido
   */
  logLoginFailed(req: Request, email: string, reason: string): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'warning',
      type: 'login_failed',
      ip: req.ip || req.socket.remoteAddress || 'unknown',
      userAgent: req.get('user-agent'),
      email,
      message: `Intento de login fallido: ${reason}`,
      details: { email, reason },
    });
  }

  /**
   * Log de login exitoso
   */
  logLoginSuccess(req: Request, userId: string, email: string): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      type: 'login_success',
      ip: req.ip || req.socket.remoteAddress || 'unknown',
      userAgent: req.get('user-agent'),
      userId,
      email,
      message: 'Login exitoso',
    });
  }

  /**
   * Log de acceso no autorizado
   */
  logUnauthorized(req: Request, resource: string, reason?: string): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'warning',
      type: 'unauthorized',
      ip: req.ip || req.socket.remoteAddress || 'unknown',
      userAgent: req.get('user-agent'),
      userId: req.user?.userId,
      email: req.user?.email,
      message: `Intento de acceso no autorizado: ${resource}`,
      details: { resource, reason },
    });
  }

  /**
   * Log de actividad sospechosa
   */
  logSuspicious(req: Request, message: string, details?: Record<string, any>): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'error',
      type: 'suspicious',
      ip: req.ip || req.socket.remoteAddress || 'unknown',
      userAgent: req.get('user-agent'),
      userId: req.user?.userId,
      email: req.user?.email,
      message: `Actividad sospechosa: ${message}`,
      details,
    });
  }

  /**
   * Log de rate limit excedido
   */
  logRateLimit(req: Request, endpoint: string): void {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'warning',
      type: 'rate_limit',
      ip: req.ip || req.socket.remoteAddress || 'unknown',
      userAgent: req.get('user-agent'),
      userId: req.user?.userId,
      email: req.user?.email,
      message: `Rate limit excedido en: ${endpoint}`,
      details: { endpoint },
    });
  }
}

export const securityLogger = new SecurityLogger();




