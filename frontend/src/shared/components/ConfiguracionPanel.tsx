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
      <div className="bg-white border border-outline/10 rounded-card p-5">
        <div className="h-6 bg-surface-container animate-pulse rounded-card w-1/3 mb-4" />
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-10 bg-surface-container animate-pulse rounded-card" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-outline/10 rounded-card p-5 text-center">
        <p className="text-sm text-error mb-2">Error al cargar configuración</p>
        <button onClick={() => refetch()} className="text-xs text-primary hover:text-primary-hover underline">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-outline/10 rounded-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-container/50 transition-colors"
      >
        <h3 className="text-sm font-semibold text-on-surface">Configuración del Sistema</h3>
        <span className="text-on-surface/40 text-sm transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : undefined }}>▼</span>
      </button>

      {isOpen && (
        <div className="px-5 pb-5">
          {!configs || configs.length === 0 ? (
            <p className="text-sm text-on-surface/40 text-center py-4">Sin configuraciones</p>
          ) : (
            <div className="space-y-2">
              {configs.map((config: ConfiguracionResponse) => (
                <div key={config.clave} className="flex items-center gap-3 p-3 bg-surface-container rounded-card">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-on-surface/60">{config.clave}</p>
                    {editKey === config.clave ? (
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 border border-outline/20 rounded-input px-2 py-1 text-sm text-on-surface bg-white"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSave(config.clave)}
                          disabled={updateMutation.isPending}
                          className="px-2 py-1 text-xs bg-primary text-white rounded-input hover:bg-primary-hover transition-colors"
                        >
                          OK
                        </button>
                        <button
                          onClick={() => setEditKey(null)}
                          className="px-2 py-1 text-xs bg-gray-200 text-on-surface rounded-input hover:bg-gray-300 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-on-surface">{config.valor}</p>
                    )}
                    {config.descripcion && (
                      <p className="text-xs text-on-surface/40 mt-0.5">{config.descripcion}</p>
                    )}
                  </div>
                  <button
                    onClick={() => { setEditKey(config.clave); setEditValue(config.valor); }}
                    className="text-xs text-primary hover:text-primary-hover flex-shrink-0 transition-colors"
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
