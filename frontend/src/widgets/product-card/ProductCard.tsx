import { Link } from 'react-router-dom';
import { ImageOff } from 'lucide-react';
import { cn } from '@/shared/lib';
import type { ProductListItem } from '@/entities/product';

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const { id, nombre, descripcion, imagen_url, precio_base } = product;

  return (
    <Link
      to={`/producto/${id}`}
      className={cn(
        'group flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition-all',
        'hover:shadow-md hover:border-primary-200',
        'dark:border-slate-700 dark:bg-surface-800 dark:hover:border-primary-600',
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-slate-100 dark:bg-slate-800">
        {imagen_url ? (
          <img
            src={imagen_url}
            alt={nombre}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300 dark:text-slate-600">
            <ImageOff className="size-10" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2">
          {nombre}
        </h3>

        {descripcion && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            {descripcion}
          </p>
        )}

        <div className="mt-auto pt-2">
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            ${precio_base.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
