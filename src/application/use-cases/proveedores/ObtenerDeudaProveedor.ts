import { ICompraRepository } from '../../../domain/repositories/ICompraRepository';
import { Result } from '../../../shared/types/Result';

/**
 * Caso de Uso: Obtener Deuda de Proveedor
 * 
 * Calcula la deuda total pendiente de un proveedor
 */
export class ObtenerDeudaProveedor {
  constructor(private readonly compraRepository: ICompraRepository) {}

  async execute(proveedorId: string): Promise<Result<{
    deudaTotal: number;
    comprasPendientes: number;
    comprasVencidas: number;
  }, Error>> {
    try {
      if (!proveedorId || proveedorId.trim().length === 0) {
        return Result.fail(new Error('El ID del proveedor es obligatorio'));
      }

      const compras = await this.compraRepository.findByProveedor(proveedorId);
      const comprasPendientes = compras.filter(c => !c.pagado);
      const comprasVencidas = comprasPendientes.filter(c => c.estaVencida());

      const deudaTotal = comprasPendientes.reduce((sum, compra) => {
        return sum + compra.saldoPendiente();
      }, 0);

      return Result.ok({
        deudaTotal,
        comprasPendientes: comprasPendientes.length,
        comprasVencidas: comprasVencidas.length,
      });
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}

