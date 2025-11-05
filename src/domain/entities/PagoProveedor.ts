/**
 * Entidad de Dominio: PagoProveedor
 * Representa un pago realizado a un proveedor
 */
export class PagoProveedor {
  private constructor(
    public readonly id: string,
    public readonly proveedorId: string,
    public readonly compraId: string | null,
    public readonly fecha: Date,
    public readonly monto: number,
    public readonly metodoPago: string,
    public readonly observaciones: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  static create(params: {
    id?: string;
    proveedorId: string;
    compraId?: string | null;
    fecha?: Date;
    monto: number;
    metodoPago?: string;
    observaciones?: string | null;
  }): PagoProveedor {
    const now = new Date();
    return new PagoProveedor(
      params.id || crypto.randomUUID(),
      params.proveedorId,
      params.compraId ?? null,
      params.fecha || now,
      params.monto,
      params.metodoPago || 'efectivo',
      params.observaciones ?? null,
      now,
      now
    );
  }

  static fromPersistence(data: {
    id: string;
    proveedorId: string;
    compraId: string | null;
    fecha: Date;
    monto: number;
    metodoPago: string;
    observaciones: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): PagoProveedor {
    return new PagoProveedor(
      data.id,
      data.proveedorId,
      data.compraId,
      data.fecha,
      Number(data.monto),
      data.metodoPago,
      data.observaciones,
      data.createdAt,
      data.updatedAt
    );
  }

  private validate(): void {
    if (!this.proveedorId || this.proveedorId.trim().length === 0) {
      throw new Error('El ID del proveedor es obligatorio');
    }
    if (this.monto <= 0) {
      throw new Error('El monto del pago debe ser mayor a cero');
    }
    if (!this.metodoPago || this.metodoPago.trim().length === 0) {
      throw new Error('El método de pago es obligatorio');
    }
  }
}



