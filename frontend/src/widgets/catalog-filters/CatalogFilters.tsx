import { useQuery } from '@tanstack/react-query';
import { Pizza, Utensils, Coffee, Cookie, Leaf, Flame, Tag } from 'lucide-react';
import { api } from '@/shared/api';
import { cn } from '@/shared/lib';
import type { LucideIcon } from 'lucide-react';

interface Category {
  id: number;
  nombre: string;
}

interface CatalogFiltersProps {
  selectedCategoryId: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

const iconMap: Record<string, LucideIcon> = {
  pizza: Pizza,
  italiana: Pizza,
  pastas: Utensils,
  italiana_express: Utensils,
  milanesas: Utensils,
  cafe: Coffee,
  bebidas: Coffee,
  postres: Cookie,
  dulces: Cookie,
  ensaladas: Leaf,
  vegetariano: Leaf,
  vegano: Leaf,
  parrilla: Flame,
  grill: Flame,
  carnes: Flame,
};

function getCategoryIcon(nombre: string): LucideIcon {
  const key = nombre.toLowerCase().replace(/\s+/g, '_');
  return iconMap[key] ?? Tag;
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
          'rounded-chip px-4 py-1.5 text-sm font-medium transition-all',
          selectedCategoryId === null
            ? 'bg-primary text-white shadow-sm'
            : 'bg-surface-container text-on-surface/70 hover:bg-primary/10 hover:text-primary',
        )}
      >
        Todas
      </button>

      {categories?.map((cat) => {
        const Icon = getCategoryIcon(cat.nombre);
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-chip px-4 py-1.5 text-sm font-medium transition-all',
              selectedCategoryId === cat.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-container text-on-surface/70 hover:bg-primary/10 hover:text-primary',
            )}
          >
            <Icon className="size-4" />
            {cat.nombre}
          </button>
        );
      })}
    </div>
  );
}
