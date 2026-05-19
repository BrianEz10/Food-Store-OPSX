import { useNavigate, useParams, Link } from 'react-router-dom';

export const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col items-center justify-center p-12 max-w-2xl mx-auto text-center space-y-6">
      <div className="w-24 h-24 bg-tertiary-light text-tertiary rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      
      <h1 className="text-4xl font-extrabold font-display text-on-surface">¡Pedido Confirmado!</h1>
      <p className="text-lg text-gray-600">
        Tu pedido ha sido procesado exitosamente y pronto comenzaremos a prepararlo.
      </p>
      
      <div className="bg-surface-container p-6 rounded-card w-full border border-outline/10 mt-4">
        <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
          Número de Pedido
        </p>
        <p className="text-2xl font-mono font-bold text-on-surface">
          #{id?.padStart(6, '0')}
        </p>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-white border border-outline/20 text-on-surface font-medium rounded-input hover:bg-surface-container transition-colors"
        >
          Volver al Inicio
        </button>
        <button
          onClick={() => navigate(`/pago/${id}`)}
          className="px-6 py-3 bg-tertiary text-white font-medium rounded-input hover:bg-tertiary-hover shadow-sm transition-colors"
        >
          Proceder al Pago
        </button>
        <Link
          to={`/pedidos/${id}`}
          className="px-6 py-3 bg-primary text-white font-medium rounded-input hover:bg-primary-hover shadow-sm text-center transition-colors"
        >
          Ver Detalle del Pedido
        </Link>
      </div>
    </div>
  );
};
