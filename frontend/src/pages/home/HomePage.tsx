import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { useAuthStore } from '@/shared/stores';
import { useProducts } from '@/entities/product';
import { ProductGrid } from '@/widgets/product-grid';
import {
  Search,
  Pizza,
  Flame,
  Utensils,
  Coffee,
  Leaf,
  Cookie,
  ArrowRight,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Instagram,
  Facebook,
  Sparkles,
  Gift,
  CheckCircle2,
  Copy
} from 'lucide-react';

interface Category {
  id: number;
  nombre: string;
}

export function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Fetch Categories from /api/v1/categorias
  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ['categorias', 'list'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Category[] }>('/api/v1/categorias');
      return data.data;
    },
  });

  // Fetch Products (limit to 8 for Platos del Día)
  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = useProducts({
    limit: 8,
  });

  const products = productsData?.data ?? [];

  // Redirection handlers
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryClick = (id: number) => {
    navigate(`/catalogo?categoria_id=${id}`);
  };

  // Copy Promo Code handler
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Default fallback categories in case DB is loading/empty
  const fallbackCategories = [
    { id: 1, nombre: 'Pizzas', icon: Pizza, color: 'bg-red-500/10 text-red-500 hover:bg-red-500/20' },
    { id: 2, nombre: 'Pastas', icon: Utensils, color: 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' },
    { id: 3, nombre: 'Burgers', icon: Flame, color: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' },
    { id: 4, nombre: 'Postres', icon: Cookie, color: 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20' },
    { id: 5, nombre: 'Bebidas', icon: Coffee, color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' },
    { id: 6, nombre: 'Ensaladas', icon: Leaf, color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20' },
  ];

  // Map API Categories to beautiful visual cards with appropriate icons
  const displayedCategories = categoriesData?.map((cat) => {
    const nameLower = cat.nombre.toLowerCase();
    let IconComponent = Utensils;
    let colorClasses = 'bg-primary/10 text-primary hover:bg-primary/20';

    if (nameLower.includes('pizza')) {
      IconComponent = Pizza;
      colorClasses = 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
    } else if (nameLower.includes('burger') || nameLower.includes('hamburguesa')) {
      IconComponent = Flame;
      colorClasses = 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20';
    } else if (nameLower.includes('pasta') || nameLower.includes('minuta')) {
      IconComponent = Utensils;
      colorClasses = 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20';
    } else if (nameLower.includes('postre') || nameLower.includes('dulce') || nameLower.includes('helado')) {
      IconComponent = Cookie;
      colorClasses = 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20';
    } else if (nameLower.includes('bebida') || nameLower.includes('trago') || nameLower.includes('gaseosa') || nameLower.includes('caf')) {
      IconComponent = Coffee;
      colorClasses = 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
    } else if (nameLower.includes('ensalada') || nameLower.includes('vegano') || nameLower.includes('vegetal') || nameLower.includes('sana')) {
      IconComponent = Leaf;
      colorClasses = 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
    }

    return {
      id: cat.id,
      nombre: cat.nombre,
      icon: IconComponent,
      color: colorClasses,
    };
  }) ?? fallbackCategories;

  return (
    <div className="flex flex-col gap-16 -mt-4 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* ── 1. HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary py-20 px-6 sm:px-12 lg:px-16 text-center text-white sm:rounded-b-[2.5rem] shadow-xl">
        {/* Decorative background visual elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_45%)]" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-x-12 -translate-y-12" />

        <div className="relative max-w-3xl mx-auto flex flex-col items-center">
          {isAuthenticated && user && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-pulse border border-white/20">
              <Sparkles className="size-4 text-white" />
              <span>¡Qué bueno verte de nuevo, {user.nombre}!</span>
            </div>
          )}

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none mb-6">
            ¿Qué tenés ganas de <br className="hidden sm:inline" />
            <span className="text-white relative inline-block">
              comer hoy?
              <span className="absolute left-0 bottom-0.5 w-full h-1 bg-white rounded-full opacity-60" />
            </span>
          </h1>

          <p className="text-lg text-white/90 max-w-xl mb-8 leading-relaxed font-sans">
            Pedí los platos más ricos de la zona y te los llevamos al toque. Calentitos, abundantes y hechos con amor.
          </p>

          {/* Interactive Search Bar */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl bg-white dark:bg-slate-900 p-2 rounded-2xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row gap-2 border border-white/10 mb-8">
            <div className="flex-1 flex items-center gap-3 px-4 py-2">
              <Search className="size-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscá por plato, categoría o ingrediente..."
                className="w-full bg-transparent border-0 p-0 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0 text-base"
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3.5 rounded-xl sm:rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 text-base"
            >
              Buscar comida
            </button>
          </form>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/catalogo')}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-6 py-2.5 rounded-full font-medium transition-all backdrop-blur-sm flex items-center gap-2 group"
            >
              Explorar Menú
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="#promociones"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Ver Promos del Día
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. CATEGORIES SECTION ── */}
      <section className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-primary text-sm font-bold uppercase tracking-wider block mb-1">Categorías</span>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Las preferidas de siempre
            </h2>
          </div>
          <button
            onClick={() => navigate('/catalogo')}
            className="text-primary hover:text-primary-hover font-semibold text-sm flex items-center gap-1 transition-colors"
          >
            Ver catálogo entero
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayedCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary/20 dark:hover:border-primary/40 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`p-4 rounded-full ${cat.color} mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="size-6" />
                </div>
                <span className="font-display font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors text-base">
                  {cat.nombre}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Ver platos
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 3. FEATURED PRODUCTS (PLATOS DEL DÍA) ── */}
      <section className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-primary text-sm font-bold uppercase tracking-wider block mb-1">Recomendados</span>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              Platos del día de hoy
            </h2>
          </div>
          <button
            onClick={() => navigate('/catalogo')}
            className="text-primary hover:text-primary-hover font-semibold text-sm flex items-center gap-1 transition-colors"
          >
            Explorar todas las opciones
            <ChevronRight className="size-4" />
          </button>
        </div>

        <ProductGrid
          products={products}
          isLoading={productsLoading}
          isError={productsError}
          onRetry={refetchProducts}
        />
      </section>

      {/* ── 4. PROMOTIONS SECTION (TERTIARY BRAND COLOR) ── */}
      <section id="promociones" className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="bg-slate-950 dark:bg-slate-950/80 rounded-[2rem] p-8 sm:p-12 lg:p-16 relative overflow-hidden text-white shadow-2xl border border-slate-900">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-tertiary/15 rounded-full blur-[100px] -translate-y-24 translate-x-24" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] translate-y-24 -translate-x-24" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <span className="bg-tertiary text-white font-semibold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 mb-6 border border-tertiary-hover">
                <Gift className="size-3.5" />
                Descuentos Exclusivos
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-6 leading-none">
                ¡Promociones imperdibles <br />
                <span className="text-tertiary">que salvan el día!</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed font-sans">
                Aprovechá estas promos exclusivas pidiendo directamente desde la app. Ingresá el cupón en el checkout y disfrutá del mejor sabor con descuento.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/catalogo')}
                  className="bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 text-center"
                >
                  ¡Pedir ahora mismo!
                </button>
                <a
                  href="#footer-contacto"
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold px-8 py-3.5 rounded-xl transition-all text-center"
                >
                  Consultar horarios
                </a>
              </div>
            </div>

            {/* Promo Code Cards */}
            <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Promo 1 */}
              <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-tertiary/30 transition-all duration-300 group">
                <div>
                  <span className="bg-tertiary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    2X1 MARTES
                  </span>
                  <h3 className="font-display text-xl font-bold mt-3 mb-2 text-white group-hover:text-tertiary transition-colors">
                    Promo 2x1 en Burgers
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Pedí cualquier hamburguesa clásica o especial los martes y te regalamos la segunda al toque.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">CUPÓN</span>
                    <span className="text-sm font-mono font-bold text-white tracking-wider">BURGER2X1</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode('BURGER2X1')}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-tertiary text-slate-300 hover:text-white transition-all"
                    title="Copiar cupón"
                  >
                    {copiedCode === 'BURGER2X1' ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Promo 2 */}
              <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-tertiary/30 transition-all duration-300 group">
                <div>
                  <span className="bg-tertiary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    ENVÍO GRATIS
                  </span>
                  <h3 className="font-display text-xl font-bold mt-3 mb-2 text-white group-hover:text-tertiary transition-colors">
                    Pastas del Domingo
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Envío 100% gratis los domingos al mediodía en compras de pastas caseras superiores a $15.000.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">CUPÓN</span>
                    <span className="text-sm font-mono font-bold text-white tracking-wider">PASTAFREE</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode('PASTAFREE')}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-tertiary text-slate-300 hover:text-white transition-all"
                    title="Copiar cupón"
                  >
                    {copiedCode === 'PASTAFREE' ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. BRAND VALUE PROPOSITIONS ── */}
      <section className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <div className="p-3 bg-primary-light dark:bg-primary/20 text-primary rounded-xl shrink-0 h-fit">
              <Clock className="size-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-800 dark:text-slate-200 text-lg mb-1">
                Entrega en 30 minutos
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Nuestros repartidores vuelan para asegurar que tu comida llegue en tiempo récord y super caliente.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <div className="p-3 bg-primary-light dark:bg-primary/20 text-primary rounded-xl shrink-0 h-fit">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-800 dark:text-slate-200 text-lg mb-1">
                Higiene y Calidad Máxima
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Usamos ingredientes premium seleccionados cuidadosamente bajo estrictos controles bromatológicos.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <div className="p-3 bg-primary-light dark:bg-primary/20 text-primary rounded-xl shrink-0 h-fit">
              <MapPin className="size-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-800 dark:text-slate-200 text-lg mb-1">
                Seguimiento en tiempo real
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Mirá el estado de tu pedido en tiempo real desde la sección "Mis Pedidos". ¡Cero ansiedad!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. INSTITUTIONAL FOOTER ── */}
      <footer id="footer-contacto" className="bg-slate-950 text-slate-400 py-16 px-6 sm:px-12 lg:px-16 border-t border-slate-900 rounded-t-[2rem] mt-8 w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Col 1: Brand & Info */}
          <div className="flex flex-col gap-4">
            <span className="font-display text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Food<span className="text-primary">Store</span>
            </span>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              El sabor que querés, directo a tu mesa. Disfrutá de la mejor comida rápida y casera con la comodidad de pedir online en segundos.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-slate-900 hover:bg-primary text-slate-400 hover:text-white transition-colors" title="Instagram">
                <Instagram className="size-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-slate-900 hover:bg-primary text-slate-400 hover:text-white transition-colors" title="Facebook">
                <Facebook className="size-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-display font-bold text-white text-base mb-5 uppercase tracking-wider">
              Enlaces rápidos
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <button onClick={() => navigate('/catalogo')} className="hover:text-primary transition-colors text-left">
                  Catálogo Digital
                </button>
              </li>
              <li>
                <a href="#promociones" className="hover:text-primary transition-colors">
                  Promociones del Día
                </a>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <button onClick={() => navigate('/mis-pedidos')} className="hover:text-primary transition-colors text-left">
                      Mis Pedidos
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/perfil')} className="hover:text-primary transition-colors text-left">
                      Mi Perfil
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button onClick={() => navigate('/login')} className="hover:text-primary transition-colors text-left">
                      Iniciar Sesión
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/register')} className="hover:text-primary transition-colors text-left">
                      Registrarse
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Col 3: Business Hours */}
          <div>
            <h4 className="font-display font-bold text-white text-base mb-5 uppercase tracking-wider flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              Horarios de Atención
            </h4>
            <ul className="space-y-3.5 text-sm font-sans">
              <li className="flex justify-between border-b border-slate-900 pb-2">
                <span>Martes a Viernes</span>
                <span className="text-white font-medium">19:00 - 23:30</span>
              </li>
              <li className="flex justify-between border-b border-slate-900 pb-2">
                <span>Sábados y Domingos</span>
                <span className="text-white font-medium">19:00 - 00:00</span>
              </li>
              <li className="flex justify-between text-rose-500 font-medium">
                <span>Lunes</span>
                <span>CERRADO</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div>
            <h4 className="font-display font-bold text-white text-base mb-5 uppercase tracking-wider flex items-center gap-2">
              <Phone className="size-4 text-primary" />
              Contacto
            </h4>
            <ul className="space-y-4 text-sm font-sans">
              <li className="flex gap-3">
                <MapPin className="size-5 text-primary shrink-0" />
                <span>Av. de Mayo 1234, Ramos Mejía, Buenos Aires</span>
              </li>
              <li className="flex gap-3">
                <Phone className="size-5 text-primary shrink-0" />
                <a href="tel:+541199998888" className="hover:text-white transition-colors">
                  +54 (11) 9999-8888
                </a>
              </li>
              <li className="text-xs text-slate-500 leading-relaxed mt-2">
                ¿Tenés consultas, quejas o reclamos? Escribinos por WhatsApp o llamanos en nuestro horario comercial.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom copyright area */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 text-center text-xs text-slate-600 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Food Store. Todos los derechos reservados.</p>
          <p className="flex gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Términos y Condiciones</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400 transition-colors">Políticas de Privacidad</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
