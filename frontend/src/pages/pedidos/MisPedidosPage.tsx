import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePedidos } from '@/features/pedidos/queries';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { STATUS_LABELS } from '@/shared/constants/pedidos';

export const MisPedidosPage: React.FC = () => {
  const [skip, setSkip] = useState(0);
  const [limit] = useState(20);
  const [estado, setEstado] = useState('');
  const { data, isLoading, error, refetch } = usePedidos({
    skip,
    limit,
    estado: estado || undefined,
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 0;
  const currentPage = Math.floor(skip / limit) + 1;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Historial de tus pedidos realizados
          </p>
        </div>
      </div>

      <div className="mb-4">
        <select
          value={estado}
          onChange={(e) => { setEstado(e.target.value); setSkip(0); }}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([code, label]) => (
            <option key={code} value={code}>{label}</option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 space-y-4">
            {[1,2,3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error al cargar los pedidos</p>
          <button onClick={() => refetch()} className="text-blue-600 hover:underline text-sm">
            Intentar de nuevo
          </button>
        </div>
      )}

      {data && data.total === 0 && !isLoading && (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-400 text-lg mb-2">No tienes pedidos aún</p>
          <p className="text-gray-400 text-sm mb-4">
            Explora nuestro catálogo y hace tu primer pedido
          </p>
          <Link
            to="/catalogo"
            className="inline-block px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Ver Catálogo
          </Link>
        </div>
      )}

      {data && data.total > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pedido</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.data.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-500">
                    #{String(pedido.id).padStart(6, '0')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(pedido.creado_en).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                    ${pedido.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge estado={pedido.estado_codigo} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/pedidos/${pedido.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              Página {currentPage} de {totalPages} ({data.total} pedidos)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSkip(Math.max(0, skip - limit))}
                disabled={skip === 0}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
              >
                Anterior
              </button>
              <button
                onClick={() => setSkip(skip + limit)}
                disabled={skip + limit >= data.total}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
