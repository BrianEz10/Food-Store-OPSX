import { useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/shared/lib';
import { useUIStore } from '@/shared/stores';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

/** El proyecto tiene paleta de colores custom (tailwind.config.js).
 *  No existen slate, green, red, blue, yellow — usamos gray y los
 *  colores semánticos del proyecto (primary, tertiary, error, secondary). */
const colorMap = {
  success:
    'border-tertiary bg-gray-50 dark:bg-gray-800 dark:border-tertiary',
  error: 'border-error bg-gray-50 dark:bg-gray-800 dark:border-error',
  info: 'border-primary bg-gray-50 dark:bg-gray-800 dark:border-primary',
  warning:
    'border-secondary bg-gray-50 dark:bg-gray-800 dark:border-secondary',
};

const iconColorMap = {
  success: 'text-tertiary',
  error: 'text-error',
  info: 'text-primary',
  warning: 'text-secondary',
};

function ToastItem({
  id,
  title,
  description,
  type,
  duration,
}: {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}) {
  const removeToast = useUIStore((s) => s.removeToast);
  const Icon = iconMap[type];

  // Auto-dismiss
  useEffect(() => {
    if (duration === 0) return;
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration || 3000);
    return () => clearTimeout(timer);
  }, [id, duration, removeToast]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 w-80 p-4 rounded-lg border-l-4 shadow-lg',
        'animate-slide-in-right',
        colorMap[type],
      )}
      role="alert"
    >
      <Icon className={cn('size-5 shrink-0 mt-0.5', iconColorMap[type])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </p>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
            {description}
          </p>
        )}
      </div>
      <button
        onClick={() => removeToast(id)}
        className="shrink-0 p-0.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        aria-label="Cerrar notificación"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem {...toast} />
        </div>
      ))}
    </div>
  );
}
