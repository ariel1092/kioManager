import { Request, Response } from 'express';
import { z } from 'zod';
import { RegistrarPago } from '../../../application/use-cases/pagos/RegistrarPago';

/**
 * Controller para Pagos a Proveedores
 */
export class PagoProveedorController {
  constructor(private readonly registrarPago: RegistrarPago) {}

  async registrar(req: Request, res: Response): Promise<void> {
    try {
      const schema = z.object({
        proveedorId: z.string().min(1, 'El ID del proveedor es obligatorio'),
        compraId: z.string().optional().nullable(),
        fecha: z.string().datetime().optional().transform((val) => val ? new Date(val) : undefined),
        monto: z.number().positive('El monto debe ser mayor a cero'),
        metodoPago: z.enum(['efectivo', 'transferencia', 'cheque', 'tarjeta']).optional(),
        observaciones: z.string().optional().nullable(),
      });

      const data = schema.parse(req.body);

      const result = await this.registrarPago.execute({
        proveedorId: data.proveedorId,
        compraId: data.compraId,
        fecha: data.fecha,
        monto: data.monto,
        metodoPago: data.metodoPago,
        observaciones: data.observaciones,
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
          error: 'Datos inválidos',
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
}

