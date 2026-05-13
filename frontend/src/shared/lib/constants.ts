import {
  Home,
  Store,
  User,
  MapPin,
  LayoutDashboard,
  FolderTree,
  Wheat,
  Users,
  ShoppingCart,
  ClipboardList,
  Package,
  type LucideIcon,
} from 'lucide-react';
import type { NavItem } from '@/shared/types';

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

/**
 * Navigation items for the app layout.
 * Each item defines the label, path, icon, and which roles can see it.
 * Roles = ['*'] means visible to all (including anonymous).
 */
export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Catálogo',
    path: '/catalogo',
    icon: Store as LucideIcon,
    roles: ['*'],
  },
  {
    label: 'Inicio',
    path: '/',
    icon: Home as LucideIcon,
    roles: ['*'],
  },
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard as LucideIcon,
    roles: ['ADMIN', 'STOCK', 'PEDIDOS'],
  },
  {
    label: 'Categorías',
    path: '/admin/categorias',
    icon: FolderTree as LucideIcon,
    roles: ['STOCK', 'ADMIN'],
  },
  {
    label: 'Ingredientes',
    path: '/admin/ingredientes',
    icon: Wheat as LucideIcon,
    roles: ['STOCK', 'ADMIN'],
  },
  {
    label: 'Productos',
    path: '/admin/productos',
    icon: Package as LucideIcon,
    roles: ['STOCK', 'ADMIN'],
  },
  {
    label: 'Carrito',
    path: '/carrito',
    icon: ShoppingCart as LucideIcon,
    roles: ['CLIENT'],
  },
  {
    label: 'Mis Pedidos',
    path: '/mis-pedidos',
    icon: ClipboardList as LucideIcon,
    roles: ['CLIENT'],
  },
  {
    label: 'Mi Perfil',
    path: '/perfil',
    icon: User as LucideIcon,
    roles: ['CLIENT'],
  },
  {
    label: 'Mis Direcciones',
    path: '/mis-direcciones',
    icon: MapPin as LucideIcon,
    roles: ['CLIENT'],
  },
  {
    label: 'Usuarios',
    path: '/admin/usuarios',
    icon: Users as LucideIcon,
    roles: ['ADMIN'],
  },
];
