import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loading from '../components/ui/Loading';
import Alert from '../components/ui/Alert';
import { BarChart3, DollarSign, TrendingUp } from 'lucide-react';
import { format, subDays } from 'date-fns';
import esLocale from 'date-fns/locale/es';

export default function Reportes() {
  const queryClient = useQueryClient();
  const [fechaInicio, setFechaInicio] = useState(
    format(subDays(new Date(), 30), 'yyyy-MM-dd')
  );
  const [fechaFin, setFechaFin] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [generarReporte, setGenerarReporte] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: reporte, isLoading, error: queryError } = useQuery({
    queryKey: ['reportes-ganancias', fechaInicio, fechaFin],
    queryFn: () =>
      apiService.obtenerGanancias(new Date(fechaInicio), new Date(fechaFin)),
    enabled: generarReporte && !!fechaInicio && !!fechaFin,
    retry: false,
  });

  const handleGenerarReporte = () => {
    setError(null);
    if (!fechaInicio || !fechaFin) {
      setError('Por favor, seleccione ambas fechas');
      return;
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (inicio > fin) {
      setError('La fecha de inicio debe ser anterior a la fecha de fin');
      return;
    }

    setGenerarReporte(true);
    // Invalidar y refetch del query
    queryClient.invalidateQueries({ queryKey: ['reportes-ganancias', fechaInicio, fechaFin] });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reportes</h2>
        <p className="text-gray-600">Análisis de ganancias y métricas</p>
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <Input
              label="Fecha Inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Fecha Fin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
          <Button onClick={handleGenerarReporte}>
            Generar Reporte
          </Button>
        </div>
      </Card>

      {/* Mensajes de error */}
      {error && (
        <Alert variant="error">{error}</Alert>
      )}

      {queryError && (
        <Alert variant="error">
          Error al generar el reporte: {queryError instanceof Error ? queryError.message : 'Error desconocido'}
        </Alert>
      )}

      {/* Mensaje cuando no hay datos */}
      {reporte && reporte.cantidadVentas === 0 && (
        <Alert variant="info">
          No se encontraron ventas en el rango de fechas seleccionado. 
          Asegúrate de haber registrado ventas en el sistema.
        </Alert>
      )}

      {/* Reporte de Ganancias */}
      {reporte && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ventas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${reporte.totalVentas.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ganancias</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  ${reporte.totalGanancias.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ganancia Neta</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  ${(reporte.gananciaNeta || 0).toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (después de pagos a proveedores)
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cantidad de Ventas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {reporte.cantidadVentas}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-gray-600" />
            </div>
          </Card>
        </div>
      )}

      {/* Detalles del Reporte */}
      {reporte && (
        <Card title="Detalles del Período">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Fecha Inicio</p>
                <p className="text-base text-gray-900 mt-1">
                  {format(new Date(reporte.fechaInicio), 'dd/MM/yyyy', { locale: esLocale })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Fecha Fin</p>
                <p className="text-base text-gray-900 mt-1">
                  {format(new Date(reporte.fechaFin), 'dd/MM/yyyy', { locale: esLocale })}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Resumen Financiero
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ingresos Totales:</span>
                  <span className="font-medium text-gray-900">
                    ${reporte.totalVentas.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ganancias Totales:</span>
                  <span className="font-medium text-green-600">
                    ${reporte.totalGanancias.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pagos a Proveedores:</span>
                  <span className="font-medium text-red-600">
                    ${(reporte.totalPagosProveedores || 0).toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600 font-semibold">Ganancia Neta:</span>
                  <span className="font-bold text-purple-600">
                    ${(reporte.gananciaNeta || 0).toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margen de Ganancia:</span>
                  <span className="font-medium text-purple-600">
                    {reporte.margenGanancia.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Promedio por Venta:</span>
                  <span className="font-medium text-gray-900">
                    ${(reporte.totalVentas / reporte.cantidadVentas || 0).toLocaleString(
                      'es-AR',
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

