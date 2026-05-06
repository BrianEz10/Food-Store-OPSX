export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/token',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  PRODUCTS: '/products',
  ORDERS: '/orders',
  CHECKOUT: '/checkout',
} as const;

export const QUERY_KEYS = {
  USER: 'user',
  PRODUCTS: 'products',
  PRODUCT_DETAIL: 'product-detail',
  ORDERS: 'orders',
} as const;

export const STORAGE_KEYS = {
  CART: 'food-store-cart',
  THEME: 'food-store-theme',
} as const;
