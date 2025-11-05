import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loading from '../components/ui/Loading';
import Alert from '../components/ui/Alert';

export default function ComprasNueva() {
  const [searchParams] = useSearchParams();
  const proveedorId = searchParams.get('proveedorId') || '';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: productos, isLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: () => apiService.listarProductos(true),
  });

  const [items, setItems] = useState<{ productoId: string; cantidad: number; precioUnitario: number }[]>([
    { productoId: '', cantidad: 1, precioUnitario: 0 },
  ]);
  const [numeroFactura, setNumeroFactura] = useState('');
  const [formaPago, setFormaPago] = useState<'contado' | 'credito' | 'transferencia'>('contado');
  const [fechaVencimiento, setFechaVencimiento] = useState<string>('');
  const [notas, setNotas] = useState('');

  const registrarCompraMutation = useMutation({
    mutationFn: apiService.registrarCompra.bind(apiService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compras', proveedorId] });
      navigate(`/proveedores/${proveedorId}`);
    },
    onError: (e: any) => {
      setErrorMsg(e?.message || 'Error al registrar la compra');
    },
  });

  const agregarItem = () => setItems((prev) => [...prev, { productoId: '', cantidad: 1, precioUnitario: 0 }]);
  const eliminarItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const total = items.reduce((sum, it) => sum + (it.cantidad || 0) * (it.precioUnitario || 0), 0);

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Registrar compra</h1>
      {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Número de factura</label>
          <Input value={numeroFactura} onChange={(e) => setNumeroFactura(e.target.value)} placeholder="Opcional" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Forma de pago</label>
          <select className="w-full border rounded px-3 py-2" value={formaPago} onChange={(e) => setFormaPago(e.target.value as any)}>
            <option value="contado">Contado</option>
            <option value="credito">Crédito</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        {formaPago === 'credito' && (
          <div>
            <label className="block text-sm text-gray-700 mb-1">Fecha de vencimiento</label>
            <Input type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Items</h3>
          <Button type="button" variant="outline" onClick={agregarItem}>Agregar ítem</Button>
        </div>
        {items.map((it, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-3 p-3 border rounded">
            <div className="col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Producto</label>
              <select className="w-full border rounded px-3 py-2" value={it.productoId} onChange={(e) => setItems((prev) => {
                const arr = [...prev];
                arr[idx].productoId = e.target.value;
                return arr;
              })}>
                <option value="">Seleccione</option>
                {productos?.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.nombre} (stock {p.stockActual})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Cantidad</label>
              <Input type="number" min={1} value={it.cantidad} onChange={(e) => setItems((prev) => {
                const arr = [...prev];
                arr[idx].cantidad = parseInt(e.target.value || '0');
                return arr;
              })} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Precio unitario</label>
              <Input type="number" min={0} step="0.01" value={it.precioUnitario} onChange={(e) => setItems((prev) => {
                const arr = [...prev];
                arr[idx].precioUnitario = parseFloat(e.target.value || '0');
                return arr;
              })} />
            </div>
            <div className="col-span-4 flex justify-between">
              <span className="text-sm text-gray-600">Subtotal: ${(it.cantidad * it.precioUnitario).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
              {items.length > 1 && (
                <Button type="button" variant="ghost" onClick={() => eliminarItem(idx)}>Quitar</Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Notas</label>
        <textarea className="w-full border rounded px-3 py-2" rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-lg">Total: ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button onClick={() => registrarCompraMutation.mutate({
            proveedorId,
            numeroFactura: numeroFactura || null,
            items,
            formaPago,
            fechaVencimiento: formaPago === 'credito' && fechaVencimiento ? new Date(fechaVencimiento) : null,
            notas: notas || null,
          })} isLoading={registrarCompraMutation.isPending}>Registrar compra</Button>
        </div>
      </div>
    </div>
  );
}



