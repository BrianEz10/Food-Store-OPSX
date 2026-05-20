import { useRef, useEffect, useState } from 'react';
import { SearchX, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/lib';
import { ProductCard } from '@/widgets/product-card';
import type { ProductListItem } from '@/entities/product';

interface ProductGridProps {
  products: ProductListItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  variant?: 'grid' | 'carousel';
}

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-card border border-outline/10 bg-white dark:border-gray-700 dark:bg-gray-800 animate-pulse">
      <div className="aspect-[4/3] rounded-t-[8px] bg-surface-container dark:bg-gray-700" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-4 w-3/4 rounded bg-surface-container dark:bg-gray-700" />
        <div className="h-3 w-full rounded bg-surface-container/60 dark:bg-gray-700" />
        <div className="mt-2 h-5 w-1/3 rounded bg-surface-container dark:bg-gray-700" />
      </div>
    </div>
  );
}

export function ProductGrid({ products, isLoading, isError, onRetry, variant = 'grid' }: ProductGridProps) {
  const isCarousel = variant === 'carousel';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play carousel
  useEffect(() => {
    if (!isCarousel || products.length === 0) return;

    const interval = setInterval(() => {
      if (isPaused || !scrollRef.current) return;

      const container = scrollRef.current;
      if (container.children.length === 0) return;

      const cardWidth = container.children[0].getBoundingClientRect().width;
      const gap = 16; // gap-4
      const step = cardWidth + gap;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll - 5) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isCarousel, products.length, isPaused]);

  // Loading state
  if (isLoading) {
    return (
      <div className={isCarousel ? 'flex gap-4 overflow-x-auto pb-2 scrollbar-hide' : 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}>
        {Array.from({ length: isCarousel ? 4 : 8 }).map((_, i) => (
          <div key={i} className={isCarousel ? 'w-[260px] sm:w-[280px] shrink-0' : ''}>
            <SkeletonCard />
          </div>
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

  // Products carousel
  if (isCarousel) {
    return (
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {products.map((product) => (
          <div key={product.id} className="w-[260px] sm:w-[280px] shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
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
