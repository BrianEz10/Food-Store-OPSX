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

const colorMap = {
  success: 'border-green-500 bg-green-50 dark:bg-green-900/20',
  error: 'border-red-500 bg-red-50 dark:bg-red-900/20',
  info: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
  warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
};

const iconColorMap = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-yellow-500',
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
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </p>
        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            {description}
          </p>
        )}
      </div>
      <button
        onClick={() => removeToast(id)}
        className="shrink-0 p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
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
