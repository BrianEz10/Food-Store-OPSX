export type Theme = 'light' | 'dark' | 'system';

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
