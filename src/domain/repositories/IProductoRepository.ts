import { Producto } from '../entities/Producto';

/**
 * Interfaz del repositorio de Productos
 * Patrón Repository - Separación de lógica de persistencia
 */
export interface IProductoRepository {
  findById(id: string): Promise<Producto | null>;
  findByCodigo(codigo: string): Promise<Producto | null>;
  findAll(activos?: boolean): Promise<Producto[]>;
  findByCategoria(categoria: string): Promise<Producto[]>;
  findByProveedor(proveedorId: string): Promise<Producto[]>;
  findStockBajo(): Promise<Producto[]>;
  save(producto: Producto): Promise<Producto>;
  delete(id: string): Promise<void>;
}

