import { Link } from 'react-router-dom';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { cn } from '@/shared/lib';
import { getProductImage } from '@/shared/lib/product-images';
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
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-surface-container dark:bg-gray-800 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-outline/20 dark:border-gray-700">
          <h2 className="text-lg font-bold font-display text-on-surface dark:text-gray-100">
            Carrito
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <ShoppingCart className="size-12 text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tu carrito está vacío
            </p>
            <Link
              to="/catalogo"
              onClick={onClose}
              className="px-4 py-2 rounded-input text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto divide-y divide-outline/10 dark:divide-gray-700">
              {items.map((item) => (
                <div key={`${item.productoId}-${JSON.stringify(item.exclusiones)}`} className="flex gap-3 p-4">
                  <div className="size-16 shrink-0 rounded-card bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    {(() => {
                      const src = item.imagenUrl || getProductImage(item.nombre);
                      return src ? (
                        <img
                          src={src}
                          alt={item.nombre}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center size-full text-gray-300 dark:text-gray-500">
                          <ShoppingCart className="size-6" />
                        </div>
                      );
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface dark:text-gray-100 truncate">
                      {item.nombre}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${item.precio.toFixed(2)}
                    </p>
                    {item.exclusiones.length > 0 && (
                      <span className="inline-block mt-1 rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-200">
                        Personalizado
                      </span>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productoId, item.cantidad - 1, item.exclusiones)}
                        className="p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-6 text-center">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productoId, item.cantidad + 1, item.exclusiones)}
                        className="p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Plus className="size-3.5" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productoId, item.exclusiones)}
                        className="ml-auto p-1 rounded text-gray-400 hover:text-error hover:bg-error-light dark:hover:bg-gray-700 transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-outline/20 dark:border-gray-700 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total</span>
                <span className="text-lg font-bold text-on-surface dark:text-gray-100">
                  ${total.toFixed(2)}
                </span>
              </div>
              <Link
                to="/carrito"
                onClick={onClose}
                className={cn(
                  'block w-full text-center py-2.5 rounded-input text-sm font-medium',
                  'bg-primary text-white hover:bg-primary-hover transition-colors',
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
