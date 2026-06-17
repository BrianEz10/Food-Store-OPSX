import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import * as formasPagoService from '@/features/formas-pago/services/formasPagoService'

export function useFormasPago() {
  return useQuery({
    queryKey: queryKeys.formasPago,
    queryFn: formasPagoService.getFormasPago,
  })
}
