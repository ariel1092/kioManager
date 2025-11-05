import { Lote } from '../../../domain/entities/Lote';
import { ILoteRepository } from '../../../domain/repositories/ILoteRepository';
import { Result } from '../../../shared/types/Result';

/**
 * Caso de Uso: Obtener Lotes Vencidos
 */
export class ObtenerLotesVencidos {
  constructor(private readonly loteRepository: ILoteRepository) {}

  async execute(): Promise<Result<Lote[], Error>> {
    try {
      const lotes = await this.loteRepository.findVencidos();
      return Result.ok(lotes);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}

