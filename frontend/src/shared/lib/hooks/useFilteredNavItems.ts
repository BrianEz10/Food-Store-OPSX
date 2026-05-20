import { useMemo } from 'react';
import { useAuthStore } from '@/shared/stores';
import { NAV_ITEMS } from '@/shared/lib';
import type { Role } from '@/shared/types';

interface FilteredNavItems {
  sidebarItems: typeof NAV_ITEMS;
  bottomNavItems: typeof NAV_ITEMS;
  moreItems: typeof NAV_ITEMS;
}

export function useFilteredNavItems(): FilteredNavItems {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useMemo(() => {
    const isStaff = user?.roles.some((r) => r === 'ADMIN' || r === 'STOCK' || r === 'PEDIDOS');

    const filtered = NAV_ITEMS.filter((item) => {
      // Items with roles=['*'] are public — shown to unauthenticated users and CLIENTs only
      if (item.roles.includes('*' as Role)) {
        if (!isAuthenticated || !user) return true;        // No logueado → ve público
        return !isStaff;                                     // Staff → NO ve público; CLIENT → sí
      }
      // If not authenticated, only show roles=['*'] items (already handled above)
      if (!isAuthenticated || !user) return false;
      // Check if user has any of the required roles
      return item.roles.some((role) => user.roles.includes(role));
    });

    // Bottom nav: first 4 items visible, rest go to "Más"
    const MAX_BOTTOM_ITEMS = 5;
    const bottomNavItems = filtered.slice(0, MAX_BOTTOM_ITEMS - 1);
    const moreItems = filtered.slice(MAX_BOTTOM_ITEMS - 1);

    return {
      sidebarItems: filtered,
      bottomNavItems,
      moreItems,
    };
  }, [user, isAuthenticated]);
}
