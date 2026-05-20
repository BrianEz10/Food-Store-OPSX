import React from 'react';
import { useToggleUsuarioEstado } from '@/features/admin/queries';

interface ConfirmToggleModalProps {
  usuarioId: number;
  usuarioNombre: string;
  activo: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const ConfirmToggleModal: React.FC<ConfirmToggleModalProps> = ({
  usuarioId,
  usuarioNombre,
  activo,
  isOpen,
  onClose,
}) => {
  const toggleMutation = useToggleUsuarioEstado();

  if (!isOpen) return null;

  const handleToggle = async () => {
    await toggleMutation.mutateAsync({ id: usuarioId, data: { activo: !activo } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {activo ? 'Desactivar Usuario' : 'Activar Usuario'}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {activo
            ? `¿Estás seguro de desactivar a ${usuarioNombre}? El usuario no podrá iniciar sesión y sus refresh tokens serán invalidados.`
            : `¿Estás seguro de activar a ${usuarioNombre}? El usuario podrá iniciar sesión nuevamente.`}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleToggle}
            disabled={toggleMutation.isPending}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50 ${
              activo
                ? 'bg-error hover:bg-error'
                : 'bg-tertiary hover:bg-tertiary-hover'
            }`}
          >
            {toggleMutation.isPending
              ? 'Procesando...'
              : activo
              ? 'Sí, desactivar'
              : 'Sí, activar'}
          </button>
        </div>
      </div>
    </div>
  );
};
