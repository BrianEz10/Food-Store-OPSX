import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/shared/lib';
import { useUIStore } from '@/shared/stores';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-900">
      {/* Header */}
      <Header onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)} />

      {/* Sidebar (desktop) */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* Main content */}
      <main
        className={cn(
          'pt-16 transition-all duration-200',
          // Desktop: offset for sidebar
          'lg:pl-60',
          sidebarCollapsed && 'lg:pl-16',
          // Mobile: padding for bottom nav
          'pb-20 lg:pb-0',
        )}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav (mobile) */}
      <BottomNav open={moreOpen} onOpenChange={setMoreOpen} />
    </div>
  );
}
