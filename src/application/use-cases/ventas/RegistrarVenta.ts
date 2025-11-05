import { Venta } from '../../../domain/entities/Venta';
import { Lote } from '../../../domain/entities/Lote';
import { IVentaRepository } from '../../../domain/repositories/IVentaRepository';
import { IProductoRepository } from '../../../domain/repositories/IProductoRepository';
import { ILoteRepository } from '../../../domain/repositories/ILoteRepository';
import { Result } from '../../../shared/types/Result';
import { BusinessError } from '../../../shared/errors/AppError';

/**
 * Caso de Uso: Registrar Venta
 * 
 * Este caso de uso:
 * 1. Valida que los productos existan y tengan stock
 * 2. Calcula ganancias automáticamente
 * 3. Actualiza stock de productos
 * 4. Actualiza lotes si aplica
 * 5. Persiste la venta
 */
export class RegistrarVenta {
  constructor(
    private readonly ventaRepository: IVentaRepository,
    private readonly productoRepository: IProductoRepository,
    private readonly loteRepository: ILoteRepository
  ) {}

  async execute(params: {
    items: Array<{
      productoId: string;
      loteId?: string;
      cantidad: number;
    }>;
    metodoPago?: string;
    notas?: string;
    usuarioId: string; // Usuario que realiza la venta
  }): Promise<Result<Venta, Error>> {
    try {
      // Validar y obtener productos
      const itemsConDatos = await Promise.all(
        params.items.map(async (item) => {
          const producto = await this.productoRepository.findById(item.productoId);
          if (!producto) {
            throw new BusinessError(`Producto ${item.productoId} no encontrado`);
          }

          if (!producto.activo) {
            throw new BusinessError(`Producto ${producto.nombre} está inactivo`);
          }

          // Si el producto tiene vencimiento, validar lote
          let lote: Lote | null = null;
          let precioCompraUnitario = producto.precioCompra;

          if (producto.tieneVencimiento) {
            if (!item.loteId) {
              throw new BusinessError(`El producto ${producto.nombre} requiere un lote`);
            }

            lote = await this.loteRepository.findById(item.loteId);
            if (!lote) {
              throw new BusinessError(`Lote ${item.loteId} no encontrado`);
            }

            if (lote.productoId !== producto.id) {
              throw new BusinessError('El lote no corresponde al producto');
            }

            if (!lote.tieneStockDisponible(item.cantidad)) {
              throw new BusinessError(`Stock insuficiente en el lote para ${producto.nombre}`);
            }

            // El precio de compra puede variar según el lote
            // Por ahora usamos el precio del producto
          } else {
            // Validar stock general
            if (!producto.tieneStockDisponible(item.cantidad)) {
              throw new BusinessError(`Stock insuficiente para ${producto.nombre}`);
            }
          }

          return {
            producto,
            lote,
            cantidad: item.cantidad,
            precioUnitario: producto.precioVenta,
            precioCompraUnitario,
          };
        })
      );

      // Crear la venta (nota: Venta.create no incluye usuarioId, necesitamos actualizar la entidad)
      const venta = Venta.create({
        items: itemsConDatos.map(item => ({
          productoId: item.producto.id,
          loteId: item.lote?.id ?? null,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          precioCompraUnitario: item.precioCompraUnitario,
        })),
        metodoPago: params.metodoPago,
        notas: params.notas,
      });

      // Persistir la venta con usuarioId
      const ventaGuardada = await this.ventaRepository.save(venta, params.usuarioId);

      // Actualizar stock de productos y lotes
      await Promise.all(
        itemsConDatos.map(async (item) => {
          // Actualizar stock del producto
          const nuevoStock = item.producto.stockActual - item.cantidad;
          const productoActualizado = item.producto.actualizarStock(nuevoStock);
          await this.productoRepository.save(productoActualizado);

          // Actualizar lote si aplica
          if (item.lote) {
            const loteActualizado = item.lote.registrarVenta(item.cantidad);
            await this.loteRepository.save(loteActualizado);
          }
        })
      );

      return Result.ok(ventaGuardada);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}

