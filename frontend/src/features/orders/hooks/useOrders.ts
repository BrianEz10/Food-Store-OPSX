import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import * as orderService from '@/features/orders/services/orderService'
import type { CrearPedidoInput } from '@/lib/cajero'

export function useOrders(page = 1, size = 50) {
  return useQuery({
    queryKey: [...queryKeys.orders, { page, size }],
    queryFn: () => orderService.getOrders(page, size),
  })
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CrearPedidoInput) => orderService.createOrder(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.orders })
    },
  })
}

export function useCancelOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) => orderService.cancelOrder(id, motivo),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.orders })
      qc.invalidateQueries({ queryKey: queryKeys.order(id) })
    },
  })
}
