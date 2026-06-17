import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import * as directionsService from '@/features/direcciones/services/directionsService'
import type { DireccionInput } from '@/features/direcciones/services/directionsService'

export function useDirections() {
  return useQuery({
    queryKey: queryKeys.directions,
    queryFn: directionsService.getDirections,
  })
}

export function useCreateDirection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: DireccionInput) => directionsService.createDirection(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.directions }),
  })
}

export function useUpdateDirection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: DireccionInput }) => directionsService.updateDirection(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.directions }),
  })
}

export function useSetPrincipal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => directionsService.setPrincipal(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.directions }),
  })
}

export function useDeleteDirection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => directionsService.deleteDirection(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.directions }),
  })
}
