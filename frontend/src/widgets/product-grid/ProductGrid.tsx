import { PackageOpen, SearchX, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/lib';
import { ProductCard } from '@/widgets/product-card';
import type { ProductListItem } from '@/entities/product';

interface ProductGridProps {
  products: ProductListItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-card border border-outline/10 bg-white dark:border-slate-700 dark:bg-surface-800 animate-pulse">
      <div className="aspect-[4/3] rounded-t-[8px] bg-surface-container dark:bg-slate-700" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-4 w-3/4 rounded bg-surface-container dark:bg-slate-700" />
        <div className="h-3 w-full rounded bg-surface-container/60 dark:bg-slate-700" />
        <div className="mt-2 h-5 w-1/3 rounded bg-surface-container dark:bg-slate-700" />
      </div>
    </div>
  );
}

export function ProductGrid({ products, isLoading, isError, onRetry }: ProductGridProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <AlertCircle className="size-14 text-error/40" />
        <div>
          <p className="text-lg font-display font-semibold text-on-surface">
            Error al cargar productos
          </p>
          <p className="mt-1 text-sm text-on-surface/60">
            No pudimos obtener el catálogo. Intentá de nuevo.
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className={cn(
              'rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white shadow-sm',
              'hover:bg-primary-hover transition-colors',
            )}
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <SearchX className="size-14 text-outline/40" />
        <div>
          <p className="text-lg font-display font-semibold text-on-surface">
            No hay productos disponibles
          </p>
          <p className="mt-1 text-sm text-on-surface/60">
            Probá ajustando los filtros o volvé más tarde.
          </p>
        </div>
      </div>
    );
  }

  // Products grid
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
