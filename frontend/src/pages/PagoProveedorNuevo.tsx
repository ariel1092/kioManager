import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loading from '../components/ui/Loading';
import Alert from '../components/ui/Alert';

export default function PagoProveedorNuevo() {
  const [searchParams] = useSearchParams();
  const proveedorId = searchParams.get('proveedorId') || '';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [monto, setMonto] = useState<number>(0);
  const [metodo, setMetodo] = useState<'efectivo' | 'transferencia' | 'cheque' | 'tarjeta'>('efectivo');
  const [fecha, setFecha] = useState<string>('');
  const [observaciones, setObservaciones] = useState('');
  const [compraId, setCompraId] = useState<string>('');

  const { data: compras, isLoading } = useQuery({
    queryKey: ['compras', proveedorId],
    queryFn: () => apiService.listarCompras({ proveedorId }),
    enabled: !!proveedorId,
  });

  const registrarPagoMutation = useMutation({
    mutationFn: apiService.registrarPagoProveedor.bind(apiService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedor-deuda', proveedorId] });
      queryClient.invalidateQueries({ queryKey: ['compras', proveedorId] });
      navigate(`/proveedores/${proveedorId}`);
    },
    onError: (e: any) => setErrorMsg(e?.message || 'Error al registrar el pago'),
  });

  if (isLoading) return <Loading />;

  const comprasPendientes = (compras || []).filter((c: any) => !c.pagado);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Registrar pago a proveedor</h1>
      {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Compra (opcional)</label>
          <select className="w-full border rounded px-3 py-2" value={compraId} onChange={(e) => setCompraId(e.target.value)}>
            <option value="">Pago general</option>
            {comprasPendientes.map((c: any) => (
              <option key={c.id} value={c.id}>
                {new Date(c.fechaCompra).toLocaleDateString('es-AR')} - Factura {c.numeroFactura || '-'} - Saldo $
                {(Number(c.total) - Number(c.montoPagado)).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Fecha</label>
          <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Método</label>
          <select className="w-full border rounded px-3 py-2" value={metodo} onChange={(e) => setMetodo(e.target.value as any)}>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="cheque">Cheque</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Monto</label>
          <Input type="number" min={0} step="0.01" value={monto} onChange={(e) => setMonto(parseFloat(e.target.value || '0'))} />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Observaciones</label>
        <textarea className="w-full border rounded px-3 py-2" rows={3} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
        <Button onClick={() => registrarPagoMutation.mutate({
          proveedorId,
          compraId: compraId || null,
          fecha: fecha ? new Date(fecha) : undefined,
          monto,
          metodoPago: metodo,
          observaciones: observaciones || null,
        })} isLoading={registrarPagoMutation.isPending}>Registrar pago</Button>
      </div>
    </div>
  );
}





