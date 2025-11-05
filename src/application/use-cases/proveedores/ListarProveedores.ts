import { Proveedor } from '../../../domain/entities/Proveedor';
import { IProveedorRepository } from '../../../domain/repositories/IProveedorRepository';
import { Result } from '../../../shared/types/Result';

/**
 * Caso de Uso: Listar Proveedores
 */
export class ListarProveedores {
  constructor(private readonly proveedorRepository: IProveedorRepository) {}

  async execute(activos?: boolean): Promise<Result<Proveedor[], Error>> {
    try {
      const proveedores = await this.proveedorRepository.findAll(activos);
      return Result.ok(proveedores);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}

