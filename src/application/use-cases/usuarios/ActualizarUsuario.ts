import { Usuario, Rol } from '../../../domain/entities/Usuario';
import { IUsuarioRepository } from '../../../domain/repositories/IUsuarioRepository';
import { Result } from '../../../shared/types/Result';
import { BusinessError } from '../../../shared/errors/AppError';

/**
 * Caso de Uso: Actualizar Usuario
 * 
 * Actualiza los datos de un usuario (nombre, email, rol, activo)
 */
export class ActualizarUsuario {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(params: {
    id: string;
    nombre?: string;
    email?: string;
    rol?: Rol;
    activo?: boolean;
  }): Promise<Result<Usuario, Error>> {
    try {
      // Buscar usuario existente
      const usuarioExistente = await this.usuarioRepository.findById(params.id);

      if (!usuarioExistente) {
        return Result.fail(new BusinessError('Usuario no encontrado'));
      }

      // Si se cambia el email, verificar que no exista otro usuario con ese email
      if (params.email && params.email !== usuarioExistente.email) {
        const usuarioConEmail = await this.usuarioRepository.findByEmail(params.email);
        if (usuarioConEmail && usuarioConEmail.id !== params.id) {
          return Result.fail(new BusinessError('Ya existe un usuario con este email'));
        }
      }

      // Actualizar campos
      if (params.nombre !== undefined) {
        usuarioExistente.actualizarNombre(params.nombre);
      }

      if (params.email !== undefined) {
        usuarioExistente.actualizarEmail(params.email);
      }

      if (params.rol !== undefined) {
        usuarioExistente.cambiarRol(params.rol);
      }

      if (params.activo !== undefined) {
        if (params.activo) {
          usuarioExistente.activar();
        } else {
          usuarioExistente.desactivar();
        }
      }

      // Persistir cambios
      const usuarioActualizado = await this.usuarioRepository.save(usuarioExistente);

      return Result.ok(usuarioActualizado);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}




