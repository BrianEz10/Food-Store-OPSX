import React from 'react';
import type { HistorialEntry } from '@/features/pedidos/types';
import { STATUS_COLORS, STATUS_LABELS } from '@/shared/constants/pedidos';

interface OrderTimelineProps {
  historial: HistorialEntry[];
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ historial }) => {
  if (historial.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-4">Sin cambios de estado registrados</p>;
  }

  return (
    <div className="relative">
      {historial.map((entry, index) => {
        const isLast = index === historial.length - 1;
        const fromLabel = entry.estado_desde ? STATUS_LABELS[entry.estado_desde] || entry.estado_desde : '—';
        const toLabel = STATUS_LABELS[entry.estado_hasta] || entry.estado_hasta;
        const date = new Date(entry.creado_en).toLocaleString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-[11px] top-5 bottom-0 w-0.5 bg-outline/20" />
            )}
            {/* Circle dot */}
            <div className={`relative z-10 mt-1 h-[22px] w-[22px] flex-shrink-0 rounded-full border-2 ${
              entry.estado_hasta === 'CANCELADO'
                ? 'border-error bg-error-light'
                : entry.estado_hasta === 'ENTREGADO'
                ? 'border-tertiary bg-tertiary-light'
                : 'border-primary bg-primary-light'
            }`} />
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-on-surface">
                  {fromLabel} → {toLabel}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{date}</p>
              {entry.motivo && (
                <p className="text-xs text-gray-400 mt-0.5 italic">{entry.motivo}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
