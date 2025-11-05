import { PrismaClient } from '@prisma/client';
import { Result } from '../../../shared/types/Result';

/**
 * Caso de Uso: Exportar Datos
 * 
 * Exporta todos los datos del sistema en formato JSON para backup
 */
export class ExportarDatos {
  private prisma = new PrismaClient();

  async execute(): Promise<Result<{
    fecha: string;
    usuarios: any[];
    proveedores: any[];
    productos: any[];
    ventas: any[];
    compras: any[];
    pagos: any[];
    lotes: any[];
  }, Error>> {
    try {
      const fecha = new Date().toISOString();

      // Exportar todos los datos
      const [usuarios, proveedores, productos, ventas, compras, pagos, lotes] = await Promise.all([
        this.prisma.usuario.findMany(),
        this.prisma.proveedor.findMany(),
        this.prisma.producto.findMany(),
        this.prisma.venta.findMany({
          include: {
            items: {
              include: {
                producto: true,
                lote: true,
              },
            },
            usuario: {
              select: {
                id: true,
                nombre: true,
                email: true,
              },
            },
          },
        }),
        this.prisma.compra.findMany({
          include: {
            items: {
              include: {
                producto: true,
              },
            },
            proveedor: true,
          },
        }),
        this.prisma.pagoProveedor.findMany({
          include: {
            proveedor: true,
            compra: true,
          },
        }),
        this.prisma.lote.findMany({
          include: {
            producto: true,
          },
        }),
      ]);

      const datos = {
        fecha,
        metadata: {
          version: '1.0.0',
          totalUsuarios: usuarios.length,
          totalProveedores: proveedores.length,
          totalProductos: productos.length,
          totalVentas: ventas.length,
          totalCompras: compras.length,
          totalPagos: pagos.length,
          totalLotes: lotes.length,
        },
        usuarios,
        proveedores,
        productos,
        ventas,
        compras,
        pagos,
        lotes,
      };

      return Result.ok(datos);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}



