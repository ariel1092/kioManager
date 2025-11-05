import { Usuario } from '../../../domain/entities/Usuario';
import { IUsuarioRepository } from '../../../domain/repositories/IUsuarioRepository';
import { Result } from '../../../shared/types/Result';

/**
 * Caso de Uso: Listar Usuarios
 * 
 * Obtiene la lista de usuarios del sistema
 */
export class ListarUsuarios {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(activos?: boolean): Promise<Result<Usuario[], Error>> {
    try {
      const usuarios = await this.usuarioRepository.findAll(activos);
      return Result.ok(usuarios);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}



