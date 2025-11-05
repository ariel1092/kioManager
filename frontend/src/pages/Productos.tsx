import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Loading from '../components/ui/Loading';
import Alert from '../components/ui/Alert';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Producto, CrearProductoDTO } from '../types';

const productoSchema = z.object({
  codigo: z.string().min(1, 'El código es obligatorio'),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().optional(),
  categoria: z.string().optional(),
  precioCompra: z.number().min(0, 'El precio de compra debe ser mayor o igual a 0'),
  precioVenta: z.number().min(0, 'El precio de venta debe ser mayor o igual a 0'),
  stockMinimo: z.number().int().min(0).optional(),
  tieneVencimiento: z.boolean().optional(),
  proveedorId: z.string().optional(),
});

type ProductoFormData = z.infer<typeof productoSchema>;

export default function Productos() {
  const { isDueño } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: productos, isLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: () => apiService.listarProductos(true),
  });

  const { data: proveedores } = useQuery({
    queryKey: ['proveedores'],
    queryFn: () => apiService.listarProveedores(true),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
  });

  const crearProductoMutation = useMutation({
    mutationFn: (data: CrearProductoDTO) => apiService.crearProducto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      setIsModalOpen(false);
      reset();
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const onSubmit = (data: ProductoFormData) => {
    setError(null);
    crearProductoMutation.mutate(data);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setError(null);
    reset();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setError(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
          <p className="text-gray-600">Gestiona tu inventario de productos</p>
        </div>
        {isDueño && (
          <Button onClick={handleOpenModal}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {/* Tabla de Productos */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productos && productos.length > 0 ? (
                productos.map((producto) => (
                  <ProductoRow key={producto.id} producto={producto} isDueño={isDueño} />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No hay productos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal de Crear Producto */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Nuevo Producto"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Código *"
              {...register('codigo')}
              error={errors.codigo?.message}
            />
            <Input
              label="Nombre *"
              {...register('nombre')}
              error={errors.nombre?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Descripción"
              {...register('descripcion')}
              error={errors.descripcion?.message}
            />
            <Input
              label="Categoría"
              {...register('categoria')}
              error={errors.categoria?.message}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Precio de Compra *"
              type="number"
              step="0.01"
              {...register('precioCompra', { valueAsNumber: true })}
              error={errors.precioCompra?.message}
            />
            <Input
              label="Precio de Venta *"
              type="number"
              step="0.01"
              {...register('precioVenta', { valueAsNumber: true })}
              error={errors.precioVenta?.message}
            />
            <Input
              label="Stock Mínimo"
              type="number"
              {...register('stockMinimo', { valueAsNumber: true })}
              error={errors.stockMinimo?.message}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="tieneVencimiento"
              {...register('tieneVencimiento')}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="tieneVencimiento" className="text-sm text-gray-700">
              Tiene fecha de vencimiento
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Crear Producto
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function ProductoRow({ producto, isDueño }: { producto: Producto; isDueño: boolean }) {
  const margenGanancia = producto.precioCompra > 0
    ? ((producto.precioVenta - producto.precioCompra) / producto.precioCompra) * 100
    : 0;

  const stockBajo = producto.stockActual <= producto.stockMinimo;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {producto.codigo}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {producto.nombre}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {producto.categoria || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${producto.precioCompra.toLocaleString('es-AR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${producto.precioVenta.toLocaleString('es-AR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`text-sm font-medium ${
            stockBajo ? 'text-red-600' : 'text-gray-900'
          }`}
        >
          {producto.stockActual}
        </span>
        {stockBajo && (
          <span className="ml-2 text-xs text-red-600">(Bajo)</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {isDueño && (
          <div className="flex space-x-2">
            <button className="text-blue-600 hover:text-blue-900">
              <Edit className="h-4 w-4" />
            </button>
            <button className="text-red-600 hover:text-red-900">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

