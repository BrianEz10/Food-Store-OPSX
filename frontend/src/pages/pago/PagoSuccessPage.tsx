import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePagoEstado } from '@/features/pagos/queries';

export const PagoSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pedidoId = searchParams.get('pedido_id');

  const { data } = usePagoEstado(pedidoId ? Number(pedidoId) : null);

  return (
    <div className="flex flex-col items-center justify-center p-12 max-w-2xl mx-auto text-center space-y-6">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-4xl font-extrabold text-gray-900">¡Pago Exitoso!</h1>
      <p className="text-lg text-gray-600">
        Tu pago fue procesado correctamente. Tu pedido está siendo confirmado.
      </p>

      {pedidoId && (
        <div className="bg-gray-50 p-6 rounded-lg w-full border border-gray-200">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Número de Pedido</p>
          <p className="text-2xl font-mono font-bold text-gray-900">#{pedidoId.padStart(6, '0')}</p>
          {data && (
            <p className="text-sm text-gray-500 mt-2">
              Estado del pedido: <span className="font-medium text-green-600">{data.pedido_estado}</span>
            </p>
          )}
        </div>
      )}

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};
