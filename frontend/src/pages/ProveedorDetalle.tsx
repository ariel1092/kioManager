import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import Alert from '../components/ui/Alert';

export default function ProveedorDetalle() {
  const { id } = useParams<{ id: string }>();

  const { data: proveedores } = useQuery({
    queryKey: ['proveedores'],
    queryFn: () => apiService.listarProveedores(true),
  });

  const proveedor = proveedores?.find((p) => p.id === id);

  const { data: productos } = useQuery({
    queryKey: ['proveedor-productos', id],
    queryFn: () => apiService.obtenerProductosDeProveedor(id!),
    enabled: !!id,
  });

  const { data: deuda } = useQuery({
    queryKey: ['proveedor-deuda', id],
    queryFn: () => apiService.obtenerDeudaProveedor(id!),
    enabled: !!id,
  });

  const { data: compras, isLoading } = useQuery({
    queryKey: ['compras', id],
    queryFn: () => apiService.listarCompras({ proveedorId: id! }),
    enabled: !!id,
  });

  if (!id) return <Alert variant="error">Proveedor no especificado</Alert>;
  if (isLoading) return <Loading />;
  if (!proveedor) return <Alert variant="error">Proveedor no encontrado</Alert>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Proveedor: {proveedor.nombre}</h1>
        <Link to="/proveedores">
          <Button variant="outline">Volver</Button>
        </Link>
      </div>

      {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

      {/* Ficha */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded-md">
          <h3 className="font-medium mb-2">Contacto</h3>
          <p><span className="text-gray-600">Representante:</span> {proveedor.contacto || '-'}</p>
          <p><span className="text-gray-600">Teléfono:</span> {proveedor.telefono || '-'}</p>
          <p><span className="text-gray-600">Email:</span> {proveedor.email || '-'}</p>
        </div>
        <div className="p-4 border rounded-md">
          <h3 className="font-medium mb-2">Datos adicionales</h3>
          <p><span className="text-gray-600">Información:</span> No disponible</p>
        </div>
      </div>

      {/* Resumen deuda */}
      <div className="p-4 border rounded-md">
        <h3 className="font-medium mb-2">Estado de cuenta</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600">Deuda total</p>
            <p className="text-lg font-semibold">${(deuda?.deudaTotal ?? 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-gray-600">Compras pendientes</p>
            <p className="text-lg font-semibold">{deuda?.comprasPendientes ?? 0}</p>
          </div>
          <div>
            <p className="text-gray-600">Compras vencidas</p>
            <p className="text-lg font-semibold text-red-600">{deuda?.comprasVencidas ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Productos que provee */}
      <div className="p-4 border rounded-md">
        <h3 className="font-medium mb-3">Productos que provee</h3>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-4">Código</th>
                <th className="py-2 pr-4">Nombre</th>
                <th className="py-2 pr-4">Precio compra</th>
                <th className="py-2 pr-4">Stock</th>
              </tr>
            </thead>
            <tbody>
              {productos?.map((prod: any) => (
                <tr key={prod.id} className="border-t">
                  <td className="py-2 pr-4">{prod.codigo}</td>
                  <td className="py-2 pr-4">{prod.nombre}</td>
                  <td className="py-2 pr-4">${prod.precioCompra.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                  <td className="py-2 pr-4">{prod.stockActual}</td>
                </tr>
              ))}
              {(!productos || productos.length === 0) && (
                <tr><td className="py-2" colSpan={4}>Sin productos vinculados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historial de compras */}
      <div className="p-4 border rounded-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Historial de compras</h3>
          <div className="space-x-2">
            <Link to={`/compras/nueva?proveedorId=${id}`}><Button size="sm">Registrar compra</Button></Link>
            <Link to={`/pagos/nuevo?proveedorId=${id}`}><Button size="sm" variant="outline">Registrar pago</Button></Link>
          </div>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-4">Fecha</th>
                <th className="py-2 pr-4">Factura</th>
                <th className="py-2 pr-4">Forma pago</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Pagado</th>
                <th className="py-2 pr-4">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {compras?.map((c: any) => (
                <tr key={c.id} className="border-t">
                  <td className="py-2 pr-4">{new Date(c.fechaCompra).toLocaleDateString('es-AR')}</td>
                  <td className="py-2 pr-4">{c.numeroFactura || '-'}</td>
                  <td className="py-2 pr-4">{c.formaPago}</td>
                  <td className="py-2 pr-4">${Number(c.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                  <td className="py-2 pr-4">${Number(c.montoPagado).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                  <td className="py-2 pr-4">${(Number(c.total) - Number(c.montoPagado)).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
              {(!compras || compras.length === 0) && (
                <tr><td className="py-2" colSpan={6}>Sin compras registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}





