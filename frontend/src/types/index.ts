/**
 * Tipos TypeScript para el frontend
 * Sincronizados con las entidades del backend
 */

export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoria: string | null;
  precioCompra: number;
  precioVenta: number;
  stockMinimo: number;
  stockActual: number;
  tieneVencimiento: boolean;
  activo: boolean;
  proveedorId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  contacto: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lote {
  id: string;
  numeroLote: string;
  fechaVencimiento: string;
  cantidad: number;
  cantidadVendida: number;
  productoId: string;
  compraId: string | null;
  createdAt: string;
  updatedAt: string;
  producto?: Producto;
}

export interface VentaItem {
  id: string;
  productoId: string;
  loteId: string | null;
  cantidad: number;
  precioUnitario: number;
  precioCompraUnitario: number;
  subtotal: number;
  ganancia: number;
  producto?: Producto;
  lote?: Lote;
}

export interface Venta {
  id: string;
  numeroVenta: string;
  fechaVenta: string;
  total: number;
  ganancia: number;
  metodoPago: string;
  notas: string | null;
  items: VentaItem[];
  createdAt: string;
  updatedAt: string;
}

export interface GananciasReporte {
  totalVentas: number;
  totalGanancias: number;
  margenGanancia: number;
  cantidadVentas: number;
  totalPagosProveedores: number;
  gananciaNeta: number;
  fechaInicio: string;
  fechaFin: string;
}

// DTOs para crear
export interface CrearProductoDTO {
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  precioCompra: number;
  precioVenta: number;
  stockMinimo?: number;
  tieneVencimiento?: boolean;
  proveedorId?: string;
}

export interface CrearProveedorDTO {
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}

export interface CrearVentaDTO {
  items: Array<{
    productoId: string;
    loteId?: string;
    cantidad: number;
  }>;
  metodoPago?: string;
  notas?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export interface ApiError {
  error: string;
  details?: Array<{ message: string; path: string[] }>;
}

export interface LoginResponse {
  token: string;
  usuario: {
    id: string;
    nombre: string;
    email: string;
    rol: string;
  };
}

export type Rol = 'DUENO' | 'EMPLEADO';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

