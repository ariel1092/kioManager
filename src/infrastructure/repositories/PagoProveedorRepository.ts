import { PagoProveedor } from '../../domain/entities/PagoProveedor';
import { IPagoProveedorRepository } from '../../domain/repositories/IPagoProveedorRepository';
import { getPrismaClient } from '../database/PrismaClient';

/**
 * Implementación concreta del repositorio de Pagos a Proveedores usando Prisma
 */
export class PagoProveedorRepository implements IPagoProveedorRepository {
  private prisma = getPrismaClient();

  async findById(id: string): Promise<PagoProveedor | null> {
    const data = await this.prisma.pagoProveedor.findUnique({
      where: { id },
      include: {
        proveedor: true,
        compra: true,
      },
    });

    if (!data) return null;
    return PagoProveedor.fromPersistence(data);
  }

  async findByProveedor(proveedorId: string): Promise<PagoProveedor[]> {
    const data = await this.prisma.pagoProveedor.findMany({
      where: { proveedorId },
      orderBy: { fecha: 'desc' },
      include: {
        compra: true,
      },
    });

    return data.map(item => PagoProveedor.fromPersistence(item));
  }

  async findByCompra(compraId: string): Promise<PagoProveedor[]> {
    const data = await this.prisma.pagoProveedor.findMany({
      where: { compraId },
      orderBy: { fecha: 'desc' },
      include: {
        proveedor: true,
      },
    });

    return data.map(item => PagoProveedor.fromPersistence(item));
  }

  async findByFecha(fechaInicio: Date, fechaFin: Date): Promise<PagoProveedor[]> {
    // Asegurar que las fechas incluyan todo el día
    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);
    
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    const data = await this.prisma.pagoProveedor.findMany({
      where: {
        fecha: {
          gte: inicio,
          lte: fin,
        },
      },
      orderBy: { fecha: 'desc' },
    });

    return data.map(item => PagoProveedor.fromPersistence(item));
  }

  async save(pago: PagoProveedor): Promise<PagoProveedor> {
    const data = await this.prisma.pagoProveedor.upsert({
      where: { id: pago.id },
      create: {
        id: pago.id,
        proveedorId: pago.proveedorId,
        compraId: pago.compraId,
        fecha: pago.fecha,
        monto: pago.monto,
        metodoPago: pago.metodoPago,
        observaciones: pago.observaciones,
        createdAt: pago.createdAt,
        updatedAt: pago.updatedAt,
      },
      update: {
        fecha: pago.fecha,
        monto: pago.monto,
        metodoPago: pago.metodoPago,
        observaciones: pago.observaciones,
        updatedAt: pago.updatedAt,
      },
    });

    return PagoProveedor.fromPersistence(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.pagoProveedor.delete({
      where: { id },
    });
  }
}

