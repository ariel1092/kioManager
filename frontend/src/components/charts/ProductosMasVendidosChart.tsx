import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProductosMasVendidosChartProps {
  data: Array<{
    productoId: string;
    productoNombre: string;
    cantidadVendida: number;
    totalVentas: number;
    ganancia: number;
  }>;
}

export default function ProductosMasVendidosChart({ data }: ProductosMasVendidosChartProps) {
  // Formatear datos para el gráfico (limitar nombres largos)
  const chartData = data.map(item => ({
    nombre: item.productoNombre.length > 20 
      ? `${item.productoNombre.substring(0, 20)}...` 
      : item.productoNombre,
    nombreCompleto: item.productoNombre,
    cantidad: item.cantidadVendida,
    total: Number(item.totalVentas.toFixed(2)),
    ganancia: Number(item.ganancia.toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="nombre" 
          angle={-45}
          textAnchor="end"
          height={100}
        />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip
          formatter={(value: number, name: string) => {
            if (name === 'total' || name === 'ganancia') {
              return `$${value.toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`;
            }
            return value;
          }}
          labelFormatter={(label, payload) => {
            if (payload && payload[0]) {
              return `Producto: ${(payload[0].payload as any).nombreCompleto}`;
            }
            return label;
          }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="cantidad" fill="#3b82f6" name="Cantidad Vendida" />
        <Bar yAxisId="right" dataKey="total" fill="#10b981" name="Total ($)" />
        <Bar yAxisId="right" dataKey="ganancia" fill="#8b5cf6" name="Ganancia ($)" />
      </BarChart>
    </ResponsiveContainer>
  );
}



