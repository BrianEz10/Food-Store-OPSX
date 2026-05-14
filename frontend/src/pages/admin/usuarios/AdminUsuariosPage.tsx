import React, { useState, useCallback } from 'react';
import { useAdminUsuarios } from '@/features/admin/queries';
import { UserEditModal } from '@/shared/components/UserEditModal';
import { UserStatusBadge } from '@/shared/components/UserStatusBadge';
import { RoleBadges } from '@/shared/components/RoleBadges';
import { ConfirmToggleModal } from '@/shared/components/ConfirmToggleModal';
import type { AdminUsuarioResponse } from '@/features/admin/types';

const ROLES = ['', 'ADMIN', 'STOCK', 'PEDIDOS', 'CLIENT'] as const;

export const AdminUsuariosPage: React.FC = () => {
  const [skip, setSkip] = useState(0);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [rolFilter, setRolFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editUsuario, setEditUsuario] = useState<AdminUsuarioResponse | null>(null);
  const [toggleUsuario, setToggleUsuario] = useState<AdminUsuarioResponse | null>(null);

  // Debounce search
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
      setSkip(0);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const { data, isLoading, error, refetch } = useAdminUsuarios({
    skip,
    limit,
    q: debouncedSearch || undefined,
    rol: rolFilter || undefined,
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 0;
  const currentPage = Math.floor(skip / limit) + 1;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestioná los usuarios del sistema
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o email..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={rolFilter}
          onChange={(e) => { setRolFilter(e.target.value); setSkip(0); }}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los roles</option>
          {ROLES.filter(Boolean).map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 space-y-4">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error al cargar los usuarios</p>
          <button onClick={() => refetch()} className="text-blue-600 hover:underline text-sm">
            Intentar de nuevo
          </button>
        </div>
      )}

      {/* Empty */}
      {data && data.total === 0 && !isLoading && (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-400 text-lg">
            {debouncedSearch || rolFilter
              ? 'No hay usuarios con los filtros seleccionados'
              : 'No hay usuarios registrados'}
          </p>
        </div>
      )}

      {/* Table */}
      {data && data.total > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Roles</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.data.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-500">{usuario.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {usuario.nombre} {usuario.apellido}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{usuario.email}</td>
                  <td className="px-4 py-3 text-center">
                    <RoleBadges roles={usuario.roles} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <UserStatusBadge activo={usuario.activo} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditUsuario(usuario)}
                      className="text-sm text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setToggleUsuario(usuario)}
                      className={`text-sm ${
                        usuario.activo
                          ? 'text-red-600 hover:text-red-800'
                          : 'text-green-600 hover:text-green-800'
                      }`}
                    >
                      {usuario.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              Página {currentPage} de {totalPages} ({data.total} usuarios)
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

      {/* Edit Modal */}
      {editUsuario && (
        <UserEditModal
          usuario={editUsuario}
          isOpen={true}
          onClose={() => setEditUsuario(null)}
        />
      )}

      {/* Toggle Modal */}
      {toggleUsuario && (
        <ConfirmToggleModal
          usuarioId={toggleUsuario.id}
          usuarioNombre={`${toggleUsuario.nombre} ${toggleUsuario.apellido}`}
          activo={toggleUsuario.activo}
          isOpen={true}
          onClose={() => setToggleUsuario(null)}
        />
      )}
    </div>
  );
};
