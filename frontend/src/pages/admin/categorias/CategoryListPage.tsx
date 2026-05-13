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
        className="flex items-center gap-2 py-2 px-2 hover:bg-gray-50 rounded group"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-4 text-gray-400 hover:text-gray-600"
        >
          {hasChildren ? (expanded ? '▼' : '▶') : '·'}
        </button>
        <span className="flex-1 text-sm text-gray-900">{node.nombre}</span>
        <div className="hidden group-hover:flex gap-1">
          <button
            onClick={() => onEdit(node.id)}
            className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(node.id)}
            className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
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
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona las categorías jerárquicas de productos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1 text-sm rounded-md ${
                viewMode === 'tree' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Árbol
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded-md ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Lista
            </button>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            + Nueva Categoría
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-md flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-500 hover:text-red-700">✕</button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : viewMode === 'tree' ? (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
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
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Padre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categorias.map((cat) => {
                const padre = categorias.find((c) => c.id === cat.padre_id);
                return (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">{cat.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{cat.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{padre?.nombre || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{cat.orden}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button
                        onClick={() => handleEdit(cat.id)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-600 hover:text-red-800"
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
