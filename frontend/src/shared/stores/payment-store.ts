import { create } from 'zustand';
import type { PaymentMethod, CheckoutStep, PaymentState } from '@/shared/types';

interface PaymentStoreState extends PaymentState {
  setPaymentMethod: (method: PaymentMethod) => void;
  setCheckoutStep: (step: CheckoutStep) => void;
  setProcessing: (isProcessing: boolean) => void;
  setDeliveryType: (type: 'DELIVERY' | 'TAKEAWAY') => void;
  setDeliveryAddress: (address: string) => void;
  resetCheckout: () => void;
}

const initialState: PaymentState = {
  step: 'CART',
  method: undefined,
  deliveryType: undefined,
  deliveryAddress: undefined,
  isProcessing: false,
};

export const usePaymentStore = create<PaymentStoreState>((set) => ({
  ...initialState,
  setPaymentMethod: (method) => set({ method }),
  setCheckoutStep: (step) => set({ step }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setDeliveryType: (deliveryType) => set({ deliveryType }),
  setDeliveryAddress: (deliveryAddress) => set({ deliveryAddress }),
  resetCheckout: () => set(initialState),
}));
