import { LayoutDashboard } from 'lucide-react';

export function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <LayoutDashboard className="size-16 mx-auto mb-4 text-primary-500" />
      <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100 mb-2">
        Dashboard
      </h1>
      <p className="text-slate-500 dark:text-slate-400">
        Panel de administración — próximamente (Change 13)
      </p>
    </div>
  );
}
