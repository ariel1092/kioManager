import { Lote } from '../../../domain/entities/Lote';
import { ILoteRepository } from '../../../domain/repositories/ILoteRepository';
import { Result } from '../../../shared/types/Result';

/**
 * Caso de Uso: Obtener Lotes por Producto
 * 
 * Obtiene los lotes disponibles de un producto (que tienen stock disponible)
 */
export class ObtenerLotesPorProducto {
  constructor(private readonly loteRepository: ILoteRepository) {}

  async execute(productoId: string): Promise<Result<Lote[], Error>> {
    try {
      if (!productoId || productoId.trim().length === 0) {
        return Result.fail(new Error('El ID del producto es obligatorio'));
      }

      const lotes = await this.loteRepository.findByProducto(productoId);

      // Filtrar solo los lotes que tienen stock disponible (cantidad > cantidadVendida)
      const lotesDisponibles = lotes.filter(
        lote => lote.cantidadDisponible() > 0
      );

      return Result.ok(lotesDisponibles);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}

