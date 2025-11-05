/**
 * Entidad de Dominio: Producto
 * Representa un producto del kiosco con toda su lógica de negocio
 * 
 * Principios aplicados:
 * - Encapsulación de lógica de negocio
 * - Inmutabilidad donde sea posible
 * - Validaciones en el dominio
 */
export class Producto {
  private constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly nombre: string,
    public readonly descripcion: string | null,
    public readonly categoria: string | null,
    public readonly precioCompra: number,
    public readonly precioVenta: number,
    public readonly stockMinimo: number,
    public readonly stockActual: number,
    public readonly tieneVencimiento: boolean,
    public readonly activo: boolean,
    public readonly proveedorId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  /**
   * Factory method para crear un nuevo producto
   */
  static create(params: {
    id?: string;
    codigo: string;
    nombre: string;
    descripcion?: string | null;
    categoria?: string | null;
    precioCompra: number;
    precioVenta: number;
    stockMinimo?: number;
    tieneVencimiento?: boolean;
    proveedorId?: string | null;
  }): Producto {
    const now = new Date();
    return new Producto(
      params.id || crypto.randomUUID(),
      params.codigo,
      params.nombre,
      params.descripcion ?? null,
      params.categoria ?? null,
      params.precioCompra,
      params.precioVenta,
      params.stockMinimo ?? 0,
      0, // stockActual inicial
      params.tieneVencimiento ?? false,
      true, // activo por defecto
      params.proveedorId ?? null,
      now,
      now
    );
  }

  /**
   * Factory method para reconstruir desde persistencia
   */
  static fromPersistence(data: {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    categoria: string | null;
    precioCompra: number | string;
    precioVenta: number | string;
    stockMinimo: number;
    stockActual: number;
    tieneVencimiento: boolean;
    activo: boolean;
    proveedorId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Producto {
    return new Producto(
      data.id,
      data.codigo,
      data.nombre,
      data.descripcion,
      data.categoria,
      Number(data.precioCompra),
      Number(data.precioVenta),
      data.stockMinimo,
      data.stockActual,
      data.tieneVencimiento,
      data.activo,
      data.proveedorId,
      data.createdAt,
      data.updatedAt
    );
  }

  /**
   * Validaciones de negocio
   */
  private validate(): void {
    if (!this.codigo || this.codigo.trim().length === 0) {
      throw new Error('El código del producto es obligatorio');
    }
    if (!this.nombre || this.nombre.trim().length === 0) {
      throw new Error('El nombre del producto es obligatorio');
    }
    if (this.precioCompra < 0) {
      throw new Error('El precio de compra no puede ser negativo');
    }
    if (this.precioVenta < 0) {
      throw new Error('El precio de venta no puede ser negativo');
    }
    if (this.precioVenta < this.precioCompra) {
      throw new Error('El precio de venta debe ser mayor o igual al precio de compra');
    }
    if (this.stockMinimo < 0) {
      throw new Error('El stock mínimo no puede ser negativo');
    }
    if (this.stockActual < 0) {
      throw new Error('El stock actual no puede ser negativo');
    }
  }

  /**
   * Calcula el margen de ganancia del producto
   */
  calcularMargenGanancia(): number {
    if (this.precioCompra === 0) return 0;
    return ((this.precioVenta - this.precioCompra) / this.precioCompra) * 100;
  }

  /**
   * Calcula el margen de ganancia en pesos
   */
  calcularGananciaUnitaria(): number {
    return this.precioVenta - this.precioCompra;
  }

  /**
   * Verifica si el stock está por debajo del mínimo
   */
  tieneStockBajo(): boolean {
    return this.stockActual <= this.stockMinimo;
  }

  /**
   * Verifica si hay stock disponible para una cantidad
   */
  tieneStockDisponible(cantidad: number): boolean {
    return this.stockActual >= cantidad;
  }

  /**
   * Actualiza el stock actual
   */
  actualizarStock(nuevaCantidad: number): Producto {
    if (nuevaCantidad < 0) {
      throw new Error('El stock no puede ser negativo');
    }
    
    return new Producto(
      this.id,
      this.codigo,
      this.nombre,
      this.descripcion,
      this.categoria,
      this.precioCompra,
      this.precioVenta,
      this.stockMinimo,
      nuevaCantidad,
      this.tieneVencimiento,
      this.activo,
      this.proveedorId,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Desactiva el producto
   */
  desactivar(): Producto {
    return new Producto(
      this.id,
      this.codigo,
      this.nombre,
      this.descripcion,
      this.categoria,
      this.precioCompra,
      this.precioVenta,
      this.stockMinimo,
      this.stockActual,
      this.tieneVencimiento,
      false,
      this.proveedorId,
      this.createdAt,
      new Date()
    );
  }
}

