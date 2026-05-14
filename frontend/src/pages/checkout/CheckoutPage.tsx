import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/shared/stores';
import { fetchDireccionesFn } from '@/features/direcciones/api';
import { useCreatePedido } from '@/features/pedidos/queries';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const [selectedDireccionId, setSelectedDireccionId] = useState<number | null>(null);
  const [notas, setNotas] = useState('');

  const { data: direcciones, isLoading: isLoadingDirecciones } = useQuery({
    queryKey: ['direcciones'],
    queryFn: fetchDireccionesFn,
  });

  const { mutate: createPedido, isPending } = useCreatePedido();

  const handleConfirmOrder = () => {
    if (!selectedDireccionId) return;

    createPedido(
      {
        direccion_id: selectedDireccionId,
        notas: notas || undefined,
        items: items.map((item) => ({
          producto_id: item.productoId,
          cantidad: item.cantidad,
          ingredientes_excluidos: item.exclusiones?.length ? item.exclusiones : undefined,
        })),
      },
      {
        onSuccess: (data) => {
          clearCart();
          navigate(`/checkout/success/${data.id}`);
        },
      }
    );
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate('/catalogo')}
        >
          Ir al catálogo
        </button>
      </div>
    );
  }

  const costoEnvio = 50.0;
  const totalFinal = total + costoEnvio;

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Columna Izquierda: Dirección y Notas */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Dirección de Entrega</h2>
            {isLoadingDirecciones ? (
              <p>Cargando direcciones...</p>
            ) : direcciones && direcciones.length > 0 ? (
              <div className="space-y-3">
                {direcciones.map((dir) => (
                  <label
                    key={dir.id}
                    className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDireccionId === dir.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="direccion"
                        value={dir.id}
                        checked={selectedDireccionId === dir.id}
                        onChange={() => setSelectedDireccionId(dir.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-900">
                          {dir.calle} {dir.numero}
                        </span>
                        <span className="block text-sm text-gray-500">
                          {dir.ciudad}, {dir.provincia}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 border border-dashed rounded-lg">
                <p className="text-gray-500 mb-4">No tenés direcciones guardadas.</p>
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => navigate('/profile')}
                >
                  Agregar una dirección en tu perfil
                </button>
              </div>
            )}
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Notas para el pedido</h2>
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Ej: Tocar timbre 2 veces, dejar en portería..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />
          </section>
        </div>

        {/* Columna Derecha: Resumen de Orden */}
        <div className="space-y-6">
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Resumen de la Orden</h2>
            
            <div className="flow-root mb-6">
              <ul className="-my-4 divide-y divide-gray-200">
                {items.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {item.cantidad}x {item.nombre}
                      </span>
                      {item.exclusiones && item.exclusiones.length > 0 && (
                        <span className="text-sm text-red-500">
                          Sin {item.exclusiones.length} ingrediente(s)
                        </span>
                      )}
                    </div>
                    <span className="font-medium">
                      ${(item.precio * item.cantidad).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Costo de Envío</span>
                <span>${costoEnvio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>${totalFinal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleConfirmOrder}
              disabled={!selectedDireccionId || isPending}
              className={`w-full mt-8 py-3 px-4 rounded-lg font-medium text-white transition-colors
                ${
                  !selectedDireccionId || isPending
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 shadow-md'
                }
              `}
            >
              {isPending ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
            {!selectedDireccionId && (
              <p className="text-sm text-red-500 text-center mt-2">
                Seleccioná una dirección para continuar
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
