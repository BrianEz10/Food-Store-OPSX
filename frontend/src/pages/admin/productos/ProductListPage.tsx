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
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona el catálogo de productos y stock</p>
        </div>
        <button
          onClick={() => navigate('/admin/productos/nuevo')}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + Nuevo Producto
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-md">{error}</div>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre..."
          className="w-full max-w-xs px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categorías</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Disponible</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                  <td className="px-4 py-3 text-center"><div className="h-4 bg-gray-200 rounded w-10 mx-auto" /></td>
                  <td className="px-4 py-3 text-center"><div className="h-4 bg-gray-200 rounded w-6 mx-auto" /></td>
                  <td className="px-4 py-3 text-right"><div className="h-4 bg-gray-200 rounded w-20 ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categorías</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Disponible</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">${p.precio_base.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">—</td>
                    <td className="px-4 py-3 text-sm text-center">
                      {stockEditingId === p.id ? (
                        <span className="inline-flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            value={stockValue}
                            onChange={(e) => setStockValue(Number(e.target.value))}
                            className="w-16 px-1 py-0.5 text-sm border border-gray-300 rounded"
                            autoFocus
                          />
                          <button onClick={() => handleStockUpdate(p.id)} className="text-green-600 hover:text-green-800 text-xs font-medium">
                            OK
                          </button>
                          <button onClick={() => setStockEditingId(null)} className="text-red-600 hover:text-red-800 text-xs">
                            ✕
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => { setStockEditingId(p.id); setStockValue(p.stock_cantidad); }}
                          className={`font-medium ${p.stock_cantidad === 0 ? 'text-red-600' : 'text-gray-900'} hover:underline`}
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
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/admin/productos/${p.id}/editar`)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.nombre)}
                        className="text-red-600 hover:text-red-800"
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
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              <button
                disabled={skip + limit >= total}
                onClick={() => setSkip(skip + limit)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
