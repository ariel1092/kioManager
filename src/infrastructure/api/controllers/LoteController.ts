import { Request, Response } from 'express';
import { ObtenerLotesVencidos } from '../../../application/use-cases/lotes/ObtenerLotesVencidos';
import { ObtenerLotesPorVencer } from '../../../application/use-cases/lotes/ObtenerLotesPorVencer';
import { ObtenerLotesPorProducto } from '../../../application/use-cases/lotes/ObtenerLotesPorProducto';

/**
 * Controller para Lotes
 */
export class LoteController {
  constructor(
    private readonly obtenerLotesVencidos: ObtenerLotesVencidos,
    private readonly obtenerLotesPorVencer: ObtenerLotesPorVencer,
    private readonly obtenerLotesPorProducto: ObtenerLotesPorProducto
  ) {}

  async vencidos(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.obtenerLotesVencidos.execute();

      if (!result.success) {
        res.status(500).json({ error: result.error.message });
        return;
      }

      res.json({
        success: true,
        data: result.data,
        count: result.data.length,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async porVencer(req: Request, res: Response): Promise<void> {
    try {
      const diasAnticipacion = req.query.dias
        ? parseInt(req.query.dias as string, 10)
        : 30;

      const result = await this.obtenerLotesPorVencer.execute(diasAnticipacion);

      if (!result.success) {
        res.status(500).json({ error: result.error.message });
        return;
      }

      res.json({
        success: true,
        data: result.data,
        count: result.data.length,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async porProducto(req: Request, res: Response): Promise<void> {
    try {
      const productoId = req.params.productoId;

      if (!productoId) {
        res.status(400).json({ error: 'El ID del producto es obligatorio' });
        return;
      }

      const result = await this.obtenerLotesPorProducto.execute(productoId);

      if (!result.success) {
        res.status(500).json({ error: result.error.message });
        return;
      }

      res.json({
        success: true,
        data: result.data,
        count: result.data.length,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}

