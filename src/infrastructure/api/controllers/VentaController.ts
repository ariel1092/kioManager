import { Request, Response } from 'express';
import { RegistrarVenta } from '../../../application/use-cases/ventas/RegistrarVenta';
import { ListarVentas } from '../../../application/use-cases/ventas/ListarVentas';
import { z } from 'zod';

/**
 * Controller para Ventas
 */
export class VentaController {
  constructor(
    private readonly registrarVenta: RegistrarVenta,
    private readonly listarVentas: ListarVentas
  ) {}

  private registrarVentaSchema = z.object({
    items: z.array(
      z.object({
        productoId: z.string().uuid(),
        loteId: z.string().uuid().optional().nullable(),
        cantidad: z.number().int().min(1),
      })
    ).min(1, 'Debe tener al menos un item'),
    metodoPago: z.string().optional(),
    notas: z.string().optional().nullable(),
  });

  async registrar(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const body = this.registrarVentaSchema.parse(req.body);

      // Convertir null a undefined para compatibilidad con use cases
      const result = await this.registrarVenta.execute({
        ...body,
        items: body.items.map(item => ({
          ...item,
          loteId: item.loteId ?? undefined,
        })),
        notas: body.notas ?? undefined,
        usuarioId: req.user.userId,
      });

      if (!result.success) {
        res.status(400).json({ error: result.error.message });
        return;
      }

      res.status(201).json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Error de validación',
          details: error.errors,
        });
        return;
      }

      res.status(500).json({
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const fechaInicio = req.query.fechaInicio ? new Date(req.query.fechaInicio as string) : undefined;
      const fechaFin = req.query.fechaFin ? new Date(req.query.fechaFin as string) : undefined;

      const result = await this.listarVentas.execute(fechaInicio, fechaFin);

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

