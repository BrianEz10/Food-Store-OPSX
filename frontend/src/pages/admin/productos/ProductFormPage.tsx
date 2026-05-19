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
          <div className="h-8 bg-surface-container-high rounded w-48" />
          <div className="h-10 bg-surface-container-high rounded w-full" />
          <div className="h-10 bg-surface-container-high rounded w-full" />
          <div className="h-10 bg-surface-container-high rounded w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-on-surface">
          {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {isEdit ? 'Modifica los datos del producto' : 'Completa los datos para crear un nuevo producto'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="bg-white border border-outline/10 rounded-card p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold font-display text-on-surface">Información básica</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-input focus:outline-none focus:ring-2 focus:ring-primary text-on-surface bg-white ${errors.nombre ? 'border-error' : 'border-outline/20'}`}
            />
            {errors.nombre && <p className="mt-1 text-xs text-error">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-outline/20 rounded-input focus:outline-none focus:ring-2 focus:ring-primary text-on-surface bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
            <input
              type="text"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-outline/20 rounded-input focus:outline-none focus:ring-2 focus:ring-primary text-on-surface bg-white"
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
                className={`w-full px-3 py-2 text-sm border rounded-input focus:outline-none focus:ring-2 focus:ring-primary text-on-surface bg-white ${errors.precioBase ? 'border-error' : 'border-outline/20'}`}
              />
              {errors.precioBase && <p className="mt-1 text-xs text-error">{errors.precioBase}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                min={0}
                value={stockCantidad}
                onChange={(e) => setStockCantidad(e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-input focus:outline-none focus:ring-2 focus:ring-primary text-on-surface bg-white ${errors.stockCantidad ? 'border-error' : 'border-outline/20'}`}
              />
              {errors.stockCantidad && <p className="mt-1 text-xs text-error">{errors.stockCantidad}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="disponible"
              checked={disponible}
              onChange={(e) => setDisponible(e.target.checked)}
              className="w-4 h-4 text-primary border-outline/20 rounded focus:ring-primary"
            />
            <label htmlFor="disponible" className="text-sm text-gray-700">Producto disponible para la venta</label>
          </div>
        </div>

        <div className="bg-white border border-outline/10 rounded-card p-6 shadow-sm">
          <h2 className="text-lg font-bold font-display text-on-surface mb-3">Categorías</h2>
          {categorias.length === 0 ? (
            <p className="text-sm text-gray-400">No hay categorías disponibles</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategoria(cat.id)}
                  className={`px-3 py-1 text-sm rounded-input border transition-colors ${
                    selectedCategoriaIds.includes(cat.id)
                      ? 'bg-primary-light border-primary/30 text-primary font-semibold'
                      : 'bg-white border-outline/20 text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-outline/10 rounded-card p-6 shadow-sm">
          <h2 className="text-lg font-bold font-display text-on-surface mb-3">Ingredientes</h2>
          {ingredientes.length === 0 ? (
            <p className="text-sm text-gray-400">No hay ingredientes disponibles</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-outline/10">
                <thead className="bg-surface-container">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Incluir</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Alérgeno</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Removible</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline/10">
                  {ingredientes.map((ing) => {
                    const isSelected = selectedIngredientes.has(ing.id);
                    return (
                      <tr key={ing.id} className="hover:bg-surface-container/50 transition-colors">
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleIngrediente(ing.id)}
                            className="w-4 h-4 text-primary border-outline/20 rounded focus:ring-primary"
                          />
                        </td>
                        <td className="px-3 py-2 text-sm text-on-surface font-medium">{ing.nombre}</td>
                        <td className="px-3 py-2 text-sm text-center">
                          {ing.es_alergeno ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-error-light text-error">
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
                            className="w-4 h-4 text-primary border-outline/20 rounded disabled:opacity-30 focus:ring-primary"
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
            className="px-6 py-2 text-sm font-bold text-white bg-primary rounded-input hover:bg-primary-hover disabled:opacity-50 shadow-sm transition-colors"
          >
            {isSaving ? 'Guardando...' : isEdit ? 'Actualizar Producto' : 'Crear Producto'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/productos')}
            className="px-4 py-2 text-sm font-semibold text-on-surface bg-surface-container rounded-input border border-outline/15 hover:bg-surface-container-high transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
