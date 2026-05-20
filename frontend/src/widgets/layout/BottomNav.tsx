import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MoreHorizontal, X } from 'lucide-react';
import { cn } from '@/shared/lib';
import { useFilteredNavItems } from '@/shared/lib/hooks';
import type { NavItem } from '@/shared/types';

interface BottomNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function NavItemButton({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-md text-[10px] font-medium transition-colors min-w-0 flex-1',
          isActive
            ? 'text-primary'
            : 'text-gray-500 dark:text-gray-400',
        )
      }
    >
      <Icon className="size-5" />
      <span className="truncate max-w-full">{item.label}</span>
    </NavLink>
  );
}

export function BottomNav({ open, onOpenChange }: BottomNavProps) {
  const { bottomNavItems, moreItems } = useFilteredNavItems();

  return (
    <>
      {/* Bottom navigation bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container dark:bg-gray-900 border-t border-outline/20 dark:border-gray-700 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-1">
          {bottomNavItems.map((item) => (
            <NavItemButton key={item.path} item={item} />
          ))}

          {/* "Más" button - only show if there are overflow items */}
          {moreItems.length > 0 && (
            <button
              onClick={() => onOpenChange(!open)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-md text-[10px] font-medium transition-colors min-w-0 flex-1',
                open
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-gray-400',
              )}
            >
              {open ? <X className="size-5" /> : <MoreHorizontal className="size-5" />}
              <span>{open ? 'Cerrar' : 'Más'}</span>
            </button>
          )}
        </div>
      </nav>

      {/* Drawer for extra items */}
      {open && moreItems.length > 0 && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/30"
            onClick={() => onOpenChange(false)}
          />

          {/* Drawer */}
          <div className="lg:hidden fixed bottom-16 left-0 right-0 z-50 bg-surface-container dark:bg-gray-900 rounded-t-xl border-t border-outline/20 dark:border-gray-700 shadow-xl animate-slide-up p-4">
            <div className="grid grid-cols-4 gap-3">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => onOpenChange(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex flex-col items-center gap-1 p-3 rounded-lg text-xs font-medium transition-colors',
                        isActive
                          ? 'bg-primary-light text-primary'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                      )
                    }
                  >
                    <Icon className="size-6" />
                    <span className="text-center">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
