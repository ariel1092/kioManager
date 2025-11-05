import { Usuario } from '../entities/Usuario';

/**
 * Interfaz del repositorio de Usuarios
 */
export interface IUsuarioRepository {
  findById(id: string): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  findAll(activos?: boolean): Promise<Usuario[]>;
  save(usuario: Usuario): Promise<Usuario>;
  delete(id: string): Promise<void>;
}




