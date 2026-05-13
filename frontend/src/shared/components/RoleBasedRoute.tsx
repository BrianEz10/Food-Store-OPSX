import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/auth-store';
import type { Role } from '@/shared/types';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, allowedRoles }) => {
  const hasRole = useAuthStore((state) => state.hasRole);
  
  const hasAnyRequiredRole = allowedRoles.some((role) => hasRole(role));

  if (!hasAnyRequiredRole) {
    return <Navigate to="/unauthorized" replace />; // Or to "/" 
  }

  return <>{children}</>;
};
