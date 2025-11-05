import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import Card from '../components/ui/Card';
import Loading from '../components/ui/Loading';
import Alert from '../components/ui/Alert';
import { AlertTriangle } from 'lucide-react';

export default function Stock() {
  const { data: productosStockBajo, isLoading } = useQuery({
    queryKey: ['productos-stock-bajo'],
    queryFn: () => apiService.obtenerProductosStockBajo(),
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Control de Stock</h2>
        <p className="text-gray-600">Productos con stock bajo o crítico</p>
      </div>

      {productosStockBajo && productosStockBajo.length > 0 ? (
        <Card title="Productos con Stock Bajo">
          <div className="space-y-4">
            {productosStockBajo.map((producto) => {
              const porcentajeStock = (producto.stockActual / producto.stockMinimo) * 100;
              const esCritico = producto.stockActual === 0;

              return (
                <div
                  key={producto.id}
                  className={`p-4 rounded-lg border ${
                    esCritico
                      ? 'bg-red-50 border-red-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle
                          className={`h-5 w-5 ${
                            esCritico ? 'text-red-600' : 'text-yellow-600'
                          }`}
                        />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {producto.nombre}
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Código:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {producto.codigo}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Stock Actual:</span>
                          <span
                            className={`ml-2 font-bold ${
                              esCritico ? 'text-red-600' : 'text-yellow-600'
                            }`}
                          >
                            {producto.stockActual}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Stock Mínimo:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {producto.stockMinimo}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Nivel de Stock</span>
                          <span className="font-medium text-gray-900">
                            {porcentajeStock.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              esCritico ? 'bg-red-600' : 'bg-yellow-600'
                            }`}
                            style={{ width: `${Math.min(porcentajeStock, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Alert variant="success" title="Todo en orden">
          No hay productos con stock bajo. Todos los productos tienen suficiente inventario.
        </Alert>
      )}
    </div>
  );
}



