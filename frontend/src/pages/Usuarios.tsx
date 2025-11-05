import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import Alert from '../components/ui/Alert';
import { UserPlus, Edit, Trash2, Lock, UserCheck, UserX } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Usuario } from '../types';

const crearUsuarioSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rol: z.enum(['DUENO', 'EMPLEADO']),
});

const actualizarUsuarioSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido'),
  rol: z.enum(['DUENO', 'EMPLEADO']),
  activo: z.boolean(),
});

const cambiarContrasenaSchema = z.object({
  nuevaPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  passwordActual: z.string().optional(),
});

type CrearUsuarioForm = z.infer<typeof crearUsuarioSchema>;
type ActualizarUsuarioForm = z.infer<typeof actualizarUsuarioSchema>;
type CambiarContrasenaForm = z.infer<typeof cambiarContrasenaSchema>;

export default function Usuarios() {
  const queryClient = useQueryClient();
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showContrasenaModal, setShowContrasenaModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => apiService.listarUsuarios(),
  });

  const crearMutation = useMutation({
    mutationFn: apiService.crearUsuario.bind(apiService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setShowCrearModal(false);
      setSuccess('Usuario creado exitosamente');
      setTimeout(() => setSuccess(null), 5000);
    },
    onError: (err: Error) => {
      setError(err.message || 'Error al crear usuario');
    },
  });

  const actualizarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiService.actualizarUsuario(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setShowEditarModal(false);
      setUsuarioSeleccionado(null);
      setSuccess('Usuario actualizado exitosamente');
      setTimeout(() => setSuccess(null), 5000);
    },
    onError: (err: Error) => {
      setError(err.message || 'Error al actualizar usuario');
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: apiService.eliminarUsuario.bind(apiService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setSuccess('Usuario eliminado exitosamente');
      setTimeout(() => setSuccess(null), 5000);
    },
    onError: (err: Error) => {
      setError(err.message || 'Error al eliminar usuario');
    },
  });

  const cambiarContrasenaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CambiarContrasenaForm }) =>
      apiService.cambiarContrasena(id, data),
    onSuccess: () => {
      setShowContrasenaModal(false);
      setUsuarioSeleccionado(null);
      setSuccess('Contraseña actualizada exitosamente');
      setTimeout(() => setSuccess(null), 5000);
    },
    onError: (err: Error) => {
      setError(err.message || 'Error al cambiar contraseña');
    },
  });

  const handleEditar = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setShowEditarModal(true);
    setError(null);
  };

  const handleEliminar = async (usuario: Usuario) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${usuario.nombre}?`)) {
      eliminarMutation.mutate(usuario.id);
    }
  };

  const handleCambiarContrasena = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setShowContrasenaModal(true);
    setError(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Usuarios</h2>
          <p className="text-gray-600">Gestiona los usuarios del sistema</p>
        </div>
        <Button onClick={() => setShowCrearModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rol</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios?.map((usuario) => (
                <tr key={usuario.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{usuario.nombre}</td>
                  <td className="py-3 px-4">{usuario.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        usuario.rol === 'DUENO'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {usuario.rol === 'DUENO' ? 'Dueño' : 'Empleado'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {usuario.activo ? (
                      <span className="inline-flex items-center text-green-600">
                        <UserCheck className="h-4 w-4 mr-1" />
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-red-600">
                        <UserX className="h-4 w-4 mr-1" />
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditar(usuario)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCambiarContrasena(usuario)}
                      >
                        <Lock className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEliminar(usuario)}
                        isLoading={eliminarMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Crear Usuario */}
      <Modal
        isOpen={showCrearModal}
        onClose={() => {
          setShowCrearModal(false);
          setError(null);
        }}
        title="Nuevo Usuario"
      >
        <CrearUsuarioForm
          onSubmit={(data) => crearMutation.mutate(data)}
          onCancel={() => setShowCrearModal(false)}
          isLoading={crearMutation.isPending}
        />
      </Modal>

      {/* Modal Editar Usuario */}
      <Modal
        isOpen={showEditarModal}
        onClose={() => {
          setShowEditarModal(false);
          setUsuarioSeleccionado(null);
          setError(null);
        }}
        title="Editar Usuario"
      >
        {usuarioSeleccionado && (
          <EditarUsuarioForm
            usuario={usuarioSeleccionado}
            onSubmit={(data) =>
              actualizarMutation.mutate({ id: usuarioSeleccionado.id, data })
            }
            onCancel={() => {
              setShowEditarModal(false);
              setUsuarioSeleccionado(null);
            }}
            isLoading={actualizarMutation.isPending}
          />
        )}
      </Modal>

      {/* Modal Cambiar Contraseña */}
      <Modal
        isOpen={showContrasenaModal}
        onClose={() => {
          setShowContrasenaModal(false);
          setUsuarioSeleccionado(null);
          setError(null);
        }}
        title="Cambiar Contraseña"
      >
        {usuarioSeleccionado && (
          <CambiarContrasenaForm
            usuario={usuarioSeleccionado}
            onSubmit={(data) =>
              cambiarContrasenaMutation.mutate({ id: usuarioSeleccionado.id, data })
            }
            onCancel={() => {
              setShowContrasenaModal(false);
              setUsuarioSeleccionado(null);
            }}
            isLoading={cambiarContrasenaMutation.isPending}
          />
        )}
      </Modal>
    </div>
  );
}

// Componente de formulario para crear usuario
function CrearUsuarioForm({
  onSubmit,
  onCancel,
  isLoading,
}: {
  onSubmit: (data: CrearUsuarioForm) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CrearUsuarioForm>({
    resolver: zodResolver(crearUsuarioSchema),
    defaultValues: {
      rol: 'EMPLEADO',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre"
        {...register('nombre')}
        error={errors.nombre?.message}
        required
      />
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        required
      />
      <Input
        label="Contraseña"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        required
      />
      <Select
        label="Rol"
        {...register('rol')}
        error={errors.rol?.message}
        required
      >
        <option value="EMPLEADO">Empleado</option>
        <option value="DUENO">Dueño</option>
      </Select>
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Crear Usuario
        </Button>
      </div>
    </form>
  );
}

// Componente de formulario para editar usuario
function EditarUsuarioForm({
  usuario,
  onSubmit,
  onCancel,
  isLoading,
}: {
  usuario: Usuario;
  onSubmit: (data: ActualizarUsuarioForm) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActualizarUsuarioForm>({
    resolver: zodResolver(actualizarUsuarioSchema),
    defaultValues: {
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre"
        {...register('nombre')}
        error={errors.nombre?.message}
        required
      />
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        required
      />
      <Select
        label="Rol"
        {...register('rol')}
        error={errors.rol?.message}
        required
      >
        <option value="EMPLEADO">Empleado</option>
        <option value="DUENO">Dueño</option>
      </Select>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="activo"
          {...register('activo')}
          className="h-4 w-4 text-primary-600 rounded"
        />
        <label htmlFor="activo" className="text-sm text-gray-700">
          Usuario activo
        </label>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}

// Componente de formulario para cambiar contraseña
function CambiarContrasenaForm({
  usuario,
  onSubmit,
  onCancel,
  isLoading,
}: {
  usuario: Usuario;
  onSubmit: (data: CambiarContrasenaForm) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CambiarContrasenaForm>({
    resolver: zodResolver(cambiarContrasenaSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-gray-600">
        Cambiando contraseña para: <strong>{usuario.nombre}</strong>
      </p>
      <Input
        label="Contraseña Actual (opcional si eres administrador)"
        type="password"
        {...register('passwordActual')}
        error={errors.passwordActual?.message}
      />
      <Input
        label="Nueva Contraseña"
        type="password"
        {...register('nuevaPassword')}
        error={errors.nuevaPassword?.message}
        required
      />
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Cambiar Contraseña
        </Button>
      </div>
    </form>
  );
}

