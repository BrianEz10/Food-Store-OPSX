export const queryKeys = {
  products: ['products'] as const,
  product: (id: number) => ['product', id] as const,
  categories: ['categories'] as const,
  orders: ['orders'] as const,
  order: (id: number) => ['order', id] as const,
  directions: ['directions'] as const,
  formasPago: ['formas-pago'] as const,
}
