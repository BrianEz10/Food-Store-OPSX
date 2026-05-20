import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/shared/lib';
import { useUIStore } from '@/shared/stores';
import { CartDrawer } from '@/widgets/cart';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface dark:bg-gray-900 flex flex-col">
      {/* Header — hamburger toggles mobile dropdown menu */}
      <Header
        isMobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        onCartClick={() => setCartOpen(true)}
      />

      {/* Sidebar — desktop only */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* Main content — flex-1 empuja el footer al fondo */}
      <main
        className={cn(
          'flex-1 transition-all duration-200',
          // When mobile menu is closed, add top padding for fixed header
          !mobileMenuOpen && 'pt-16',
          // Desktop: offset for sidebar
          'lg:pl-60',
          sidebarCollapsed && 'lg:pl-16',
          // Mobile: no bottom nav padding needed
          'lg:pb-0',
        )}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Footer — full width, outside <main> so no sidebar offset */}
      <Footer />

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
