import bcrypt from 'bcryptjs';

/**
 * Servicio para manejo de contraseñas
 * Encapsula la lógica de hashing y verificación
 */
export class PasswordService {
  private readonly saltRounds: number = 10;

  /**
   * Hashea una contraseña
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Verifica una contraseña contra un hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export const passwordService = new PasswordService();

