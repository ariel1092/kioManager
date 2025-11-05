import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { apiService } from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Loading from '../ui/Loading';
import Alert from '../ui/Alert';
import { Plus, Trash2, Scan } from 'lucide-react';
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import type { CrearVentaDTO, Lote } from '../../types';
import VentaItemForm from './VentaItemForm';

interface FormularioVentaProps {
  onSubmit: (data: CrearVentaDTO) => void;
  onCancel: () => void;
  isLoading: boolean;
}

interface VentaItem {
  productoId: string;
  loteId?: string;
  cantidad: number;
}

export default function FormularioVenta({
  onSubmit,
  onCancel,
  isLoading,
}: FormularioVentaProps) {
  const [items, setItems] = useState<VentaItem[]>([
    { productoId: '', cantidad: 1 },
  ]);
  const [codigoBarras, setCodigoBarras] = useState('');
  const [errorCodigo, setErrorCodigo] = useState<string | null>(null);
  const [isBuscandoPorCodigo, setIsBuscandoPorCodigo] = useState(false);
  const codigoBarrasInputRef = useRef<HTMLInputElement>(null);

  const { data: productos, isLoading: productosLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: () => apiService.listarProductos(true),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ metodoPago: string; notas?: string }>({
    defaultValues: {
      metodoPago: 'efectivo',
    },
  });

  const agregarItem = () => {
    setItems([...items, { productoId: '', cantidad: 1 }]);
  };

  const eliminarItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const actualizarItem = (index: number, field: keyof VentaItem, value: string | number) => {
    setItems(prevItems => {
      const nuevosItems = [...prevItems];
      nuevosItems[index] = { ...nuevosItems[index], [field]: value };
      return nuevosItems;
    });
  };

  const onSubmitForm = (data: { metodoPago: string; notas?: string }) => {
    if (items.length === 0 || items.some(item => !item.productoId || item.cantidad <= 0)) {
      return;
    }

    // Validar que si el producto requiere lote, se haya seleccionado un lote
    for (const item of items) {
      const producto = productoSeleccionado(item.productoId);
      if (producto?.tieneVencimiento && !item.loteId) {
        setErrorCodigo(`El producto "${producto.nombre}" requiere seleccionar un lote`);
        return;
      }
    }

    onSubmit({
      items: items.map(item => ({
        productoId: item.productoId,
        loteId: item.loteId || undefined,
        cantidad: item.cantidad,
      })),
      metodoPago: data.metodoPago,
      notas: data.notas,
    });
  };

  if (productosLoading) {
    return <Loading />;
  }

  const productoSeleccionado = (productoId: string) => {
    return productos?.find(p => p.id === productoId);
  };

  const buscarProductoPorCodigo = async (codigo: string) => {
    if (!codigo || codigo.trim() === '') {
      return;
    }

    setIsBuscandoPorCodigo(true);
    setErrorCodigo(null);

    try {
      const producto = await apiService.buscarProductoPorCodigo(codigo.trim());

      // Verificar si el producto ya está en el carrito
      const itemExistente = items.find(item => item.productoId === producto.id);
      
      if (itemExistente) {
        // Si ya existe, aumentar la cantidad
        const nuevosItems = items.map(item =>
          item.productoId === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
        setItems(nuevosItems);
      } else {
        // Si no existe, agregar nuevo item
        setItems([...items, { productoId: producto.id, cantidad: 1 }]);
      }

      // Limpiar el input y enfocarlo para el siguiente escaneo
      setCodigoBarras('');
      setTimeout(() => {
        codigoBarrasInputRef.current?.focus();
      }, 100);
    } catch (error: any) {
      const mensajeError = error.response?.data?.error || 'Producto no encontrado';
      setErrorCodigo(`Código "${codigo.trim()}" no encontrado. Verifique que el código sea correcto.`);
      setCodigoBarras('');
      setTimeout(() => {
        codigoBarrasInputRef.current?.focus();
      }, 100);
    } finally {
      setIsBuscandoPorCodigo(false);
    }
  };

  const handleCodigoBarrasKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Los lectores de código de barras suelen enviar Enter después del código
    if (e.key === 'Enter') {
      e.preventDefault();
      buscarProductoPorCodigo(codigoBarras);
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (codigoBarras.length >= 8 && !isBuscandoPorCodigo) {
      timeoutId = setTimeout(() => {
        buscarProductoPorCodigo(codigoBarras);
      }, 500);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigoBarras]);

  const handleCodigoBarrasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setCodigoBarras(valor);
    setErrorCodigo(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {/* Lector de Código de Barras */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Scan className="h-4 w-4 inline mr-2" />
          Escanear Código de Barras
        </label>
        <div className="flex gap-2">
          <input
            ref={codigoBarrasInputRef}
            type="text"
            value={codigoBarras}
            onChange={handleCodigoBarrasChange}
            onKeyDown={handleCodigoBarrasKeyDown}
            placeholder="Escanee o ingrese el código de barras..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isBuscandoPorCodigo}
            autoFocus
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => buscarProductoPorCodigo(codigoBarras)}
            disabled={isBuscandoPorCodigo || !codigoBarras.trim()}
            isLoading={isBuscandoPorCodigo}
          >
            Buscar
          </Button>
        </div>
        {errorCodigo && (
          <Alert variant="error" className="mt-2">
            {errorCodigo}
          </Alert>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Escanee el código de barras del producto o ingréselo manualmente y presione Enter
        </p>
      </div>

      {/* Items de Venta */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Items de Venta</h3>
          <Button type="button" variant="outline" size="sm" onClick={agregarItem}>
            <Plus className="h-4 w-4 mr-1" />
            Agregar Item
          </Button>
        </div>

        {items.map((item, index) => (
          <VentaItemForm
            key={index}
            item={item}
            index={index}
            productos={productos}
            productoId={item.productoId}
            cantidad={item.cantidad}
            loteId={item.loteId}
            onUpdate={(field, value) => actualizarItem(index, field, value)}
            onDelete={() => eliminarItem(index)}
            canDelete={items.length > 1}
          />
        ))}
      </div>

      {/* Método de Pago y Notas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label 
            htmlFor="metodoPago"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Método de Pago *
          </label>
          <select
            id="metodoPago"
            {...register('metodoPago', { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Seleccionar método de pago"
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
      </div>

      <div>
        <label 
          htmlFor="notas"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Notas (opcional)
        </label>
        <textarea
          id="notas"
          {...register('notas')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Ingrese notas adicionales sobre la venta (opcional)"
          aria-label="Notas adicionales sobre la venta"
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Registrar Venta
        </Button>
      </div>
    </form>
  );
}

