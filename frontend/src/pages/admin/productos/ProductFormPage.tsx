import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/shared/api';
import { useUIStore } from '@/shared/stores/ui-store';
import type { ProductoResponse, ProductoCategoriaOut, ProductoIngredienteOut } from '@/shared/types';

interface CategoriaOption {
  id: number;
  nombre: string;
}

interface IngredienteOption {
  id: number;
  nombre: string;
  es_alergeno: boolean;
}

export const ProductFormPage: React.FC = () => {
  const { productoId } = useParams<{ productoId?: string }>();
  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);
  const isEdit = Boolean(productoId);

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [precioBase, setPrecioBase] = useState('');
  const [stockCantidad, setStockCantidad] = useState('');
  const [disponible, setDisponible] = useState(true);

  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);
  const [selectedCategoriaIds, setSelectedCategoriaIds] = useState<number[]>([]);
  const [ingredientes, setIngredientes] = useState<IngredienteOption[]>([]);
  const [selectedIngredientes, setSelectedIngredientes] = useState<Map<number, boolean>>(new Map());

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [catRes, ingRes] = await Promise.all([
          api.get<{ data: CategoriaOption[] }>('/api/v1/categorias'),
          api.get<{ data: IngredienteOption[] }>('/api/v1/ingredientes'),
        ]);
        setCategorias(catRes.data.data || []);
        setIngredientes(ingRes.data.data || []);

        if (isEdit && productoId) {
          const prodRes = await api.get<ProductoResponse>(`/api/v1/productos/${productoId}`);
          const p = prodRes.data;
          setNombre(p.nombre);
          setDescripcion(p.descripcion ?? '');
          setImagenUrl(p.imagen_url ?? '');
          setPrecioBase(String(p.precio_base));
          setStockCantidad(String(p.stock_cantidad));
          setDisponible(p.disponible);
          setSelectedCategoriaIds(p.categorias.map((c) => c.id));

          const ingMap = new Map<number, boolean>();
          p.ingredientes.forEach((ing) => ingMap.set(ing.id, ing.es_removible));
          setSelectedIngredientes(ingMap);
        }
      } catch {
        addToast({ type: 'error', title: 'Error', description: 'No se pudieron cargar los datos del formulario' });
      } finally {
        setIsLoading(false);
      }
    };
    loadFormData();
  }, [isEdit, productoId, addToast]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    const precio = parseFloat(precioBase);
    if (isNaN(precio) || precio < 0) newErrors.precioBase = 'Debe ser un número >= 0';
    const stock = parseInt(stockCantidad, 10);
    if (isNaN(stock) || stock < 0) newErrors.stockCantidad = 'Debe ser un número >= 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    const payload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || null,
      imagen_url: imagenUrl.trim() || null,
      precio_base: parseFloat(precioBase),
      stock_cantidad: parseInt(stockCantidad, 10),
      disponible,
      categoria_ids: selectedCategoriaIds,
      ingredientes: Array.from(selectedIngredientes.entries()).map(([id, removible]) => ({
        ingrediente_id: id,
        es_removible: removible,
      })),
    };

    try {
      if (isEdit && productoId) {
        await api.put(`/api/v1/productos/${productoId}`, payload);
        addToast({ type: 'success', title: 'Producto actualizado', description: `${payload.nombre} fue actualizado correctamente` });
      } else {
        await api.post('/api/v1/productos', payload);
        addToast({ type: 'success', title: 'Producto creado', description: `${payload.nombre} fue creado correctamente` });
      }
      navigate('/admin/productos');
    } catch {
      addToast({ type: 'error', title: 'Error', description: `No se pudo ${isEdit ? 'actualizar' : 'crear'} el producto` });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCategoria = (id: number) => {
    setSelectedCategoriaIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleIngrediente = (id: number) => {
    setSelectedIngredientes((prev) => {
      const next = new Map(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.set(id, false);
      }
      return next;
    });
  };

  const setIngredienteRemovible = (id: number, removible: boolean) => {
    setSelectedIngredientes((prev) => {
      const next = new Map(prev);
      next.set(id, removible);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-10 bg-gray-200 rounded w-full" />
          <div className="h-10 bg-gray-200 rounded w-full" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {isEdit ? 'Modifica los datos del producto' : 'Completa los datos para crear un nuevo producto'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Información básica</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
            <input
              type="text"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio base *</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={precioBase}
                onChange={(e) => setPrecioBase(e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.precioBase ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.precioBase && <p className="mt-1 text-xs text-red-600">{errors.precioBase}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                min={0}
                value={stockCantidad}
                onChange={(e) => setStockCantidad(e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.stockCantidad ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.stockCantidad && <p className="mt-1 text-xs text-red-600">{errors.stockCantidad}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="disponible"
              checked={disponible}
              onChange={(e) => setDisponible(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="disponible" className="text-sm text-gray-700">Producto disponible para la venta</label>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Categorías</h2>
          {categorias.length === 0 ? (
            <p className="text-sm text-gray-400">No hay categorías disponibles</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategoria(cat.id)}
                  className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                    selectedCategoriaIds.includes(cat.id)
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Ingredientes</h2>
          {ingredientes.length === 0 ? (
            <p className="text-sm text-gray-400">No hay ingredientes disponibles</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Incluir</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Alérgeno</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Removible</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ingredientes.map((ing) => {
                    const isSelected = selectedIngredientes.has(ing.id);
                    return (
                      <tr key={ing.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleIngrediente(ing.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">{ing.nombre}</td>
                        <td className="px-3 py-2 text-sm text-center">
                          {ing.es_alergeno ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Alérgeno
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm text-center">
                          <input
                            type="checkbox"
                            checked={isSelected ? (selectedIngredientes.get(ing.id) ?? false) : false}
                            disabled={!isSelected}
                            onChange={(e) => setIngredienteRemovible(ing.id, e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded disabled:opacity-30"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : isEdit ? 'Actualizar Producto' : 'Crear Producto'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/productos')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
