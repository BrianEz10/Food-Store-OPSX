import React from 'react';
import { Link } from 'react-router-dom';
import type { PedidoResponse } from '@/features/pedidos/types';
import { StatusBadge } from './StatusBadge';

interface OrderCardProps {
  pedido: PedidoResponse;
}

export const OrderCard: React.FC<OrderCardProps> = ({ pedido }) => {
  const date = new Date(pedido.creado_en).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <Link
      to={`/pedidos/${pedido.id}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-mono text-gray-500">#{String(pedido.id).padStart(6, '0')}</span>
        <StatusBadge estado={pedido.estado_codigo} size="sm" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{date}</span>
        <span className="text-sm font-semibold text-gray-900">
          ${pedido.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </span>
      </div>
    </Link>
  );
};
