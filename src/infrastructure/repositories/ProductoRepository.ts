import { Producto } from '../../domain/entities/Producto';
import { IProductoRepository } from '../../domain/repositories/IProductoRepository';
import { getPrismaClient } from '../database/PrismaClient';

/**
 * Implementación concreta del repositorio de Productos usando Prisma
 * Patrón Adapter - Conecta la capa de dominio con la infraestructura
 */
export class ProductoRepository implements IProductoRepository {
  private prisma = getPrismaClient();

  async findById(id: string): Promise<Producto | null> {
    const data = await this.prisma.producto.findUnique({
      where: { id },
      include: { proveedor: false },
    });

    if (!data) return null;
    return Producto.fromPersistence(data);
  }

  async findByCodigo(codigo: string): Promise<Producto | null> {
    const data = await this.prisma.producto.findUnique({
      where: { codigo },
    });

    if (!data) return null;
    return Producto.fromPersistence(data);
  }

  async findAll(activos?: boolean): Promise<Producto[]> {
    const where = activos !== undefined ? { activo: activos } : {};
    const data = await this.prisma.producto.findMany({
      where,
      orderBy: { nombre: 'asc' },
    });

    return data.map(item => Producto.fromPersistence(item));
  }

  async findByCategoria(categoria: string): Promise<Producto[]> {
    const data = await this.prisma.producto.findMany({
      where: { categoria },
      orderBy: { nombre: 'asc' },
    });

    return data.map(item => Producto.fromPersistence(item));
  }

  async findByProveedor(proveedorId: string): Promise<Producto[]> {
    const data = await this.prisma.producto.findMany({
      where: { proveedorId },
      orderBy: { nombre: 'asc' },
    });

    return data.map(item => Producto.fromPersistence(item));
  }

  async findStockBajo(): Promise<Producto[]> {
    // Buscar productos activos y luego filtrar en memoria
    // (Prisma no permite comparar campos directamente en WHERE)
    const data = await this.prisma.producto.findMany({
      where: {
        activo: true,
      },
      orderBy: { stockActual: 'asc' },
    });

    // Filtrar productos donde stockActual <= stockMinimo
    const productosStockBajo = data.filter(
      producto => producto.stockActual <= producto.stockMinimo
    );

    return productosStockBajo.map(item => Producto.fromPersistence(item));
  }

  async save(producto: Producto): Promise<Producto> {
    const data = await this.prisma.producto.upsert({
      where: { id: producto.id },
      create: {
        id: producto.id,
        codigo: producto.codigo,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        precioCompra: producto.precioCompra,
        precioVenta: producto.precioVenta,
        stockMinimo: producto.stockMinimo,
        stockActual: producto.stockActual,
        tieneVencimiento: producto.tieneVencimiento,
        activo: producto.activo,
        proveedorId: producto.proveedorId,
        createdAt: producto.createdAt,
        updatedAt: producto.updatedAt,
      },
      update: {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        precioCompra: producto.precioCompra,
        precioVenta: producto.precioVenta,
        stockMinimo: producto.stockMinimo,
        stockActual: producto.stockActual,
        tieneVencimiento: producto.tieneVencimiento,
        activo: producto.activo,
        proveedorId: producto.proveedorId,
        updatedAt: producto.updatedAt,
      },
    });

    return Producto.fromPersistence(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.producto.delete({
      where: { id },
    });
  }
}

