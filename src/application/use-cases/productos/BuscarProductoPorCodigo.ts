import { Producto } from '../../../domain/entities/Producto';
import { IProductoRepository } from '../../../domain/repositories/IProductoRepository';
import { Result } from '../../../shared/types/Result';
import { BusinessError } from '../../../shared/errors/AppError';

/**
 * Caso de Uso: Buscar Producto por Código
 * 
 * Busca un producto activo por su código (para escáner de código de barras)
 */
export class BuscarProductoPorCodigo {
  constructor(private readonly productoRepository: IProductoRepository) {}

  async execute(codigo: string): Promise<Result<Producto, Error>> {
    try {
      if (!codigo || codigo.trim().length === 0) {
        return Result.fail(new BusinessError('El código es obligatorio'));
      }

      const producto = await this.productoRepository.findByCodigo(codigo.trim());

      if (!producto) {
        return Result.fail(new BusinessError('Producto no encontrado'));
      }

      if (!producto.activo) {
        return Result.fail(new BusinessError('El producto está inactivo'));
      }

      return Result.ok(producto);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}

