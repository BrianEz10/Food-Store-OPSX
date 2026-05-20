import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { TopProductoEntry } from '@/features/dashboard/types';

interface TopProductosChartProps {
  data: TopProductoEntry[];
}

export const TopProductosChart: React.FC<TopProductosChartProps> = ({ data }) => {
  return (
    <div className="bg-white border border-outline/10 rounded-card p-5">
      <h3 className="text-sm font-semibold text-on-surface mb-4">Productos Más Vendidos</h3>
      {data.length === 0 ? (
        <p className="text-sm text-on-surface/40 text-center py-8">Sin datos de productos</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ left: 100 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#b3193d" />
                <stop offset="100%" stopColor="#6d4e9f" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#8e7071" strokeOpacity={0.15} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#8e7071' }} />
            <YAxis dataKey="nombre" type="category" tick={{ fontSize: 12, fill: '#8e7071' }} width={90} />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid rgba(142, 112, 113, 0.15)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            />
            <Bar dataKey="cantidad_vendida" fill="url(#barGradient)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
