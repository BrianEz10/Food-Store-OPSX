import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import * as productService from '@/features/productos/services/productService'

export function useProducts(params?: { page?: number; size?: number; categoria_id?: number; disponible?: boolean; buscar?: string }) {
  return useQuery({
    queryKey: [...queryKeys.products, params],
    queryFn: () => productService.getProducts(params),
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  })
}
