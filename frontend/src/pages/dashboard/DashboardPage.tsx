import React from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp, ShoppingCart, RefreshCw } from 'lucide-react';
import { useDashboardResumen, useVentasPorMes, useTopProductos, usePedidosPorEstado } from '@/features/dashboard/queries';
import { DashboardKPI } from '@/shared/components/DashboardKPI';
import { VentasChart } from '@/shared/components/VentasChart';
import { TopProductosChart } from '@/shared/components/TopProductosChart';
import { PedidosPorEstadoChart } from '@/shared/components/PedidosPorEstadoChart';
import { ConfiguracionPanel } from '@/shared/components/ConfiguracionPanel';

export const DashboardPage: React.FC = () => {
  const resumen = useDashboardResumen();
  const ventas = useVentasPorMes();
  const topProductos = useTopProductos(10);
  const pedidosEstados = usePedidosPorEstado();

  const isLoading = resumen.isLoading || ventas.isLoading || topProductos.isLoading || pedidosEstados.isLoading;
  const hasError = resumen.error || ventas.error || topProductos.error || pedidosEstados.error;

  const handleRefresh = () => {
    resumen.refetch();
    ventas.refetch();
    topProductos.refetch();
    pedidosEstados.refetch();
  };

  if (hasError && !isLoading) {
    return (
      <div className="p-6 text-center py-16">
        <p className="text-error text-lg mb-4">Error al cargar el dashboard</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-card hover:bg-primary-hover transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatNumber = (value: number) =>
    value.toLocaleString('es-AR');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Dashboard</h1>
          <p className="text-sm text-on-surface/50 mt-1">
            Panel de administración y métricas del sistema
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-outline/20 rounded-card text-on-surface hover:bg-surface-container disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <DashboardKPI
          title="Ventas Totales"
          value={isLoading ? '...' : `$${formatCurrency(resumen.data?.ventas_totales || 0)}`}
          icon={DollarSign}
        />
        <DashboardKPI
          title="Pedidos"
          value={isLoading ? '...' : formatNumber(resumen.data?.cantidad_pedidos || 0)}
          subtitle={`${formatNumber(resumen.data?.pedidos_hoy || 0)} hoy`}
          icon={ShoppingBag}
        />
        <DashboardKPI
          title="Usuarios Registrados"
          value={isLoading ? '...' : formatNumber(resumen.data?.usuarios_registrados || 0)}
          icon={Users}
        />
        <DashboardKPI
          title="Ticket Promedio"
          value={isLoading ? '...' : `$${formatCurrency(resumen.data?.ticket_promedio || 0)}`}
          icon={TrendingUp}
        />
        <DashboardKPI
          title="Productos Disponibles"
          value={isLoading ? '...' : formatNumber(resumen.data?.productos_disponibles || 0)}
          icon={ShoppingCart}
        />
      </div>

      {/* Skeletons when loading */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="h-[300px] bg-surface-container animate-pulse rounded-card" />
          <div className="h-[300px] bg-surface-container animate-pulse rounded-card" />
          <div className="h-[300px] bg-surface-container animate-pulse rounded-card lg:col-span-2" />
        </div>
      )}

      {/* Charts */}
      {!isLoading && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <VentasChart data={ventas.data || []} />
            <PedidosPorEstadoChart data={pedidosEstados.data || []} />
          </div>
          <div className="mb-4">
            <TopProductosChart data={topProductos.data || []} />
          </div>
        </>
      )}

      {/* Config Panel */}
      {!isLoading && <ConfiguracionPanel />}
    </div>
  );
};
