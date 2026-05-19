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
          <h1 className="text-2xl font-bold font-display text-on-surface">Ingredientes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los ingredientes y marca alérgenos
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-input hover:bg-primary-hover shadow-sm transition-colors"
        >
          + Nuevo Ingrediente
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 text-sm text-error bg-error-light border border-error/20 rounded-input flex justify-between items-center font-medium">
          <span>{error}</span>
          <button onClick={clearError} className="text-error hover:opacity-80">✕</button>
        </div>
      )}

      {/* Filter */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-gray-600 font-medium">Filtrar:</span>
        {(['all', 'alergenos', 'no-alergenos'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-sm rounded-input font-medium transition-colors ${
              filter === f
                ? 'bg-primary-light text-primary font-semibold border border-primary/20'
                : 'text-on-surface bg-white border border-outline/10 hover:bg-surface-container-high'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'alergenos' ? '🔴 Solo alérgenos' : '🟢 No alérgenos'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : (
        <div className="bg-white border border-outline/10 rounded-card overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-outline/10">
            <thead className="bg-surface-container">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Alérgeno</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10">
              {filteredIngredientes.map((ing) => (
                <tr key={ing.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-505">{ing.id}</td>
                  <td className="px-4 py-3 text-sm font-bold text-on-surface font-display">{ing.nombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                    {ing.descripcion || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    {ing.es_alergeno ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-error-light text-error">
                        🔴 Alérgeno
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-tertiary-light text-tertiary">
                        🟢 Normal
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(ing.id)}
                      className="text-primary hover:text-primary-hover font-semibold mr-3 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(ing.id)}
                      className="text-error hover:text-error/95 font-semibold transition-colors"
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
