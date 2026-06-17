import { useEffect, useState } from 'react'
import { fetchProductos, fetchProducto, type ProductoOut } from '@/lib/productos'
import { fetchFormasPago, createPedido, type FormaPago } from '@/lib/cajero'
import { imgUrl } from '@/lib/img'
import { useToastStore } from '@/store/useToastStore'

interface CartItem {
  productoId: number
  nombre: string
  precio: number
  cantidad: number
  imagenUrl?: string
  exclusiones: number[]
}

interface IngModal {
  productoId: number
  nombre: string
  ingredientes: { id: number; nombre: string; es_removible: boolean; excluido: boolean }[]
}

export default function CajeroPage() {
  const [productos, setProductos] = useState<ProductoOut[]>([])
  const [formasPago, setFormasPago] = useState<FormaPago[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedPago, setSelectedPago] = useState('')
  const [nombrePara, setNombrePara] = useState('')
  const [notas, setNotas] = useState('')
  const [creating, setCreating] = useState(false)
  const [ingModal, setIngModal] = useState<IngModal | null>(null)
  const [customizingProduct, setCustomizingProduct] = useState<ProductoOut | null>(null)
  const toast = useToastStore()

  useEffect(() => {
    Promise.all([
      fetchProductos({ size: 100 }),
      fetchFormasPago(),
    ]).then(([prods, fps]) => {
      setProductos(prods.items)
      setFormasPago(fps.filter((f) => f.habilitado))
      if (fps.length > 0) setSelectedPago(fps[0].codigo)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const openCustomizer = async (p: ProductoOut) => {
    try {
      const det = await fetchProducto(p.id)
      const removibles = (det as any).ingredientes?.filter((i: any) => i.es_removible) || []
      if (removibles.length === 0) {
        toast.info('Este producto no tiene ingredientes para modificar')
        return
      }
      setCustomizingProduct(p)
      setIngModal({
        productoId: p.id,
        nombre: p.nombre,
        ingredientes: removibles.map((i: any) => ({ id: i.id, nombre: i.nombre, es_removible: true, excluido: false })),
      })
    } catch {
      toast.info('Este producto no tiene ingredientes para modificar')
    }
  }

  const toggleExcluir = (id: number) => {
    setIngModal((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        ingredientes: prev.ingredientes.map((i) => i.id === id ? { ...i, excluido: !i.excluido } : i),
      }
    })
  }

  const confirmIng = () => {
    if (!ingModal || !customizingProduct) return
    const excl = ingModal.ingredientes.filter((i) => i.excluido).map((i) => i.id)
    addToCart(customizingProduct, excl)
    setIngModal(null)
    setCustomizingProduct(null)
  }

  const addToCart = (p: ProductoOut, exclusiones: number[]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productoId === p.id)
      if (existing) {
        return prev.map((i) => i.productoId === p.id ? { ...i, cantidad: i.cantidad + 1, exclusiones } : i)
      }
      return [...prev, {
        productoId: p.id,
        nombre: p.nombre,
        precio: p.precio_base,
        cantidad: 1,
        imagenUrl: (p as any).imagenes_url?.[0],
        exclusiones,
      }]
    })
  }

  const updateCant = (id: number, cant: number) => {
    if (cant <= 0) { setCart((prev) => prev.filter((i) => i.productoId !== id)); return }
    setCart((prev) => prev.map((i) => i.productoId === id ? { ...i, cantidad: cant } : i))
  }

  const reOpenCustomizer = async (item: CartItem) => {
    try {
      const det = await fetchProducto(item.productoId)
      const removibles = (det as any).ingredientes?.filter((i: any) => i.es_removible) || []
      setIngModal({
        productoId: item.productoId,
        nombre: item.nombre,
        ingredientes: removibles.map((i: any) => ({
          id: i.id, nombre: i.nombre, es_removible: true,
          excluido: item.exclusiones.includes(i.id),
        })),
      })
      setCustomizingProduct(null)
    } catch { /* ignore */ }
  }

  const confirmIngEdit = () => {
    if (!ingModal) return
    const excl = ingModal.ingredientes.filter((i) => i.excluido).map((i) => i.id)
    setCart((prev) => prev.map((i) => i.productoId === ingModal.productoId ? { ...i, exclusiones: excl } : i))
    setIngModal(null)
  }

  const subtotal = cart.reduce((sum, i) => sum + i.precio * i.cantidad, 0)
  const total = subtotal

  const handleCreate = async () => {
    if (cart.length === 0) { toast.error('Agregá productos al carrito'); return }
    if (!selectedPago) { toast.error('Seleccioná una forma de pago'); return }
    setCreating(true)
    try {
      const result = await createPedido({
        forma_pago_codigo: selectedPago,
        metodo_envio: 'DOMICILIO',
        nombre_para: nombrePara.trim() || null,
        notas: notas.trim() || null,
        items: cart.map((i) => ({ producto_id: i.productoId, cantidad: i.cantidad, personalizacion: i.exclusiones.length > 0 ? i.exclusiones : undefined })),
      })
      toast.success('Pedido creado', `#${result.id}`)
      setCart([])
      setNombrePara('')
      setNotas('')
    } catch { toast.error('Error al crear pedido') }
    setCreating(false)
  }

  const filtered = search ? productos.filter((p) => p.nombre.toLowerCase().includes(search.toLowerCase())) : productos

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 100px)', gap: 24 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ marginBottom: 16 }}>
          <input placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', maxWidth: 360, padding: '8px 12px', background: '#1f2111', border: '1px solid #343625', color: '#e4e4cc', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, alignContent: 'start' }}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: '#6b6151' }}>Cargando...</div>
          ) : filtered.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: '#6b6151' }}>Sin productos</div>
          ) : (
            filtered.filter((p) => p.disponible && p.stock_cantidad > 0).map((p) => (
              <div key={p.id}
                style={{ background: '#1f2111', border: '1px solid #2a2b1b', display: 'flex', flexDirection: 'column', transition: 'border 0.15s' }}
              >
                <div style={{ height: 120, background: '#2a2b1b', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {(p as any).imagenes_url?.[0]
                    ? <img src={imgUrl((p as any).imagenes_url[0])} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 32, opacity: 0.3 }}>🍽</span>}
                </div>
                <div style={{ padding: '8px 10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#e4e4cc', fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>{p.nombre}</span>
                  <span style={{ color: '#e9c349', fontSize: 14, fontWeight: 700, marginTop: 'auto', paddingTop: 6 }}>
                    ${p.precio_base.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 0 }}>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(p, []) }}
                    style={{ flex: 1, padding: '8px 0', border: 'none', background: '#e9c349', color: '#3c2f00', fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.02em' }}>
                    AGREGAR
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); openCustomizer(p) }}
                    style={{ flex: 1, padding: '8px 0', border: 'none', borderLeft: '1px solid #3c2f0030', background: '#d4b030', color: '#3c2f00', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                    MODIFICAR
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ width: 350, flexShrink: 0, background: '#1f2111', border: '1px solid #2a2b1b', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #343625' }}>
          <h3 style={{ margin: 0, color: '#e4e4cc', fontSize: 16, fontFamily: "'Playfair Display', serif" }}>
            Carrito <span style={{ color: '#6b6151', fontSize: 13, fontFamily: "'Manrope', sans-serif" }}>({cart.length})</span>
          </h3>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {cart.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#6b6151', fontSize: 13 }}>Carrito vacío</div>
          ) : (
            cart.map((item) => (
              <div key={item.productoId} style={{ padding: '10px 16px', borderBottom: '1px solid #2a2b1b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#e4e4cc', fontSize: 13, fontWeight: 500 }}>{item.nombre}</div>
                    <div style={{ color: '#e9c349', fontSize: 12 }}>${(item.precio * item.cantidad).toFixed(2)}</div>
                    {item.exclusiones.length > 0 && (
                      <div style={{ color: '#ffb4ab', fontSize: 11, marginTop: 2 }}>
                        Sin: {item.exclusiones.length} ingrediente{item.exclusiones.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button onClick={() => updateCant(item.productoId, item.cantidad - 1)}
                      style={{ width: 24, height: 24, border: '1px solid #444748', background: 'transparent', color: '#c4c7c7', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>−</button>
                    <span style={{ color: '#e4e4cc', fontSize: 13, fontWeight: 600, minWidth: 18, textAlign: 'center' }}>{item.cantidad}</span>
                    <button onClick={() => updateCant(item.productoId, item.cantidad + 1)}
                      style={{ width: 24, height: 24, border: '1px solid #444748', background: 'transparent', color: '#c4c7c7', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>+</button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
        <div style={{ padding: '14px 16px', borderTop: '1px solid #343625' }}>
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', color: '#6b6151', fontSize: 12, marginBottom: 4 }}>Forma de pago</label>
            <select value={selectedPago} onChange={(e) => setSelectedPago(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', background: '#2a2b1b', border: '1px solid #444748', color: '#e4e4cc', fontSize: 13, outline: 'none' }}>
              {formasPago.map((fp) => (<option key={fp.codigo} value={fp.codigo}>{fp.descripcion}</option>))}
            </select>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', color: '#6b6151', fontSize: 12, marginBottom: 4 }}>Cliente</label>
            <input placeholder="Nombre del cliente" value={nombrePara} onChange={(e) => setNombrePara(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', background: '#2a2b1b', border: '1px solid #444748', color: '#e4e4cc', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', color: '#6b6151', fontSize: 12, marginBottom: 4 }}>Notas</label>
            <input placeholder="Opcional" value={notas} onChange={(e) => setNotas(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', background: '#2a2b1b', border: '1px solid #444748', color: '#e4e4cc', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ borderTop: '1px solid #343625', paddingTop: 10, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c4c7c7', fontSize: 13, marginBottom: 4 }}>
              <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e9c349', fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={handleCreate} disabled={creating || cart.length === 0}
            style={{
              width: '100%', padding: '12px', border: 'none', background: cart.length === 0 ? '#2a2b1b' : '#e9c349',
              color: cart.length === 0 ? '#6b6151' : '#3c2f00', fontSize: 14, fontWeight: 700,
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer', letterSpacing: '0.03em',
            }}>
            {creating ? 'Creando pedido...' : `COBRAR $${total.toFixed(2)}`}
          </button>
        </div>
      </div>

      {ingModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }}
          onClick={() => { setIngModal(null); setCustomizingProduct(null) }}>
          <div style={{ background: '#1f2111', border: '1px solid #343625', width: '100%', maxWidth: 400, padding: 24 }}
            onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#e4e4cc', fontSize: 18, margin: '0 0 4px' }}>
              {ingModal.nombre}
            </h3>
            <p style={{ color: '#6b6151', fontSize: 12, marginBottom: 16 }}>Seleccioná ingredientes a excluir</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
              {ingModal.ingredientes.map((ing) => (
                <label key={ing.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                  cursor: 'pointer', borderRadius: 2,
                  background: ing.excluido ? '#ffb4ab10' : 'transparent',
                  border: ing.excluido ? '1px solid #ffb4ab30' : '1px solid transparent',
                }}>
                  <input type="checkbox" checked={ing.excluido}
                    onChange={() => toggleExcluir(ing.id)}
                    style={{ accentColor: '#ffb4ab' }} />
                  <span style={{
                    flex: 1, color: ing.excluido ? '#ffb4ab' : '#c4c7c7', fontSize: 13,
                    textDecoration: ing.excluido ? 'line-through' : 'none',
                  }}>{ing.nombre}</span>
                  {ing.excluido && <span style={{ color: '#ffb4ab', fontSize: 11 }}>Excluido</span>}
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 0 }}>
              <button onClick={() => { setIngModal(null); setCustomizingProduct(null) }}
                style={{ flex: 1, padding: '10px 0', border: 'none', background: '#2a2b1b', color: '#c4c7c7', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                Cancelar
              </button>
              <button onClick={customizingProduct ? confirmIng : confirmIngEdit}
                style={{ flex: 1, padding: '10px 0', border: 'none', background: '#e9c349', color: '#3c2f00', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                {customizingProduct ? 'Agregar' : 'Modificar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
