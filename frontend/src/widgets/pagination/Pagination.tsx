import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const maxVisible = 5;

  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Paginación">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          currentPage <= 1
            ? 'text-outline/40 cursor-not-allowed dark:text-slate-600'
            : 'text-on-surface/70 hover:bg-surface-container dark:text-slate-300 dark:hover:bg-slate-800',
        )}
      >
        <ChevronLeft className="size-4" />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            'flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            page === currentPage
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface/70 hover:bg-surface-container dark:text-slate-300 dark:hover:bg-slate-800',
          )}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          currentPage >= totalPages
            ? 'text-outline/40 cursor-not-allowed dark:text-slate-600'
            : 'text-on-surface/70 hover:bg-surface-container dark:text-slate-300 dark:hover:bg-slate-800',
        )}
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
