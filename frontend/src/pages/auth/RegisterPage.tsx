import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import { registerFn } from '@/features/auth/api';
import type { RegisterData } from '@/shared/types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<RegisterData>({
    defaultValues: {
      email: '',
      password: '',
      nombre: '',
      apellido: '',
    },
    onSubmit: async ({ value }) => {
      setGlobalError(null);
      try {
        await registerFn(value);
        setSuccess(true);
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } catch (err: any) {
        setGlobalError(err?.response?.data?.detail || 'Error al registrar el usuario');
      }
    },
  });

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="w-full max-w-md p-8 text-center bg-white shadow-md rounded-card border border-outline/10">
          <h2 className="text-2xl font-bold font-display text-tertiary mb-2">¡Registro Exitoso!</h2>
          <p className="text-gray-600">Redirigiendo al inicio de sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-card border border-outline/10">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-display text-on-surface">Crear Cuenta</h1>
          <p className="mt-2 text-sm text-gray-600">
            Completa tus datos para registrarte
          </p>
        </div>

        {globalError && (
          <div className="p-4 text-sm text-error bg-error-light rounded-card border border-error/20">
            {globalError}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="nombre"
              validators={{
                onChange: ({ value }) => (!value ? 'Requerido' : undefined),
              }}
            >
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-input shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                      field.state.meta.errors.length ? 'border-error' : 'border-outline/20'
                    }`}
                  />
                  {field.state.meta.errors ? (
                    <p className="mt-1 text-xs text-error">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field
              name="apellido"
              validators={{
                onChange: ({ value }) => (!value ? 'Requerido' : undefined),
              }}
            >
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Apellido</label>
                  <input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border rounded-input shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                      field.state.meta.errors.length ? 'border-error' : 'border-outline/20'
                    }`}
                  />
                  {field.state.meta.errors ? (
                    <p className="mt-1 text-xs text-error">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? 'El email es requerido'
                  : !/^\S+@\S+\.\S+$/.test(value)
                  ? 'Formato de email inválido'
                  : undefined,
            }}
          >
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-input shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                    field.state.meta.errors.length ? 'border-error' : 'border-outline/20'
                  }`}
                  placeholder="tu@email.com"
                />
                {field.state.meta.errors ? (
                  <p className="mt-1 text-xs text-error">
                    {field.state.meta.errors.join(', ')}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'La contraseña es requerida';
                if (value.length < 8) return 'Debe tener al menos 8 caracteres';
                return undefined;
              },
            }}
          >
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-input shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                    field.state.meta.errors.length ? 'border-error' : 'border-outline/20'
                  }`}
                />
                {field.state.meta.errors ? (
                  <p className="mt-1 text-xs text-error">
                    {field.state.meta.errors.join(', ')}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-input shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Registrando...' : 'Registrarse'}
              </button>
            )}
          </form.Subscribe>
        </form>

        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-secondary hover:text-secondary-hover transition-colors">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};
