import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePedidoById, useTransitionEstado } from '@/features/pedidos/queries';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { OrderTimeline } from '@/shared/components/OrderTimeline';
import { CancelOrderModal } from '@/shared/components/CancelOrderModal';
import { STATUS_LABELS } from '@/shared/constants/pedidos';
import { useAuthStore } from '@/shared/stores/auth-store';
import type { Role } from '@/shared/types';

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDIENTE: ['CONFIRMADO'],
  CONFIRMADO: ['EN_PREP'],
  EN_PREP: ['EN_CAMINO'],
  EN_CAMINO: ['ENTREGADO'],
};

const STAFF_ROLES: Role[] = ['ADMIN', 'PEDIDOS'];

export const PedidoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const pedidoId = id ? parseInt(id, 10) : null;
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: pedido, isLoading, error, refetch } = usePedidoById(pedidoId);
  const transitionMutation = useTransitionEstado();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const isStaff = user?.roles?.some(r => STAFF_ROLES.includes(r)) ?? false;
  const currentEstado = pedido?.estado_codigo ?? '';
  const availableTransitions = VALID_TRANSITIONS[currentEstado] || [];

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-48 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error && (error as any).response?.status === 403) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center py-16">
        <p className="text-red-600 text-lg mb-2">No tienes permiso para ver este pedido</p>
        <Link to="/mis-pedidos" className="text-blue-600 hover:underline">Volver a Mis Pedidos</Link>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center py-16">
        <p className="text-gray-500 text-lg mb-2">Pedido no encontrado</p>
        <Link to="/mis-pedidos" className="text-blue-600 hover:underline">Volver a Mis Pedidos</Link>
      </div>
    );
  }

  const handleTransition = async (nuevoEstado: string) => {
    if (!pedidoId) return;
    await transitionMutation.mutateAsync({
      pedidoId,
      update: { nuevo_estado: nuevoEstado },
    });
    refetch();
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('es-AR', { minimumFractionDigits: 2 });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link
        to={isStaff ? '/admin/pedidos' : '/mis-pedidos'}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
      >
        ← Volver
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pedido #{String(pedido.id).padStart(6, '0')}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(pedido.creado_en).toLocaleString('es-AR')}
            </p>
          </div>
          <StatusBadge estado={pedido.estado_codigo} />
        </div>

        {pedido.pago && (
          <div className="flex items-center gap-2 mt-2 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Estado del pago:</span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              pedido.pago.pago_estado === 'approved' ? 'bg-green-100 text-green-800' :
              pedido.pago.pago_estado === 'rejected' ? 'bg-red-100 text-red-800' :
              pedido.pago.pago_estado === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {pedido.pago.pago_estado === 'approved' ? 'Pagado' :
               pedido.pago.pago_estado === 'rejected' ? 'Rechazado' :
               pedido.pago.pago_estado === 'pending' ? 'Pendiente de pago' :
               pedido.pago.pago_estado || 'Sin pago'}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-400">Total</span>
            <p className="text-lg font-bold text-gray-900">${formatCurrency(pedido.total)}</p>
          </div>
          <div>
            <span className="text-xs text-gray-400">Costo de envío</span>
            <p className="text-sm text-gray-700">${formatCurrency(pedido.costo_envio)}</p>
          </div>
          {pedido.notas && (
            <div className="col-span-2">
              <span className="text-xs text-gray-400">Notas</span>
              <p className="text-sm text-gray-700">{pedido.notas}</p>
            </div>
          )}
        </div>

        {isStaff && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            {availableTransitions.map((estadoDestino) => (
              <button
                key={estadoDestino}
                onClick={() => handleTransition(estadoDestino)}
                disabled={transitionMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {STATUS_LABELS[estadoDestino] || estadoDestino}
              </button>
            ))}
            {currentEstado !== 'CANCELADO' && currentEstado !== 'ENTREGADO' && (
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={transitionMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50"
              >
                Cancelar pedido
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Productos</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase pb-2">Producto</th>
              <th className="text-center text-xs font-medium text-gray-500 uppercase pb-2">Cant.</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase pb-2">Precio</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase pb-2">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pedido.detalles.map((det) => (
              <tr key={det.id}>
                <td className="py-3 text-sm text-gray-900">
                  {det.nombre_snapshot}
                  {det.personalizacion && det.personalizacion.length > 0 && (
                    <span className="text-xs text-gray-400 ml-2">(personalizado)</span>
                  )}
                </td>
                <td className="py-3 text-sm text-gray-700 text-center">{det.cantidad}</td>
                <td className="py-3 text-sm text-gray-700 text-right">
                  ${formatCurrency(det.precio_snapshot)}
                </td>
                <td className="py-3 text-sm text-gray-900 font-medium text-right">
                  ${formatCurrency(det.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="pt-3 text-sm text-gray-500 text-right font-medium">Total</td>
              <td className="pt-3 text-sm text-gray-900 font-bold text-right">
                ${formatCurrency(pedido.total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial de Estados</h2>
        <OrderTimeline historial={pedido.historial} />
      </div>

      <CancelOrderModal
        pedidoId={pedido.id}
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
      />
    </div>
  );
};
