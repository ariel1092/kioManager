import { IUsuarioRepository } from '../../../domain/repositories/IUsuarioRepository';
import { Result } from '../../../shared/types/Result';
import { BusinessError } from '../../../shared/errors/AppError';

/**
 * Caso de Uso: Eliminar Usuario
 * 
 * Elimina un usuario del sistema
 * No permite eliminar si es el último dueño activo
 */
export class EliminarUsuario {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(id: string): Promise<Result<void, Error>> {
    try {
      // Buscar usuario
      const usuario = await this.usuarioRepository.findById(id);

      if (!usuario) {
        return Result.fail(new BusinessError('Usuario no encontrado'));
      }

      // Verificar si es el último dueño activo
      if (usuario.esDueño() && usuario.activo) {
        const todosLosUsuarios = await this.usuarioRepository.findAll();
        const dueñosActivos = todosLosUsuarios.filter(
          u => u.esDueño() && u.activo && u.id !== id
        );

        if (dueñosActivos.length === 0) {
          return Result.fail(
            new BusinessError('No se puede eliminar el último dueño activo del sistema')
          );
        }
      }

      // Eliminar usuario
      await this.usuarioRepository.delete(id);

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}


