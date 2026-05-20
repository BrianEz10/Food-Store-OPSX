import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '@/entities/product';
import { CatalogFilters } from '@/widgets/catalog-filters';
import { SearchBar } from '@/widgets/search-bar';
import { ProductGrid } from '@/widgets/product-grid';
import { Pagination } from '@/widgets/pagination';

const PAGE_SIZE = 12;

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read filters from URL
  const search = searchParams.get('search') ?? '';
  const categoria_id = searchParams.get('categoria_id')
    ? Number(searchParams.get('categoria_id'))
    : null;
  const page = Number(searchParams.get('page') ?? '1');
  const skip = (page - 1) * PAGE_SIZE;

  // Fetch products
  const { data, isLoading, isError, refetch } = useProducts({
    skip,
    limit: PAGE_SIZE,
    categoria_id,
    search: search || undefined,
  });

  const products = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Update a single param while preserving others
  const updateParam = useCallback(
    (key: string, value: string | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === null || value === '') {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        // Reset to page 1 when filters change
        if (key !== 'page') {
          next.delete('page');
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const handleCategoryChange = useCallback(
    (categoryId: number | null) => {
      updateParam('categoria_id', categoryId?.toString() ?? null);
    },
    [updateParam],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      updateParam('search', value || null);
    },
    [updateParam],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateParam('page', newPage > 1 ? newPage.toString() : null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [updateParam],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-on-surface">
          Catálogo
        </h1>
        <p className="mt-1 text-sm text-on-surface/60 dark:text-gray-400">
          Explorá nuestros productos
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4">
        <SearchBar value={search} onChange={handleSearchChange} />
        <CatalogFilters
          selectedCategoryId={categoria_id}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Results count */}
      {!isLoading && !isError && (
        <p className="text-sm text-on-surface/60 dark:text-gray-400">
          {total} producto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
        </p>
      )}

      {/* Product grid */}
      <ProductGrid
        products={products}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
