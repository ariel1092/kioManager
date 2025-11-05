import { IVentaRepository } from '../../../domain/repositories/IVentaRepository';
import { Result } from '../../../shared/types/Result';
import { getPrismaClient } from '../../../infrastructure/database/PrismaClient';

export interface ProductoMasVendido {
  productoId: string;
  productoNombre: string;
  cantidadVendida: number;
  totalVentas: number;
  ganancia: number;
}

/**
 * Caso de Uso: Obtener Productos Más Vendidos
 * 
 * Retorna los productos más vendidos en un período
 */
export class ObtenerProductosMasVendidos {
  private prisma = getPrismaClient();

  async execute(
    fechaInicio: Date,
    fechaFin: Date,
    limite: number = 10
  ): Promise<Result<ProductoMasVendido[], Error>> {
    try {
      // Asegurar que las fechas incluyan todo el día
      const inicio = new Date(fechaInicio);
      inicio.setHours(0, 0, 0, 0);
      
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999);

      // Obtener datos directamente de Prisma para tener acceso a productos
      const ventasData = await this.prisma.venta.findMany({
        where: {
          fechaVenta: {
            gte: inicio,
            lte: fin,
          },
        },
        include: {
          items: {
            include: {
              producto: true,
            },
          },
        },
      });

      // Agrupar por producto
      const productosMap = new Map<string, {
        nombre: string;
        cantidadVendida: number;
        totalVentas: number;
        ganancia: number;
      }>();

      ventasData.forEach(venta => {
        venta.items.forEach(item => {
          const producto = item.producto;
          if (!producto) return;

          const productoId = producto.id;
          const existente = productosMap.get(productoId);

          if (existente) {
            existente.cantidadVendida += item.cantidad;
            existente.totalVentas += Number(item.subtotal);
            existente.ganancia += Number(item.ganancia);
          } else {
            productosMap.set(productoId, {
              nombre: producto.nombre,
              cantidadVendida: item.cantidad,
              totalVentas: Number(item.subtotal),
              ganancia: Number(item.ganancia),
            });
          }
        });
      });

      // Convertir a array, ordenar por cantidad vendida y limitar
      const resultado: ProductoMasVendido[] = Array.from(productosMap.entries())
        .map(([productoId, datos]) => ({
          productoId,
          productoNombre: datos.nombre,
          cantidadVendida: datos.cantidadVendida,
          totalVentas: datos.totalVentas,
          ganancia: datos.ganancia,
        }))
        .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
        .slice(0, limite);

      return Result.ok(resultado);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error('Error desconocido'));
    }
  }
}

