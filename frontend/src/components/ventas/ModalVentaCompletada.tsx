import Modal from '../ui/Modal';
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import { CheckCircle, Package, Printer } from 'lucide-react';
import { imprimirTicket } from '../../utils/ticketGenerator';
import TicketPreview from './TicketPreview';
import { useState } from 'react';
import type { Venta } from '../../types';

interface ModalVentaCompletadaProps {
  venta: Venta;
  onClose: () => void;
}

export default function ModalVentaCompletada({ venta, onClose }: ModalVentaCompletadaProps) {
  const [mostrarTicket, setMostrarTicket] = useState(false);

  const handleImprimirTicket = () => {
    // Configuración básica del ticket (puedes obtenerla de un contexto o API)
    const config = {
      nombreKiosco: 'Kiosco',
      mensajePersonalizado: 'Gracias por su compra',
    };
    
    imprimirTicket(venta, config);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Venta Completada" size="lg">
      <div className="space-y-6">
        {/* Header con éxito */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            ¡Venta registrada exitosamente!
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Venta #{venta.numeroVenta}
          </p>
        </div>

        {/* Información de la venta */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Fecha:</span>
            <span className="text-sm text-gray-900">
              {format(new Date(venta.fechaVenta), 'dd/MM/yyyy HH:mm', { locale: esLocale })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Método de Pago:</span>
            <span className="text-sm text-gray-900 capitalize">{venta.metodoPago}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total:</span>
            <span className="text-lg font-bold text-gray-900">
              ${venta.total.toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Ganancia:</span>
            <span className="text-lg font-bold text-green-600">
              ${venta.ganancia.toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Items de la venta */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Package className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Productos ({venta.items.length})</span>
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto -mx-1 px-1">
            {venta.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-white border border-gray-200 rounded-lg gap-2 sm:gap-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.producto?.nombre || 'Producto desconocido'}
                  </p>
                  <p className="text-xs text-gray-600">
                    Cantidad: {item.cantidad} × ${item.precioUnitario.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900">
                    ${item.subtotal.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-green-600">
                    Ganancia: ${item.ganancia.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen final */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-lg font-bold">
            <span className="text-gray-900">Total Venta:</span>
            <span className="text-blue-600">
              ${venta.total.toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => setMostrarTicket(!mostrarTicket)}
            className="w-full sm:w-auto px-4 py-2.5 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 active:bg-blue-100 transition-colors text-sm font-medium"
          >
            {mostrarTicket ? 'Ocultar Ticket' : 'Ver Ticket'}
          </button>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleImprimirTicket}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir Ticket</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>

        {/* Vista previa del ticket */}
        {mostrarTicket && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <TicketPreview
              venta={venta}
              config={{
                nombreKiosco: 'Kiosco',
                mensajePersonalizado: 'Gracias por su compra',
              }}
              onImprimir={handleImprimirTicket}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}

