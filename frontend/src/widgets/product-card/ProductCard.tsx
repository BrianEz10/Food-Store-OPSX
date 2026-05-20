import { Link } from 'react-router-dom';
import { ImageOff, ShoppingCart } from 'lucide-react';
import { cn } from '@/shared/lib';
import { useCartStore, useUIStore } from '@/shared/stores';
import type { ProductListItem } from '@/entities/product';

interface ProductCardProps {
  product: ProductListItem;
}

const ES_NUEVO_DIAS = 7;

function isRecentlyCreated(creadoEn: string): boolean {
  const creado = Date.parse(creadoEn);
  if (isNaN(creado)) return false;
  const ahora = Date.now();
  const diffMs = ahora - creado;
  return diffMs >= 0 && diffMs < ES_NUEVO_DIAS * 24 * 60 * 60 * 1000;
}

export function ProductCard({ product }: ProductCardProps) {
  const { id, nombre, descripcion, imagen_url, precio_base, stock_cantidad, disponible, creado_en } = product;
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useUIStore((s) => s.addToast);

  const esNuevo = isRecentlyCreated(creado_en);
  const hayStock = disponible && stock_cantidad > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productoId: id,
      nombre,
      precio: precio_base,
      cantidad: 1,
      imagenUrl: imagen_url || '',
      exclusiones: [],
    });
    addToast({ type: 'success', message: 'Producto agregado al carrito' });
  };

  return (
    <Link
      to={`/producto/${id}`}
      className={cn(
        'group flex flex-col rounded-card border border-outline/10 bg-white shadow-sm transition-all',
        'hover:shadow-md hover:border-primary/30',
        'dark:border-slate-700 dark:bg-surface-800 dark:hover:border-primary/50',
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-[8px] bg-surface-container dark:bg-slate-800">
        {imagen_url ? (
          <img
            src={imagen_url}
            alt={nombre}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-outline/40 dark:text-slate-600">
            <ImageOff className="size-10" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {esNuevo && (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
              Nuevo
            </span>
          )}
          {hayStock ? (
            <span className="rounded-full bg-tertiary px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
              Disponible
            </span>
          ) : (
            <span className="rounded-full bg-error px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
              Sin stock
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className={cn(
            'absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-full',
            'bg-primary px-3 py-1.5 text-xs font-medium text-white shadow',
            'hover:bg-primary-hover transition-colors',
            'opacity-0 group-hover:opacity-100',
          )}
        >
          <ShoppingCart className="size-3.5" />
          Agregar
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="font-display font-semibold text-on-surface dark:text-slate-100 line-clamp-2">
          {nombre}
        </h3>

        {descripcion && (
          <p className="text-xs text-outline/60 dark:text-slate-400 line-clamp-2">
            {descripcion}
          </p>
        )}

        <div className="mt-auto pt-2">
          <span className="text-lg font-bold text-primary dark:text-primary-400">
            ${precio_base.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
