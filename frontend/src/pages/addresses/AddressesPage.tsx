import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import {
  fetchDireccionesFn,
  createDireccionFn,
  updateDireccionFn,
  deleteDireccionFn,
  setDireccionPredeterminadaFn,
} from '@/features/direcciones/api';
import type { DireccionCreate, DireccionResponse, DireccionUpdate } from '@/shared/types';

// ─── Toast ───────────────────────────────────────────────────────────────────

type ToastMsg = { text: string; type: 'success' | 'error' };

const Toast: React.FC<{ msg: ToastMsg | null; onClose: () => void }> = ({ msg, onClose }) => {
  if (!msg) return null;
  const bg = msg.type === 'success'
    ? 'bg-green-50 border-green-400 text-green-800'
    : 'bg-red-50 border-red-400 text-red-800';
  return (
    <div className={`flex items-center gap-3 px-4 py-3 border rounded-lg text-sm font-medium ${bg}`}>
      <span className="flex-1">{msg.text}</span>
      <button onClick={onClose} className="text-current opacity-60 hover:opacity-100">✕</button>
    </div>
  );
};

// ─── AddressCard ──────────────────────────────────────────────────────────────

const AddressCard: React.FC<{
  direccion: DireccionResponse;
  onEdit: (d: DireccionResponse) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
  isDeleting: boolean;
  isSettingDefault: boolean;
}> = ({ direccion, onEdit, onDelete, onSetDefault, isDeleting, isSettingDefault }) => (
  <div className={`relative border rounded-xl p-5 bg-white shadow-sm space-y-1 ${direccion.es_principal ? 'border-blue-400 ring-1 ring-blue-300' : 'border-gray-200'}`}>
    {direccion.es_principal && (
      <span className="absolute top-3 right-3 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
        Predeterminada
      </span>
    )}
    {direccion.alias && (
      <p className="text-sm font-semibold text-gray-700">{direccion.alias}</p>
    )}
    <p className="text-sm text-gray-800">{direccion.linea1}</p>
    {direccion.linea2 && <p className="text-sm text-gray-600">{direccion.linea2}</p>}
    <p className="text-sm text-gray-600">{direccion.ciudad} — CP {direccion.codigo_postal}</p>

    <div className="flex gap-2 pt-3 flex-wrap">
      <button
        onClick={() => onEdit(direccion)}
        className="text-xs px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 transition-colors"
      >
        Editar
      </button>
      {!direccion.es_principal && (
        <button
          onClick={() => onSetDefault(direccion.id)}
          disabled={isSettingDefault}
          className="text-xs px-3 py-1.5 border border-blue-300 rounded-md hover:bg-blue-50 text-blue-700 transition-colors disabled:opacity-50"
        >
          {isSettingDefault ? 'Estableciendo...' : 'Marcar como predeterminada'}
        </button>
      )}
      <button
        onClick={() => onDelete(direccion.id)}
        disabled={isDeleting}
        className="text-xs px-3 py-1.5 border border-red-300 rounded-md hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50 ml-auto"
      >
        {isDeleting ? 'Eliminando...' : 'Eliminar'}
      </button>
    </div>
  </div>
);

// ─── AddressForm (crear / editar) ─────────────────────────────────────────────

type AddressFormValues = {
  alias: string;
  linea1: string;
  linea2: string;
  ciudad: string;
  codigo_postal: string;
  es_principal: boolean;
};

const AddressFormModal: React.FC<{
  initial?: DireccionResponse;
  onSave: (data: DireccionCreate | DireccionUpdate) => void;
  onCancel: () => void;
  isPending: boolean;
}> = ({ initial, onSave, onCancel, isPending }) => {
  const form = useForm<AddressFormValues>({
    defaultValues: {
      alias: initial?.alias ?? '',
      linea1: initial?.linea1 ?? '',
      linea2: initial?.linea2 ?? '',
      ciudad: initial?.ciudad ?? '',
      codigo_postal: initial?.codigo_postal ?? '',
      es_principal: initial?.es_principal ?? false,
    },
    onSubmit: async ({ value }) => {
      const payload: DireccionCreate = {
        ...(value.alias.trim() && { alias: value.alias.trim() }),
        linea1: value.linea1.trim(),
        ...(value.linea2.trim() && { linea2: value.linea2.trim() }),
        ciudad: value.ciudad.trim(),
        codigo_postal: value.codigo_postal.trim(),
        es_principal: value.es_principal,
      };
      onSave(payload);
    },
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {initial ? 'Editar dirección' : 'Nueva dirección'}
        </h3>

        <form
          onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
          className="space-y-3"
        >
          {/* Alias */}
          <form.Field name="alias">
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Alias (opcional)</label>
                <input type="text" value={field.state.value} onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Casa, Trabajo..."
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
            )}
          </form.Field>

          {/* Linea 1 */}
          <form.Field name="linea1"
            validators={{ onChange: ({ value }) => !value?.trim() ? 'La dirección es requerida' : undefined }}>
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección <span className="text-red-500">*</span></label>
                <input type="text" value={field.state.value} onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Av. Corrientes 1234"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${field.state.meta.errors.length ? 'border-red-300' : 'border-gray-300'}`} />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </form.Field>

          {/* Linea 2 */}
          <form.Field name="linea2">
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Piso / Depto (opcional)</label>
                <input type="text" value={field.state.value} onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Piso 3, Depto B"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
            )}
          </form.Field>

          {/* Ciudad y CP en fila */}
          <div className="grid grid-cols-2 gap-3">
            <form.Field name="ciudad"
              validators={{ onChange: ({ value }) => !value?.trim() ? 'Requerida' : undefined }}>
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ciudad <span className="text-red-500">*</span></label>
                  <input type="text" value={field.state.value} onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${field.state.meta.errors.length ? 'border-red-300' : 'border-gray-300'}`} />
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-xs text-red-600">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="codigo_postal"
              validators={{ onChange: ({ value }) => !value?.trim() ? 'Requerido' : undefined }}>
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Código Postal <span className="text-red-500">*</span></label>
                  <input type="text" value={field.state.value} onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${field.state.meta.errors.length ? 'border-red-300' : 'border-gray-300'}`} />
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-xs text-red-600">{field.state.meta.errors.join(', ')}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Predeterminada */}
          <form.Field name="es_principal">
            {(field) => (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Establecer como dirección predeterminada</span>
              </label>
            )}
          </form.Field>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel}
              className="flex-1 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <button type="submit" disabled={!canSubmit || isPending}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md disabled:opacity-50 transition-colors">
                  {isSubmitting || isPending ? 'Guardando...' : initial ? 'Actualizar' : 'Crear dirección'}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── DeleteConfirmDialog ───────────────────────────────────────────────────────

const DeleteConfirmDialog: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}> = ({ onConfirm, onCancel, isDeleting }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">¿Eliminar dirección?</h3>
      <p className="text-sm text-gray-600">Esta acción no se puede deshacer.</p>
      <div className="flex gap-3">
        <button onClick={onCancel}
          className="flex-1 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button onClick={onConfirm} disabled={isDeleting}
          className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md disabled:opacity-50 transition-colors">
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-2 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/2" />
    <div className="h-3 bg-gray-200 rounded w-3/4" />
    <div className="h-3 bg-gray-200 rounded w-1/3" />
  </div>
);

// ─── AddressesPage ────────────────────────────────────────────────────────────

export const AddressesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const [editingAddress, setEditingAddress] = useState<DireccionResponse | null | 'new'>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: direcciones, isLoading } = useQuery({
    queryKey: ['direcciones'],
    queryFn: fetchDireccionesFn,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['direcciones'] });

  const createMutation = useMutation({
    mutationFn: (data: DireccionCreate) => createDireccionFn(data),
    onSuccess: () => { setEditingAddress(null); setToast({ text: 'Dirección creada', type: 'success' }); invalidate(); },
    onError: (err: any) => setToast({ text: err?.response?.data?.detail || 'Error al crear', type: 'error' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: DireccionUpdate }) => updateDireccionFn(id, data),
    onSuccess: () => { setEditingAddress(null); setToast({ text: 'Dirección actualizada', type: 'success' }); invalidate(); },
    onError: (err: any) => setToast({ text: err?.response?.data?.detail || 'Error al actualizar', type: 'error' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDireccionFn(id),
    onSuccess: () => { setDeletingId(null); setToast({ text: 'Dirección eliminada', type: 'success' }); invalidate(); },
    onError: (err: any) => {
      setDeletingId(null);
      setToast({ text: err?.response?.data?.detail || 'No se puede eliminar esta dirección', type: 'error' });
    },
  });

  const defaultMutation = useMutation({
    mutationFn: (id: number) => setDireccionPredeterminadaFn(id),
    onSuccess: () => { setToast({ text: 'Dirección predeterminada actualizada', type: 'success' }); invalidate(); },
    onError: (err: any) => setToast({ text: err?.response?.data?.detail || 'Error', type: 'error' }),
  });

  const handleSave = (data: DireccionCreate | DireccionUpdate) => {
    if (editingAddress === 'new') {
      createMutation.mutate(data as DireccionCreate);
    } else if (editingAddress) {
      updateMutation.mutate({ id: editingAddress.id, data: data as DireccionUpdate });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Direcciones</h1>
          <p className="mt-1 text-sm text-gray-500">Gestioná tus direcciones de entrega.</p>
        </div>
        <button
          onClick={() => setEditingAddress('new')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Nueva dirección
        </button>
      </div>

      <Toast msg={toast} onClose={() => setToast(null)} />

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-4">
          <SkeletonCard /><SkeletonCard />
        </div>
      ) : !direcciones?.length ? (
        <div className="text-center py-16 border border-dashed border-gray-300 rounded-xl">
          <p className="text-gray-400 text-sm">No tenés direcciones registradas.</p>
          <button
            onClick={() => setEditingAddress('new')}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Agregar una ahora
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {direcciones.map((d) => (
            <AddressCard
              key={d.id}
              direccion={d}
              onEdit={(addr) => setEditingAddress(addr)}
              onDelete={(id) => setDeletingId(id)}
              onSetDefault={(id) => defaultMutation.mutate(id)}
              isDeleting={deleteMutation.isPending && deleteMutation.variables === d.id}
              isSettingDefault={defaultMutation.isPending && defaultMutation.variables === d.id}
            />
          ))}
        </div>
      )}

      {/* Modal crear / editar */}
      {editingAddress !== null && (
        <AddressFormModal
          initial={editingAddress !== 'new' ? editingAddress : undefined}
          onSave={handleSave}
          onCancel={() => setEditingAddress(null)}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Dialog confirmación de eliminación */}
      {deletingId !== null && (
        <DeleteConfirmDialog
          onConfirm={() => deleteMutation.mutate(deletingId)}
          onCancel={() => setDeletingId(null)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
