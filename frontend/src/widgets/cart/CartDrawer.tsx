import { Link } from 'react-router-dom';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { cn } from '@/shared/lib';
import { useCartStore } from '@/shared/stores';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white dark:bg-surface-900 shadow-2xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Carrito
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <ShoppingCart className="size-12 text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tu carrito está vacío
            </p>
            <Link
              to="/catalogo"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors"
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((item) => (
                <div key={`${item.productoId}-${JSON.stringify(item.exclusiones)}`} className="flex gap-3 p-4">
                  <div className="size-16 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {item.imagenUrl ? (
                      <img
                        src={item.imagenUrl}
                        alt={item.nombre}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center size-full text-slate-300 dark:text-slate-600">
                        <ShoppingCart className="size-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                      {item.nombre}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      ${item.precio.toFixed(2)}
                    </p>
                    {item.exclusiones.length > 0 && (
                      <span className="inline-block mt-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                        Personalizado
                      </span>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productoId, item.cantidad - 1, item.exclusiones)}
                        className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-6 text-center">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productoId, item.cantidad + 1, item.exclusiones)}
                        className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Plus className="size-3.5" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productoId, item.exclusiones)}
                        className="ml-auto p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Total</span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  ${total.toFixed(2)}
                </span>
              </div>
              <Link
                to="/carrito"
                onClick={onClose}
                className={cn(
                  'block w-full text-center py-2.5 rounded-lg text-sm font-medium',
                  'bg-primary-500 text-white hover:bg-primary-600 transition-colors',
                )}
              >
                Ver carrito completo
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
