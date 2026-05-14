import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { useCreatePago } from '@/features/pagos/queries';

// Inicializar SDK con la public key (se ejecuta una sola vez)
const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY || '';
initMercadoPago(MP_PUBLIC_KEY, { locale: 'es-AR' });

export const PagoPage = () => {
  const navigate = useNavigate();
  const { pedidoId } = useParams<{ pedidoId: string }>();
  const { mutate: createPago, data: pagoData, isPending, isSuccess } = useCreatePago();

  useEffect(() => {
    if (pedidoId) {
      createPago(Number(pedidoId));
    }
  }, [pedidoId]);

  const handleCardPaymentSubmit = async (formData: any) => {
    // El brick ya maneja la tokenización y el pago.
    // MP redirige automáticamente a las back_urls configuradas en el backend.
    console.log('CardPayment submitted', formData);
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Preparando tu pago...</p>
        </div>
      </div>
    );
  }

  if (!isSuccess || !pagoData?.preference_id) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">No se pudo iniciar el pago.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Ingresá tu tarjeta</h1>
      <p className="text-gray-600 mb-6">
        Total a pagar: <span className="font-bold">${pagoData.monto.toFixed(2)}</span>
      </p>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <CardPayment
          initialization={{
            amount: pagoData.monto,
            preferenceId: pagoData.preference_id,
          }}
          onSubmit={handleCardPaymentSubmit}
          onError={(error) => console.error('CardPayment error', error)}
          customization={{
            paymentMethods: { minInstallments: 1, maxInstallments: 12 },
          }}
        />
      </div>
    </div>
  );
};
