import { Proveedor } from '../entities/Proveedor';

/**
 * Interfaz del repositorio de Proveedores
 */
export interface IProveedorRepository {
  findById(id: string): Promise<Proveedor | null>;
  findAll(activos?: boolean): Promise<Proveedor[]>;
  save(proveedor: Proveedor): Promise<Proveedor>;
  delete(id: string): Promise<void>;
}

