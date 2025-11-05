import { Request, Response } from 'express';
import { CrearProducto } from '../../../application/use-cases/productos/CrearProducto';
import { ListarProductos } from '../../../application/use-cases/productos/ListarProductos';
import { ObtenerProductosStockBajo } from '../../../application/use-cases/productos/ObtenerProductosStockBajo';
import { BuscarProductoPorCodigo } from '../../../application/use-cases/productos/BuscarProductoPorCodigo';
import { z } from 'zod';

/**
 * Controller para Productos
 * Capa de presentación - maneja HTTP requests/responses
 */
export class ProductoController {
  constructor(
    private readonly crearProducto: CrearProducto,
    private readonly listarProductos: ListarProductos,
    private readonly obtenerProductosStockBajo: ObtenerProductosStockBajo,
    private readonly buscarProductoPorCodigo: BuscarProductoPorCodigo
  ) {}

  // Schema de validación con Zod
  private crearProductoSchema = z.object({
    codigo: z.string().min(1, 'El código es obligatorio'),
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    descripcion: z.string().optional().nullable(),
    categoria: z.string().optional().nullable(),
    precioCompra: z.number().min(0, 'El precio de compra debe ser mayor o igual a 0'),
    precioVenta: z.number().min(0, 'El precio de venta debe ser mayor o igual a 0'),
    stockMinimo: z.number().int().min(0).optional(),
    tieneVencimiento: z.boolean().optional(),
    proveedorId: z.string().uuid().optional().nullable(),
  });

  async crear(req: Request, res: Response): Promise<void> {
    try {
      const body = this.crearProductoSchema.parse(req.body);

      // Convertir null a undefined para compatibilidad con use cases
      const result = await this.crearProducto.execute({
        ...body,
        descripcion: body.descripcion ?? undefined,
        categoria: body.categoria ?? undefined,
        proveedorId: body.proveedorId ?? undefined,
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
      const activos = req.query.activos === 'true' ? true : req.query.activos === 'false' ? false : undefined;

      const result = await this.listarProductos.execute(activos);

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

  async stockBajo(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.obtenerProductosStockBajo.execute();

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

  async buscarPorCodigo(req: Request, res: Response): Promise<void> {
    try {
      const codigo = decodeURIComponent(req.params.codigo);

      if (!codigo) {
        res.status(400).json({ error: 'El código es obligatorio' });
        return;
      }

      console.log('[ProductoController] Buscando producto por código:', codigo);

      const result = await this.buscarProductoPorCodigo.execute(codigo);

      if (!result.success) {
        console.log('[ProductoController] Producto no encontrado:', result.error.message);
        res.status(404).json({ error: result.error.message });
        return;
      }

      console.log('[ProductoController] Producto encontrado:', result.data.nombre);
      res.json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      console.error('[ProductoController] Error al buscar producto:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}

