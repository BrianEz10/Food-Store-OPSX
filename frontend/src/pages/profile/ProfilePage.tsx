import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores/auth-store';
import { fetchPerfilFn, updatePerfilFn, cambiarPasswordFn } from '@/features/perfil/api';
import type { PerfilUpdate, CambioPasswordRequest } from '@/shared/types';

// ─── Toast simple ────────────────────────────────────────────────────────────

type ToastMsg = { text: string; type: 'success' | 'error' };

const Toast: React.FC<{ msg: ToastMsg | null; onClose: () => void }> = ({ msg, onClose }) => {
  if (!msg) return null;
  const bg = msg.type === 'success' ? 'bg-tertiary-light border-tertiary/20 text-tertiary' : 'bg-error-light border-error/20 text-error';
  return (
    <div className={`flex items-center gap-3 px-4 py-3 border rounded-card text-sm font-medium ${bg}`}>
      <span className="flex-1">{msg.text}</span>
      <button onClick={onClose} className="text-current opacity-60 hover:opacity-100">✕</button>
    </div>
  );
};

// ─── ProfilePage ─────────────────────────────────────────────────────────────

export const ProfilePage: React.FC = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const storeUser = useAuthStore((s) => s.user);

  const [perfilToast, setPerfilToast] = useState<ToastMsg | null>(null);
  const [passToast, setPassToast] = useState<ToastMsg | null>(null);

  // Fetch perfil actual
  const { data: perfil, isLoading } = useQuery({
    queryKey: ['perfil'],
    queryFn: fetchPerfilFn,
    initialData: storeUser
      ? {
          id: storeUser.id,
          nombre: storeUser.nombre,
          apellido: storeUser.apellido,
          email: storeUser.email,
          roles: storeUser.roles,
          creado_en: '',
        }
      : undefined,
  });

  // Mutación: actualizar datos personales
  const updateMutation = useMutation({
    mutationFn: (payload: PerfilUpdate) => updatePerfilFn(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(['perfil'], data);
      setUser({ ...storeUser!, nombre: data.nombre, apellido: data.apellido });
      setPerfilToast({ text: 'Datos actualizados correctamente', type: 'success' });
    },
    onError: (err: any) => {
      setPerfilToast({ text: err?.response?.data?.detail || 'Error al actualizar el perfil', type: 'error' });
    },
  });

  // Mutación: cambiar contraseña
  const passMutation = useMutation({
    mutationFn: (payload: CambioPasswordRequest) => cambiarPasswordFn(payload),
    onSuccess: () => {
      setPassToast({ text: 'Contraseña actualizada correctamente', type: 'success' });
      passForm.reset();
    },
    onError: (err: any) => {
      setPassToast({ text: err?.response?.data?.detail || 'Error al cambiar la contraseña', type: 'error' });
    },
  });

  // Form: datos personales
  const perfilForm = useForm<PerfilUpdate>({
    defaultValues: {
      nombre: perfil?.nombre ?? '',
      apellido: perfil?.apellido ?? '',
    },
    onSubmit: async ({ value }) => {
      setPerfilToast(null);
      const payload: PerfilUpdate = {};
      if (value.nombre && value.nombre !== perfil?.nombre) payload.nombre = value.nombre;
      if (value.apellido && value.apellido !== perfil?.apellido) payload.apellido = value.apellido;
      if (Object.keys(payload).length === 0) {
        setPerfilToast({ text: 'No hay cambios para guardar', type: 'error' });
        return;
      }
      updateMutation.mutate(payload);
    },
  });

  // Form: cambio de contraseña
  type PassForm = CambioPasswordRequest & { confirm_password: string };
  const passForm = useForm<PassForm>({
    defaultValues: { current_password: '', new_password: '', confirm_password: '' },
    onSubmit: async ({ value }) => {
      setPassToast(null);
      passMutation.mutate({
        current_password: value.current_password,
        new_password: value.new_password,
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-on-surface">Mi Perfil</h1>
        <p className="mt-1 text-sm text-gray-500">Administrá tu información personal y contraseña.</p>
      </div>

      {/* ── Sección: Datos personales ─────────────────────────────── */}
      <section className="bg-white border border-outline/10 rounded-card p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold font-display text-on-surface">Datos personales</h2>

        <Toast msg={perfilToast} onClose={() => setPerfilToast(null)} />

        <form
          onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); perfilForm.handleSubmit(); }}
          className="space-y-4"
        >
          {/* Email (solo lectura) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={perfil?.email ?? ''}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-surface-container border border-outline/10 rounded-input text-sm text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-400">El email no se puede modificar desde aquí.</p>
          </div>

          {/* Nombre */}
          <perfilForm.Field
            name="nombre"
            validators={{ onChange: ({ value }) => !value?.trim() ? 'El nombre es requerido' : undefined }}
          >
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-input shadow-sm text-sm focus:outline-none focus:ring-primary focus:border-primary ${
                    field.state.meta.errors.length ? 'border-red-300' : 'border-outline/20'
                  }`}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-error">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </perfilForm.Field>

          {/* Apellido */}
          <perfilForm.Field
            name="apellido"
            validators={{ onChange: ({ value }) => !value?.trim() ? 'El apellido es requerido' : undefined }}
          >
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Apellido</label>
                <input
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-input shadow-sm text-sm focus:outline-none focus:ring-primary focus:border-primary ${
                    field.state.meta.errors.length ? 'border-red-300' : 'border-outline/20'
                  }`}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-error">{field.state.meta.meta?.errors?.join(', ') || field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </perfilForm.Field>

          <perfilForm.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || updateMutation.isPending}
                className="w-full py-2 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-input disabled:opacity-50 transition-colors"
              >
                {isSubmitting || updateMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
              </button>
            )}
          </perfilForm.Subscribe>
        </form>
      </section>

      {/* ── Sección: Cambiar contraseña ───────────────────────────── */}
      <section className="bg-white border border-outline/10 rounded-card p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold font-display text-on-surface">Cambiar contraseña</h2>

        <Toast msg={passToast} onClose={() => setPassToast(null)} />

        <form
          onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); passForm.handleSubmit(); }}
          className="space-y-4"
        >
          <passForm.Field
            name="current_password"
            validators={{ onChange: ({ value }) => !value ? 'Requerida' : undefined }}
          >
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña actual</label>
                <input
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-input shadow-sm text-sm focus:outline-none focus:ring-primary focus:border-primary ${
                    field.state.meta.errors.length ? 'border-red-300' : 'border-outline/20'
                  }`}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-error">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </passForm.Field>

          <passForm.Field
            name="new_password"
            validators={{
              onChange: ({ value }) =>
                !value ? 'Requerida' : value.length < 8 ? 'Mínimo 8 caracteres' : undefined,
            }}
          >
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
                <input
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-input shadow-sm text-sm focus:outline-none focus:ring-primary focus:border-primary ${
                    field.state.meta.errors.length ? 'border-red-300' : 'border-outline/20'
                  }`}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-error">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </passForm.Field>

          <passForm.Field
            name="confirm_password"
            validators={{
              onChangeListenTo: ['new_password'],
              onChange: ({ value, fieldApi }) => {
                const newPass = fieldApi.form.getFieldValue('new_password');
                return !value ? 'Requerida' : value !== newPass ? 'Las contraseñas no coinciden' : undefined;
              },
            }}
          >
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-input shadow-sm text-sm focus:outline-none focus:ring-primary focus:border-primary ${
                    field.state.meta.errors.length ? 'border-red-300' : 'border-outline/20'
                  }`}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-error">{field.state.meta.errors.join(', ')}</p>
                )}
              </div>
            )}
          </passForm.Field>

          <passForm.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || passMutation.isPending}
                className="w-full py-2 px-4 bg-secondary hover:bg-secondary-hover text-white text-sm font-semibold rounded-input disabled:opacity-50 transition-colors"
              >
                {isSubmitting || passMutation.isPending ? 'Cambiando...' : 'Cambiar contraseña'}
              </button>
            )}
          </passForm.Subscribe>
        </form>
      </section>
    </div>
  );
};
