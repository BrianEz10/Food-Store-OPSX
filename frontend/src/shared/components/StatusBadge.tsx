import React from 'react';
import { STATUS_COLORS, STATUS_LABELS } from '@/shared/constants/pedidos';

interface StatusBadgeProps {
  estado: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ estado, size = 'md' }) => {
  const colorClass = STATUS_COLORS[estado] || 'bg-gray-100 text-gray-800';
  const label = STATUS_LABELS[estado] || estado;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}>
      {label}
    </span>
  );
};
