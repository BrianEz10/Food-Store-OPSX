export const STATUS_COLORS: Record<string, string> = {
  PENDIENTE: 'bg-outline/10 text-outline',
  CONFIRMADO: 'bg-primary-light text-primary',
  EN_PREP: 'bg-secondary-light text-secondary',
  EN_CAMINO: 'bg-secondary-light text-secondary',
  ENTREGADO: 'bg-tertiary-light text-tertiary',
  CANCELADO: 'bg-error-light text-error',
};

export const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  EN_PREP: 'En Preparación',
  EN_CAMINO: 'En Camino',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};
