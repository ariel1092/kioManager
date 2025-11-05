import { Venta } from '../../domain/entities/Venta';
import { IVentaRepository } from '../../domain/repositories/IVentaRepository';
import { getPrismaClient } from '../database/PrismaClient';

/**
 * Implementación concreta del repositorio de Ventas usando Prisma
 */
export class VentaRepository implements IVentaRepository {
  private prisma = getPrismaClient();

  async findById(id: string): Promise<Venta | null> {
    const data = await this.prisma.venta.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            producto: true,
            lote: true,
          },
        },
      },
    });

    if (!data) return null;
    return Venta.fromPersistence({
      ...data,
      items: data.items.map(item => ({
        ...item,
        precioUnitario: item.precioUnitario,
        precioCompraUnitario: item.precioCompraUnitario,
        subtotal: item.subtotal,
        ganancia: item.ganancia,
      })),
    });
  }

  async findByNumeroVenta(numeroVenta: string): Promise<Venta | null> {
    const data = await this.prisma.venta.findUnique({
      where: { numeroVenta },
      include: {
        items: {
          include: {
            producto: true,
            lote: true,
          },
        },
      },
    });

    if (!data) return null;
    return Venta.fromPersistence({
      ...data,
      items: data.items.map(item => ({
        ...item,
        precioUnitario: item.precioUnitario,
        precioCompraUnitario: item.precioCompraUnitario,
        subtotal: item.subtotal,
        ganancia: item.ganancia,
      })),
    });
  }

  async findAll(): Promise<Venta[]> {
    const data = await this.prisma.venta.findMany({
      include: {
        items: {
          include: {
            producto: true,
            lote: true,
          },
        },
      },
      orderBy: { fechaVenta: 'desc' },
    });

    return data.map(item => Venta.fromPersistence({
      ...item,
      items: item.items.map(vi => ({
        ...vi,
        precioUnitario: vi.precioUnitario,
        precioCompraUnitario: vi.precioCompraUnitario,
        subtotal: vi.subtotal,
        ganancia: vi.ganancia,
      })),
    }));
  }

  async findByFecha(fechaInicio: Date, fechaFin: Date): Promise<Venta[]> {
    // Asegurar que las fechas incluyan todo el día
    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);
    
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    console.log('🔎 VentaRepository.findByFecha - Buscando ventas:', {
      fechaInicioOriginal: fechaInicio.toISOString(),
      fechaFinOriginal: fechaFin.toISOString(),
      inicioAjustado: inicio.toISOString(),
      finAjustado: fin.toISOString(),
    });

    const data = await this.prisma.venta.findMany({
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
            lote: true,
          },
        },
      },
      orderBy: { fechaVenta: 'desc' },
    });

    console.log('📊 VentaRepository.findByFecha - Resultados de Prisma:', {
      cantidadEncontrada: data.length,
      fechas: data.map(v => ({
        id: v.id,
        fechaVenta: v.fechaVenta.toISOString(),
        total: v.total,
      })),
    });

    return data.map(item => {
      const venta = Venta.fromPersistence({
        ...item,
        items: item.items.map(vi => ({
          ...vi,
          precioUnitario: vi.precioUnitario,
          precioCompraUnitario: vi.precioCompraUnitario,
          subtotal: vi.subtotal,
          ganancia: vi.ganancia,
        })),
      });
      
      // Agregar productos a los items para acceso directo
      (venta as any).itemsWithProduct = item.items.map(vi => ({
        ...vi,
        producto: vi.producto,
      }));
      
      return venta;
    });
  }

  async save(venta: Venta, usuarioId?: string): Promise<Venta> {
    if (!usuarioId) {
      throw new Error('usuarioId es requerido para guardar una venta');
    }

    // Usar transacción para garantizar atomicidad
    await this.prisma.$transaction(async (tx) => {
      // Crear la venta
      await tx.venta.create({
        data: {
          id: venta.id,
          numeroVenta: venta.numeroVenta,
          fechaVenta: venta.fechaVenta,
          total: venta.total,
          ganancia: venta.ganancia,
          metodoPago: venta.metodoPago,
          notas: venta.notas,
          usuarioId: usuarioId,
          createdAt: venta.createdAt,
          updatedAt: venta.updatedAt,
        },
      });

      // Crear los items de la venta
      await Promise.all(
        venta.items.map(item =>
          tx.ventaItem.create({
            data: {
              id: item.id,
              ventaId: venta.id,
              productoId: item.productoId,
              loteId: item.loteId,
              cantidad: item.cantidad,
              precioUnitario: item.precioUnitario,
              precioCompraUnitario: item.precioCompraUnitario,
              subtotal: item.subtotal,
              ganancia: item.ganancia,
            },
          })
        )
      );
    });

    // Recuperar la venta completa con relaciones
    const ventaCompleta = await this.findById(venta.id);
    if (!ventaCompleta) {
      throw new Error('Error al recuperar la venta guardada');
    }
    return ventaCompleta;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.venta.delete({
      where: { id },
    });
  }
}

