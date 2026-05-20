import React from 'react';

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-error-light text-error',
  STOCK: 'bg-primary-light text-primary',
  PEDIDOS: 'bg-gray-200 text-gray-700',
  CLIENT: 'bg-tertiary-light text-tertiary',
};

interface RoleBadgesProps {
  roles: string[];
}

export const RoleBadges: React.FC<RoleBadgesProps> = ({ roles }) => {
  if (roles.length === 0) {
    return <span className="text-xs text-gray-400">Sin roles</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {roles.map((role) => (
        <span
          key={role}
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            ROLE_COLORS[role] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {role}
        </span>
      ))}
    </div>
  );
};
