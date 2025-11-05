import { IVentaRepository } from '../../../domain/repositories/IVentaRepository';
import { Result } from '../../../shared/types/Result';
import { IPagoProveedorRepository } from '../../../domain/repositories/IPagoProveedorRepository';

/**
 * Caso de Uso: Obtener Reporte de Ganancias
 */
export interface GananciasReporte {
  totalVentas: number;
  totalGanancias: number;
  margenGanancia: number;
  cantidadVentas: number;
  totalPagosProveedores: number;
  gananciaNeta: number;
  fechaInicio: Date;
  fechaFin: Date;
}

export class ObtenerGanancias {
  constructor(
    private readonly ventaRepository: IVentaRepository,
    private readonly pagoProveedorRepository: IPagoProveedorRepository
  ) {}

  async execute(fechaInicio: Date, fechaFin: Date): Promise<Result<GananciasReporte, Error>> {
    try {
      // Asegurar que las fechas incluyan todo el día
      const inicio = new Date(fechaInicio);
      inicio.setHours(0, 0, 0, 0);
      
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999);

      console.log('🔍 Buscando ventas en rango:', {
        inicio: inicio.toISOString(),
        fin: fin.toISOString(),
      });

      const ventas = await this.ventaRepository.findByFecha(inicio, fin);
      const pagos = await this.pagoProveedorRepository.findByFecha(inicio, fin);

      console.log('📦 Resultados encontrados:', {
        cantidadVentas: ventas.length,
        cantidadPagos: pagos.length,
        ventas: ventas.map(v => ({
          id: v.id,
          fechaVenta: v.fechaVenta.toISOString(),
          total: v.total,
          ganancia: v.ganancia,
        })),
      });

      const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0);
      const totalGanancias = ventas.reduce((sum, venta) => sum + venta.ganancia, 0);
      const cantidadVentas = ventas.length;
      
      // Convertir monto de Decimal a Number si es necesario
      const totalPagosProveedores = pagos.reduce((sum, p) => {
        const monto = typeof p.monto === 'number' ? p.monto : Number(p.monto);
        return sum + monto;
      }, 0);
      
      const gananciaNeta = totalGanancias - totalPagosProveedores;
      
      // Calcular margen de ganancia: (ganancias / costo) * 100
      const costoTotal = totalVentas - totalGanancias;
      const margenGanancia = costoTotal > 0 ? (totalGanancias / costoTotal) * 100 : 0;

      const reporte: GananciasReporte = {
        totalVentas,
        totalGanancias,
        margenGanancia,
        cantidadVentas,
        totalPagosProveedores,
        gananciaNeta,
        fechaInicio: inicio,
        fechaFin: fin,
      };

      return Result.ok(reporte);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}

