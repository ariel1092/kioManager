import { Producto } from '../../../domain/entities/Producto';
import { IProductoRepository } from '../../../domain/repositories/IProductoRepository';
import { Result } from '../../../shared/types/Result';
import { BusinessError } from '../../../shared/errors/AppError';

/**
 * Caso de Uso: Crear Producto
 * 
 * Principios aplicados:
 * - Single Responsibility: Solo crea productos
 * - Dependency Inversion: Depende de abstracciones (IProductoRepository)
 */
export class CrearProducto {
  constructor(private readonly productoRepository: IProductoRepository) {}

  async execute(params: {
    codigo: string;
    nombre: string;
    descripcion?: string;
    categoria?: string;
    precioCompra: number;
    precioVenta: number;
    stockMinimo?: number;
    tieneVencimiento?: boolean;
    proveedorId?: string;
  }): Promise<Result<Producto, Error>> {
    try {
      // Validar que el código no exista
      const productoExistente = await this.productoRepository.findByCodigo(params.codigo);
      if (productoExistente) {
        return Result.fail(new BusinessError('Ya existe un producto con este código'));
      }

      // Crear el producto usando la entidad
      const producto = Producto.create({
        codigo: params.codigo,
        nombre: params.nombre,
        descripcion: params.descripcion,
        categoria: params.categoria,
        precioCompra: params.precioCompra,
        precioVenta: params.precioVenta,
        stockMinimo: params.stockMinimo,
        tieneVencimiento: params.tieneVencimiento,
        proveedorId: params.proveedorId,
      });

      // Persistir
      const productoGuardado = await this.productoRepository.save(producto);

      return Result.ok(productoGuardado);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}

