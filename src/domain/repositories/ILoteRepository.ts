import { Lote } from '../entities/Lote';

/**
 * Interfaz del repositorio de Lotes
 */
export interface ILoteRepository {
  findById(id: string): Promise<Lote | null>;
  findByProducto(productoId: string): Promise<Lote[]>;
  findVencidos(): Promise<Lote[]>;
  findPorVencer(diasAnticipacion?: number): Promise<Lote[]>;
  save(lote: Lote): Promise<Lote>;
  saveMany(lotes: Lote[]): Promise<Lote[]>;
  delete(id: string): Promise<void>;
}




