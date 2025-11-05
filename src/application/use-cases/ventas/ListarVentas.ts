import { Venta } from '../../../domain/entities/Venta';
import { IVentaRepository } from '../../../domain/repositories/IVentaRepository';
import { Result } from '../../../shared/types/Result';

/**
 * Caso de Uso: Listar Ventas
 */
export class ListarVentas {
  constructor(private readonly ventaRepository: IVentaRepository) {}

  async execute(fechaInicio?: Date, fechaFin?: Date): Promise<Result<Venta[], Error>> {
    try {
      let ventas: Venta[];
      
      if (fechaInicio && fechaFin) {
        ventas = await this.ventaRepository.findByFecha(fechaInicio, fechaFin);
      } else {
        ventas = await this.ventaRepository.findAll();
      }

      return Result.ok(ventas);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}



