import { Usuario } from '../../../domain/entities/Usuario';
import { IUsuarioRepository } from '../../../domain/repositories/IUsuarioRepository';
import { passwordService } from '../../../shared/auth/PasswordService';
import { jwtService } from '../../../shared/auth/JwtService';
import { Result } from '../../../shared/types/Result';
import { BusinessError } from '../../../shared/errors/AppError';

/**
 * Caso de Uso: Login
 * 
 * Autentica un usuario y genera un token JWT
 */
export interface LoginResponse {
  token: string;
  usuario: {
    id: string;
    nombre: string;
    email: string;
    rol: string;
  };
}

export class Login {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(email: string, password: string): Promise<Result<LoginResponse, Error>> {
    try {
      console.log('[Login] Intentando login con email:', email);
      
      // Buscar usuario por email
      const usuario = await this.usuarioRepository.findByEmail(email);
      if (!usuario) {
        console.log('[Login] Usuario no encontrado para email:', email);
        return Result.fail(new BusinessError('Credenciales inválidas'));
      }

      console.log('[Login] Usuario encontrado:', usuario.email, 'Activo:', usuario.activo);

      // Verificar que el usuario esté activo
      if (!usuario.activo) {
        console.log('[Login] Usuario inactivo:', usuario.email);
        return Result.fail(new BusinessError('Usuario inactivo'));
      }

      // Verificar contraseña
      console.log('[Login] Verificando contraseña...');
      const passwordValid = await passwordService.verifyPassword(
        password,
        usuario.passwordHash
      );
      console.log('[Login] Contraseña válida:', passwordValid);
      
      if (!passwordValid) {
        console.log('[Login] Contraseña inválida para usuario:', usuario.email);
        return Result.fail(new BusinessError('Credenciales inválidas'));
      }

      // Generar token JWT
      const token = jwtService.generateToken({
        userId: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      });

      return Result.ok({
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      });
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}

