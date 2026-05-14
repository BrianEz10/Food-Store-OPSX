import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { PedidosPorEstadoEntry } from '@/features/dashboard/types';
import { STATUS_LABELS } from '@/shared/constants/pedidos';

const COLORS = ['#9ca3af', '#3b82f6', '#f59e0b', '#f97316', '#22c55e', '#ef4444'];

interface PedidosPorEstadoChartProps {
  data: PedidosPorEstadoEntry[];
}

export const PedidosPorEstadoChart: React.FC<PedidosPorEstadoChartProps> = ({ data }) => {
  const chartData = data.map((d) => ({
    ...d,
    name: STATUS_LABELS[d.estado] || d.estado,
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Pedidos por Estado</h3>
      {data.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Sin datos de pedidos</p>
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
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
