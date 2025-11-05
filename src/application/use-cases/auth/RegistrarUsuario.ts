import { Usuario, Rol } from '../../../domain/entities/Usuario';
import { IUsuarioRepository } from '../../../domain/repositories/IUsuarioRepository';
import { passwordService } from '../../../shared/auth/PasswordService';
import { Result } from '../../../shared/types/Result';
import { BusinessError } from '../../../shared/errors/AppError';

/**
 * Caso de Uso: Registrar Usuario
 * 
 * Crea un nuevo usuario en el sistema
 */
export class RegistrarUsuario {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(params: {
    nombre: string;
    email: string;
    password: string;
    rol?: Rol;
  }): Promise<Result<Usuario, Error>> {
    try {
      // Verificar que el email no exista
      const usuarioExistente = await this.usuarioRepository.findByEmail(params.email);
      if (usuarioExistente) {
        return Result.fail(new BusinessError('Ya existe un usuario con este email'));
      }

      // Hashear contraseña
      const passwordHash = await passwordService.hashPassword(params.password);

      // Crear usuario
      const usuario = Usuario.create({
        nombre: params.nombre,
        email: params.email,
        passwordHash,
        rol: params.rol || Rol.EMPLEADO,
      });

      // Persistir
      const usuarioGuardado = await this.usuarioRepository.save(usuario);

      return Result.ok(usuarioGuardado);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}



