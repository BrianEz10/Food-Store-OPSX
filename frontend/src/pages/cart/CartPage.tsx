import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
} from 'lucide-react';
import { cn } from '@/shared/lib';
import { getProductImage } from '@/shared/lib/product-images';
import { useCartStore, useUIStore } from '@/shared/stores';

export function CartPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const addToast = useUIStore((s) => s.addToast);
  const openModal = useUIStore((s) => s.openModal);
  const closeModal = useUIStore((s) => s.closeModal);
  const activeModal = useUIStore((s) => s.activeModal);

  const showClearConfirm =
    activeModal.isOpen && activeModal.type === 'confirm-clear-cart';

  const handleClearCart = () => {
    clearCart();
    closeModal();
    addToast({ type: 'success', title: 'Carrito vaciado' });
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <ShoppingCart className="size-16 text-gray-300 dark:text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Tu carrito está vacío
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Agregá productos desde nuestro catálogo
          </p>
          <Link
            to="/catalogo"
            className={cn(
              'mt-2 rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-medium text-white',
              'hover:bg-primary-600 transition-colors',
            )}
          >
            Explorar productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/catalogo"
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Carrito de Compras
        </h1>
      </div>

      {/* Items list */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        {items.map((item) => {
          const subtotal = item.precio * item.cantidad;
          return (
            <div
              key={`${item.productoId}-${JSON.stringify(item.exclusiones)}`}
              className="flex items-start gap-4 p-4"
            >
              {/* Image */}
              <div className="size-16 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {(() => {
                  const src = item.imagenUrl || getProductImage(item.nombre);
                  return src ? (
                    <img
                      src={src}
                      alt={item.nombre}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center size-full text-gray-300 dark:text-gray-600">
                      <ShoppingCart className="size-6" />
                    </div>
                  );
                })()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      {item.nombre}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                      ${item.precio.toFixed(2)}
                    </p>
                    {item.exclusiones.length > 0 && (
                      <span className="inline-block mt-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
                        Personalizado
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 shrink-0">
                    ${subtotal.toFixed(2)}
                  </p>
                </div>

                {/* Quantity controls + remove */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productoId,
                        item.cantidad - 1,
                        item.exclusiones,
                      )
                    }
                    className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productoId,
                        item.cantidad + 1,
                        item.exclusiones,
                      )
                    }
                    className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Plus className="size-4" />
                  </button>
                  <button
                    onClick={() =>
                      removeItem(item.productoId, item.exclusiones)
                    }
                    className="ml-2 p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-gray-700 dark:text-gray-300">
            Total general
          </span>
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
            ${total.toFixed(2)}
          </span>
        </div>

        <button
          disabled
          title="Próximamente"
          className={cn(
            'w-full py-2.5 rounded-lg text-sm font-medium',
            'bg-primary-500 text-white',
            'opacity-50 cursor-not-allowed',
          )}
        >
          Proceder al checkout
        </button>
      </div>

      {/* Vaciar carrito */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => openModal('confirm-clear-cart')}
          className="text-sm font-medium text-red-500 hover:text-red-600 hover:underline transition-colors"
        >
          Vaciar carrito
        </button>
      </div>

      {/* Confirmation modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Vaciar carrito
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              ¿Estás seguro de vaciar el carrito?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearCart}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Sí, vaciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
