import { api } from './axios'
import { imgUrl } from './img'

export interface FormaPago {
  codigo: string
  descripcion: string
  habilitado: boolean
}

export async function fetchFormasPago(): Promise<FormaPago[]> {
  const { data } = await api.get('/formas-pago')
  return data
}

export interface CrearPedidoInput {
  forma_pago_codigo: string
  metodo_envio: string
  direccion_id?: number | null
  nombre_para?: string | null
  notas?: string | null
  items: { producto_id: number; cantidad: number; personalizacion?: number[] }[]
}

export async function createPedido(input: CrearPedidoInput) {
  const { data } = await api.post('/pedidos/', input)
  return data
}
