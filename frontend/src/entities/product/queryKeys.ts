/**
 * Query keys para productos.
 * Siguen la convención de TanStack Query para invalidación selectiva.
 */
export const productKeys = {
  all: ['productos'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};
