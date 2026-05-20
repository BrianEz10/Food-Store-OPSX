import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, ShoppingCart, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib';
import { useAuthStore, useCartStore } from '@/shared/stores';
import { useFilteredNavItems } from '@/shared/lib/hooks';

interface HeaderProps {
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onCartClick?: () => void;
}

export function Header({ isMobileMenuOpen, onToggleMobileMenu, onCartClick }: HeaderProps) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const itemCount = useCartStore((s) => s.itemCount);
  const { sidebarItems } = useFilteredNavItems();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isStaff = user?.roles.some((r) => r === 'ADMIN' || r === 'STOCK' || r === 'PEDIDOS');
  const logoSite = isStaff ? '/dashboard' : '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserMenuOpen(false); // Cerrar menú después de cerrar sesión
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  // Cerrar dropdown si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 h-16 z-40',
          'bg-surface/90 dark:bg-gray-900/90 backdrop-blur-md',
          'border-b border-outline/20 dark:border-gray-700',
        )}
      >
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-on-surface dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="size-5" />
            </button>

            <Link to={logoSite} className="flex items-center gap-2">
              <span className="text-xl font-display font-bold text-primary">
                Food Store
              </span>
            </Link>
          </div>

        {/* Right: user info + auth buttons */}
        <div className="flex items-center gap-2">
          {/* Cart button — solo para clientes */}
          {isAuthenticated && user?.roles.includes('CLIENT') && (
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-lg text-on-surface dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Carrito"
            >
              <ShoppingCart className="size-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                  {itemCount}
                </span>
              )}
            </button>
          )}

          {/* Authenticated user info with dropdown */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              {/* User display button - triggers dropdown */}
              <button
                onClick={toggleUserMenu}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
              >
                <span className="hidden sm:block text-sm font-medium text-on-surface dark:text-gray-200">
                  {user.nombre} {user.apellido}
                </span>
                <ChevronDown className="size-4" /> {/* Indicador de dropdown */}
              </button>

              {/* Dropdown menu */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-surface dark:bg-gray-900 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabIndex={-1}
                >
                  <div className="py-1" role="none">
                    {/* Botón de cerrar sesión */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm text-on-surface dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 w-full text-left"
                      role="menuitem"
                    >
                      <LogOut className="size-4" />
                      Salir
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Botones de Ingresar/Registrarse */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>

      {/* ==================== MENÚ DESPLEGABLE MÓVIL ==================== */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-surface-container dark:bg-gray-900 border-b border-outline/20 dark:border-gray-700 shadow-lg overflow-y-auto max-h-[calc(100vh-4rem)] mt-16">
          <nav className="p-2 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onToggleMobileMenu}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-on-surface dark:text-gray-300 hover:bg-primary-light hover:text-primary',
                    )
                  }
                >
                  <Icon className="size-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
