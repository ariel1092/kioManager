import { PagoProveedor } from '../../../domain/entities/PagoProveedor';
import { IPagoProveedorRepository } from '../../../domain/repositories/IPagoProveedorRepository';
import { ICompraRepository } from '../../../domain/repositories/ICompraRepository';
import { Result } from '../../../shared/types/Result';
import { BusinessError } from '../../../shared/errors/AppError';

/**
 * Caso de Uso: Registrar Pago a Proveedor
 * 
 * Registra un pago a un proveedor, actualizando el estado de la compra si aplica
 */
export class RegistrarPago {
  constructor(
    private readonly pagoRepository: IPagoProveedorRepository,
    private readonly compraRepository: ICompraRepository
  ) {}

  async execute(params: {
    proveedorId: string;
    compraId?: string | null;
    fecha?: Date;
    monto: number;
    metodoPago?: string;
    observaciones?: string | null;
  }): Promise<Result<PagoProveedor, Error>> {
    try {
      // Validar monto
      if (params.monto <= 0) {
        return Result.fail(new BusinessError('El monto del pago debe ser mayor a cero'));
      }

      // Si se especifica una compra, validar que existe y no está completamente pagada
      if (params.compraId) {
        const compra = await this.compraRepository.findById(params.compraId);
        
        if (!compra) {
          return Result.fail(new BusinessError('La compra especificada no existe'));
        }

        if (compra.pagado) {
          return Result.fail(new BusinessError('La compra ya está completamente pagada'));
        }

        const saldoPendiente = compra.saldoPendiente();
        if (params.monto > saldoPendiente) {
          return Result.fail(
            new BusinessError(
              `El monto del pago (${params.monto}) excede el saldo pendiente (${saldoPendiente})`
            )
          );
        }

        // Crear el pago
        const pago = PagoProveedor.create({
          proveedorId: params.proveedorId,
          compraId: params.compraId,
          fecha: params.fecha,
          monto: params.monto,
          metodoPago: params.metodoPago,
          observaciones: params.observaciones,
        });

        const pagoGuardado = await this.pagoRepository.save(pago);

        // Actualizar la compra con el pago
        const compraActualizada = compra.registrarPago(params.monto);
        await this.compraRepository.save(compraActualizada);

        return Result.ok(pagoGuardado);
      } else {
        // Pago general (no asociado a una compra específica)
        const pago = PagoProveedor.create({
          proveedorId: params.proveedorId,
          compraId: null,
          fecha: params.fecha,
          monto: params.monto,
          metodoPago: params.metodoPago,
          observaciones: params.observaciones,
        });

        const pagoGuardado = await this.pagoRepository.save(pago);
        return Result.ok(pagoGuardado);
      }
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}


