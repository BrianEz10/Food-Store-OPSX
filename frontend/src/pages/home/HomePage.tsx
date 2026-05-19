import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores';
import { useQuery } from '@tanstack/react-query';
import { categoriasApi } from '@/features/categorias/api';
import { Pizza, Utensils, Flame, Cookie, Coffee, Leaf, ChevronRight, FolderTree, Tag, Truck, Percent, Instagram, Phone, Mail, Clock } from 'lucide-react';
import { useProducts } from '@/entities/product';
import { ProductGrid } from '@/widgets/product-grid';

function getCategoryIcon(nombre: string) {
  const name = nombre.toLowerCase();
  if (/pizza|pizzas/.test(name)) return Pizza;
  if (/pasta|fideo|tallarin|raviol|agnolot/.test(name)) return Utensils;
  if (/parrill|carne|asado|bife|milanes|hamburg/.test(name)) return Flame;
  if (/postre|dulce|torta|pastel|helado|flan/.test(name)) return Cookie;
  if (/bebida|gaseosa|jugo|soda|agua|cerveza|vino|licor/.test(name)) return Coffee;
  if (/ensalada|verdura|vegetal|vegan|sano|verde/.test(name)) return Leaf;
  return FolderTree;
}

export function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: categoriasData, isLoading: catsLoading, isError: catsError } = useQuery({
    queryKey: ['categorias', 'homepage-list'],
    queryFn: () => categoriasApi.list(),
  });

  const { data: platosData, isLoading: platosLoading, isError: platosError, refetch: platosRefetch } = useProducts({ limit: 8 });

  return (
    <div className="flex flex-col gap-12 -mt-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary py-16 px-6 sm:px-12 lg:px-16 text-center text-white rounded-b-3xl shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_45%)]" />

        <div className="relative max-w-3xl mx-auto flex flex-col items-center">
          {isAuthenticated && user && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20">
              <span>¡Qué bueno verte de nuevo, {user.nombre}!</span>
            </div>
          )}

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none mb-6">
            ¿Qué tenés ganas de{' '}
            <br className="hidden sm:inline" />
            <span className="text-white relative inline-block">
              comer hoy?
              <span className="absolute left-0 bottom-0.5 w-full h-1 bg-white rounded-full opacity-60" />
            </span>
          </h1>

          <p className="text-lg text-white/90 max-w-xl mb-8 leading-relaxed font-sans">
            Pedí los platos más ricos de la zona y te los llevamos al toque.
            Calentitos, abundantes y hechos con amor.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/catalogo')}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-6 py-2.5 rounded-full font-medium transition-all backdrop-blur-sm"
            >
              Explorar Menú
            </button>
            {!isAuthenticated && (
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-primary hover:bg-white/90 px-6 py-2.5 rounded-full font-medium transition-all shadow-lg"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-on-surface mb-8 text-center">
          Categorías
        </h2>

        {catsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-card bg-white border border-outline/10 p-6 flex flex-col items-center gap-3">
                <div className="size-12 rounded-full bg-slate-200" />
                <div className="h-4 w-20 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : catsError ? (
          <p className="text-center text-on-surface/60 py-8">
            No pudimos cargar las categorías. Intentalo de nuevo más tarde.
          </p>
        ) : categoriasData?.data ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoriasData.data.slice(0, 6).map((cat) => {
              const Icon = getCategoryIcon(cat.nombre);
              return (
                <Link
                  key={cat.id}
                  to={`/catalogo?categoria_id=${cat.id}`}
                  className="rounded-card bg-white border border-outline/10 p-6 flex flex-col items-center gap-3 hover:border-primary/30 hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <div className="size-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                    <Icon className="size-6" />
                  </div>
                  <span className="text-sm font-medium text-on-surface text-center leading-tight">
                    {cat.nombre}
                  </span>
                </Link>
              );
            })}
          </div>
        ) : null}

        {categoriasData?.data && categoriasData.total > 6 && (
          <div className="mt-8 text-center">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              Ver todas las categorías
              <ChevronRight className="size-4" />
            </Link>
          </div>
        )}
      </section>

      {/* Platos del Día Section */}
      <section className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-on-surface mb-8 text-center">
          Platos del Día
        </h2>
        <ProductGrid
          products={platosData?.data ?? []}
          isLoading={platosLoading}
          isError={platosError}
          onRetry={() => platosRefetch()}
        />
      </section>

      {/* Promociones Section */}
      <section className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-on-surface mb-8 text-center">
          Promociones del Día
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Promo: 2x1 */}
          <div className="rounded-card bg-gradient-to-br from-tertiary/5 to-tertiary/10 border border-tertiary/20 p-6 flex flex-col gap-3">
            <div className="inline-flex items-center gap-1.5 bg-tertiary text-white text-xs font-bold px-3 py-1 rounded-chip w-fit">
              <Tag className="size-3" />
              OFERTA
            </div>
            <h3 className="text-lg font-bold text-on-surface">2x1 en Pizzas</h3>
            <p className="text-sm text-on-surface/70 leading-relaxed">
              Todos los martes y jueves. Llevá dos pizzas grandes al precio de una.
            </p>
            <Link
              to="/catalogo"
              className="mt-auto text-sm font-medium text-tertiary hover:text-tertiary-hover inline-flex items-center gap-1 transition-colors"
            >
              Ver más <ChevronRight className="size-4" />
            </Link>
          </div>

          {/* Promo: Envío gratis */}
          <div className="rounded-card bg-gradient-to-br from-tertiary/5 to-tertiary/10 border border-tertiary/20 p-6 flex flex-col gap-3">
            <div className="inline-flex items-center gap-1.5 bg-tertiary text-white text-xs font-bold px-3 py-1 rounded-chip w-fit">
              <Truck className="size-3" />
              GRATIS
            </div>
            <h3 className="text-lg font-bold text-on-surface">Envío Gratis</h3>
            <p className="text-sm text-on-surface/70 leading-relaxed">
              En pedidos superiores a $15.000. Válido para toda la zona de cobertura.
            </p>
            <Link
              to="/catalogo"
              className="mt-auto text-sm font-medium text-tertiary hover:text-tertiary-hover inline-flex items-center gap-1 transition-colors"
            >
              Ver más <ChevronRight className="size-4" />
            </Link>
          </div>

          {/* Promo: 20% OFF */}
          <div className="rounded-card bg-gradient-to-br from-tertiary/5 to-tertiary/10 border border-tertiary/20 p-6 flex flex-col gap-3">
            <div className="inline-flex items-center gap-1.5 bg-tertiary text-white text-xs font-bold px-3 py-1 rounded-chip w-fit">
              <Percent className="size-3" />
              20% OFF
            </div>
            <h3 className="text-lg font-bold text-on-surface">Primer Pedido</h3>
            <p className="text-sm text-on-surface/70 leading-relaxed">
              Descuento del 20% en tu primer pedido. Usá el código{' '}
              <span className="font-bold text-tertiary">BIENVENIDO20</span>.
            </p>
            <Link
              to="/register"
              className="mt-auto text-sm font-medium text-tertiary hover:text-tertiary-hover inline-flex items-center gap-1 transition-colors"
            >
              Ver más <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      {isAuthenticated && (
        <section className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionCard
              title="Mi Perfil"
              description="Ver y editar tus datos personales"
              href="/perfil"
            />
            <QuickActionCard
              title="Mis Direcciones"
              description="Gestionar tus direcciones de entrega"
              href="/mis-direcciones"
            />
            <QuickActionCard
              title="Mis Pedidos"
              description="Seguimiento de tus pedidos en tiempo real"
              href="/mis-pedidos"
            />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white pb-0">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div>
              <h3 className="font-display text-lg font-bold mb-3">
                Food Store
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Tu comida favorita, al toque. Pedí online y recibí en casa los
                platos más ricos de la zona.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-widest text-gray-300 mb-4">
                Navegación
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/catalogo" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Catálogo
                  </Link>
                </li>
                {!isAuthenticated ? (
                  <>
                    <li>
                      <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                        Iniciar Sesión
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="text-sm text-gray-400 hover:text-white transition-colors">
                        Registrarse
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/perfil" className="text-sm text-gray-400 hover:text-white transition-colors">
                        Mi Perfil
                      </Link>
                    </li>
                    <li>
                      <Link to="/mis-pedidos" className="text-sm text-gray-400 hover:text-white transition-colors">
                        Mis Pedidos
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-widest text-gray-300 mb-4">
                Contacto
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5 text-sm text-gray-400">
                  <Phone className="size-4 shrink-0" />
                  <span>+54 11 5555-0123</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-gray-400">
                  <Mail className="size-4 shrink-0" />
                  <span>hola@foodstore.com.ar</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-gray-400">
                  <MapPin className="size-4 shrink-0" />
                  <span>Av. Siempre Viva 123, CABA</span>
                </li>
              </ul>
            </div>

            {/* Hours & Social */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-widest text-gray-300 mb-4">
                Horarios
              </h4>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2.5 text-sm text-gray-400">
                  <Clock className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <p>Lun a Vie: 10:00 - 23:00</p>
                    <p className="text-gray-500">Sáb y Dom: 11:00 - 00:00</p>
                  </div>
                </li>
              </ul>

              <h4 className="font-semibold text-xs uppercase tracking-widest text-gray-300 mb-4">
                Seguinos
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="size-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="size-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-10 pt-6 border-t border-white/10 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Food Store. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block p-6 rounded-card bg-white dark:bg-surface-800 border border-outline/10 hover:shadow-md hover:border-primary/30 transition-all"
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </a>
  );
}
