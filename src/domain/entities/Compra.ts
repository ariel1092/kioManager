/**
 * Entidad de Dominio: Compra
 * Representa una compra realizada a un proveedor
 */

export interface CompraItemData {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export class Compra {
  private constructor(
    public readonly id: string,
    public readonly numeroFactura: string | null,
    public readonly fechaCompra: Date,
    public readonly total: number,
    public readonly formaPago: string,
    public readonly fechaVencimiento: Date | null,
    public readonly pagado: boolean,
    public readonly montoPagado: number,
    public readonly proveedorId: string,
    public readonly notas: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  static create(params: {
    id?: string;
    numeroFactura?: string | null;
    fechaCompra?: Date;
    total: number;
    formaPago?: string;
    fechaVencimiento?: Date | null;
    pagado?: boolean;
    montoPagado?: number;
    proveedorId: string;
    notas?: string | null;
  }): Compra {
    const now = new Date();
    return new Compra(
      params.id || crypto.randomUUID(),
      params.numeroFactura ?? null,
      params.fechaCompra || now,
      params.total,
      params.formaPago || 'contado',
      params.fechaVencimiento ?? null,
      params.pagado || false,
      params.montoPagado || 0,
      params.proveedorId,
      params.notas ?? null,
      now,
      now
    );
  }

  static fromPersistence(data: {
    id: string;
    numeroFactura: string | null;
    fechaCompra: Date;
    total: number;
    formaPago: string;
    fechaVencimiento: Date | null;
    pagado: boolean;
    montoPagado: number;
    proveedorId: string;
    notas: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Compra {
    return new Compra(
      data.id,
      data.numeroFactura,
      data.fechaCompra,
      Number(data.total),
      data.formaPago,
      data.fechaVencimiento,
      data.pagado,
      Number(data.montoPagado),
      data.proveedorId,
      data.notas,
      data.createdAt,
      data.updatedAt
    );
  }

  private validate(): void {
    if (!this.proveedorId || this.proveedorId.trim().length === 0) {
      throw new Error('El ID del proveedor es obligatorio');
    }
    if (this.total <= 0) {
      throw new Error('El total de la compra debe ser mayor a cero');
    }
    if (this.montoPagado < 0) {
      throw new Error('El monto pagado no puede ser negativo');
    }
    if (this.montoPagado > this.total) {
      throw new Error('El monto pagado no puede ser mayor al total');
    }
  }

  /**
   * Calcula el saldo pendiente de la compra
   */
  saldoPendiente(): number {
    return this.total - this.montoPagado;
  }

  /**
   * Marca la compra como pagada
   */
  marcarComoPagada(): Compra {
    return new Compra(
      this.id,
      this.numeroFactura,
      this.fechaCompra,
      this.total,
      this.formaPago,
      this.fechaVencimiento,
      true,
      this.total,
      this.proveedorId,
      this.notas,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Registra un pago parcial
   */
  registrarPago(monto: number): Compra {
    const nuevoMontoPagado = this.montoPagado + monto;
    const estaPagada = nuevoMontoPagado >= this.total;

    return new Compra(
      this.id,
      this.numeroFactura,
      this.fechaCompra,
      this.total,
      this.formaPago,
      this.fechaVencimiento,
      estaPagada,
      Math.min(nuevoMontoPagado, this.total),
      this.proveedorId,
      this.notas,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Verifica si la compra está vencida
   */
  estaVencida(): boolean {
    if (!this.fechaVencimiento) return false;
    return new Date() > this.fechaVencimiento && !this.pagado;
  }
}




