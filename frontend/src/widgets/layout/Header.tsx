import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/shared/lib';
import { useAuthStore, useUIStore } from '@/shared/stores';
import type { Theme } from '@/shared/types';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const themeIcons: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const themeLabels: Record<Theme, string> = {
  light: 'Modo claro',
  dark: 'Modo oscuro',
  system: 'Modo sistema',
};

const themeCycle: Theme[] = ['light', 'dark', 'system'];

export function Header({ onToggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cycleTheme = () => {
    const currentIndex = themeCycle.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeCycle.length;
    setTheme(themeCycle[nextIndex]);
  };

  const ThemeIcon = themeIcons[theme];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 h-16 z-40',
        'bg-white/90 dark:bg-surface-900/90 backdrop-blur-md',
        'border-b border-slate-200 dark:border-slate-700',
      )}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="size-5" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-display font-bold text-primary-500">
              Food Store
            </span>
          </Link>
        </div>

        {/* Right: theme toggle + user info + auth buttons */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={themeLabels[theme]}
          >
            <ThemeIcon className="size-5" />
          </button>

          {/* Authenticated user info */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200">
                {user.nombre} {user.apellido}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          ) : (
            /* Login/Register buttons */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
