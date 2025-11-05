import { Request, Response } from 'express';
import { ListarUsuarios } from '../../../application/use-cases/usuarios/ListarUsuarios';
import { ObtenerUsuario } from '../../../application/use-cases/usuarios/ObtenerUsuario';
import { ActualizarUsuario } from '../../../application/use-cases/usuarios/ActualizarUsuario';
import { EliminarUsuario } from '../../../application/use-cases/usuarios/EliminarUsuario';
import { CambiarContrasena } from '../../../application/use-cases/usuarios/CambiarContrasena';
import { RegistrarUsuario } from '../../../application/use-cases/auth/RegistrarUsuario';
import { z } from 'zod';
import { Rol } from '../../../domain/entities/Usuario';

/**
 * Controller para Gestión de Usuarios
 */
export class UsuarioController {
  constructor(
    private readonly listarUsuarios: ListarUsuarios,
    private readonly obtenerUsuario: ObtenerUsuario,
    private readonly actualizarUsuario: ActualizarUsuario,
    private readonly eliminarUsuario: EliminarUsuario,
    private readonly cambiarContrasena: CambiarContrasena,
    private readonly registrarUsuario: RegistrarUsuario
  ) {}

  private crearSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    rol: z.enum(['DUENO', 'EMPLEADO']).optional(),
  });

  private actualizarSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio').optional(),
    email: z.string().email('Email inválido').optional(),
    rol: z.enum(['DUENO', 'EMPLEADO']).optional(),
    activo: z.boolean().optional(),
  });

  private cambiarContrasenaSchema = z.object({
    nuevaPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    passwordActual: z.string().optional(),
  });

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const activos = req.query.activos !== undefined ? req.query.activos === 'true' : undefined;

      const result = await this.listarUsuarios.execute(activos);

      if (!result.success) {
        res.status(500).json({ error: result.error.message });
        return;
      }

      // Ocultar password hash de los usuarios
      const usuariosSinPassword = result.data.map(usuario => {
        const { passwordHash, ...usuarioSinPassword } = usuario;
        return usuarioSinPassword;
      });

      res.json({
        success: true,
        data: usuariosSinPassword,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async obtener(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await this.obtenerUsuario.execute(id);

      if (!result.success) {
        res.status(404).json({ error: result.error.message });
        return;
      }

      // Ocultar password hash
      const { passwordHash, ...usuarioSinPassword } = result.data;

      res.json({
        success: true,
        data: usuarioSinPassword,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async crear(req: Request, res: Response): Promise<void> {
    try {
      const body = this.crearSchema.parse(req.body);

      const result = await this.registrarUsuario.execute({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        rol: body.rol as Rol | undefined,
      });

      if (!result.success) {
        res.status(400).json({ error: result.error.message });
        return;
      }

      // Ocultar password hash
      const { passwordHash, ...usuarioSinPassword } = result.data;

      res.status(201).json({
        success: true,
        data: usuarioSinPassword,
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

  async actualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const body = this.actualizarSchema.parse(req.body);

      const result = await this.actualizarUsuario.execute({
        id,
        nombre: body.nombre,
        email: body.email,
        rol: body.rol as Rol | undefined,
        activo: body.activo,
      });

      if (!result.success) {
        res.status(400).json({ error: result.error.message });
        return;
      }

      // Ocultar password hash
      const { passwordHash, ...usuarioSinPassword } = result.data;

      res.json({
        success: true,
        data: usuarioSinPassword,
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

  async eliminar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // No permitir que un usuario se elimine a sí mismo
      if (req.user?.userId === id) {
        res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
        return;
      }

      const result = await this.eliminarUsuario.execute(id);

      if (!result.success) {
        res.status(400).json({ error: result.error.message });
        return;
      }

      res.json({
        success: true,
        message: 'Usuario eliminado exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async cambiarContrasena(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const body = this.cambiarContrasenaSchema.parse(req.body);

      // Determinar si es administrador (dueño) o el mismo usuario
      const esAdministrador = req.user?.rol === 'DUENO';
      const esElMismoUsuario = req.user?.userId === id;

      if (!esAdministrador && !esElMismoUsuario) {
        res.status(403).json({ error: 'No tienes permisos para cambiar esta contraseña' });
        return;
      }

      const result = await this.cambiarContrasena.execute({
        usuarioId: id,
        nuevaPassword: body.nuevaPassword,
        passwordActual: body.passwordActual,
        esAdministrador: esAdministrador && !esElMismoUsuario, // Si es admin y no es su propia cuenta
      });

      if (!result.success) {
        res.status(400).json({ error: result.error.message });
        return;
      }

      res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente',
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
}

