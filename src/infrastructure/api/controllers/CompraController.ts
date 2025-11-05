import { Request, Response } from 'express';
import { z } from 'zod';
import { RegistrarCompra } from '../../../application/use-cases/compras/RegistrarCompra';
import { ListarCompras } from '../../../application/use-cases/compras/ListarCompras';

/**
 * Controller para Compras
 */
export class CompraController {
  constructor(
    private readonly registrarCompra: RegistrarCompra,
    private readonly listarCompras: ListarCompras
  ) {}

  async registrar(req: Request, res: Response): Promise<void> {
    try {
      const schema = z.object({
        proveedorId: z.string().min(1, 'El ID del proveedor es obligatorio'),
        numeroFactura: z.string().optional().nullable(),
        fechaCompra: z.string().datetime().optional().transform((val) => val ? new Date(val) : undefined),
        items: z.array(
          z.object({
            productoId: z.string().min(1, 'El ID del producto es obligatorio'),
            cantidad: z.number().int().positive('La cantidad debe ser un número positivo'),
            precioUnitario: z.number().positive('El precio unitario debe ser mayor a cero'),
          })
        ).min(1, 'La compra debe tener al menos un item'),
        formaPago: z.enum(['contado', 'credito', 'transferencia']).optional(),
        fechaVencimiento: z.string().datetime().optional().nullable().transform((val) => val ? new Date(val) : null),
        notas: z.string().optional().nullable(),
      });

      const data = schema.parse(req.body);

      const result = await this.registrarCompra.execute({
        proveedorId: data.proveedorId,
        numeroFactura: data.numeroFactura,
        fechaCompra: data.fechaCompra,
        items: data.items,
        formaPago: data.formaPago,
        fechaVencimiento: data.fechaVencimiento,
        notas: data.notas,
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

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const proveedorId = req.query.proveedorId as string | undefined;
      const soloPendientes = req.query.soloPendientes === 'true';
      const soloVencidas = req.query.soloVencidas === 'true';

      const result = await this.listarCompras.execute({
        proveedorId,
        soloPendientes,
        soloVencidas,
      });

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




