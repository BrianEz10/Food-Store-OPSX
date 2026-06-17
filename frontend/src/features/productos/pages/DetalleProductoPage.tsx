import { useParams, Link } from 'react-router-dom'
import { useProduct } from '@/features/productos/hooks/useProducts'
import { useCartStore } from '@/store/useCartStore'
import { imgUrl } from '@/lib/img'
import { useToastStore } from '@/store/useToastStore'

export default function DetalleProductoPage() {
  const { id } = useParams<{ id: string }>()
  const productoId = Number(id)
  const { data: product, isLoading } = useProduct(productoId)
  const addItem = useCartStore((s) => s.addItem)
  const addToast = useToastStore((s) => s.addToast)

  if (isLoading) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px', display: 'flex', gap: 32 }}>
        <div style={{ width: '50%', height: 300, background: '#2a2b1b' }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 24, background: '#2a2b1b', marginBottom: 12, width: '70%' }} />
          <div style={{ height: 18, background: '#2a2b1b', width: '40%', marginBottom: 20 }} />
          <div style={{ height: 14, background: '#2a2b1b', width: '100%', marginBottom: 8 }} />
          <div style={{ height: 14, background: '#2a2b1b', width: '80%' }} />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ color: '#c4c7c7' }}>Producto no encontrado</p>
        <Link to="/" style={{ color: '#e9c349' }}>Volver al catálogo</Link>
      </div>
    )
  }

  const handleAdd = () => {
    addItem({
      productoId: product.id,
      nombre: product.nombre,
      precio: product.precio_base,
      imagenUrl: product.imagenes_url?.[0] || '',
      exclusiones: [],
    })
    addToast(`${product.nombre} agregado al carrito`, 'success')
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <Link to="/" style={{ color: '#6b6151', fontSize: 14, textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>← Volver al catálogo</Link>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ background: '#2a2b1b', borderRadius: 4, overflow: 'hidden', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {product.imagenes_url?.[0] ? (
              <img src={imgUrl(product.imagenes_url[0])} alt={product.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: '#6b6151' }}>Sin imagen</span>
            )}
          </div>
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#e4e4cc', margin: '0 0 8px' }}>{product.nombre}</h1>
          <p style={{ color: '#e9c349', fontSize: 24, fontWeight: 600, margin: '0 0 16px' }}>${product.precio_base.toLocaleString('es-AR')}</p>
          {product.descripcion && <p style={{ color: '#c4c7c7', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{product.descripcion}</p>}

          {product.categorias?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: '#6b6151', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Categorías</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {product.categorias.map((c) => (
                  <span key={c.id} style={{ background: '#2a2b1b', color: '#c4c7c7', padding: '4px 10px', fontSize: 12 }}>{c.nombre}</span>
                ))}
              </div>
            </div>
          )}

          {product.ingredientes?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ color: '#6b6151', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Ingredientes</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {product.ingredientes.map((ing) => (
                  <span key={ing.id} style={{
                    background: ing.es_alergeno ? '#93000a30' : '#2a2b1b',
                    color: ing.es_alergeno ? '#ffb4ab' : '#c4c7c7',
                    padding: '4px 10px', fontSize: 12,
                    border: ing.es_alergeno ? '1px solid #ffb4ab40' : 'none',
                  }}>
                    {ing.nombre}{ing.es_alergeno ? ' ⚠️' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleAdd}
            style={{ width: '100%', padding: '14px', background: '#e9c349', color: '#131407', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', borderRadius: 4 }}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}
