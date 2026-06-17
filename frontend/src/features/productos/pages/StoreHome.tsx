import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '@/features/productos/hooks/useProducts'
import { useCategories } from '@/features/categorias/hooks/useCategories'
import { imgUrl } from '@/lib/img'

export default function StoreHome() {
  const [buscar, setBuscar] = useState('')
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined)
  const { data: productsData, isLoading: loadingProducts } = useProducts({ size: 50, disponible: true, categoria_id: categoriaId, buscar: buscar || undefined })
  const { data: categorias } = useCategories()

  const parentCats = categorias?.filter((c) => !c.parent_id) || []
  const products = productsData?.items || []

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#e4e4cc', margin: '0 0 8px' }}>Catálogo</h1>
        <p style={{ color: '#6b6151', fontSize: 14, margin: 0 }}>Elegí tus productos favoritos</p>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        <input type="text" value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Buscar productos..."
          style={{ flex: 1, minWidth: 200, padding: '10px 14px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 14 }} />
        <select value={categoriaId ?? ''} onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : undefined)}
          style={{ padding: '10px 14px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 14 }}>
          <option value="">Todas las categorías</option>
          {parentCats.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {loadingProducts ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: '#1f2111', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: 180, background: '#2a2b1b' }} />
              <div style={{ padding: 16 }}>
                <div style={{ height: 16, background: '#2a2b1b', marginBottom: 8, width: '60%' }} />
                <div style={{ height: 14, background: '#2a2b1b', width: '40%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#6b6151' }}>
          <p style={{ fontSize: 18 }}>No se encontraron productos</p>
          <p style={{ fontSize: 14 }}>Probá con otros filtros</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {products.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration: 'none', background: '#1f2111', borderRadius: 4, overflow: 'hidden', display: 'block', transition: 'transform 0.15s', border: '1px solid #2a2b1b' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}>
              <div style={{ height: 180, background: '#2a2b1b', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {p.imagenes_url?.[0] ? (
                  <img src={imgUrl(p.imagenes_url[0])} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#6b6151', fontSize: 13 }}>Sin imagen</span>
                )}
              </div>
              <div style={{ padding: 16 }}>
                <h3 style={{ color: '#e4e4cc', fontSize: 15, margin: '0 0 4px', fontWeight: 500 }}>{p.nombre}</h3>
                <p style={{ color: '#e9c349', fontSize: 16, margin: 0, fontWeight: 600 }}>${p.precio_base.toLocaleString('es-AR')}</p>
                {!p.disponible || p.stock_cantidad === 0 ? (
                  <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 8px', background: '#93000a30', color: '#ffb4ab', border: '1px solid #ffb4ab40', fontSize: 11 }}>Sin stock</span>
                ) : <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 8px', background: '#1a3a1a30', color: '#80c080', fontSize: 11 }}>En stock</span>}
                {p.descripcion && <p style={{ color: '#6b6151', fontSize: 12, margin: '4px 0 0' }}>{p.descripcion}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
