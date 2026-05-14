import React, { useState } from 'react';
import { useConfiguracion, useUpdateConfiguracion } from '@/features/dashboard/queries';
import type { ConfiguracionResponse } from '@/features/dashboard/types';

export const ConfiguracionPanel: React.FC = () => {
  const { data: configs, isLoading, error, refetch } = useConfiguracion();
  const updateMutation = useUpdateConfiguracion();
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async (clave: string) => {
    await updateMutation.mutateAsync({ clave, valor: editValue });
    setEditKey(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="h-6 bg-gray-100 animate-pulse rounded w-1/3 mb-4" />
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-5 text-center">
        <p className="text-red-600 text-sm mb-2">Error al cargar configuración</p>
        <button onClick={() => refetch()} className="text-blue-600 hover:underline text-xs">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <h3 className="text-sm font-semibold text-gray-700">Configuración del Sistema</h3>
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="px-5 pb-5">
          {!configs || configs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Sin configuraciones</p>
          ) : (
            <div className="space-y-2">
              {configs.map((config: ConfiguracionResponse) => (
                <div key={config.clave} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500">{config.clave}</p>
                    {editKey === config.clave ? (
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSave(config.clave)}
                          disabled={updateMutation.isPending}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          OK
                        </button>
                        <button
                          onClick={() => setEditKey(null)}
                          className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-900">{config.valor}</p>
                    )}
                    {config.descripcion && (
                      <p className="text-xs text-gray-400 mt-0.5">{config.descripcion}</p>
                    )}
                  </div>
                  <button
                    onClick={() => { setEditKey(config.clave); setEditValue(config.valor); }}
                    className="text-xs text-blue-600 hover:text-blue-800 flex-shrink-0"
                  >
                    Editar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
