import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { cn } from '@/shared/lib';

interface Category {
  id: number;
  nombre: string;
}

interface CatalogFiltersProps {
  selectedCategoryId: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

export function CatalogFilters({ selectedCategoryId, onCategoryChange }: CatalogFiltersProps) {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categorias', 'list'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Category[] }>('/api/v1/categorias');
      return data.data;
    },
  });

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange(null)}
        className={cn(
          'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
          selectedCategoryId === null
            ? 'bg-primary-500 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
        )}
      >
        Todas
      </button>

      {categories?.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            selectedCategoryId === cat.id
              ? 'bg-primary-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
          )}
        >
          {cat.nombre}
        </button>
      ))}
    </div>
  );
}
