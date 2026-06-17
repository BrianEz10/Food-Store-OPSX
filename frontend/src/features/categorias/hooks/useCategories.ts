import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import * as categoriesService from '@/features/categorias/services/categoriesService'

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesService.getCategories,
  })
}
