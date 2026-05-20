import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface DashboardKPIProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
}

export const DashboardKPI: React.FC<DashboardKPIProps> = ({ title, value, icon: Icon, subtitle }) => {
  return (
    <div className="bg-white border border-outline/10 rounded-card p-5 hover:shadow-md hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-on-surface/60">{title}</p>
          <p className="text-2xl font-bold text-on-surface mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-on-surface/40 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="p-2.5 bg-gradient-to-br from-primary to-secondary rounded-card text-white shadow-sm">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
};
