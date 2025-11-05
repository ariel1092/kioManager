import { Proveedor } from '../../domain/entities/Proveedor';
import { IProveedorRepository } from '../../domain/repositories/IProveedorRepository';
import { getPrismaClient } from '../database/PrismaClient';

/**
 * Implementación concreta del repositorio de Proveedores usando Prisma
 */
export class ProveedorRepository implements IProveedorRepository {
  private prisma = getPrismaClient();

  async findById(id: string): Promise<Proveedor | null> {
    const data = await this.prisma.proveedor.findUnique({
      where: { id },
    });

    if (!data) return null;
    return Proveedor.fromPersistence(data);
  }

  async findAll(activos?: boolean): Promise<Proveedor[]> {
    const where = activos !== undefined ? { activo: activos } : {};
    const data = await this.prisma.proveedor.findMany({
      where,
      orderBy: { nombre: 'asc' },
    });

    return data.map(item => Proveedor.fromPersistence(item));
  }

  async save(proveedor: Proveedor): Promise<Proveedor> {
    const data = await this.prisma.proveedor.upsert({
      where: { id: proveedor.id },
      create: {
        id: proveedor.id,
        nombre: proveedor.nombre,
        contacto: proveedor.contacto,
        telefono: proveedor.telefono,
        email: proveedor.email,
        direccion: proveedor.direccion,
        tipo: proveedor.tipo,
        condicionPago: proveedor.condicionPago,
        cuit: proveedor.cuit,
        cuentasBancarias: proveedor.cuentasBancarias,
        activo: proveedor.activo,
        createdAt: proveedor.createdAt,
        updatedAt: proveedor.updatedAt,
      },
      update: {
        nombre: proveedor.nombre,
        contacto: proveedor.contacto,
        telefono: proveedor.telefono,
        email: proveedor.email,
        direccion: proveedor.direccion,
        tipo: proveedor.tipo,
        condicionPago: proveedor.condicionPago,
        cuit: proveedor.cuit,
        cuentasBancarias: proveedor.cuentasBancarias,
        activo: proveedor.activo,
        updatedAt: proveedor.updatedAt,
      },
    });

    return Proveedor.fromPersistence(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.proveedor.delete({
      where: { id },
    });
  }
}

