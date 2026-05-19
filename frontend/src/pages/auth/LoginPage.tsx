import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import { useAuthStore } from '@/shared/stores/auth-store';
import { loginFn, fetchMeFn } from '@/features/auth/api';
import type { LoginCredentials } from '@/shared/types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setGlobalError(null);
      try {
        const tokens = await loginFn(value);
        setTokens(tokens.access_token, tokens.refresh_token);
        
        const user = await fetchMeFn();
        setUser(user);
        
        const hasAdminRole = user.roles.some(r => ['ADMIN', 'STOCK', 'PEDIDOS'].includes(r));
        if (hasAdminRole) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } catch (err: any) {
        setGlobalError(err?.response?.data?.detail || 'Credenciales inválidas');
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-card border border-outline/10">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-display text-on-surface">Iniciar Sesión</h1>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa tus datos para acceder a tu cuenta
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
                  <p className="mt-1 text-sm text-error">
                    {field.state.meta.errors.join(', ')}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                !value ? 'La contraseña es requerida' : undefined,
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
                  <p className="mt-1 text-sm text-error">
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
                {isSubmitting ? 'Cargando...' : 'Entrar'}
              </button>
            )}
          </form.Subscribe>
        </form>

        <p className="text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-medium text-secondary hover:text-secondary-hover transition-colors">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};
