import React, { useEffect, useState } from 'react';
import { useIngredienteStore } from '@/features/ingredientes/ingrediente-store';
import { IngredientFormModal } from '@/features/ingredientes/components/IngredientFormModal';

export const IngredientListPage: React.FC = () => {
  const {
    ingredientes,
    isLoading,
    error,
    filter,
    loadIngredientes,
    deleteIngrediente,
    selectIngrediente,
    selectedIngrediente,
    setFilter,
    clearError,
  } = useIngredienteStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadIngredientes();
  }, []);

  const handleEdit = (id: number) => {
    const ing = ingredientes.find((i) => i.id === id);
    if (ing) {
      selectIngrediente(ing);
      setEditingId(id);
      setModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este ingrediente?')) {
      await deleteIngrediente(id);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingId(null);
    selectIngrediente(null);
  };

  const filteredIngredientes = ingredientes.filter((i) => {
    if (filter === 'alergenos') return i.es_alergeno;
    if (filter === 'no-alergenos') return !i.es_alergeno;
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ingredientes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los ingredientes y marca alérgenos
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + Nuevo Ingrediente
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-md flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-500 hover:text-red-700">✕</button>
        </div>
      )}

      {/* Filter */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-gray-600">Filtrar:</span>
        {(['all', 'alergenos', 'no-alergenos'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === f
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'alergenos' ? '🔴 Solo alérgenos' : '🟢 No alérgenos'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Alérgeno</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIngredientes.map((ing) => (
                <tr key={ing.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">{ing.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{ing.nombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                    {ing.descripcion || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    {ing.es_alergeno ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        🔴 Alérgeno
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        🟢 Normal
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button
                      onClick={() => handleEdit(ing.id)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(ing.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {filteredIngredientes.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No hay ingredientes todavía
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <IngredientFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        ingrediente={editingId ? ingredientes.find((i) => i.id === editingId) || null : null}
      />
    </div>
  );
};
