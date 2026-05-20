import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-outline/20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} Food Store</span>
          <div className="flex items-center gap-4">
            <Link to="/catalogo" className="hover:text-primary transition-colors">
              Catálogo
            </Link>
            <Link to="/terminos" className="hover:text-primary transition-colors">
              Términos
            </Link>
            <Link to="/privacidad" className="hover:text-primary transition-colors">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
