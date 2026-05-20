import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/shared/api';
import { useUIStore } from '@/shared/stores/ui-store';
import type { ProductoListadoItem, ProductoListResponse } from '@/shared/types';

const SKELETON_ROWS = 5;

export const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);

  const [productos, setProductos] = useState<ProductoListadoItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [skip, setSkip] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const limit = 10;

  const [stockEditingId, setStockEditingId] = useState<number | null>(null);
  const [stockValue, setStockValue] = useState(0);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchProductos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { skip, limit };
      if (debouncedSearch) params.search = debouncedSearch;
      const res = await api.get<ProductoListResponse>('/api/v1/productos', { params });
      setProductos(res.data.data);
      setTotal(res.data.total);
    } catch {
      setError('Error al cargar los productos');
    } finally {
      setIsLoading(false);
    }
  }, [skip, limit, debouncedSearch]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setSkip(0);
    }, 400);
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [search]);

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  const handleDelete = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${nombre}"?`)) return;
    try {
      await api.delete(`/api/v1/productos/${id}`);
      addToast({ type: 'success', title: 'Producto eliminado', description: `${nombre} fue eliminado correctamente` });
      fetchProductos();
    } catch {
      addToast({ type: 'error', title: 'Error', description: 'No se pudo eliminar el producto' });
    }
  };

  const handleToggleDisponible = async (producto: ProductoListadoItem) => {
    try {
      await api.put(`/api/v1/productos/${producto.id}`, { disponible: !producto.disponible });
      addToast({
        type: 'success',
        title: producto.disponible ? 'Producto desactivado' : 'Producto activado',
        description: `${producto.nombre} ahora está ${producto.disponible ? 'no disponible' : 'disponible'}`,
      });
      fetchProductos();
    } catch {
      addToast({ type: 'error', title: 'Error', description: 'No se pudo cambiar la disponibilidad' });
    }
  };

  const handleStockUpdate = async (id: number) => {
    try {
      await api.put(`/api/v1/productos/${id}`, { stock_cantidad: stockValue });
      addToast({ type: 'success', title: 'Stock actualizado', description: `Stock actualizado a ${stockValue}` });
      setStockEditingId(null);
      fetchProductos();
    } catch {
      addToast({ type: 'error', title: 'Error', description: 'No se pudo actualizar el stock' });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-on-surface">Productos</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona el catálogo de productos y stock</p>
        </div>
        <button
          onClick={() => navigate('/admin/productos/nuevo')}
          className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-input hover:bg-primary-hover shadow-sm transition-colors"
        >
          + Nuevo Producto
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 text-sm text-error bg-error-light rounded-input border border-error/20 font-medium">{error}</div>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre..."
          className="w-full max-w-xs px-3 py-2 text-sm border border-outline/20 rounded-input focus:outline-none focus:ring-2 focus:ring-primary text-on-surface bg-white"
        />
      </div>

      {isLoading ? (
        <div className="bg-white border border-outline/10 rounded-card overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-outline/10">
            <thead className="bg-surface-container">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categorías</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Disponible</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10">
              {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-32" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-16" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-surface-container-high rounded w-24" /></td>
                  <td className="px-4 py-3 text-center"><div className="h-4 bg-surface-container-high rounded w-10 mx-auto" /></td>
                  <td className="px-4 py-3 text-center"><div className="h-4 bg-surface-container-high rounded w-6 mx-auto" /></td>
                  <td className="px-4 py-3 text-right"><div className="h-4 bg-surface-container-high rounded w-20 ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="bg-white border border-outline/10 rounded-card overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-outline/10">
              <thead className="bg-surface-container">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categorías</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Disponible</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/10">
                {productos.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-on-surface font-display">{p.nombre}</td>
                    <td className="px-4 py-3 text-sm text-on-surface font-medium">${p.precio_base.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {p.categorias && p.categorias.length > 0
                        ? p.categorias.map((c) => c.nombre).join(', ')
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {stockEditingId === p.id ? (
                        <span className="inline-flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            value={stockValue}
                            onChange={(e) => setStockValue(Number(e.target.value))}
                            className="w-16 px-1.5 py-0.5 text-sm border border-outline/20 rounded bg-white text-on-surface"
                            autoFocus
                          />
                          <button onClick={() => handleStockUpdate(p.id)} className="text-tertiary hover:opacity-85 text-xs font-bold">
                            OK
                          </button>
                          <button onClick={() => setStockEditingId(null)} className="text-error hover:opacity-85 text-xs font-bold">
                            ✕
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => { setStockEditingId(p.id); setStockValue(p.stock_cantidad); }}
                          className={`font-semibold ${p.stock_cantidad === 0 ? 'text-error' : 'text-on-surface'} hover:underline`}
                        >
                          {p.stock_cantidad}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <input
                        type="checkbox"
                        checked={p.disponible}
                        onChange={() => handleToggleDisponible(p)}
                        className="w-4 h-4 text-primary border-outline/20 rounded cursor-pointer focus:ring-primary"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/admin/productos/${p.id}/editar`)}
                        className="text-primary hover:text-primary-hover font-semibold mr-3 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.nombre)}
                        className="text-error hover:text-error/95 font-semibold transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {productos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">No hay productos todavía</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              {total} producto{total !== 1 ? 's' : ''} — Página {currentPage} de {totalPages || 1}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={skip === 0}
                onClick={() => setSkip(Math.max(0, skip - limit))}
                className="px-3 py-1 text-sm border border-outline/20 rounded-input disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-high font-medium text-on-surface transition-colors"
              >
                Anterior
              </button>
              <button
                disabled={skip + limit >= total}
                onClick={() => setSkip(skip + limit)}
                className="px-3 py-1 text-sm border border-outline/20 rounded-input disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-high font-medium text-on-surface transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
