import { Request, Response } from 'express';
import { Login } from '../../../application/use-cases/auth/Login';
import { RegistrarUsuario } from '../../../application/use-cases/auth/RegistrarUsuario';
import { z } from 'zod';
import { Rol } from '../../../domain/entities/Usuario';
import { securityLogger } from '../../middleware/securityLogger';
import { sanitizeEmail } from '../../middleware/inputSanitizer';

/**
 * Controller para Autenticación
 */
export class AuthController {
  constructor(
    private readonly loginUseCase: Login,
    private readonly registrarUsuarioUseCase: RegistrarUsuario
  ) {}

  private loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es obligatoria'),
  });

  private registrarSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    rol: z.enum(['DUENO', 'EMPLEADO']).optional(),
  });

  async login(req: Request, res: Response): Promise<void> {
    try {
      const body = this.loginSchema.parse(req.body);
      
      // Sanitizar email
      const email = sanitizeEmail(body.email);

      const result = await this.loginUseCase.execute(email, body.password);

      if (!result.success) {
        // Log de intento fallido
        securityLogger.logLoginFailed(req, email, result.error.message);
        res.status(401).json({ error: 'Credenciales inválidas' }); // No revelar detalles
        return;
      }

      // Log de login exitoso
      securityLogger.logLoginSuccess(req, result.data.usuario.id, result.data.usuario.email);

      res.json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const email = req.body.email || 'unknown';
        securityLogger.logLoginFailed(req, email, 'Datos inválidos');
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

  async registrar(req: Request, res: Response): Promise<void> {
    try {
      const body = this.registrarSchema.parse(req.body);

      const result = await this.registrarUsuarioUseCase.execute({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        rol: body.rol as Rol | undefined,
      });

      if (!result.success) {
        res.status(400).json({ error: result.error.message });
        return;
      }

      // No devolver el password hash
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
}

