import { IUsuarioRepository } from '../../../domain/repositories/IUsuarioRepository';
import { passwordService } from '../../../shared/auth/PasswordService';
import { Result } from '../../../shared/types/Result';
import { BusinessError } from '../../../shared/errors/AppError';

/**
 * Caso de Uso: Cambiar Contraseña
 * 
 * Cambia la contraseña de un usuario
 * Puede ser cambiada por el mismo usuario (con contraseña actual) o por un administrador
 */
export class CambiarContrasena {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(params: {
    usuarioId: string;
    nuevaPassword: string;
    passwordActual?: string; // Opcional: si se proporciona, se valida
    esAdministrador?: boolean; // Si es true, no requiere password actual
  }): Promise<Result<void, Error>> {
    try {
      // Buscar usuario
      const usuario = await this.usuarioRepository.findById(params.usuarioId);

      if (!usuario) {
        return Result.fail(new BusinessError('Usuario no encontrado'));
      }

      // Validar contraseña actual si no es administrador
      if (!params.esAdministrador && params.passwordActual) {
        const passwordValida = await passwordService.comparePassword(
          params.passwordActual,
          usuario.passwordHash
        );

        if (!passwordValida) {
          return Result.fail(new BusinessError('Contraseña actual incorrecta'));
        }
      }

      // Validar nueva contraseña
      if (!params.nuevaPassword || params.nuevaPassword.length < 6) {
        return Result.fail(new BusinessError('La contraseña debe tener al menos 6 caracteres'));
      }

      // Hashear nueva contraseña
      const nuevoPasswordHash = await passwordService.hashPassword(params.nuevaPassword);

      // Actualizar contraseña
      usuario.actualizarPassword(nuevoPasswordHash);

      // Persistir cambios
      await this.usuarioRepository.save(usuario);

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}

