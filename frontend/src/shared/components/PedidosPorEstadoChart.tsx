import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { PedidosPorEstadoEntry } from '@/features/dashboard/types';
import { STATUS_LABELS } from '@/shared/constants/pedidos';

const STATE_COLORS: Record<string, string> = {
  PENDIENTE: '#8e7071',
  CONFIRMADO: '#b3193d',
  EN_PREP: '#6d4e9f',
  EN_CAMINO: '#e07c3c',
  ENTREGADO: '#006a42',
  CANCELADO: '#ba1a1a',
};

interface PedidosPorEstadoChartProps {
  data: PedidosPorEstadoEntry[];
}

export const PedidosPorEstadoChart: React.FC<PedidosPorEstadoChartProps> = ({ data }) => {
  const chartData = data.map((d) => ({
    ...d,
    name: STATUS_LABELS[d.estado] || d.estado,
  }));

  return (
    <div className="bg-white border border-outline/10 rounded-card p-5">
      <h3 className="text-sm font-semibold text-on-surface mb-4">Pedidos por Estado</h3>
      {data.length === 0 ? (
        <p className="text-sm text-on-surface/40 text-center py-8">Sin datos de pedidos</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="cantidad"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry) => (
                <Cell key={entry.estado} fill={STATE_COLORS[entry.estado] || '#8e7071'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid rgba(142, 112, 113, 0.15)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
