import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createPayment } from '@/features/pagos/services/paymentService'
import { parseError } from '@/lib/errorParser'

export default function PaymentPage() {
  const { id: orderId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'processing' | 'redirecting'>('processing')
  const called = useRef(false)

  useEffect(() => {
    if (!orderId || called.current) return
    called.current = true
    ;(async () => {
      try {
        setStatus('processing')
        const result = await createPayment(Number(orderId))
        if (result?.init_point) {
          setStatus('redirecting')
          window.location.href = result.init_point
        } else {
          setError('No se pudo obtener el enlace de pago')
        }
      } catch (e) {
        setError(parseError(e))
      }
    })()
  }, [orderId])

  if (error) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <div style={{ background: '#93000a30', border: '1px solid #ffb4ab', padding: '16px 20px', marginBottom: 20 }}>
          <p style={{ color: '#ffb4ab', fontSize: 14, margin: 0 }}>{error}</p>
        </div>
        <button onClick={() => navigate(`/orders/${orderId}`)}
          style={{ padding: '10px 24px', background: '#2a2b1b', border: '1px solid #444748', color: '#c4c7c7', cursor: 'pointer', fontSize: 14 }}>
          Ver pedido
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
      <div style={{ width: 48, height: 48, border: '3px solid #e9c349', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
      <p style={{ color: '#c4c7c7', fontSize: 15 }}>
        {status === 'redirecting' ? 'Redirigiendo a MercadoPago...' : 'Preparando el pago...'}
      </p>
      <p style={{ color: '#6b6151', fontSize: 13 }}>No cerrés esta página</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
