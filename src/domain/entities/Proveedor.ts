/**
 * Entidad de Dominio: Proveedor
 * Representa un proveedor del kiosco
 */
export class Proveedor {
  private constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly contacto: string | null,
    public readonly telefono: string | null,
    public readonly email: string | null,
    public readonly direccion: string | null,
    public readonly tipo: string | null,
    public readonly condicionPago: string | null,
    public readonly cuit: string | null,
    public readonly cuentasBancarias: string | null,
    public readonly activo: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  static create(params: {
    id?: string;
    nombre: string;
    contacto?: string | null;
    telefono?: string | null;
    email?: string | null;
    direccion?: string | null;
    tipo?: string | null;
    condicionPago?: string | null;
    cuit?: string | null;
    cuentasBancarias?: string | null;
  }): Proveedor {
    const now = new Date();
    return new Proveedor(
      params.id || crypto.randomUUID(),
      params.nombre,
      params.contacto ?? null,
      params.telefono ?? null,
      params.email ?? null,
      params.direccion ?? null,
      params.tipo ?? null,
      params.condicionPago ?? null,
      params.cuit ?? null,
      params.cuentasBancarias ?? null,
      true,
      now,
      now
    );
  }

  static fromPersistence(data: {
    id: string;
    nombre: string;
    contacto: string | null;
    telefono: string | null;
    email: string | null;
    direccion: string | null;
    tipo: string | null;
    condicionPago: string | null;
    cuit: string | null;
    cuentasBancarias: string | null;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Proveedor {
    return new Proveedor(
      data.id,
      data.nombre,
      data.contacto,
      data.telefono,
      data.email,
      data.direccion,
      data.tipo,
      data.condicionPago,
      data.cuit,
      data.cuentasBancarias,
      data.activo,
      data.createdAt,
      data.updatedAt
    );
  }

  private validate(): void {
    if (!this.nombre || this.nombre.trim().length === 0) {
      throw new Error('El nombre del proveedor es obligatorio');
    }
  }

  desactivar(): Proveedor {
    return new Proveedor(
      this.id,
      this.nombre,
      this.contacto,
      this.telefono,
      this.email,
      this.direccion,
      this.tipo,
      this.condicionPago,
      this.cuit,
      this.cuentasBancarias,
      false,
      this.createdAt,
      new Date()
    );
  }
}

