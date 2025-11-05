import { Compra } from '../../domain/entities/Compra';
import { ICompraRepository } from '../../domain/repositories/ICompraRepository';
import { getPrismaClient } from '../database/PrismaClient';

/**
 * Implementación concreta del repositorio de Compras usando Prisma
 */
export class CompraRepository implements ICompraRepository {
  private prisma = getPrismaClient();

  async findById(id: string): Promise<Compra | null> {
    const data = await this.prisma.compra.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            producto: true,
          },
        },
        proveedor: true,
      },
    });

    if (!data) return null;
    return Compra.fromPersistence(data);
  }

  async findByProveedor(proveedorId: string): Promise<Compra[]> {
    const data = await this.prisma.compra.findMany({
      where: { proveedorId },
      orderBy: { fechaCompra: 'desc' },
      include: {
        items: {
          include: {
            producto: true,
          },
        },
      },
    });

    return data.map(item => Compra.fromPersistence(item));
  }

  async findPendientes(): Promise<Compra[]> {
    const data = await this.prisma.compra.findMany({
      where: {
        pagado: false,
      },
      orderBy: { fechaCompra: 'desc' },
      include: {
        proveedor: true,
        items: {
          include: {
            producto: true,
          },
        },
      },
    });

    return data.map(item => Compra.fromPersistence(item));
  }

  async findVencidas(): Promise<Compra[]> {
    const hoy = new Date();
    const data = await this.prisma.compra.findMany({
      where: {
        pagado: false,
        fechaVencimiento: {
          lt: hoy,
        },
      },
      orderBy: { fechaVencimiento: 'asc' },
      include: {
        proveedor: true,
        items: {
          include: {
            producto: true,
          },
        },
      },
    });

    return data.map(item => Compra.fromPersistence(item));
  }

  async save(compra: Compra): Promise<Compra> {
    const data = await this.prisma.compra.upsert({
      where: { id: compra.id },
      create: {
        id: compra.id,
        numeroFactura: compra.numeroFactura,
        fechaCompra: compra.fechaCompra,
        total: compra.total,
        formaPago: compra.formaPago,
        fechaVencimiento: compra.fechaVencimiento,
        pagado: compra.pagado,
        montoPagado: compra.montoPagado,
        proveedorId: compra.proveedorId,
        notas: compra.notas,
        createdAt: compra.createdAt,
        updatedAt: compra.updatedAt,
      },
      update: {
        numeroFactura: compra.numeroFactura,
        fechaCompra: compra.fechaCompra,
        total: compra.total,
        formaPago: compra.formaPago,
        fechaVencimiento: compra.fechaVencimiento,
        pagado: compra.pagado,
        montoPagado: compra.montoPagado,
        notas: compra.notas,
        updatedAt: compra.updatedAt,
      },
    });

    return Compra.fromPersistence(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.compra.delete({
      where: { id },
    });
  }
}


