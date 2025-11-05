import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Loading from '../components/ui/Loading';
import { Calendar, AlertTriangle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import esLocale from 'date-fns/locale/es';

export default function Vencimientos() {
  const [diasAnticipacion, setDiasAnticipacion] = useState(30);

  const { data: lotesVencidos, isLoading: vencidosLoading } = useQuery({
    queryKey: ['lotes-vencidos'],
    queryFn: () => apiService.obtenerLotesVencidos(),
  });

  const { data: lotesPorVencer, isLoading: porVencerLoading } = useQuery({
    queryKey: ['lotes-por-vencer', diasAnticipacion],
    queryFn: () => apiService.obtenerLotesPorVencer(diasAnticipacion),
  });

  const isLoading = vencidosLoading || porVencerLoading;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Control de Vencimientos</h2>
        <p className="text-gray-600">Gestiona lotes vencidos y próximos a vencer</p>
      </div>

      {/* Lotes Vencidos */}
      <Card title="Lotes Vencidos">
        {lotesVencidos && lotesVencidos.length > 0 ? (
          <div className="space-y-4">
            {lotesVencidos.map((lote) => {
              const diasVencido = differenceInDays(new Date(), new Date(lote.fechaVencimiento));
              const cantidadDisponible = lote.cantidad - lote.cantidadVendida;

              return (
                <div
                  key={lote.id}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {lote.producto?.nombre || 'Producto desconocido'}
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Lote:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {lote.numeroLote}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Vencido hace:</span>
                          <span className="ml-2 font-bold text-red-600">
                            {diasVencido} días
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Cantidad Disponible:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {cantidadDisponible}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Fecha de Vencimiento:</span>{' '}
                        {format(new Date(lote.fechaVencimiento), 'dd/MM/yyyy', { locale: esLocale })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">No hay lotes vencidos</p>
        )}
      </Card>

      {/* Lotes Por Vencer */}
      <Card
        title="Lotes Próximos a Vencer"
        action={
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Días de anticipación:</label>
            <Input
              type="number"
              min="1"
              max="365"
              value={diasAnticipacion}
              onChange={(e) => setDiasAnticipacion(parseInt(e.target.value) || 30)}
              className="w-20"
            />
          </div>
        }
      >
        {lotesPorVencer && lotesPorVencer.length > 0 ? (
          <div className="space-y-4">
            {lotesPorVencer.map((lote) => {
              const diasHastaVencimiento = differenceInDays(
                new Date(lote.fechaVencimiento),
                new Date()
              );
              const cantidadDisponible = lote.cantidad - lote.cantidadVendida;
              const esUrgente = diasHastaVencimiento <= 7;

              return (
                <div
                  key={lote.id}
                  className={`p-4 rounded-lg border ${
                    esUrgente
                      ? 'bg-red-50 border-red-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar
                          className={`h-5 w-5 ${
                            esUrgente ? 'text-red-600' : 'text-yellow-600'
                          }`}
                        />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {lote.producto?.nombre || 'Producto desconocido'}
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Lote:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {lote.numeroLote}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Vence en:</span>
                          <span
                            className={`ml-2 font-bold ${
                              esUrgente ? 'text-red-600' : 'text-yellow-600'
                            }`}
                          >
                            {diasHastaVencimiento} días
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Cantidad Disponible:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {cantidadDisponible}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Fecha de Vencimiento:</span>{' '}
                        {format(new Date(lote.fechaVencimiento), 'dd/MM/yyyy', { locale: esLocale })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">
            No hay lotes próximos a vencer en los próximos {diasAnticipacion} días
          </p>
        )}
      </Card>
    </div>
  );
}

