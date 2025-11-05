import { Producto } from '../../../domain/entities/Producto';
import { IProductoRepository } from '../../../domain/repositories/IProductoRepository';
import { Result } from '../../../shared/types/Result';

/**
 * Caso de Uso: Listar Productos
 */
export class ListarProductos {
  constructor(private readonly productoRepository: IProductoRepository) {}

  async execute(activos?: boolean): Promise<Result<Producto[], Error>> {
    try {
      const productos = await this.productoRepository.findAll(activos);
      return Result.ok(productos);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}

