import { Compra } from '../../../domain/entities/Compra';
import { ICompraRepository } from '../../../domain/repositories/ICompraRepository';
import { IProductoRepository } from '../../../domain/repositories/IProductoRepository';
import { ILoteRepository } from '../../../domain/repositories/ILoteRepository';
import { Result } from '../../../shared/types/Result';
import { BusinessError } from '../../../shared/errors/AppError';

/**
 * Caso de Uso: Registrar Compra
 * 
 * Registra una nueva compra a un proveedor, actualizando el stock de productos
 * y creando lotes si es necesario
 */
export class RegistrarCompra {
  constructor(
    private readonly compraRepository: ICompraRepository,
    private readonly productoRepository: IProductoRepository,
    private readonly loteRepository: ILoteRepository
  ) {}

  async execute(params: {
    proveedorId: string;
    numeroFactura?: string | null;
    fechaCompra?: Date;
    items: Array<{
      productoId: string;
      cantidad: number;
      precioUnitario: number;
    }>;
    formaPago?: string;
    fechaVencimiento?: Date | null;
    notas?: string | null;
  }): Promise<Result<Compra, Error>> {
    try {
      // Validar items
      if (!params.items || params.items.length === 0) {
        return Result.fail(new BusinessError('La compra debe tener al menos un item'));
      }

      // Calcular total
      const total = params.items.reduce((sum, item) => {
        return sum + item.precioUnitario * item.cantidad;
      }, 0);

      if (total <= 0) {
        return Result.fail(new BusinessError('El total de la compra debe ser mayor a cero'));
      }

      // Crear la compra
      const compra = Compra.create({
        proveedorId: params.proveedorId,
        numeroFactura: params.numeroFactura,
        fechaCompra: params.fechaCompra,
        total,
        formaPago: params.formaPago,
        fechaVencimiento: params.fechaVencimiento,
        pagado: params.formaPago === 'contado',
        montoPagado: params.formaPago === 'contado' ? total : 0,
        notas: params.notas,
      });

      // Guardar la compra
      const compraGuardada = await this.compraRepository.save(compra);

      // Actualizar stock de productos y crear lotes
      await Promise.all(
        params.items.map(async (item) => {
          const producto = await this.productoRepository.findById(item.productoId);
          
          if (!producto) {
            throw new Error(`Producto con ID ${item.productoId} no encontrado`);
          }

          // Actualizar precio de compra del producto
          const nuevoStock = producto.stockActual + item.cantidad;
          const productoActualizado = producto
            .actualizarStock(nuevoStock)
            .actualizarPrecioCompra(item.precioUnitario);

          await this.productoRepository.save(productoActualizado);

          // Crear lote si el producto tiene vencimiento
          if (producto.tieneVencimiento) {
            const { Lote } = await import('../../../domain/entities/Lote');
            let fechaVencimiento: Date;

            if (params.fechaVencimiento) {
              fechaVencimiento = params.fechaVencimiento;
            } else {
              // Si no se especificó fecha, crear un lote con fecha de vencimiento por defecto (30 días)
              fechaVencimiento = new Date();
              fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);
            }

            const lote = Lote.create({
              numeroLote: `LOT-${producto.codigo}-${Date.now()}`,
              fechaVencimiento,
              cantidad: item.cantidad,
              productoId: producto.id,
              compraId: compraGuardada.id,
            });

            await this.loteRepository.save(lote);
          }
        })
      );

      return Result.ok(compraGuardada);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}

