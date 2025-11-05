import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import Alert from '../components/ui/Alert';
import { Download, Database, FileText } from 'lucide-react';

export default function Backup() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const exportarMutation = useMutation({
    mutationFn: apiService.exportarDatos.bind(apiService),
    onSuccess: (blob) => {
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSuccess('Backup exportado exitosamente');
      setError(null);
      
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setSuccess(null), 5000);
    },
    onError: (err: Error) => {
      setError(err.message || 'Error al exportar el backup');
      setSuccess(null);
    },
  });

  const handleExportar = () => {
    setError(null);
    setSuccess(null);
    exportarMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Backup y Restauración</h2>
        <p className="text-gray-600">Gestiona los respaldos de tu base de datos</p>
      </div>

      {error && (
        <Alert variant="error">{error}</Alert>
      )}

      {success && (
        <Alert variant="success">{success}</Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exportar Datos */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Exportar Datos</h3>
                <p className="text-sm text-gray-600">Descarga todos los datos en formato JSON</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>Esta exportación incluye:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Usuarios</li>
                <li>Proveedores</li>
                <li>Productos</li>
                <li>Ventas y compras</li>
                <li>Pagos a proveedores</li>
                <li>Lotes y vencimientos</li>
              </ul>
            </div>

            <Button
              onClick={handleExportar}
              isLoading={exportarMutation.isPending}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Backup
            </Button>
          </div>
        </Card>

        {/* Información de Backup Manual */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Backup Manual</h3>
                <p className="text-sm text-gray-600">Usa scripts desde la terminal</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Crear backup:</p>
                <code className="text-xs text-gray-600">npm run backup</code>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Restaurar backup:</p>
                <code className="text-xs text-gray-600">npm run restore</code>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              <p>Los backups se guardan en la carpeta <code>backups/</code></p>
              <p className="mt-1">⚠️ La restauración eliminará todos los datos actuales</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Información adicional */}
      <Card>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Recomendaciones
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Realiza backups regulares (diarios o semanales)</p>
            <p>• Guarda los backups en un lugar seguro (nube, disco externo)</p>
            <p>• Verifica que los backups se puedan restaurar correctamente</p>
            <p>• Antes de restaurar, crea un backup del estado actual</p>
          </div>
        </div>
      </Card>
    </div>
  );
}


