import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePagoEstado } from '@/features/pagos/queries';

export const PagoPendingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pedidoId = searchParams.get('pedido_id');

  const { data } = usePagoEstado(pedidoId ? Number(pedidoId) : null);

  return (
    <div className="flex flex-col items-center justify-center p-12 max-w-2xl mx-auto text-center space-y-6">
      <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 className="text-4xl font-extrabold text-gray-900">Pago en Proceso</h1>
      <p className="text-lg text-gray-600">
        Tu pago está siendo procesado. Esto puede tardar unos minutos.
        Te notificaremos cuando esté confirmado.
      </p>

      {/* Indicador de polling */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
        Verificando estado del pago...
      </div>

      {pedidoId && data && (
        <div className="bg-gray-50 p-6 rounded-lg w-full border border-gray-200">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Número de Pedido</p>
          <p className="text-2xl font-mono font-bold text-gray-900">#{pedidoId.padStart(6, '0')}</p>
          <p className="text-sm text-gray-500 mt-2">
            Estado: <span className="font-medium text-yellow-600">{data.pago_estado ?? 'pendiente'}</span>
          </p>
        </div>
      )}

      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 mt-8"
      >
        Volver al Inicio
      </button>
    </div>
  );
};
