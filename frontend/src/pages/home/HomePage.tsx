import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, ImageOff } from 'lucide-react';
import { categoriasApi } from '@/features/categorias/api';
import { Pizza, Utensils, Flame, Cookie, Coffee, Leaf, ChevronRight, FolderTree } from 'lucide-react';
import { useProducts } from '@/entities/product';
import { getProductImage } from '@/shared/lib/product-images';
import { useCartStore, useUIStore } from '@/shared/stores';
import { ProductGrid } from '@/widgets/product-grid';

function getCategoryIcon(nombre: string) {
  const name = nombre.toLowerCase();
  if (/pizza|pizzas/.test(name)) return Pizza;
  if (/pasta|fideo|tallarin|raviol|agnolot/.test(name)) return Utensils;
  if (/parrill|carne|asado|bife|milanes|hamburg/.test(name)) return Flame;
  if (/postre|dulce|torta|pastel|helado|flan/.test(name)) return Cookie;
  if (/bebida|gaseosa|jugo|soda|agua|cerveza|vino|licor/.test(name)) return Coffee;
  if (/ensalada|verdura|vegetal|vegan|sano|verde/.test(name)) return Leaf;
  return FolderTree;
}

export function HomePage() {
  const { data: categoriasData, isLoading: catsLoading, isError: catsError } = useQuery({
    queryKey: ['categorias', 'homepage-list'],
    queryFn: () => categoriasApi.list(),
  });

  const { data: platosData, isLoading: platosLoading, isError: platosError, refetch: platosRefetch } = useProducts({ limit: 8 });

  // Hooks para el carrito
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useUIStore((s) => s.addToast);

  // Índice aleatorio — distinto en cada carga de página
  const featuredIndex = useMemo(
    () => Math.floor(Math.random() * (platosData?.data?.length || 1)),
    [platosData?.data?.length],
  );
  const featured = platosData?.data?.[featuredIndex] ?? platosData?.data?.[0] ?? null;

  const handleAddFeatured = () => {
    if (!featured) return;
    addItem({
      productoId: featured.id,
      nombre: featured.nombre,
      precio: featured.precio_base,
      cantidad: 1,
      imagenUrl: getProductImage(featured.nombre, featured.imagen_url) || '',
      exclusiones: [],
    });
    addToast({ type: 'success', title: `${featured.nombre} agregado al carrito` });
  };

  return (
    <div className="flex flex-col gap-12 -mt-4">

      {/* ═══════════════════════════════════════════
         Featured dish — hero con imagen + detalles
         ═══════════════════════════════════════════ */}
      {!platosLoading && featured && (
        <section className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-xl bg-surface-container p-6 sm:p-8 border border-outline-variant">
            {/* Left — image */}
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-surface-container-high">
              {(() => {
                const imgSrc = getProductImage(featured.nombre, featured.imagen_url);
                return imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={featured.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-on-surface-variant">
                    <ImageOff className="size-16" />
                  </div>
                );
              })()}
            </div>

            {/* Right — info */}
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-on-surface leading-tight">
                {featured.nombre}
              </h2>

              {/* Categories */}
              {featured.categorias && featured.categorias.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {featured.categorias.map((cat: { id: number; nombre: string }) => (
                    <span
                      key={cat.id}
                      className="rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary"
                    >
                      {cat.nombre}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {featured.descripcion && (
                <p className="text-on-surface-variant leading-relaxed text-sm sm:text-base">
                  {featured.descripcion}
                </p>
              )}

              {/* Ingredients */}
              {featured.ingredientes && featured.ingredientes.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">
                    Ingredientes
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {featured.ingredientes.map((ing: { id: number; nombre: string }) => (
                      <span
                        key={ing.id}
                        className="rounded-full bg-surface-container-high px-3 py-1 text-xs text-on-surface"
                      >
                        {ing.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price + add to cart */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-2xl font-bold text-primary">
                  ${featured.precio_base.toFixed(2)}
                </span>
                <button
                  onClick={handleAddFeatured}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors active:scale-95"
                >
                  <ShoppingCart className="size-4" />
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Platos del Día Section */}
      <section className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-on-surface mb-8 text-center">
          Platos del Día
        </h2>
        <ProductGrid
          variant="carousel"
          products={platosData?.data ?? []}
          isLoading={platosLoading}
          isError={platosError}
          onRetry={() => platosRefetch()}
        />
      </section>

      {/* Categories Section */}
      <section className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-on-surface mb-8 text-center">
          Categorías
        </h2>

        {catsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-card bg-white border border-outline/10 p-6 flex flex-col items-center gap-3">
                <div className="size-12 rounded-full bg-gray-200" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : catsError ? (
          <p className="text-center text-on-surface/60 py-8">
            No pudimos cargar las categorías. Intentalo de nuevo más tarde.
          </p>
        ) : categoriasData?.data ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoriasData.data.slice(0, 6).map((cat) => {
              const Icon = getCategoryIcon(cat.nombre);
              return (
                <Link
                  key={cat.id}
                  to={`/catalogo?categoria_id=${cat.id}`}
                  className="rounded-card bg-white border border-outline/10 p-6 flex flex-col items-center gap-3 hover:border-primary/30 hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <div className="size-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                    <Icon className="size-6" />
                  </div>
                  <span className="text-sm font-medium text-on-surface text-center leading-tight">
                    {cat.nombre}
                  </span>
                </Link>
              );
            })}
          </div>
        ) : null}

        {categoriasData?.data && categoriasData.total > 6 && (
          <div className="mt-8 text-center">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              Ver todas las categorías
              <ChevronRight className="size-4" />
            </Link>
          </div>
        )}
      </section>

    </div>
  );
}
