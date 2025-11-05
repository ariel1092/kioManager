import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Loading from '../components/ui/Loading';
import Alert from '../components/ui/Alert';
import { Plus } from 'lucide-react';
import type { CrearProveedorDTO } from '../types';

const proveedorSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  contacto: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  direccion: z.string().optional(),
});

type ProveedorFormData = z.infer<typeof proveedorSchema>;

export default function Proveedores() {
  const { isDueño } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: proveedores, isLoading } = useQuery({
    queryKey: ['proveedores'],
    queryFn: () => apiService.listarProveedores(true),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProveedorFormData>({
    resolver: zodResolver(proveedorSchema),
  });

  const crearProveedorMutation = useMutation({
    mutationFn: (data: CrearProveedorDTO) => apiService.crearProveedor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
      setIsModalOpen(false);
      reset();
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const onSubmit = (data: ProveedorFormData) => {
    setError(null);
    const payload: CrearProveedorDTO = {
      nombre: data.nombre,
      contacto: data.contacto || undefined,
      telefono: data.telefono || undefined,
      email: data.email || undefined,
      direccion: data.direccion || undefined,
    };
    crearProveedorMutation.mutate(payload);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Proveedores</h2>
          <p className="text-gray-600">Gestiona tus proveedores</p>
        </div>
        {isDueño && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proveedor
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {/* Grid de Proveedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proveedores && proveedores.length > 0 ? (
          proveedores.map((proveedor) => (
            <Link key={proveedor.id} to={`/proveedores/${proveedor.id}`} className="block focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg">
              <Card>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {proveedor.nombre}
                  </h3>
                  {proveedor.contacto && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Contacto:</span> {proveedor.contacto}
                    </p>
                  )}
                  {proveedor.telefono && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Teléfono:</span> {proveedor.telefono}
                    </p>
                  )}
                  {proveedor.email && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {proveedor.email}
                    </p>
                  )}
                  {proveedor.direccion && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Dirección:</span> {proveedor.direccion}
                    </p>
                  )}
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No hay proveedores registrados
          </div>
        )}
      </div>

      {/* Modal de Crear Proveedor */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
          setError(null);
        }}
        title="Nuevo Proveedor"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nombre *"
            {...register('nombre')}
            error={errors.nombre?.message}
          />
          <Input
            label="Contacto"
            {...register('contacto')}
            error={errors.contacto?.message}
          />
          <Input
            label="Teléfono"
            {...register('telefono')}
            error={errors.telefono?.message}
          />
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Dirección"
            {...register('direccion')}
            error={errors.direccion?.message}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                reset();
                setError(null);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Crear Proveedor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

