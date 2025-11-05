import { PagoProveedor } from '../entities/PagoProveedor';

/**
 * Interfaz del repositorio de Pagos a Proveedores
 */
export interface IPagoProveedorRepository {
  findById(id: string): Promise<PagoProveedor | null>;
  findByProveedor(proveedorId: string): Promise<PagoProveedor[]>;
  findByCompra(compraId: string): Promise<PagoProveedor[]>;
  findByFecha(fechaInicio: Date, fechaFin: Date): Promise<PagoProveedor[]>;
  save(pago: PagoProveedor): Promise<PagoProveedor>;
  delete(id: string): Promise<void>;
}

