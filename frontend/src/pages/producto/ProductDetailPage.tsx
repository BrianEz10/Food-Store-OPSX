import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ImageOff, AlertTriangle, ShoppingCart } from 'lucide-react';
import { useProduct } from '@/entities/product';
import { cn } from '@/shared/lib';
import { useCartStore, useUIStore } from '@/shared/stores';

function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-8 w-32 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-[4/3] rounded-xl bg-slate-200 dark:bg-slate-700" />
        <div className="flex flex-col gap-4">
          <div className="h-8 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-700" />
          <div className="h-4 w-2/3 rounded bg-slate-100 dark:bg-slate-700" />
          <div className="mt-4 h-10 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { data: product, isLoading, isError, refetch } = useProduct(productId);

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <DetailSkeleton />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <AlertTriangle className="size-12 text-red-400" />
          <div>
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
              Error al cargar el producto
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No pudimos obtener la información. Intentá de nuevo.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className={cn(
              'rounded-input bg-primary px-4 py-2 text-sm font-medium text-white',
              'hover:bg-primary-hover transition-colors',
            )}
          >
            Reintentar
          </button>
          <Link
            to="/catalogo"
            className="text-sm font-medium text-primary hover:text-primary-hover dark:text-primary-400"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  // Not found
  if (!product) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <AlertTriangle className="size-12 text-slate-300 dark:text-slate-600" />
          <div>
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
              Producto no encontrado
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              El producto que buscás no existe o fue eliminado.
            </p>
          </div>
          <Link
            to="/catalogo"
            className={cn(
              'rounded-input bg-primary px-4 py-2 text-sm font-medium text-white',
              'hover:bg-primary-hover transition-colors',
            )}
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const { nombre, descripcion, imagen_url, precio_base, categorias, ingredientes } = product;
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useUIStore((s) => s.addToast);
  const [selectedExclusiones, setSelectedExclusiones] = useState<number[]>([]);

  const toggleExclusion = (ingId: number) => {
    setSelectedExclusiones((prev) =>
      prev.includes(ingId) ? prev.filter((id) => id !== ingId) : [...prev, ingId]
    );
  };

  const handleAddToCart = () => {
    addItem({
      productoId: product.id,
      nombre: product.nombre,
      precio: product.precio_base,
      cantidad: 1,
      imagenUrl: product.imagen_url || '',
      exclusiones: selectedExclusiones,
    });
    addToast({ type: 'success', message: 'Producto agregado al carrito' });
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Back button */}
      <Link
        to="/catalogo"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover dark:text-primary-400"
      >
        <ArrowLeft className="size-4" />
        Volver al catálogo
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Product image */}
        <div className="aspect-[4/3] overflow-hidden rounded-card bg-slate-100 dark:bg-slate-800">
          {imagen_url ? (
            <img
              src={imagen_url}
              alt={nombre}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300 dark:text-slate-600">
              <ImageOff className="size-16" />
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold font-display text-on-surface dark:text-slate-100">
            {nombre}
          </h1>

          {/* Categories */}
          {categorias && categorias.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <span
                  key={cat.id}
                  className="rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary dark:bg-primary-900/30 dark:text-primary-300"
                >
                  {cat.nombre}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <p className="text-3xl font-bold text-primary dark:text-primary-400">
            ${precio_base.toFixed(2)}
          </p>

          {/* Description */}
          {descripcion && (
            <div>
              <h2 className="mb-1 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Descripción
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {descripcion}
              </p>
            </div>
          )}

          {/* Ingredients */}
          {ingredientes && ingredientes.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Ingredientes
              </h2>
              <ul className="space-y-1">
                {ingredientes.map((ing) => (
                  <li
                    key={ing.id}
                    className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span className="size-1.5 rounded-full bg-slate-400" />
                    <span>{ing.nombre}</span>
                    {ing.es_removible && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                        Removible
                      </span>
                    )}
                    {ing.es_alergeno && (
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
                        Alérgeno
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No ingredients */}
          {(!ingredientes || ingredientes.length === 0) && (
            <div>
              <h2 className="mb-1 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Ingredientes
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Sin ingredientes adicionales
              </p>
            </div>
          )}

          {/* Customization: removable ingredients */}
          {ingredientes && ingredientes.some((ing) => ing.es_removible) && (
            <div>
              <h2 className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Personalizar producto
              </h2>
              <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                Desmarcá los ingredientes que querés excluir
              </p>
              <div className="space-y-1.5">
                {ingredientes
                  .filter((ing) => ing.es_removible)
                  .map((ing) => (
                    <label
                      key={ing.id}
                      className="flex cursor-pointer items-center gap-2 rounded-card border border-outline/10 px-3 py-2 text-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
                    >
                      <input
                        type="checkbox"
                        checked={!selectedExclusiones.includes(ing.id)}
                        onChange={() => toggleExclusion(ing.id)}
                        className="size-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600"
                      />
                      <span className="text-slate-700 dark:text-slate-300">{ing.nombre}</span>
                      {ing.es_alergeno && (
                        <span className="ml-auto rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
                          Alérgeno
                        </span>
                      )}
                    </label>
                  ))}
              </div>
            </div>
          )}

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            className={cn(
              'mt-2 inline-flex w-full items-center justify-center gap-2 rounded-input',
              'bg-primary px-6 py-3 text-sm font-semibold text-white',
              'hover:bg-primary-hover transition-colors',
            )}
          >
            <ShoppingCart className="size-5" />
            Agregar al carrito — ${precio_base.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
