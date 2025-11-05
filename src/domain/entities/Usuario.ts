/**
 * Entidad de Dominio: Usuario
 * Representa un usuario del sistema con su rol
 */
export enum Rol {
  DUENO = 'DUENO',
  EMPLEADO = 'EMPLEADO',
}

export class Usuario {
  private constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly rol: Rol,
    public readonly activo: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  static create(params: {
    id?: string;
    nombre: string;
    email: string;
    passwordHash: string;
    rol?: Rol;
  }): Usuario {
    const now = new Date();
    return new Usuario(
      params.id || crypto.randomUUID(),
      params.nombre,
      params.email,
      params.passwordHash,
      params.rol || Rol.EMPLEADO,
      true,
      now,
      now
    );
  }

  static fromPersistence(data: {
    id: string;
    nombre: string;
    email: string;
    password: string;
    rol: string;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Usuario {
    return new Usuario(
      data.id,
      data.nombre,
      data.email,
      data.password,
      data.rol as Rol,
      data.activo,
      data.createdAt,
      data.updatedAt
    );
  }

  private validate(): void {
    if (!this.nombre || this.nombre.trim().length === 0) {
      throw new Error('El nombre del usuario es obligatorio');
    }
    if (!this.email || this.email.trim().length === 0) {
      throw new Error('El email del usuario es obligatorio');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error('El email no es válido');
    }
    if (!Object.values(Rol).includes(this.rol)) {
      throw new Error('El rol no es válido');
    }
  }

  /**
   * Verifica si el usuario es dueño
   */
  esDueño(): boolean {
    return this.rol === Rol.DUENO;
  }

  /**
   * Verifica si el usuario es empleado
   */
  esEmpleado(): boolean {
    return this.rol === Rol.EMPLEADO;
  }

  /**
   * Verifica si el usuario puede realizar una acción
   */
  puede(accion: 'crear' | 'editar' | 'eliminar' | 'ver'): boolean {
    if (this.esDueño()) {
      return true; // El dueño puede hacer todo
    }

    // Restricciones para empleados
    if (this.esEmpleado()) {
      switch (accion) {
        case 'crear':
          // Empleados solo pueden crear ventas
          return false;
        case 'editar':
          // Empleados no pueden editar productos/proveedores
          return false;
        case 'eliminar':
          // Empleados no pueden eliminar nada
          return false;
        case 'ver':
          // Empleados pueden ver todo pero con restricciones
          return true;
        default:
          return false;
      }
    }

    return false;
  }

  desactivar(): Usuario {
    return new Usuario(
      this.id,
      this.nombre,
      this.email,
      this.passwordHash,
      this.rol,
      false,
      this.createdAt,
      new Date()
    );
  }

  activar(): Usuario {
    return new Usuario(
      this.id,
      this.nombre,
      this.email,
      this.passwordHash,
      this.rol,
      true,
      this.createdAt,
      new Date()
    );
  }

  actualizarNombre(nombre: string): void {
    (this as any).nombre = nombre;
    (this as any).updatedAt = new Date();
  }

  actualizarEmail(email: string): void {
    (this as any).email = email;
    (this as any).updatedAt = new Date();
  }

  cambiarRol(rol: Rol): void {
    (this as any).rol = rol;
    (this as any).updatedAt = new Date();
  }

  actualizarPassword(passwordHash: string): void {
    (this as any).passwordHash = passwordHash;
    (this as any).updatedAt = new Date();
  }
}

