/**
 * Entidad de Dominio: Venta
 * Representa una venta con cálculo de ganancias
 */
export class VentaItem {
  constructor(
    public readonly id: string,
    public readonly productoId: string,
    public readonly loteId: string | null,
    public readonly cantidad: number,
    public readonly precioUnitario: number,
    public readonly precioCompraUnitario: number,
    public readonly subtotal: number,
    public readonly ganancia: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a cero');
    }
    if (this.precioUnitario < 0) {
      throw new Error('El precio unitario no puede ser negativo');
    }
    if (this.subtotal < 0) {
      throw new Error('El subtotal no puede ser negativo');
    }
  }
}

export class Venta {
  private constructor(
    public readonly id: string,
    public readonly numeroVenta: string,
    public readonly fechaVenta: Date,
    public readonly total: number,
    public readonly ganancia: number,
    public readonly metodoPago: string,
    public readonly notas: string | null,
    public readonly items: VentaItem[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  static create(params: {
    id?: string;
    numeroVenta?: string;
    items: Array<{
      productoId: string;
      loteId?: string | null;
      cantidad: number;
      precioUnitario: number;
      precioCompraUnitario: number;
    }>;
    metodoPago?: string;
    notas?: string | null;
  }): Venta {
    const now = new Date();
    const items = params.items.map(item => {
      const subtotal = item.cantidad * item.precioUnitario;
      const ganancia = item.cantidad * (item.precioUnitario - item.precioCompraUnitario);
      return new VentaItem(
        crypto.randomUUID(),
        item.productoId,
        item.loteId ?? null,
        item.cantidad,
        item.precioUnitario,
        item.precioCompraUnitario,
        subtotal,
        ganancia
      );
    });

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const ganancia = items.reduce((sum, item) => sum + item.ganancia, 0);

    return new Venta(
      params.id || crypto.randomUUID(),
      params.numeroVenta || this.generarNumeroVenta(),
      now,
      total,
      ganancia,
      params.metodoPago || 'efectivo',
      params.notas ?? null,
      items,
      now,
      now
    );
  }

  static fromPersistence(data: {
    id: string;
    numeroVenta: string;
    fechaVenta: Date;
    total: number | string;
    ganancia: number | string;
    metodoPago: string;
    notas: string | null;
    items: Array<{
      id: string;
      productoId: string;
      loteId: string | null;
      cantidad: number;
      precioUnitario: number | string;
      precioCompraUnitario: number | string;
      subtotal: number | string;
      ganancia: number | string;
    }>;
    createdAt: Date;
    updatedAt: Date;
  }): Venta {
    const items = data.items.map(item => new VentaItem(
      item.id,
      item.productoId,
      item.loteId,
      item.cantidad,
      Number(item.precioUnitario),
      Number(item.precioCompraUnitario),
      Number(item.subtotal),
      Number(item.ganancia)
    ));

    return new Venta(
      data.id,
      data.numeroVenta,
      data.fechaVenta,
      Number(data.total),
      Number(data.ganancia),
      data.metodoPago,
      data.notas,
      items,
      data.createdAt,
      data.updatedAt
    );
  }

  private static generarNumeroVenta(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `V-${timestamp}-${random}`;
  }

  private validate(): void {
    if (!this.numeroVenta || this.numeroVenta.trim().length === 0) {
      throw new Error('El número de venta es obligatorio');
    }
    if (this.items.length === 0) {
      throw new Error('Una venta debe tener al menos un item');
    }
    if (this.total < 0) {
      throw new Error('El total no puede ser negativo');
    }
  }

  /**
   * Calcula el margen de ganancia porcentual
   */
  calcularMargenGanancia(): number {
    if (this.total === 0) return 0;
    const costoTotal = this.total - this.ganancia;
    return (this.ganancia / costoTotal) * 100;
  }
}

