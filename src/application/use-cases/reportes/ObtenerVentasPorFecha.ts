import { IVentaRepository } from '../../../domain/repositories/IVentaRepository';
import { Result } from '../../../shared/types/Result';

export interface VentaPorFecha {
  fecha: string; // Formato YYYY-MM-DD
  cantidad: number;
  total: number;
  ganancia: number;
}

/**
 * Caso de Uso: Obtener Ventas por Fecha
 * 
 * Agrupa las ventas por fecha para generar gráficos
 */
export class ObtenerVentasPorFecha {
  constructor(private readonly ventaRepository: IVentaRepository) {}

  async execute(fechaInicio: Date, fechaFin: Date): Promise<Result<VentaPorFecha[], Error>> {
    try {
      const ventas = await this.ventaRepository.findByFecha(fechaInicio, fechaFin);

      // Agrupar ventas por fecha
      const ventasPorFecha = new Map<string, {
        cantidad: number;
        total: number;
        ganancia: number;
      }>();

      ventas.forEach(venta => {
        const fecha = venta.fechaVenta.toISOString().split('T')[0]; // YYYY-MM-DD
        const existente = ventasPorFecha.get(fecha);

        if (existente) {
          existente.cantidad += 1;
          existente.total += venta.total;
          existente.ganancia += venta.ganancia;
        } else {
          ventasPorFecha.set(fecha, {
            cantidad: 1,
            total: venta.total,
            ganancia: venta.ganancia,
          });
        }
      });

      // Convertir a array y ordenar por fecha
      const resultado: VentaPorFecha[] = Array.from(ventasPorFecha.entries())
        .map(([fecha, datos]) => ({
          fecha,
          cantidad: datos.cantidad,
          total: datos.total,
          ganancia: datos.ganancia,
        }))
        .sort((a, b) => a.fecha.localeCompare(b.fecha));

      return Result.ok(resultado);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}

