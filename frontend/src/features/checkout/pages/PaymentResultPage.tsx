import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { confirmPayment } from '@/features/pagos/services/paymentService'
import { parseError } from '@/lib/errorParser'

export default function PaymentResultPage() {
  const { id: orderId } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'processing' | 'approved' | 'rejected' | 'error'>('processing')
  const [error, setError] = useState('')

  const isSuccess = window.location.pathname.includes('/success')
  const paymentId = searchParams.get('payment_id') || searchParams.get('paymentId') || ''

  useEffect(() => {
    if (!orderId || !isSuccess) {
      setStatus(isSuccess ? 'error' : 'rejected')
      return
    }
    ;(async () => {
      try {
        await confirmPayment({ pedido_id: Number(orderId), payment_id: paymentId || 'manual' })
        setStatus('approved')
      } catch (e) {
        setError(parseError(e))
        setStatus('error')
      }
    })()
  }, [orderId, paymentId, isSuccess])

  return (
    <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
      {status === 'processing' && (
        <>
          <div style={{ width: 48, height: 48, border: '3px solid #e9c349', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
          <p style={{ color: '#c4c7c7', fontSize: 15 }}>Confirmando pago...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </>
      )}
      {status === 'approved' && (
        <>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <h2 style={{ color: '#4caf50', fontSize: 22, margin: '0 0 8px' }}>Pago aprobado</h2>
          <p style={{ color: '#c4c7c7', fontSize: 14, marginBottom: 24 }}>Tu pedido ya está en proceso</p>
          <button onClick={() => navigate(`/orders/${orderId}`)}
            style={{ padding: '12px 32px', background: '#e9c349', color: '#131407', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', borderRadius: 4 }}>
            Ver pedido
          </button>
        </>
      )}
      {(status === 'rejected' || status === 'error') && (
        <>
          <div style={{ fontSize: 48, marginBottom: 12 }}>❌</div>
          <h2 style={{ color: '#ff5252', fontSize: 22, margin: '0 0 8px' }}>Pago {isSuccess ? 'falló' : 'rechazado'}</h2>
          <p style={{ color: '#c4c7c7', fontSize: 14, marginBottom: 8 }}>{error || 'El pago no pudo completarse'}</p>
          <p style={{ color: '#6b6151', fontSize: 13, marginBottom: 24 }}>Podés intentar de nuevo desde tu pedido</p>
          <button onClick={() => navigate(`/orders/${orderId}`)}
            style={{ padding: '12px 32px', background: '#2a2b1b', border: '1px solid #444748', color: '#c4c7c7', cursor: 'pointer', fontSize: 14, borderRadius: 4 }}>
            Ver pedido
          </button>
        </>
      )}
    </div>
  )
}
