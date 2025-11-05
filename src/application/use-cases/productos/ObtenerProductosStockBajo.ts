import { Producto } from '../../../domain/entities/Producto';
import { IProductoRepository } from '../../../domain/repositories/IProductoRepository';
import { Result } from '../../../shared/types/Result';

/**
 * Caso de Uso: Obtener Productos con Stock Bajo
 */
export class ObtenerProductosStockBajo {
  constructor(private readonly productoRepository: IProductoRepository) {}

  async execute(): Promise<Result<Producto[], Error>> {
    try {
      const productos = await this.productoRepository.findStockBajo();
      return Result.ok(productos);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}



