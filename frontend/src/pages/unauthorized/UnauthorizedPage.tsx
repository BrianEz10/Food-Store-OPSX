import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-surface-900 p-4">
      <div className="max-w-md text-center">
        <ShieldX className="size-16 mx-auto mb-4 text-red-500" />
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100 mb-2">
          Acceso denegado
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          No tenés permisos para acceder a esta sección.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
