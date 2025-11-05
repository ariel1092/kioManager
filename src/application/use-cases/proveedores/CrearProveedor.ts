import { Proveedor } from '../../../domain/entities/Proveedor';
import { IProveedorRepository } from '../../../domain/repositories/IProveedorRepository';
import { Result } from '../../../shared/types/Result';

/**
 * Caso de Uso: Crear Proveedor
 */
export class CrearProveedor {
  constructor(private readonly proveedorRepository: IProveedorRepository) {}

  async execute(params: {
    nombre: string;
    contacto?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
  }): Promise<Result<Proveedor, Error>> {
    try {
      const proveedor = Proveedor.create({
        nombre: params.nombre,
        contacto: params.contacto,
        telefono: params.telefono,
        email: params.email,
        direccion: params.direccion,
      });

      const proveedorGuardado = await this.proveedorRepository.save(proveedor);
      return Result.ok(proveedorGuardado);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}


