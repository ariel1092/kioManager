import { Lote } from '../../../domain/entities/Lote';
import { ILoteRepository } from '../../../domain/repositories/ILoteRepository';
import { Result } from '../../../shared/types/Result';

/**
 * Caso de Uso: Obtener Lotes Por Vencer
 */
export class ObtenerLotesPorVencer {
  constructor(private readonly loteRepository: ILoteRepository) {}

  async execute(diasAnticipacion: number = 30): Promise<Result<Lote[], Error>> {
    try {
      const lotes = await this.loteRepository.findPorVencer(diasAnticipacion);
      return Result.ok(lotes);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}

