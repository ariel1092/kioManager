import { Request, Response } from 'express';
import { CrearProveedor } from '../../../application/use-cases/proveedores/CrearProveedor';
import { ListarProveedores } from '../../../application/use-cases/proveedores/ListarProveedores';
import { z } from 'zod';

/**
 * Controller para Proveedores
 */
export class ProveedorController {
  constructor(
    private readonly crearProveedor: CrearProveedor,
    private readonly listarProveedores: ListarProveedores
  ) {}

  private crearProveedorSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    contacto: z.string().optional().nullable(),
    telefono: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    direccion: z.string().optional().nullable(),
  });

  async crear(req: Request, res: Response): Promise<void> {
    try {
      const body = this.crearProveedorSchema.parse(req.body);

      const result = await this.crearProveedor.execute(body);

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
      const activos = req.query.activos === 'true' ? true : req.query.activos === 'false' ? false : undefined;

      const result = await this.listarProveedores.execute(activos);

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

