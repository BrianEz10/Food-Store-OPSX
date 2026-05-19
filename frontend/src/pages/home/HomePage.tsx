import { useAuthStore } from '@/shared/stores';

export function HomePage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-display font-bold text-primary mb-4">
          Food Store
        </h1>
        {isAuthenticated && user ? (
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Bienvenido, <span className="font-semibold">{user.nombre}</span>
          </p>
        ) : (
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Sistema de gestión de pedidos y menú digital
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {isAuthenticated && (
          <>
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
          </>
        )}
      </div>
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
