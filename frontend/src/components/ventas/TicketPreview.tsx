/**
 * Componente de Vista Previa del Ticket
 */

import { useEffect, useRef } from 'react';
import { generarHTMLTicket } from '../../utils/ticketGenerator';
import type { Venta } from '../../types';
import type { ConfiguracionTicket } from '../../utils/ticketGenerator';
import { Printer } from 'lucide-react';

interface TicketPreviewProps {
  venta: Venta;
  config?: ConfiguracionTicket;
  onImprimir?: () => void;
}

export default function TicketPreview({ venta, config = {}, onImprimir }: TicketPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const html = generarHTMLTicket(venta, config);
      const iframe = iframeRef.current;
      iframe.contentDocument?.open();
      iframe.contentDocument?.write(html);
      iframe.contentDocument?.close();
    }
  }, [venta, config]);

  const handleImprimir = () => {
    if (onImprimir) {
      onImprimir();
    } else {
      // Abrir ventana de impresión
      const html = generarHTMLTicket(venta, config);
      const ventana = window.open('', '_blank', 'width=300,height=600');
      
      if (!ventana) {
        alert('Por favor, permite ventanas emergentes para imprimir el ticket');
        return;
      }

      ventana.document.write(html);
      ventana.document.close();
      
      ventana.onload = () => {
        setTimeout(() => {
          ventana.print();
        }, 250);
      };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Vista Previa del Ticket</h3>
        <button
          onClick={handleImprimir}
          className="w-full sm:w-auto px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Printer className="h-4 w-4" />
          <span>Imprimir</span>
        </button>
      </div>
      
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <iframe
            ref={iframeRef}
            className="w-full"
            style={{
              minHeight: '400px',
              height: '600px',
              border: 'none',
              display: 'block',
              maxWidth: '100%',
            }}
            title="Vista previa del ticket"
          />
        </div>
      </div>
      
      <div className="text-sm text-gray-600 bg-blue-50 p-3 sm:p-4 rounded-lg">
        <p className="font-medium mb-2 text-sm sm:text-base">💡 Consejos para imprimir:</p>
        <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
          <li>Selecciona una impresora térmica de 80mm en la ventana de impresión</li>
          <li>Ajusta los márgenes a "Mínimos" o "Sin márgenes"</li>
          <li>Desactiva encabezados y pies de página</li>
          <li>Usa calidad "Borrador" para ahorrar papel</li>
        </ul>
      </div>
    </div>
  );
}

