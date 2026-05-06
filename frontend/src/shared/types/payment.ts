export type PaymentMethod = 'MERCADOPAGO' | 'CASH';
export type CheckoutStep = 'CART' | 'DELIVERY' | 'PAYMENT' | 'CONFIRMATION';

export interface PaymentState {
  step: CheckoutStep;
  method?: PaymentMethod;
  deliveryType?: 'DELIVERY' | 'TAKEAWAY';
  deliveryAddress?: string;
  isProcessing: boolean;
}
