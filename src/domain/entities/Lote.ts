/**
 * Entidad de Dominio: Lote
 * Representa un lote de productos para control de vencimientos
 */
export class Lote {
  private constructor(
    public readonly id: string,
    public readonly numeroLote: string,
    public readonly fechaVencimiento: Date,
    public readonly cantidad: number,
    public readonly cantidadVendida: number,
    public readonly productoId: string,
    public readonly compraId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  static create(params: {
    id?: string;
    numeroLote: string;
    fechaVencimiento: Date;
    cantidad: number;
    productoId: string;
    compraId?: string | null;
  }): Lote {
    const now = new Date();
    return new Lote(
      params.id || crypto.randomUUID(),
      params.numeroLote,
      params.fechaVencimiento,
      params.cantidad,
      0, // cantidadVendida inicial
      params.productoId,
      params.compraId ?? null,
      now,
      now
    );
  }

  static fromPersistence(data: {
    id: string;
    numeroLote: string;
    fechaVencimiento: Date;
    cantidad: number;
    cantidadVendida: number;
    productoId: string;
    compraId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Lote {
    return new Lote(
      data.id,
      data.numeroLote,
      data.fechaVencimiento,
      data.cantidad,
      data.cantidadVendida,
      data.productoId,
      data.compraId,
      data.createdAt,
      data.updatedAt
    );
  }

  private validate(): void {
    if (!this.numeroLote || this.numeroLote.trim().length === 0) {
      throw new Error('El número de lote es obligatorio');
    }
    if (this.cantidad <= 0) {
      throw new Error('La cantidad del lote debe ser mayor a cero');
    }
    if (this.cantidadVendida < 0) {
      throw new Error('La cantidad vendida no puede ser negativa');
    }
    if (this.cantidadVendida > this.cantidad) {
      throw new Error('La cantidad vendida no puede ser mayor a la cantidad del lote');
    }
  }

  /**
   * Calcula la cantidad disponible del lote
   */
  cantidadDisponible(): number {
    return this.cantidad - this.cantidadVendida;
  }

  /**
   * Verifica si el lote está vencido
   */
  estaVencido(): boolean {
    return this.fechaVencimiento < new Date();
  }

  /**
   * Verifica si el lote está próximo a vencer (30 días)
   */
  estaPorVencer(diasAnticipacion: number = 30): boolean {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + diasAnticipacion);
    return this.fechaVencimiento <= fechaLimite && !this.estaVencido();
  }

  /**
   * Días hasta el vencimiento
   */
  diasHastaVencimiento(): number {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = new Date(this.fechaVencimiento);
    vencimiento.setHours(0, 0, 0, 0);
    const diff = vencimiento.getTime() - hoy.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Verifica si hay stock disponible para una cantidad
   */
  tieneStockDisponible(cantidad: number): boolean {
    return this.cantidadDisponible() >= cantidad;
  }

  /**
   * Registra una venta del lote
   */
  registrarVenta(cantidad: number): Lote {
    if (!this.tieneStockDisponible(cantidad)) {
      throw new Error('No hay suficiente stock disponible en el lote');
    }
    
    return new Lote(
      this.id,
      this.numeroLote,
      this.fechaVencimiento,
      this.cantidad,
      this.cantidadVendida + cantidad,
      this.productoId,
      this.compraId,
      this.createdAt,
      new Date()
    );
  }
}



