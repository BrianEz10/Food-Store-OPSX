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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-surface via-primary/5 to-secondary/10 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 sm:p-10 space-y-8 bg-white shadow-[0_8px_30px_rgb(109,78,159,0.08)] rounded-card border border-outline/5 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(109,78,159,0.12)]">
        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-4 border border-primary/10 shadow-sm transition-transform duration-300 hover:scale-105">
            <svg
              className="w-8 h-8 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v2M12 18h9A2 2 0 0 0 21 16H3a2 2 0 0 0 0 2h9z" />
              <path d="M3 16a9 9 0 0 1 18 0" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-on-surface">
            Food <span className="text-primary font-bold">Store</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-sans">
            Ingresá tus credenciales para acceder a tu cuenta
          </p>
        </div>

        {/* Global Error Alert */}
        {globalError && (
          <div className="p-4 text-sm text-error bg-error-light rounded-card border border-error/20 flex items-center space-x-2 font-sans animate-fade-in">
            <svg
              className="w-5 h-5 text-error shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{globalError}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Email Field */}
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
            {(field) => {
              const hasError = !!field.state.meta.errors.length;
              return (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 font-sans">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={`block w-full px-4 py-2.5 border rounded-input bg-gray-50/50 text-on-surface placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 sm:text-sm font-sans ${
                        hasError
                          ? 'border-error focus:ring-error/20 focus:border-error'
                          : 'border-outline/30 focus:ring-primary/20 focus:border-primary'
                      }`}
                      placeholder="tu@email.com"
                    />
                  </div>
                  {hasError && (
                    <p className="mt-1 text-xs text-error font-sans flex items-center space-x-1">
                      <span>{field.state.meta.errors.join(', ')}</span>
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Password Field */}
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                !value ? 'La contraseña es requerida' : undefined,
            }}
          >
            {(field) => {
              const hasError = !!field.state.meta.errors.length;
              return (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 font-sans">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={`block w-full px-4 py-2.5 border rounded-input bg-gray-50/50 text-on-surface placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 sm:text-sm font-sans ${
                        hasError
                          ? 'border-error focus:ring-error/20 focus:border-error'
                          : 'border-outline/30 focus:ring-primary/20 focus:border-primary'
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {hasError && (
                    <p className="mt-1 text-xs text-error font-sans flex items-center space-x-1">
                      <span>{field.state.meta.errors.join(', ')}</span>
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Submit Button */}
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-input shadow-md text-base font-semibold font-display text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                {isSubmitting ? 'Cargando...' : 'Iniciar Sesión'}
              </button>
            )}
          </form.Subscribe>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 font-sans">
          ¿No tenés una cuenta?{' '}
          <Link
            to="/register"
            className="font-bold text-secondary hover:text-secondary-hover transition-colors font-display"
          >
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
};
