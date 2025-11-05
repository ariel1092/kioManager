import { Lote } from '../../domain/entities/Lote';
import { ILoteRepository } from '../../domain/repositories/ILoteRepository';
import { getPrismaClient } from '../database/PrismaClient';

/**
 * Implementación concreta del repositorio de Lotes usando Prisma
 */
export class LoteRepository implements ILoteRepository {
  private prisma = getPrismaClient();

  async findById(id: string): Promise<Lote | null> {
    const data = await this.prisma.lote.findUnique({
      where: { id },
    });

    if (!data) return null;
    return Lote.fromPersistence(data);
  }

  async findByProducto(productoId: string): Promise<Lote[]> {
    const data = await this.prisma.lote.findMany({
      where: { productoId },
      orderBy: { fechaVencimiento: 'asc' },
    });

    return data.map(item => Lote.fromPersistence(item));
  }

  async findVencidos(): Promise<Lote[]> {
    const hoy = new Date();
    const data = await this.prisma.lote.findMany({
      where: {
        fechaVencimiento: {
          lt: hoy,
        },
      },
      orderBy: { fechaVencimiento: 'asc' },
      include: { producto: true },
    });

    // Filtrar lotes con stock disponible
    const lotesConStock = data.filter(lote => lote.cantidad > lote.cantidadVendida);
    return lotesConStock.map(item => Lote.fromPersistence(item));
  }

  async findPorVencer(diasAnticipacion: number = 30): Promise<Lote[]> {
    const hoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + diasAnticipacion);

    const data = await this.prisma.lote.findMany({
      where: {
        fechaVencimiento: {
          gte: hoy,
          lte: fechaLimite,
        },
      },
      orderBy: { fechaVencimiento: 'asc' },
      include: { producto: true },
    });

    // Filtrar lotes con stock disponible
    const lotesConStock = data.filter(lote => lote.cantidad > lote.cantidadVendida);
    return lotesConStock.map(item => Lote.fromPersistence(item));
  }

  async save(lote: Lote): Promise<Lote> {
    const data = await this.prisma.lote.upsert({
      where: { id: lote.id },
      create: {
        id: lote.id,
        numeroLote: lote.numeroLote,
        fechaVencimiento: lote.fechaVencimiento,
        cantidad: lote.cantidad,
        cantidadVendida: lote.cantidadVendida,
        productoId: lote.productoId,
        compraId: lote.compraId,
        createdAt: lote.createdAt,
        updatedAt: lote.updatedAt,
      },
      update: {
        numeroLote: lote.numeroLote,
        fechaVencimiento: lote.fechaVencimiento,
        cantidad: lote.cantidad,
        cantidadVendida: lote.cantidadVendida,
        updatedAt: lote.updatedAt,
      },
    });

    return Lote.fromPersistence(data);
  }

  async saveMany(lotes: Lote[]): Promise<Lote[]> {
    const promises = lotes.map(lote => this.save(lote));
    return Promise.all(promises);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.lote.delete({
      where: { id },
    });
  }
}

