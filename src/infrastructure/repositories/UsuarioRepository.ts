import { Usuario } from '../../domain/entities/Usuario';
import { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';
import { getPrismaClient } from '../database/PrismaClient';

/**
 * Implementación concreta del repositorio de Usuarios usando Prisma
 */
export class UsuarioRepository implements IUsuarioRepository {
  private prisma = getPrismaClient();

  async findById(id: string): Promise<Usuario | null> {
    const data = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!data) return null;
    return Usuario.fromPersistence(data);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const data = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!data) return null;
    return Usuario.fromPersistence(data);
  }

  async findAll(activos?: boolean): Promise<Usuario[]> {
    const where = activos !== undefined ? { activo: activos } : {};
    const data = await this.prisma.usuario.findMany({
      where,
      orderBy: { nombre: 'asc' },
    });

    return data.map(item => Usuario.fromPersistence(item));
  }

  async save(usuario: Usuario): Promise<Usuario> {
    const data = await this.prisma.usuario.upsert({
      where: { id: usuario.id },
      create: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        password: usuario.passwordHash,
        rol: usuario.rol,
        activo: usuario.activo,
        createdAt: usuario.createdAt,
        updatedAt: usuario.updatedAt,
      },
      update: {
        nombre: usuario.nombre,
        email: usuario.email,
        password: usuario.passwordHash,
        rol: usuario.rol,
        activo: usuario.activo,
        updatedAt: usuario.updatedAt,
      },
    });

    return Usuario.fromPersistence(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.usuario.delete({
      where: { id },
    });
  }
}


