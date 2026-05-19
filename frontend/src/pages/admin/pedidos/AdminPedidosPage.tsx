import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePedidos, useTransitionEstado } from '@/features/pedidos/queries';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { CancelOrderModal } from '@/shared/components/CancelOrderModal';
import { STATUS_LABELS } from '@/shared/constants/pedidos';

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDIENTE: ['CONFIRMADO'],
  CONFIRMADO: ['EN_PREP'],
  EN_PREP: ['EN_CAMINO'],
  EN_CAMINO: ['ENTREGADO'],
};

export const AdminPedidosPage: React.FC = () => {
  const [skip, setSkip] = useState(0);
  const [limit] = useState(20);
  const [estado, setEstado] = useState('');
  const [cancelPedidoId, setCancelPedidoId] = useState<number | null>(null);
  const { data, isLoading, error, refetch } = usePedidos({
    skip,
    limit,
    estado: estado || undefined,
  });
  const transitionMutation = useTransitionEstado();
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const totalPages = data ? Math.ceil(data.total / limit) : 0;
  const currentPage = Math.floor(skip / limit) + 1;

  const handleTransition = async (pedidoId: number, nuevoEstado: string) => {
    await transitionMutation.mutateAsync({
      pedidoId,
      update: { nuevo_estado: nuevoEstado },
    });
    setOpenDropdownId(null);
    refetch();
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('es-AR', { minimumFractionDigits: 2 });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-on-surface">Gesti&oacute;n de Pedidos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administr&aacute; todos los pedidos del sistema
          </p>
        </div>
      </div>

      <div className="mb-4">
        <select
          value={estado}
          onChange={(e) => { setEstado(e.target.value); setSkip(0); }}
          className="border border-outline/20 rounded-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white text-on-surface"
        >
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([code, label]) => (
            <option key={code} value={code}>{label}</option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="bg-white border border-outline/10 rounded-card overflow-hidden">
          <div className="p-6 space-y-4">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="h-12 bg-surface-container animate-pulse rounded-input" />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-error mb-4 font-semibold">Error al cargar los pedidos</p>
          <button onClick={() => refetch()} className="text-primary hover:underline text-sm font-semibold">
            Intentar de nuevo
          </button>
        </div>
      )}

      {data && data.total === 0 && !isLoading && (
        <div className="text-center py-16 bg-white border border-outline/10 rounded-card shadow-sm">
          <p className="text-gray-400 text-lg font-bold font-display">No hay pedidos</p>
          <p className="text-gray-400 text-sm mt-1">
            {estado ? 'No hay pedidos con el filtro seleccionado' : 'A&uacute;n no se han realizado pedidos'}
          </p>
        </div>
      )}

      {data && data.total > 0 && (
        <div className="bg-white border border-outline/10 rounded-card overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-outline/10">
            <thead className="bg-surface-container">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pedido</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10">
              {data.data.map((pedido) => {
                const trans = VALID_TRANSITIONS[pedido.estado_codigo] || [];
                const isTerminal = pedido.estado_codigo === 'ENTREGADO' || pedido.estado_codigo === 'CANCELADO';
                return (
                  <tr key={pedido.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-gray-500">
                      <Link to={`/pedidos/${pedido.id}`} className="hover:text-primary transition-colors">
                        #{String(pedido.id).padStart(6, '0')}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      #{pedido.usuario_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(pedido.creado_en).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-4 py-3 text-sm text-on-surface text-right font-bold font-display">
                      ${formatCurrency(pedido.total)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge estado={pedido.estado_codigo} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-right relative">
                      {isTerminal ? (
                        <Link
                          to={`/pedidos/${pedido.id}`}
                          className="text-sm text-primary hover:text-primary-hover font-semibold transition-colors"
                        >
                          Ver
                        </Link>
                      ) : (
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenDropdownId(openDropdownId === pedido.id ? null : pedido.id)}
                            className="text-sm text-on-surface hover:bg-surface-container/50 px-3 py-1.5 border border-outline/20 rounded-input transition-colors font-medium"
                          >
                            Acciones &#9660;
                          </button>
                          {openDropdownId === pedido.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenDropdownId(null)}
                              />
                              <div className="absolute right-0 mt-1 w-48 bg-white border border-outline/15 rounded-modal shadow-lg z-20 overflow-hidden">
                                {trans.map((estadoDestino) => (
                                  <button
                                    key={estadoDestino}
                                    onClick={() => handleTransition(pedido.id, estadoDestino)}
                                    disabled={transitionMutation.isPending}
                                    className="block w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container/50 disabled:opacity-50"
                                  >
                                    {STATUS_LABELS[estadoDestino] || estadoDestino}
                                  </button>
                                ))}
                                <button
                                  onClick={() => { setCancelPedidoId(pedido.id); setOpenDropdownId(null); }}
                                  className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-error-light border-t border-outline/10"
                                >
                                  Cancelar pedido
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-4 py-3 bg-surface-container border-t border-outline/10">
            <span className="text-sm text-gray-500">
              P&aacute;gina {currentPage} de {totalPages} ({data.total} pedidos)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSkip(Math.max(0, skip - limit))}
                disabled={skip === 0}
                className="px-3 py-1 text-sm border border-outline/20 rounded-input disabled:opacity-50 hover:bg-surface-container-high transition-colors font-medium text-on-surface"
              >
                Anterior
              </button>
              <button
                onClick={() => setSkip(skip + limit)}
                disabled={skip + limit >= data.total}
                className="px-3 py-1 text-sm border border-outline/20 rounded-input disabled:opacity-50 hover:bg-surface-container-high transition-colors font-medium text-on-surface"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelPedidoId && (
        <CancelOrderModal
          pedidoId={cancelPedidoId}
          isOpen={true}
          onClose={() => setCancelPedidoId(null)}
        />
      )}
    </div>
  );
};
