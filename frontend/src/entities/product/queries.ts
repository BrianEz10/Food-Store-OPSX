import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { productKeys } from './queryKeys';
import type { Product, ProductFilters, ProductListResponse } from './types';

/**
 * Hook para listar productos del catálogo con filtros y paginación.
 * Usa el endpoint público GET /api/v1/productos.
 */
export function useProducts(filters: ProductFilters = {}) {
  const { skip = 0, limit = 12, categoria_id, search } = filters;

  return useQuery({
    queryKey: productKeys.list({ skip, limit, categoria_id, search }),
    queryFn: async (): Promise<ProductListResponse> => {
      const params: Record<string, string | number> = { skip, limit };
      if (categoria_id != null) params.categoria_id = categoria_id;
      if (search) params.search = search;

      const { data } = await api.get<ProductListResponse>('/api/v1/productos', { params });
      return data;
    },
  });
}

/**
 * Hook para obtener un producto por ID con todas sus relaciones.
 * Usa el endpoint público GET /api/v1/productos/:id.
 */
export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async (): Promise<Product> => {
      const { data } = await api.get<Product>(`/api/v1/productos/${id}`);
      return data;
    },
    enabled: id > 0,
  });
}
