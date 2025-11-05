import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { apiService } from '../services/api';
import { useVenta } from '../contexts/VentaContext';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Loading from '../components/ui/Loading';
import ModalVentaCompletada from '../components/ventas/ModalVentaCompletada';
import VentasPorFechaChart from '../components/charts/VentasPorFechaChart';
import ProductosMasVendidosChart from '../components/charts/ProductosMasVendidosChart';
import { Package, ShoppingCart, DollarSign, AlertTriangle, TrendingUp, BarChart3 } from 'lucide-react';
import { format, subDays } from 'date-fns';
import esLocale from 'date-fns/locale/es';

export default function Dashboard() {
  const { ventaCompletada, mostrarModal, cerrarModal } = useVenta();
  const { isAuthenticated } = useAuth();
  
  // Verificar también localStorage para evitar race conditions
  const token = localStorage.getItem('token');
  const isReady = isAuthenticated || !!token;

  const { data: productos, isLoading: productosLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: () => apiService.listarProductos(true),
    enabled: isReady,
  });

  const { data: stockBajo, isLoading: stockBajoLoading } = useQuery({
    queryKey: ['productos-stock-bajo'],
    queryFn: () => apiService.obtenerProductosStockBajo(),
    enabled: isReady,
  });

  // Ganancias netas del mes en curso - Memorizar fechas para evitar loops
  const fechas = useMemo(() => {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    return {
      inicio: inicioMes,
      fin: hoy,
      inicioISO: inicioMes.toISOString().split('T')[0], // Solo fecha sin hora para queryKey estable
      finISO: hoy.toISOString().split('T')[0],
    };
  }, []); // Array vacío: solo se calcula una vez al montar

  const { data: reporte, isLoading: reporteLoading } = useQuery({
    queryKey: ['reporte-ganancias', fechas.inicioISO, fechas.finISO],
    queryFn: () => apiService.obtenerGanancias(fechas.inicio, fechas.fin),
    staleTime: 60000, // Cache por 1 minuto para evitar requests excesivos
    enabled: isReady,
  });

  const { data: lotesVencidos, isLoading: lotesVencidosLoading } = useQuery({
    queryKey: ['lotes-vencidos'],
    queryFn: () => apiService.obtenerLotesVencidos(),
    enabled: isReady,
  });

  // Datos para gráficos - últimos 30 días
  const fechasGraficos = useMemo(() => {
    const hoy = new Date();
    const inicio = subDays(hoy, 30);
    return {
      inicio,
      fin: hoy,
      inicioISO: inicio.toISOString().split('T')[0],
      finISO: hoy.toISOString().split('T')[0],
    };
  }, []);

  const { data: ventasPorFecha, isLoading: ventasPorFechaLoading } = useQuery({
    queryKey: ['ventas-por-fecha', fechasGraficos.inicioISO, fechasGraficos.finISO],
    queryFn: () => apiService.obtenerVentasPorFecha(fechasGraficos.inicio, fechasGraficos.fin),
    staleTime: 60000, // Cache por 1 minuto
    enabled: isReady,
  });

  const { data: productosMasVendidos, isLoading: productosMasVendidosLoading } = useQuery({
    queryKey: ['productos-mas-vendidos', fechasGraficos.inicioISO, fechasGraficos.finISO],
    queryFn: () => apiService.obtenerProductosMasVendidos(fechasGraficos.inicio, fechasGraficos.fin, 10),
    staleTime: 60000, // Cache por 1 minuto
    enabled: isReady,
  });

  const isLoading =
    productosLoading || 
    stockBajoLoading || 
    reporteLoading || 
    lotesVencidosLoading ||
    ventasPorFechaLoading ||
    productosMasVendidosLoading;

  if (isLoading) {
    return <Loading />;
  }

  const totalProductos = productos?.length || 0;
  const totalVentas = reporte?.cantidadVentas || 0;
  const gananciaNeta = reporte?.gananciaNeta || 0;
  const alertasStock = stockBajo?.length || 0;
  const lotesVencidosCount = lotesVencidos?.length || 0;

  const stats = [
    {
      name: 'Total Productos',
      value: totalProductos,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Total Ventas',
      value: totalVentas,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Ganancia Neta (mes)',
      value: `$${gananciaNeta.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Alertas de Stock',
      value: alertasStock,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">
          Resumen general del sistema - {format(new Date(), 'PPPP', { locale: esLocale })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ventas por Fecha */}
        <Card title="Ventas por Fecha (Últimos 30 días)">
          {ventasPorFecha && ventasPorFecha.length > 0 ? (
            <VentasPorFechaChart data={ventasPorFecha} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No hay datos de ventas para mostrar</p>
              </div>
            </div>
          )}
        </Card>

        {/* Gráfico de Productos Más Vendidos */}
        <Card title="Productos Más Vendidos (Últimos 30 días)">
          {productosMasVendidos && productosMasVendidos.length > 0 ? (
            <ProductosMasVendidosChart data={productosMasVendidos} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No hay datos de productos vendidos para mostrar</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos con Stock Bajo */}
        <Card title="Productos con Stock Bajo">
          {alertasStock > 0 ? (
            <div className="space-y-2">
              {stockBajo?.slice(0, 5).map((producto) => (
                <div
                  key={producto.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{producto.nombre}</p>
                    <p className="text-sm text-gray-600">
                      Stock: {producto.stockActual} / Mínimo: {producto.stockMinimo}
                    </p>
                  </div>
                  <span className="text-red-600 font-semibold">Bajo</span>
                </div>
              ))}
              {alertasStock > 5 && (
                <p className="text-sm text-gray-600 text-center mt-2">
                  Y {alertasStock - 5} productos más...
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">
              No hay productos con stock bajo
            </p>
          )}
        </Card>

        {/* Lotes Vencidos */}
        <Card title="Lotes Vencidos">
          {lotesVencidosCount > 0 ? (
            <div className="space-y-2">
              {lotesVencidos?.slice(0, 5).map((lote) => (
                <div
                  key={lote.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {lote.producto?.nombre || 'Producto desconocido'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Lote: {lote.numeroLote} - Vencido: {format(new Date(lote.fechaVencimiento), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <span className="text-red-600 font-semibold">Vencido</span>
                </div>
              ))}
              {lotesVencidosCount > 5 && (
                <p className="text-sm text-gray-600 text-center mt-2">
                  Y {lotesVencidosCount - 5} lotes más...
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No hay lotes vencidos</p>
          )}
        </Card>
      </div>

      {/* Modal de Venta Completada */}
      {mostrarModal && ventaCompletada && (
        <ModalVentaCompletada venta={ventaCompletada} onClose={cerrarModal} />
      )}
    </div>
  );
}

