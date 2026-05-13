import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib';
import { useUIStore } from '@/shared/stores';
import { useFilteredNavItems } from '@/shared/lib/hooks';
import type { NavItem } from '@/shared/types';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

function SidebarItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
          'hover:bg-primary-100 hover:text-primary-900',
          'dark:hover:bg-primary-900/30 dark:hover:text-primary-100',
          isActive
            ? 'bg-primary-500 text-white hover:bg-primary-600 hover:text-white dark:bg-primary-600'
            : 'text-slate-600 dark:text-slate-300',
        )
      }
      title={collapsed ? item.label : undefined}
    >
      <Icon className="size-5 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const { sidebarItems } = useFilteredNavItems();

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-surface-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-200 z-30',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {sidebarItems.map((item) => (
          <SidebarItem key={item.path} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={onToggleCollapse}
          className="flex items-center justify-center w-full p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {collapsed ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
        </button>
      </div>
    </aside>
  );
}
