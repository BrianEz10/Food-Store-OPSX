import React, { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { useIngredienteStore } from '@/features/ingredientes/ingrediente-store';
import type { Ingrediente, IngredienteCreate, IngredienteUpdate } from '@/shared/types/ingrediente';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ingrediente?: Ingrediente | null;
}

export const IngredientFormModal: React.FC<Props> = ({ isOpen, onClose, ingrediente }) => {
  const { createIngrediente, updateIngrediente, isLoading } = useIngredienteStore();
  const isEditing = !!ingrediente;

  const form = useForm<IngredienteCreate | IngredienteUpdate>({
    defaultValues: {
      nombre: '',
      descripcion: '',
      es_alergeno: false,
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEditing && ingrediente) {
          await updateIngrediente(ingrediente.id, value as IngredienteUpdate);
        } else {
          await createIngrediente(value as IngredienteCreate);
        }
        onClose();
      } catch {
        // Error handled by store
      }
    },
  });

  useEffect(() => {
    if (ingrediente) {
      form.reset({
        nombre: ingrediente.nombre,
        descripcion: ingrediente.descripcion || '',
        es_alergeno: ingrediente.es_alergeno,
      });
    } else {
      form.reset({ nombre: '', descripcion: '', es_alergeno: false });
    }
  }, [ingrediente, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg p-6 bg-white rounded-modal shadow-xl border border-outline/10">
        <h2 className="text-xl font-bold font-display text-on-surface mb-4">
          {isEditing ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
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
                  className={`mt-1 block w-full px-3 py-2 border rounded-input shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-on-surface bg-white ${
                    field.state.meta.errors.length ? 'border-error' : 'border-outline/20'
                  }`}
                />
                {field.state.meta.errors ? (
                  <p className="mt-1 text-sm text-error">{field.state.meta.errors.join(', ')}</p>
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
                  className="mt-1 block w-full px-3 py-2 border border-outline/20 rounded-input shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-on-surface bg-white"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="es_alergeno">
            {(field) => (
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.state.value as boolean}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="w-4 h-4 text-error border-outline/20 rounded focus:ring-error"
                  />
                  <span className="ml-2">Es alérgeno</span>
                </label>
              </div>
            )}
          </form.Field>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-on-surface bg-surface-container rounded-input hover:bg-surface-container-high transition-colors"
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
                  className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-input hover:bg-primary-hover disabled:opacity-50 transition-colors shadow-sm"
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
