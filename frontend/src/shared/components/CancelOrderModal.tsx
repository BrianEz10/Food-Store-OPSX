import React, { useState } from 'react';
import { useTransitionEstado } from '@/features/pedidos/queries';

interface CancelOrderModalProps {
  pedidoId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ pedidoId, isOpen, onClose }) => {
  const [motivo, setMotivo] = useState('');
  const transitionMutation = useTransitionEstado();

  if (!isOpen) return null;

  const handleCancel = async () => {
    if (!motivo.trim()) return;
    await transitionMutation.mutateAsync({
      pedidoId,
      update: { nuevo_estado: 'CANCELADO', motivo: motivo.trim() },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-modal shadow-xl max-w-md w-full mx-4 p-6 border border-outline/10">
        <h3 className="text-lg font-bold font-display text-on-surface mb-2">Cancelar Pedido</h3>
        <p className="text-sm text-gray-500 mb-4">
          ¿Estás seguro de cancelar este pedido? Esta acción no se puede deshacer.
        </p>
        <div className="mb-4">
          <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">
            Motivo de cancelación <span className="text-error">*</span>
          </label>
          <textarea
            id="motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full border border-outline/20 rounded-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-error bg-white text-on-surface"
            rows={3}
            placeholder="Describí el motivo..."
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-on-surface bg-surface-container rounded-input hover:bg-surface-container-high transition-colors"
          >
            Volver
          </button>
          <button
            onClick={handleCancel}
            disabled={!motivo.trim() || transitionMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-error rounded-input hover:bg-error/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {transitionMutation.isPending ? 'Cancelando...' : 'Sí, cancelar pedido'}
          </button>
        </div>
      </div>
    </div>
  );
};
