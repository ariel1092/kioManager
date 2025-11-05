import { Usuario } from '../../../domain/entities/Usuario';
import { IUsuarioRepository } from '../../../domain/repositories/IUsuarioRepository';
import { Result } from '../../../shared/types/Result';
import { BusinessError } from '../../../shared/errors/AppError';

/**
 * Caso de Uso: Obtener Usuario
 * 
 * Obtiene un usuario por su ID
 */
export class ObtenerUsuario {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(id: string): Promise<Result<Usuario, Error>> {
    try {
      const usuario = await this.usuarioRepository.findById(id);

      if (!usuario) {
        return Result.fail(new BusinessError('Usuario no encontrado'));
      }

      return Result.ok(usuario);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}


