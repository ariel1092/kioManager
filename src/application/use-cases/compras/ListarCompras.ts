import { Compra } from '../../../domain/entities/Compra';
import { ICompraRepository } from '../../../domain/repositories/ICompraRepository';
import { Result } from '../../../shared/types/Result';

/**
 * Caso de Uso: Listar Compras
 * 
 * Lista las compras realizadas, con filtros opcionales
 */
export class ListarCompras {
  constructor(private readonly compraRepository: ICompraRepository) {}

  async execute(params?: {
    proveedorId?: string;
    soloPendientes?: boolean;
    soloVencidas?: boolean;
  }): Promise<Result<Compra[], Error>> {
    try {
      let compras: Compra[];

      if (params?.proveedorId) {
        compras = await this.compraRepository.findByProveedor(params.proveedorId);
      } else if (params?.soloVencidas) {
        compras = await this.compraRepository.findVencidas();
      } else if (params?.soloPendientes) {
        compras = await this.compraRepository.findPendientes();
      } else {
        // Si no hay filtros, obtener todas las compras pendientes
        compras = await this.compraRepository.findPendientes();
      }

      return Result.ok(compras);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}



