import React, { useEffect, useState } from 'react';
import { useCategoriaStore } from '@/features/categorias/categoria-store';
import { CategoryFormModal } from '@/features/categorias/components/CategoryFormModal';
import type { CategoriaTreeNode } from '@/shared/types/categoria';

const TreeNode: React.FC<{
  node: CategoriaTreeNode;
  depth: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}> = ({ node, depth, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.hijos.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-2 hover:bg-surface-container/50 rounded-input group transition-colors"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-4 text-gray-400 hover:text-on-surface transition-colors"
        >
          {hasChildren ? (expanded ? '▼' : '▶') : '·'}
        </button>
        <span className="flex-1 text-sm text-on-surface font-medium">{node.nombre}</span>
        <div className="hidden group-hover:flex gap-1">
          <button
            onClick={() => onEdit(node.id)}
            className="px-2 py-1 text-xs text-primary hover:bg-primary-light rounded-input font-medium transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(node.id)}
            className="px-2 py-1 text-xs text-error hover:bg-error-light rounded-input font-medium transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
      {expanded && hasChildren && (
        <div>
          {node.hijos.map((hijo) => (
            <TreeNode key={hijo.id} node={hijo} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export const CategoryListPage: React.FC = () => {
  const {
    categorias,
    tree,
    isLoading,
    error,
    loadCategorias,
    loadTree,
    deleteCategoria,
    selectCategoria,
    selectedCategoria,
    clearError,
  } = useCategoriaStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('tree');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadCategorias();
    loadTree();
  }, []);

  const handleEdit = (id: number) => {
    const cat = categorias.find((c) => c.id === id);
    if (cat) {
      selectCategoria(cat);
      setEditingId(id);
      setModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      await deleteCategoria(id);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingId(null);
    selectCategoria(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-on-surface">Categorías</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona las categorías jerárquicas de productos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-container rounded-card p-1 border border-outline/10">
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1 text-sm rounded-input transition-all ${
                viewMode === 'tree' ? 'bg-white shadow-sm font-semibold text-on-surface' : 'text-gray-500 hover:text-on-surface'
              }`}
            >
              Árbol
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded-input transition-all ${
                viewMode === 'list' ? 'bg-white shadow-sm font-semibold text-on-surface' : 'text-gray-500 hover:text-on-surface'
              }`}
            >
              Lista
            </button>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-input hover:bg-primary-hover shadow-sm transition-colors"
          >
            + Nueva Categoría
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 text-sm text-error bg-error-light rounded-input flex justify-between items-center border border-error/20">
          <span>{error}</span>
          <button onClick={clearError} className="text-error hover:opacity-80">✕</button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : viewMode === 'tree' ? (
        <div className="bg-white border border-outline/10 rounded-card p-6 shadow-sm">
          {tree.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No hay categorías todavía</p>
          ) : (
            tree.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                depth={0}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      ) : (
        <div className="bg-white border border-outline/10 rounded-card overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-outline/10">
            <thead className="bg-surface-container">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Padre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Orden</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10">
              {categorias.map((cat) => {
                const padre = categorias.find((c) => c.id === cat.padre_id);
                return (
                  <tr key={cat.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-500">{cat.id}</td>
                    <td className="px-4 py-3 text-sm font-bold text-on-surface font-display">{cat.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{padre?.nombre || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{cat.orden}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button
                        onClick={() => handleEdit(cat.id)}
                        className="text-primary hover:text-primary-hover font-semibold transition-colors mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-error hover:text-error/95 font-semibold transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
              {categorias.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No hay categorías todavía
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <CategoryFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        categoria={editingId ? categorias.find((c) => c.id === editingId) || null : null}
      />
    </div>
  );
};
