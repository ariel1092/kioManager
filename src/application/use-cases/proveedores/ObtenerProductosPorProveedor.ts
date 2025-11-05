import { Producto } from '../../../domain/entities/Producto';
import { IProductoRepository } from '../../../domain/repositories/IProductoRepository';
import { Result } from '../../../shared/types/Result';

/**
 * Caso de Uso: Obtener Productos por Proveedor
 * 
 * Obtiene todos los productos que provee un proveedor específico
 */
export class ObtenerProductosPorProveedor {
  constructor(private readonly productoRepository: IProductoRepository) {}

  async execute(proveedorId: string): Promise<Result<Producto[], Error>> {
    try {
      if (!proveedorId || proveedorId.trim().length === 0) {
        return Result.fail(new Error('El ID del proveedor es obligatorio'));
      }

      const productos = await this.productoRepository.findByProveedor(proveedorId);
      return Result.ok(productos);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}



