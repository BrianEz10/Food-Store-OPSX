import { useToastStore } from '@/store/useToastStore'

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore()
  if (toasts.length === 0) return null
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map((t) => (
        <div key={t.id} onClick={() => removeToast(t.id)}
          style={{
            padding: '12px 20px', borderRadius: 4, cursor: 'pointer', fontSize: 14,
            background: t.type === 'success' ? '#1b5e20' : t.type === 'error' ? '#93000a' : '#2a2b1b',
            color: '#e4e4cc', border: `1px solid ${t.type === 'success' ? '#4caf50' : t.type === 'error' ? '#ffb4ab' : '#444748'}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
