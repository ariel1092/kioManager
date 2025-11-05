import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { useVenta } from '../contexts/VentaContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Loading from '../components/ui/Loading';
import Alert from '../components/ui/Alert';
import { Plus, ShoppingCart, Printer } from 'lucide-react';
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import { imprimirTicket } from '../utils/ticketGenerator';
import FormularioVenta from '../components/ventas/FormularioVenta';
import type { Venta } from '../types';

export default function Ventas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { setVentaCompletada } = useVenta();

  const { data: ventas, isLoading } = useQuery({
    queryKey: ['ventas'],
    queryFn: () => apiService.listarVentas(),
  });

  const registrarVentaMutation = useMutation({
    mutationFn: apiService.registrarVenta,
    onSuccess: (venta: Venta) => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['lotes-vencidos'] });
      setIsModalOpen(false);
      setError(null);
      // Establecer la venta completada para mostrar el modal en el dashboard
      setVentaCompletada(venta);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  const totalVentas = ventas?.reduce((sum, venta) => sum + venta.total, 0) || 0;
  const totalGanancias = ventas?.reduce((sum, venta) => sum + venta.ganancia, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ventas</h2>
          <p className="text-gray-600">Registra y gestiona tus ventas</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Venta
        </Button>
      </div>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ventas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {ventas?.length || 0}
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${totalVentas.toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ganancias Totales</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${totalGanancias.toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Lista de Ventas */}
      <Card title="Historial de Ventas">
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-6 sm:px-0">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Ganancia
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Método Pago
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ventas && ventas.length > 0 ? (
                ventas.map((venta) => <VentaRow key={venta.id} venta={venta} />)
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No hay ventas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </Card>

      {/* Modal de Nueva Venta */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError(null);
        }}
        title="Nueva Venta"
        size="xl"
      >
        <FormularioVenta
          onSubmit={(data) => {
            try {
              registrarVentaMutation.mutate(data);
            } catch (error) {
              console.error('Error al registrar venta:', error);
              setError(error instanceof Error ? error.message : 'Error desconocido');
            }
          }}
          onCancel={() => {
            setIsModalOpen(false);
            setError(null);
          }}
          isLoading={registrarVentaMutation.isPending}
        />
      </Modal>
    </div>
  );
}

function VentaRow({ venta }: { venta: Venta }) {
  const handleImprimir = () => {
    const config = {
      nombreKiosco: 'Kiosco',
      mensajePersonalizado: 'Gracias por su compra',
    };
    imprimirTicket(venta, config);
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
        {venta.numeroVenta}
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
        <span className="block sm:hidden">{format(new Date(venta.fechaVenta), 'dd/MM/yyyy', { locale: esLocale })}</span>
        <span className="hidden sm:block">{format(new Date(venta.fechaVenta), 'dd/MM/yyyy HH:mm', { locale: esLocale })}</span>
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
        {venta.items.length} items
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
        ${venta.total.toLocaleString('es-AR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-green-600 font-medium hidden sm:table-cell">
        ${venta.ganancia.toLocaleString('es-AR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 capitalize hidden md:table-cell">
        {venta.metodoPago}
      </td>
      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
        <button
          onClick={handleImprimir}
          className="text-blue-600 hover:text-blue-800 active:text-blue-900 flex items-center gap-1 p-1.5 sm:p-1 rounded transition-colors"
          title="Reimprimir ticket"
          aria-label="Reimprimir ticket"
        >
          <Printer className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden lg:inline text-xs sm:text-sm">Reimprimir</span>
        </button>
      </td>
    </tr>
  );
}

