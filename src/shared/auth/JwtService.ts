import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { Rol } from '../../domain/entities/Usuario';

/**
 * Servicio para manejo de JWT
 * Encapsula la lógica de generación y verificación de tokens
 */
export interface PayloadToken {
  userId: string;
  email: string;
  rol: Rol;
}

export class JwtService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    // Validar y normalizar expiresIn
    const envExpiresIn = process.env.JWT_EXPIRES_IN;
    if (envExpiresIn && typeof envExpiresIn === 'string' && envExpiresIn.trim() !== '') {
      const trimmed = envExpiresIn.trim();
      // Validar formato: debe ser un número o string válido (ej: "1d", "20h", "60m", "3600", 60)
      // Formato válido: número seguido opcionalmente de s, m, h, o d
      const isValidFormat = /^(\d+[smhd]?|\d+)$/i.test(trimmed);
      this.expiresIn = isValidFormat ? trimmed : '24h';
      
      if (!isValidFormat) {
        console.warn(`[JwtService] JWT_EXPIRES_IN tiene un valor inválido: "${envExpiresIn}". Usando valor por defecto: "24h"`);
      }
    } else {
      // Valor por defecto si no está definido o es inválido
      this.expiresIn = '24h';
    }
    
    console.log(`[JwtService] Configurado con expiresIn: ${this.expiresIn}`);
  }

  /**
   * Genera un token JWT para un usuario
   */
  generateToken(payload: PayloadToken): string {
    const options: jwt.SignOptions = {
      expiresIn: this.expiresIn as StringValue | number,
    };
    return jwt.sign(payload, this.secret, options);
  }

  /**
   * Verifica y decodifica un token JWT
   */
  verifyToken(token: string): PayloadToken {
    try {
      const decoded = jwt.verify(token, this.secret) as PayloadToken;
      return decoded;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  /**
   * Extrae el token del header Authorization
   */
  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    if (!authHeader.startsWith('Bearer ')) return null;
    return authHeader.substring(7);
  }
}

export const jwtService = new JwtService();

