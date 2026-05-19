import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import { registerFn } from '@/features/auth/api';
import type { RegisterData } from '@/shared/types';

interface RegisterFormValues extends RegisterData {
  confirmPassword?: string;
}

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      nombre: '',
      apellido: '',
      telefono: '',
    },
    onSubmit: async ({ value }) => {
      setGlobalError(null);
      
      // Double check password match before sending
      if (value.password !== value.confirmPassword) {
        setGlobalError('Las contraseñas no coinciden');
        return;
      }

      try {
        const payload: RegisterData = {
          nombre: value.nombre,
          apellido: value.apellido,
          email: value.email,
          password: value.password,
        };
        
        if (value.telefono && value.telefono.trim() !== '') {
          payload.telefono = value.telefono.trim();
        }

        await registerFn(payload);
        setSuccess(true);
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } catch (err: any) {
        setGlobalError(
          err?.response?.data?.detail || 'Error al registrar el usuario'
        );
      }
    },
  });

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-surface via-primary/5 to-secondary/10 px-4">
        <div className="w-full max-w-md p-8 sm:p-10 text-center bg-white shadow-[0_8px_30px_rgb(109,78,159,0.08)] rounded-card border border-outline/5 transition-all duration-300">
          <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-tertiary/20">
            <svg
              className="w-8 h-8 text-tertiary animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold font-display text-tertiary mb-2">
            ¡Registro Exitoso!
          </h2>
          <p className="text-gray-500 font-sans text-sm">
            Tu cuenta ha sido creada correctamente. Redirigiendo al inicio de sesión...
          </p>
        </div>
      </div>
    );
  }

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
            Completa tus datos para crear tu cuenta
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
          className="space-y-5"
        >
          {/* Nombre y Apellido Grid */}
          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="nombre"
              validators={{
                onChange: ({ value }) => (!value ? 'Requerido' : undefined),
              }}
            >
              {(field) => {
                const hasError = !!field.state.meta.errors.length;
                return (
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700 font-sans">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={`block w-full px-3 py-2.5 border rounded-input bg-gray-50/50 text-on-surface placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 sm:text-sm font-sans ${
                        hasError
                          ? 'border-error focus:ring-error/20 focus:border-error'
                          : 'border-outline/30 focus:ring-primary/20 focus:border-primary'
                      }`}
                      placeholder="Juan"
                    />
                    {hasError && (
                      <p className="mt-1 text-xs text-error font-sans">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            <form.Field
              name="apellido"
              validators={{
                onChange: ({ value }) => (!value ? 'Requerido' : undefined),
              }}
            >
              {(field) => {
                const hasError = !!field.state.meta.errors.length;
                return (
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700 font-sans">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={`block w-full px-3 py-2.5 border rounded-input bg-gray-50/50 text-on-surface placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 sm:text-sm font-sans ${
                        hasError
                          ? 'border-error focus:ring-error/20 focus:border-error'
                          : 'border-outline/30 focus:ring-primary/20 focus:border-primary'
                      }`}
                      placeholder="Pérez"
                    />
                    {hasError && (
                      <p className="mt-1 text-xs text-error font-sans">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                );
              }}
            </form.Field>
          </div>

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
                  {hasError && (
                    <p className="mt-1 text-xs text-error font-sans">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Telefono Field */}
          <form.Field
            name="telefono"
            validators={{
              onChange: ({ value }) => {
                if (value && value.trim() !== '' && !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(value)) {
                  return 'Número de teléfono inválido';
                }
                return undefined;
              },
            }}
          >
            {(field) => {
              const hasError = !!field.state.meta.errors.length;
              return (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 font-sans">
                    Teléfono <span className="text-xs text-gray-400 font-normal">(Opcional)</span>
                  </label>
                  <input
                    type="tel"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`block w-full px-4 py-2.5 border rounded-input bg-gray-50/50 text-on-surface placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 sm:text-sm font-sans ${
                      hasError
                        ? 'border-error focus:ring-error/20 focus:border-error'
                        : 'border-outline/30 focus:ring-primary/20 focus:border-primary'
                    }`}
                    placeholder="+54 9 11 1234-5678"
                  />
                  {hasError && (
                    <p className="mt-1 text-xs text-error font-sans">
                      {field.state.meta.errors.join(', ')}
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
              onChange: ({ value }) => {
                if (!value) return 'La contraseña es requerida';
                if (value.length < 8) return 'Debe tener al menos 8 caracteres';
                return undefined;
              },
            }}
          >
            {(field) => {
              const hasError = !!field.state.meta.errors.length;
              return (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 font-sans">
                    Contraseña
                  </label>
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
                  {hasError && (
                    <p className="mt-1 text-xs text-error font-sans">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Confirm Password Field */}
          <form.Field
            name="confirmPassword"
            validators={{
              onChangeListenTo: ['password'],
              onChange: ({ value, fieldApi }) => {
                if (!value) return 'Confirmar contraseña es requerido';
                if (value !== fieldApi.form.state.values.password) {
                  return 'Las contraseñas no coinciden';
                }
                return undefined;
              },
            }}
          >
            {(field) => {
              const hasError = !!field.state.meta.errors.length;
              return (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 font-sans">
                    Confirmar Contraseña
                  </label>
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
                  {hasError && (
                    <p className="mt-1 text-xs text-error font-sans">
                      {field.state.meta.errors.join(', ')}
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
                {isSubmitting ? 'Registrando...' : 'Registrarse'}
              </button>
            )}
          </form.Subscribe>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 font-sans">
          ¿Ya tenés una cuenta?{' '}
          <Link
            to="/login"
            className="font-bold text-secondary hover:text-secondary-hover transition-colors font-display"
          >
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
};
