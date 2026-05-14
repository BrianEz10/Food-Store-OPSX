import { useNavigate, useSearchParams } from 'react-router-dom';

export const PagoFailurePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pedidoId = searchParams.get('pedido_id');

  return (
    <div className="flex flex-col items-center justify-center p-12 max-w-2xl mx-auto text-center space-y-6">
      <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h1 className="text-4xl font-extrabold text-gray-900">Pago Rechazado</h1>
      <p className="text-lg text-gray-600">
        No pudimos procesar tu pago. Tu pedido sigue guardado y podés intentarlo de nuevo.
      </p>

      {pedidoId && (
        <div className="bg-gray-50 p-6 rounded-lg w-full border border-gray-200">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Número de Pedido</p>
          <p className="text-2xl font-mono font-bold text-gray-900">#{pedidoId.padStart(6, '0')}</p>
        </div>
      )}

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
        >
          Volver al Inicio
        </button>
        {pedidoId && (
          <button
            onClick={() => navigate(`/pago/${pedidoId}`)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm"
          >
            Reintentar Pago
          </button>
        )}
      </div>
    </div>
  );
};
