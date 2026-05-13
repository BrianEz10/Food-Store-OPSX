import type { ComponentType } from 'react';
import type { Role } from './auth';

export type Theme = 'light' | 'dark' | 'system';

export interface NavItem {
  label: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
  roles: Role[] | ['*'];
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  type: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any | null;
}
