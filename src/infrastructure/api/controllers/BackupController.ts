import { Request, Response } from 'express';
import { ExportarDatos } from '../../../application/use-cases/backup/ExportarDatos';
import { z } from 'zod';

/**
 * Controller para Backup y Exportación
 */
export class BackupController {
  constructor(private readonly exportarDatos: ExportarDatos) {}

  async exportar(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.exportarDatos.execute();

      if (!result.success) {
        res.status(500).json({ error: result.error.message });
        return;
      }

      // Configurar headers para descarga
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="backup_${new Date().toISOString().split('T')[0]}.json"`
      );

      res.json(result.data);
    } catch (error) {
      res.status(500).json({
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}




