import { Request, Response } from 'express';
import { ObtenerGanancias } from '../../../application/use-cases/reportes/ObtenerGanancias';
import { ObtenerVentasPorFecha } from '../../../application/use-cases/reportes/ObtenerVentasPorFecha';
import { ObtenerProductosMasVendidos } from '../../../application/use-cases/reportes/ObtenerProductosMasVendidos';

/**
 * Controller para Reportes
 */
export class ReporteController {
  constructor(
    private readonly obtenerGanancias: ObtenerGanancias,
    private readonly obtenerVentasPorFecha: ObtenerVentasPorFecha,
    private readonly obtenerProductosMasVendidos: ObtenerProductosMasVendidos
  ) {}

  async ganancias(req: Request, res: Response): Promise<void> {
    try {
      // Parsear fechas correctamente para incluir todo el día
      let fechaInicio: Date;
      let fechaFin: Date;

      if (req.query.fechaInicio) {
        const fechaStr = req.query.fechaInicio as string;
        // Crear fecha en UTC para evitar problemas de zona horaria
        fechaInicio = new Date(fechaStr + 'T00:00:00.000Z');
      } else {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - 30);
        fecha.setHours(0, 0, 0, 0);
        fechaInicio = fecha;
      }

      if (req.query.fechaFin) {
        const fechaStr = req.query.fechaFin as string;
        // Crear fecha en UTC para evitar problemas de zona horaria
        fechaFin = new Date(fechaStr + 'T23:59:59.999Z');
      } else {
        fechaFin = new Date();
        fechaFin.setHours(23, 59, 59, 999);
      }

      console.log('📊 Reporte de Ganancias - Parámetros recibidos:', {
        fechaInicioQuery: req.query.fechaInicio,
        fechaFinQuery: req.query.fechaFin,
        fechaInicioParsed: fechaInicio.toISOString(),
        fechaFinParsed: fechaFin.toISOString(),
      });

      const result = await this.obtenerGanancias.execute(fechaInicio, fechaFin);

      if (!result.success) {
        console.error('❌ Error al obtener ganancias:', result.error.message);
        res.status(500).json({ error: result.error.message });
        return;
      }

      console.log('✅ Reporte generado:', {
        cantidadVentas: result.data.cantidadVentas,
        totalVentas: result.data.totalVentas,
        totalGanancias: result.data.totalGanancias,
        totalPagosProveedores: result.data.totalPagosProveedores,
        gananciaNeta: result.data.gananciaNeta,
      });

      res.json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async ventasPorFecha(req: Request, res: Response): Promise<void> {
    try {
      // Parsear fechas correctamente para incluir todo el día
      let fechaInicio: Date;
      let fechaFin: Date;

      if (req.query.fechaInicio) {
        const fechaStr = req.query.fechaInicio as string;
        fechaInicio = new Date(fechaStr);
        fechaInicio.setHours(0, 0, 0, 0);
      } else {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - 30);
        fecha.setHours(0, 0, 0, 0);
        fechaInicio = fecha;
      }

      if (req.query.fechaFin) {
        const fechaStr = req.query.fechaFin as string;
        fechaFin = new Date(fechaStr);
        fechaFin.setHours(23, 59, 59, 999);
      } else {
        fechaFin = new Date();
        fechaFin.setHours(23, 59, 59, 999);
      }

      const result = await this.obtenerVentasPorFecha.execute(fechaInicio, fechaFin);

      if (!result.success) {
        res.status(500).json({ error: result.error.message });
        return;
      }

      res.json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async productosMasVendidos(req: Request, res: Response): Promise<void> {
    try {
      // Parsear fechas correctamente para incluir todo el día
      let fechaInicio: Date;
      let fechaFin: Date;

      if (req.query.fechaInicio) {
        const fechaStr = req.query.fechaInicio as string;
        fechaInicio = new Date(fechaStr);
        fechaInicio.setHours(0, 0, 0, 0);
      } else {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - 30);
        fecha.setHours(0, 0, 0, 0);
        fechaInicio = fecha;
      }

      if (req.query.fechaFin) {
        const fechaStr = req.query.fechaFin as string;
        fechaFin = new Date(fechaStr);
        fechaFin.setHours(23, 59, 59, 999);
      } else {
        fechaFin = new Date();
        fechaFin.setHours(23, 59, 59, 999);
      }

      const limite = req.query.limite ? parseInt(req.query.limite as string) : 10;

      const result = await this.obtenerProductosMasVendidos.execute(fechaInicio, fechaFin, limite);

      if (!result.success) {
        res.status(500).json({ error: result.error.message });
        return;
      }

      res.json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}

