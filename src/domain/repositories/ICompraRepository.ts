import { Compra } from '../entities/Compra';

/**
 * Interfaz del repositorio de Compras
 */
export interface ICompraRepository {
  findById(id: string): Promise<Compra | null>;
  findByProveedor(proveedorId: string): Promise<Compra[]>;
  findPendientes(): Promise<Compra[]>;
  findVencidas(): Promise<Compra[]>;
  save(compra: Compra): Promise<Compra>;
  delete(id: string): Promise<void>;
}



