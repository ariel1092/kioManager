import { Venta } from '../entities/Venta';

/**
 * Interfaz del repositorio de Ventas
 */
export interface IVentaRepository {
  findById(id: string): Promise<Venta | null>;
  findByNumeroVenta(numeroVenta: string): Promise<Venta | null>;
  findAll(): Promise<Venta[]>;
  findByFecha(fechaInicio: Date, fechaFin: Date): Promise<Venta[]>;
  save(venta: Venta, usuarioId?: string): Promise<Venta>;
  delete(id: string): Promise<void>;
}

