import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es';

interface VentasPorFechaChartProps {
  data: Array<{
    fecha: string;
    cantidad: number;
    total: number;
    ganancia: number;
  }>;
}

export default function VentasPorFechaChart({ data }: VentasPorFechaChartProps) {
  // Formatear datos para el gráfico
  const chartData = data.map(item => ({
    fecha: format(new Date(item.fecha), 'dd/MM', { locale: esLocale }),
    fechaCompleta: item.fecha,
    ventas: item.cantidad,
    total: Number(item.total.toFixed(2)),
    ganancia: Number(item.ganancia.toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
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
          labelFormatter={(label) => `Fecha: ${label}`}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="ventas"
          stroke="#3b82f6"
          name="Cantidad de Ventas"
          strokeWidth={2}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="total"
          stroke="#10b981"
          name="Total ($)"
          strokeWidth={2}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="ganancia"
          stroke="#8b5cf6"
          name="Ganancia ($)"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}




