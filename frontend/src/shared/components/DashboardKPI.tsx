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
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
      </div>
    </div>
  );
};
