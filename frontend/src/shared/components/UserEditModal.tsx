import React, { useState, useEffect } from 'react';
import type { AdminUsuarioResponse, AdminUsuarioUpdate } from '@/features/admin/types';
import { useUpdateAdminUsuario } from '@/features/admin/queries';

const ALL_ROLES = ['ADMIN', 'STOCK', 'PEDIDOS', 'CLIENT'] as const;

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-error-light text-error',
  STOCK: 'bg-primary-light text-primary',
  PEDIDOS: 'bg-gray-200 text-gray-700',
  CLIENT: 'bg-tertiary-light text-tertiary',
};

interface UserEditModalProps {
  usuario: AdminUsuarioResponse;
  isOpen: boolean;
  onClose: () => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({ usuario, isOpen, onClose }) => {
  const [nombre, setNombre] = useState(usuario.nombre);
  const [apellido, setApellido] = useState(usuario.apellido);
  const [email, setEmail] = useState(usuario.email);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(usuario.roles);
  const updateMutation = useUpdateAdminUsuario();

  useEffect(() => {
    setNombre(usuario.nombre);
    setApellido(usuario.apellido);
    setEmail(usuario.email);
    setSelectedRoles(usuario.roles);
  }, [usuario]);

  if (!isOpen) return null;

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: AdminUsuarioUpdate = {};
    if (nombre !== usuario.nombre) payload.nombre = nombre;
    if (apellido !== usuario.apellido) payload.apellido = apellido;
    if (email !== usuario.email) payload.email = email;
    payload.roles = selectedRoles;

    await updateMutation.mutateAsync({ id: usuario.id, data: payload });
    onClose();
  };

  const hasChanges =
    nombre !== usuario.nombre ||
    apellido !== usuario.apellido ||
    email !== usuario.email ||
    JSON.stringify(selectedRoles) !== JSON.stringify(usuario.roles);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Editar Usuario — {usuario.nombre} {usuario.apellido}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
            <div className="flex flex-wrap gap-2">
              {ALL_ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                    selectedRoles.includes(role)
                      ? `${ROLE_COLORS[role]} border-transparent font-medium`
                      : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!hasChanges || updateMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
