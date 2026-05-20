import React from 'react';

interface UserStatusBadgeProps {
  activo: boolean;
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ activo }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        activo
          ? 'bg-tertiary-light text-tertiary'
          : 'bg-error-light text-error'
      }`}
    >
      {activo ? 'Activo' : 'Inactivo'}
    </span>
  );
};
