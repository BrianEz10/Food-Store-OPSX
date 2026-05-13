import React, { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { useCategoriaStore } from '@/features/categorias/categoria-store';
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '@/shared/types/categoria';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categoria?: Categoria | null;
}

export const CategoryFormModal: React.FC<Props> = ({ isOpen, onClose, categoria }) => {
  const { createCategoria, updateCategoria, categorias, isLoading } = useCategoriaStore();
  const isEditing = !!categoria;

  const form = useForm<CategoriaCreate | CategoriaUpdate>({
    defaultValues: {
      nombre: '',
      descripcion: '',
      padre_id: null,
      orden: 0,
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditing && categoria) {
          await updateCategoria(categoria.id, value as CategoriaUpdate);
        } else {
          await createCategoria(value as CategoriaCreate);
        }
        onClose();
      } catch {
        // Error handled by store
      }
    },
  });

  useEffect(() => {
    if (categoria) {
      form.reset({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        padre_id: categoria.padre_id ?? null,
        orden: categoria.orden,
      });
    } else {
      form.reset({ nombre: '', descripcion: '', padre_id: null, orden: 0 });
    }
  }, [categoria, isOpen]);

  if (!isOpen) return null;

  // Filter out the current category from parent options to avoid self-reference
  const parentOptions = categorias.filter(
    (c) => c.id !== categoria?.id && c.padre_id !== categoria?.id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="nombre"
            validators={{
              onChange: ({ value }) =>
                !value ? 'El nombre es requerido' : undefined,
            }}
          >
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                <input
                  type="text"
                  value={field.state.value as string}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    field.state.meta.errors.length ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {field.state.meta.errors ? (
                  <p className="mt-1 text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field name="descripcion">
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  value={field.state.value as string}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="padre_id">
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoría Padre</label>
                <select
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : null)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">— Ninguna (categoría raíz) —</option>
                  {parentOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="orden">
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Orden</label>
                <input
                  type="number"
                  value={field.state.value as number}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  min={0}
                  className="mt-1 block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            )}
          </form.Field>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
};
