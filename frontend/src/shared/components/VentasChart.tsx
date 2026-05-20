import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { VentasPorMesEntry } from '@/features/dashboard/types';

interface VentasChartProps {
  data: VentasPorMesEntry[];
}

export const VentasChart: React.FC<VentasChartProps> = ({ data }) => {
  return (
    <div className="bg-white border border-outline/10 rounded-card p-5">
      <h3 className="text-sm font-semibold text-on-surface mb-4">Evolución de Ventas</h3>
      {data.length === 0 ? (
        <p className="text-sm text-on-surface/40 text-center py-8">Sin datos de ventas</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#8e7071" strokeOpacity={0.15} />
            <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#8e7071' }} />
            <YAxis tick={{ fontSize: 12, fill: '#8e7071' }} />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid rgba(142, 112, 113, 0.15)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            />
            <Line type="monotone" dataKey="ventas" stroke="#b3193d" strokeWidth={2.5} dot={{ r: 3, fill: '#b3193d' }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
