import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/store/useCartStore'
import { useFormasPago } from '@/features/formas-pago/hooks/useFormasPago'
import { useDirections, useCreateDirection } from '@/features/direcciones/hooks/useDirections'
import { useCreateOrder } from '@/features/orders/hooks/useOrders'
import { imgUrl } from '@/lib/img'
import { parseError } from '@/lib/errorParser'
import { useToastStore } from '@/store/useToastStore'
import { MetodoEnvioSelector, PagoSelector, AddressForm } from '@/features/checkout/components/CheckoutComponents'
import type { CrearPedidoInput } from '@/lib/cajero'

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCartStore()
  const navigate = useNavigate()
  const toast = useToastStore()
  const [metodoEnvio, setMetodoEnvio] = useState('RETIRO')
  const [formaPago, setFormaPago] = useState('')
  const [notas, setNotas] = useState('')
  const [creando, setCreando] = useState(false)
  const [mostrarFormDireccion, setMostrarFormDireccion] = useState(false)
  const [dirValues, setDirValues] = useState({ calle: '', numero: '', ciudad: '', provincia: '', codigo_postal: '', piso: '', referencia: '' })
  const dirToInput = () => ({
    linea1: `${dirValues.calle} ${dirValues.numero}`.trim(),
    linea2: [dirValues.piso, dirValues.referencia].filter(Boolean).join(' - ') || null,
    ciudad: dirValues.ciudad,
    provincia: dirValues.provincia,
    codigo_postal: dirValues.codigo_postal,
  })

  const { data: formas } = useFormasPago()
  const { data: direcciones, isLoading: loadingDirs } = useDirections()
  const createDirection = useCreateDirection()
  const createOrder = useCreateOrder()

  const formastePago = formas?.filter((f) => f.habilitado) || []

  const dirPrincipal = direcciones?.find((d) => d.es_principal) || direcciones?.[0]
  const [selectedDirId, setSelectedDirId] = useState<number | null>(null)

  // pre-seleccionar dirección principal al cargar
  const dirsLoaded = !loadingDirs && direcciones !== undefined
  if (dirsLoaded && selectedDirId === null && dirPrincipal) {
    setSelectedDirId(dirPrincipal.id)
  }

  const direccionSeleccionada = direcciones?.find((d) => d.id === selectedDirId)

  const handleCrearDireccion = async () => {
    try {
      const nueva = await createDirection.mutateAsync(dirToInput())
      toast.success('Dirección guardada')
      setMostrarFormDireccion(false)
      setSelectedDirId(nueva.id)
      setDirValues({ calle: '', numero: '', ciudad: '', provincia: '', codigo_postal: '', piso: '', referencia: '' })
    } catch (e) { toast.error(parseError(e)) }
  }

  const handleCrearPedido = async () => {
    if (items.length === 0) { toast.error('El carrito está vacío'); return }
    if (!formaPago) { toast.error('Seleccioná una forma de pago'); return }
    if (metodoEnvio === 'DOMICILIO' && !selectedDirId) { toast.error('Seleccioná una dirección de envío'); return }
    setCreando(true)
    try {
      const payload: CrearPedidoInput = {
        forma_pago_codigo: formaPago,
        metodo_envio: metodoEnvio,
        direccion_id: metodoEnvio === 'DOMICILIO' ? selectedDirId : null,
        notas: notas.trim() || null,
        items: items.map((i) => ({
          producto_id: i.productoId, cantidad: i.cantidad,
          personalizacion: (i.exclusiones?.length ?? 0) > 0 ? i.exclusiones : undefined,
        })),
      }
      const result = await createOrder.mutateAsync(payload)
      clearCart()
      if (formaPago === 'MERCADOPAGO') {
        navigate(`/payment/${result.id}`)
      } else {
        toast.success('Pedido creado', `#${result.id}`)
        navigate(`/orders/${result.id}`)
      }
    } catch (e) { toast.error(parseError(e)) }
    finally { setCreando(false) }
  }

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#e4e4cc', marginBottom: 12 }}>No hay productos en el carrito</h2>
        <p style={{ color: '#6b6151', marginBottom: 24 }}>Agregá productos desde el catálogo para iniciar un pedido</p>
        <a href="/" style={{ color: '#e9c349', textDecoration: 'none', fontSize: 14, cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); navigate('/') }}>Ir al catálogo</a>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#e4e4cc', marginBottom: 24 }}>Confirmar pedido</h1>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: '#1f2111', padding: 20, borderRadius: 4 }}>
            <h3 style={{ color: '#e4e4cc', fontSize: 15, margin: '0 0 12px', fontWeight: 500 }}>Productos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map((item) => (
                <div key={item.productoId} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, background: '#2a2b1b', borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
                    {item.imagenUrl && <img src={imgUrl(item.imagenUrl)} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#e4e4cc', fontSize: 13, margin: 0 }}>{item.nombre} <span style={{ color: '#6b6151' }}>x{item.cantidad}</span></p>
                  </div>
                  <p style={{ color: '#e9c349', fontSize: 13, margin: 0, fontWeight: 500 }}>${(item.precio * item.cantidad).toLocaleString('es-AR')}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#1f2111', padding: 20, borderRadius: 4 }}>
            <h3 style={{ color: '#e4e4cc', fontSize: 15, margin: '0 0 12px', fontWeight: 500 }}>Método de entrega</h3>
            <MetodoEnvioSelector value={metodoEnvio} onChange={setMetodoEnvio} />
            {metodoEnvio === 'DOMICILIO' && (
              <div style={{ marginTop: 16 }}>
                {loadingDirs ? (
                  <p style={{ color: '#6b6151', fontSize: 13 }}>Cargando direcciones...</p>
                ) : (
                  <>
                    {direcciones && direcciones.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                        <p style={{ color: '#6b6151', fontSize: 12, margin: '0 0 4px' }}>Seleccioná una dirección</p>
                        {direcciones.map((d) => (
                          <label key={d.id} style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12', cursor: 'pointer',
                            background: selectedDirId === d.id ? '#2a2b1b' : 'transparent',
                            border: selectedDirId === d.id ? '1px solid #e9c349' : '1px solid #333',
                            borderRadius: 4,
                          }}>
                            <input type="radio" name="direccion" checked={selectedDirId === d.id}
                              onChange={() => setSelectedDirId(d.id)}
                              style={{ accentColor: '#e9c349' }} />
                            <div>
                              <p style={{ color: '#e4e4cc', fontSize: 13, margin: 0 }}>{d.linea1}</p>
                              <p style={{ color: '#6b6151', fontSize: 12, margin: '2px 0 0' }}>{d.ciudad}, {d.provincia}{d.es_principal ? ' · Principal' : ''}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                    {mostrarFormDireccion ? (
                      <AddressForm values={dirValues}
                        onChange={(f, v) => setDirValues((d) => ({ ...d, [f]: v }))}
                        onSubmit={handleCrearDireccion} />
                    ) : (
                      <button onClick={() => setMostrarFormDireccion(true)}
                        style={{ padding: '10px', background: '#2a2b1b', border: '1px solid #444748', color: '#e4e4cc', fontSize: 13, cursor: 'pointer', width: '100%' }}>
                        + Agregar dirección nueva
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div style={{ background: '#1f2111', padding: 20, borderRadius: 4 }}>
            <h3 style={{ color: '#e4e4cc', fontSize: 15, margin: '0 0 12px', fontWeight: 500 }}>Forma de pago</h3>
            {formastePago.length > 0 ? (
              <PagoSelector value={formaPago} onChange={setFormaPago} />
            ) : (
              <p style={{ color: '#6b6151', fontSize: 13 }}>Cargando formas de pago...</p>
            )}
          </div>

          <div style={{ background: '#1f2111', padding: 20, borderRadius: 4 }}>
            <h3 style={{ color: '#e4e4cc', fontSize: 15, margin: '0 0 12px', fontWeight: 500 }}>Notas</h3>
            <textarea value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Algún comentario para el pedido..."
              style={{ width: '100%', padding: '10px 12px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 13, boxSizing: 'border-box', minHeight: 60, resize: 'vertical' }} />
          </div>
        </div>

        <div style={{ flex: '0 0 300px' }}>
          <div style={{ background: '#1f2111', padding: 20, borderRadius: 4, position: 'sticky', top: 88 }}>
            <h3 style={{ color: '#e4e4cc', fontSize: 15, margin: '0 0 16px', fontWeight: 500 }}>Resumen</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#c4c7c7', fontSize: 14 }}>Subtotal</span>
              <span style={{ color: '#c4c7c7', fontSize: 14 }}>${totalAmount().toLocaleString('es-AR')}</span>
            </div>
            <div style={{ borderTop: '1px solid #2a2b1b', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#e4e4cc', fontSize: 16, fontWeight: 600 }}>Total</span>
              <span style={{ color: '#e9c349', fontSize: 18, fontWeight: 600 }}>${totalAmount().toLocaleString('es-AR')}</span>
            </div>
            <button onClick={handleCrearPedido} disabled={creando || !formaPago}
              style={{
                width: '100%', marginTop: 20, padding: '14px', cursor: creando || !formaPago ? 'not-allowed' : 'pointer',
                background: '#e9c349', color: '#131407', border: 'none', fontSize: 15, fontWeight: 600, borderRadius: 4,
                opacity: creando || !formaPago ? 0.5 : 1,
              }}>
              {creando ? 'Creando pedido...' : 'Confirmar pedido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
