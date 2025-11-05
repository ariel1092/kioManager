import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/api';
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import { Trash2 } from 'lucide-react';
import type { Producto } from '../../types';

interface VentaItem {
  productoId: string;
  loteId?: string;
  cantidad: number;
}

interface VentaItemFormProps {
  index: number;
  productos: Producto[] | undefined;
  productoId: string;
  cantidad: number;
  loteId?: string;
  onUpdate: (field: keyof VentaItem, value: string | number) => void;
  onDelete: () => void;
  canDelete: boolean;
}

export default function VentaItemForm({
  index,
  productos,
  productoId,
  cantidad,
  loteId,
  onUpdate,
  onDelete,
  canDelete,
}: VentaItemFormProps) {
  const producto = productos?.find(p => p.id === productoId);
  const requiereLote = producto?.tieneVencimiento;

  // Query para obtener lotes del producto si requiere lote
  const { data: lotes, isLoading: lotesLoading } = useQuery({
    queryKey: ['lotes-producto', productoId],
    queryFn: () => apiService.obtenerLotesPorProducto(productoId),
    enabled: !!productoId && requiereLote === true,
  });

  return (
    <div className="p-4 border border-gray-200 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
            aria-label={`Eliminar item ${index + 1}`}
            title="Eliminar item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label 
            htmlFor={`producto-${index}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Producto *
          </label>
          <select
            id={`producto-${index}`}
            name={`producto-${index}`}
            value={productoId || ''}
            onChange={(e) => {
              const nuevoProductoId = e.target.value;
              onUpdate('productoId', nuevoProductoId);
              // Limpiar loteId cuando cambia el producto
              if (nuevoProductoId !== productoId) {
                onUpdate('loteId', '');
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
            aria-label={`Seleccionar producto para item ${index + 1}`}
          >
            <option value="">Seleccione un producto</option>
            {productos?.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre} - Stock: {producto.stockActual}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label 
            htmlFor={`cantidad-${index}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Cantidad *
          </label>
          <input
            id={`cantidad-${index}`}
            name={`cantidad-${index}`}
            type="number"
            min="1"
            max={producto?.stockActual || 999}
            value={cantidad}
            onChange={(e) => onUpdate('cantidad', parseInt(e.target.value) || 1)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
            aria-label={`Cantidad para item ${index + 1}`}
            placeholder="Ingrese la cantidad"
          />
        </div>
      </div>

      {/* Selector de Lote (solo si el producto requiere lote) */}
      {requiereLote && productoId && (
        <div>
          <label 
            htmlFor={`lote-${index}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Lote * <span className="text-xs text-gray-500">(requerido para productos con vencimiento)</span>
          </label>
          {lotesLoading ? (
            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
              <span className="text-sm text-gray-500">Cargando lotes...</span>
            </div>
          ) : lotes && lotes.length > 0 ? (
            <select
              id={`lote-${index}`}
              name={`lote-${index}`}
              value={loteId || ''}
              onChange={(e) => onUpdate('loteId', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
              aria-label={`Seleccionar lote para item ${index + 1}`}
            >
              <option value="">Seleccione un lote</option>
              {lotes.map((lote) => {
                const cantidadDisponible = lote.cantidad - lote.cantidadVendida;
                return (
                  <option key={lote.id} value={lote.id}>
                    {lote.numeroLote} - Vence: {format(new Date(lote.fechaVencimiento), 'dd/MM/yyyy', { locale: esLocale })} - Disponible: {cantidadDisponible}
                  </option>
                );
              })}
            </select>
          ) : (
            <div className="w-full px-4 py-2 border border-red-300 rounded-lg bg-red-50">
              <span className="text-sm text-red-600">
                No hay lotes disponibles para este producto
              </span>
            </div>
          )}
        </div>
      )}

      {producto && (
        <div className="text-sm text-gray-600">
          <p>
            Precio: ${producto.precioVenta.toLocaleString('es-AR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p>
            Subtotal: ${(producto.precioVenta * cantidad).toLocaleString('es-AR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      )}
    </div>
  );
}

