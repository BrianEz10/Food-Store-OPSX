import { useEffect, useState } from 'react'
import { fetchProductos, createProducto, updateProducto, toggleDisponibilidad, deleteProducto, fetchProducto, uploadImagen, type ProductoOut } from '@/lib/productos'
import { fetchCategorias, type Categoria } from '@/lib/categorias'
import { fetchIngredientes, type Ingrediente } from '@/lib/ingredientes'
import { imgUrl } from '@/lib/img'

interface IngItem { ingrediente_id: number; nombre: string }

export default function ProductosPage() {
  const [items, setItems] = useState<ProductoOut[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; id?: number } | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = (p: number, q?: string) => {
    setLoading(true)
    fetchProductos({ page: p, size: 20, buscar: q || undefined })
      .then((d) => { setItems(d.items); setTotal(d.total); setPages(d.pages); setPage(d.page) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(page) }, [])

  const handleSearch = (val: string) => {
    setSearch(val)
    load(1, val)
  }

  const handleToggle = async (id: number, disponible: boolean) => {
    try {
      const updated = await toggleDisponibilidad(id, !disponible)
      setItems((prev) => prev.map((p) => p.id === id ? updated : p))
    } catch { alert('Error al cambiar disponibilidad') }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#e4e4cc', fontSize: 24, margin: 0 }}>Productos</h1>
        <button onClick={() => setModal({ mode: 'create' })} style={{ ...btn, background: '#e9c349', color: '#3c2f00' }}>+ Nuevo</button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input placeholder="Buscar por nombre..." value={search} onChange={(e) => handleSearch(e.target.value)}
          style={{ width: '100%', maxWidth: 320, padding: '8px 12px', background: '#1f2111', border: '1px solid #343625', color: '#e4e4cc', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ background: '#1f2111', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b6151' }}>Cargando...</div>
        ) : items.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b6151' }}>Sin productos</div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2b1b' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6b6151', fontWeight: 500, width: 50 }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6b6151', fontWeight: 500 }}>Nombre</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6b6151', fontWeight: 500 }}>Categorías</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', color: '#6b6151', fontWeight: 500, width: 100 }}>Precio</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', color: '#6b6151', fontWeight: 500, width: 70 }}>Stock</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', color: '#6b6151', fontWeight: 500, width: 90 }}>Disponible</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', color: '#6b6151', fontWeight: 500, width: 140 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #2a2b1b' }}>
                    <td style={{ padding: '10px 12px', color: '#6b6151' }}>{p.id}</td>
                    <td style={{ padding: '10px 12px', color: '#e4e4cc' }}>{p.nombre}</td>
                    <td style={{ padding: '10px 12px' }}>
                      {(p as any).categorias?.length > 0 ? (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {(p as any).categorias.map((c: any) => (
                            <span key={c.id} style={{ padding: '2px 6px', borderRadius: 3, fontSize: 11, background: '#e9c34915', color: '#e9c349', border: '1px solid #e9c34930' }}>{c.nombre}</span>
                          ))}
                        </div>
                      ) : <span style={{ color: '#6b6151', fontSize: 12 }}>—</span>}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#e9c349', textAlign: 'right', fontWeight: 600 }}>${p.precio_base.toFixed(2)}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: p.stock_cantidad <= 0 ? '#ffb4ab' : '#c4c7c7' }}>{p.stock_cantidad}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <button onClick={() => handleToggle(p.id, p.disponible)}
                        style={{ padding: '2px 10px', borderRadius: 3, fontSize: 11, border: 'none', cursor: 'pointer', background: p.disponible ? '#60dac420' : '#ffb4ab20', color: p.disponible ? '#60dac4' : '#ffb4ab' }}>
                        {p.disponible ? 'Sí' : 'No'}
                      </button>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <button onClick={() => setModal({ mode: 'edit', id: p.id })} style={{ ...btnSm, color: '#c4c7c7' }}>Editar</button>
                      <button onClick={() => setDeleteId(p.id)} style={{ ...btnSm, color: '#ffb4ab' }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 16, alignItems: 'center' }}>
                <button disabled={page <= 1} onClick={() => load(page - 1, search)} style={{ ...pBtn, opacity: page <= 1 ? 0.4 : 1 }}>← Anterior</button>
                <span style={{ color: '#6b6151', fontSize: 13 }}>{page} / {pages}</span>
                <button disabled={page >= pages} onClick={() => load(page + 1, search)} style={{ ...pBtn, opacity: page >= pages ? 0.4 : 1 }}>Siguiente →</button>
              </div>
            )}
          </>
        )}
      </div>

      {modal && <ProductoFormModal mode={modal.mode} id={modal.id} onClose={() => setModal(null)} onSave={() => { setModal(null); load(page) }} />}
      {deleteId && <DeleteModal id={deleteId} onClose={() => setDeleteId(null)} onDone={() => { setDeleteId(null); load(page) }} />}
    </div>
  )
}

function ProductoFormModal({ mode, id, onClose, onSave }: { mode: 'create' | 'edit'; id?: number; onClose: () => void; onSave: () => void }) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState(0)
  const [stock, setStock] = useState(0)
  const [disponible, setDisponible] = useState(true)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [selectedCat, setSelectedCat] = useState<number[]>([])
  const [imagenes, setImagenes] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [ingItems, setIngItems] = useState<IngItem[]>([])
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [loadingData, setLoadingData] = useState(mode === 'edit')

  useEffect(() => {
    fetchCategorias().then(setCategorias).catch(() => {})
    fetchIngredientes().then(setIngredientes).catch(() => {})
    if (mode === 'edit' && id) {
      fetchProducto(id).then((p) => {
        setNombre(p.nombre)
        setDescripcion(p.descripcion || '')
        setPrecio(p.precio_base)
        setStock(p.stock_cantidad)
        setDisponible(p.disponible)
        setSelectedCat(p.categorias.map((c: any) => c.id))
        setImagenes((p as any).imagenes_url || [])
        setIngItems((p as any).ingredientes?.map((ing: any) => ({
          ingrediente_id: ing.id, nombre: ing.nombre,
        })) || [])
      }).finally(() => setLoadingData(false))
    }
  }, [])

  const handleSave = async () => {
    if (!nombre.trim()) { setErr('El nombre es obligatorio'); return }
    if (precio <= 0) { setErr('El precio debe ser mayor a 0'); return }
    setSaving(true)
    setErr('')
    try {
      const payload: any = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        precio_base: precio,
        stock_cantidad: stock,
        disponible,
        imagenes_url: imagenes.length > 0 ? imagenes : null,
        categorias: selectedCat.map((c) => ({ categoria_id: c, es_principal: false })),
        ingredientes: ingItems.map((i) => ({
          ingrediente_id: i.ingrediente_id,
          cantidad: 1,
        })),
      }
      if (mode === 'create') await createProducto(payload)
      else await updateProducto(id!, payload)
      onSave()
    } catch (e: any) {
      setErr(e?.response?.data?.detail?.[0]?.msg || 'Error al guardar')
    }
    setSaving(false)
  }

  const addIng = (ing: Ingrediente) => {
    if (ingItems.find((i) => i.ingrediente_id === ing.id)) return
    setIngItems((prev) => [...prev, { ingrediente_id: ing.id, nombre: ing.nombre }])
  }

  const removeIng = (id: number) => setIngItems((prev) => prev.filter((i) => i.ingrediente_id !== id))

  if (loadingData) return <Modal onClose={onClose}><p style={{ color: '#6b6151' }}>Cargando...</p></Modal>

  return (
    <Modal onClose={onClose}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#e4e4cc', fontSize: 18, margin: '0 0 16px' }}>
        {mode === 'create' ? 'Nuevo producto' : 'Editar producto'}
      </h3>
      {err && <p style={{ color: '#ffb4ab', fontSize: 13, marginBottom: 12 }}>{err}</p>}
      <Field label="Nombre *" value={nombre} onChange={setNombre} />
      <FieldArea label="Descripción" value={descripcion} onChange={setDescripcion} />
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', color: '#c4c7c7', fontSize: 13, marginBottom: 4 }}>Precio *</label>
          <input type="number" min={0} step={0.01} value={precio} onChange={(e) => setPrecio(parseFloat(e.target.value) || 0)} style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', color: '#c4c7c7', fontSize: 13, marginBottom: 4 }}>Stock</label>
          <input type="number" min={0} value={stock} onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))} style={inputStyle} />
        </div>
      </div>
      <div style={{ margin: '12px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" checked={disponible} onChange={(e) => setDisponible(e.target.checked)} style={{ accentColor: '#e9c349' }} />
        <label style={{ color: '#c4c7c7', fontSize: 13, cursor: 'pointer' }}>Disponible para la venta</label>
      </div>

      {/* Categorías en árbol estático */}
      {categorias.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', color: '#c4c7c7', fontSize: 13, marginBottom: 6 }}>Categorías</label>
          <div style={{ border: '1px solid #343625', padding: '8px 0', maxHeight: 250, overflowY: 'auto' }}>
            <CategoryTree
              items={categorias}
              selected={selectedCat}
              onToggle={(id) => setSelectedCat((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])}
              parentId={null}
              depth={0}
            />
          </div>
        </div>
      )}

      {/* Ingredientes */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', color: '#c4c7c7', fontSize: 13, marginBottom: 4 }}>Ingredientes</label>
        <div style={{ border: '1px solid #343625', maxHeight: 200, overflowY: 'auto', marginBottom: 8 }}>
          {ingredientes.length === 0 ? (
            <div style={{ padding: 12, color: '#6b6151', fontSize: 12, textAlign: 'center' }}>Sin ingredientes. Creá ingredientes primero.</div>
          ) : (
            ingredientes.map((ing) => {
              const active = ingItems.find((i) => i.ingrediente_id === ing.id)
              return (
                <div key={ing.id} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
                  borderBottom: '1px solid #2a2b1b', background: active ? '#e9c34908' : 'transparent',
                  fontSize: 12,
                }}>
                  <button onClick={() => active ? removeIng(ing.id) : addIng(ing)}
                    style={{
                      width: 20, height: 20, border: `1px solid ${active ? '#e9c349' : '#444748'}`,
                      background: active ? '#e9c349' : 'transparent', color: active ? '#3c2f00' : '#c4c7c7',
                      cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>{active ? '✓' : '+'}</button>
                  <span style={{ flex: 1, color: active ? '#e9c349' : '#c4c7c7' }}>{ing.nombre}</span>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Imágenes */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', color: '#c4c7c7', fontSize: 13, marginBottom: 4 }}>Imágenes</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          {imagenes.map((url, i) => (
            <div key={i} style={{ position: 'relative', width: 72, height: 72, background: '#2a2b1b', borderRadius: 4, overflow: 'hidden' }}>
              <img src={imgUrl(url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setImagenes((prev) => prev.filter((_, j) => j !== i))}
                style={{ position: 'absolute', top: 2, right: 2, background: '#ffb4ab', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#690005' }}>×</button>
            </div>
          ))}
        </div>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#2a2b1b', border: '1px dashed #444748', cursor: 'pointer', fontSize: 12, color: '#c4c7c7' }}>
          {uploading ? 'Subiendo...' : '+ Agregar imagen'}
          <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploading}
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              setUploading(true)
              try { const result = await uploadImagen(file); setImagenes((prev) => [...prev, result.url]) }
              catch { alert('Error al subir imagen') }
              setUploading(false)
              e.target.value = ''
            }} />
        </label>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
        <button onClick={onClose} style={{ ...mBtn, background: 'transparent', color: '#c4c7c7' }}>Cancelar</button>
        <button onClick={handleSave} disabled={saving} style={{ ...mBtn, background: '#e9c349', color: '#3c2f00' }}>{saving ? 'Guardando...' : 'Guardar'}</button>
      </div>
    </Modal>
  )
}

function CategoryTree({ items, selected, onToggle, parentId, depth }: {
  items: Categoria[]; selected: number[]; onToggle: (id: number) => void; parentId: number | null; depth: number
}) {
  const children = items.filter((c) => c.parent_id === parentId)
  if (children.length === 0) return null
  return (
    <div>
      {children.map((c) => (
        <div key={c.id}>
          <label
            onClick={() => onToggle(c.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', paddingLeft: 12 + depth * 20,
              cursor: 'pointer', fontSize: 13,
              background: selected.includes(c.id) ? '#e9c34910' : 'transparent',
              borderLeft: selected.includes(c.id) ? '2px solid #e9c349' : '2px solid transparent',
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: selected.includes(c.id) ? '#e9c349' : '#444748',
            }} />
            <span style={{ color: selected.includes(c.id) ? '#e9c349' : '#c4c7c7' }}>{c.nombre}</span>
          </label>
          <CategoryTree items={items} selected={selected} onToggle={onToggle} parentId={c.id} depth={depth + 1} />
        </div>
      ))}
    </div>
  )
}

function DeleteModal({ id, onClose, onDone }: { id: number; onClose: () => void; onDone: () => void }) {
  const [saving, setSaving] = useState(false)
  const handleDelete = async () => {
    setSaving(true)
    try { await deleteProducto(id); onDone() }
    catch { alert('Error al eliminar') }
    setSaving(false)
  }
  return (
    <Modal onClose={onClose}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#e4e4cc', fontSize: 18, margin: '0 0 16px' }}>¿Eliminar producto?</h3>
      <p style={{ color: '#c4c7c7', fontSize: 14, marginBottom: 20 }}>Esta acción no se puede deshacer.</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{ ...mBtn, background: 'transparent', color: '#c4c7c7' }}>Cancelar</button>
        <button onClick={handleDelete} disabled={saving} style={{ ...mBtn, background: '#ffb4ab', color: '#690005' }}>{saving ? 'Eliminando...' : 'Eliminar'}</button>
      </div>
    </Modal>
  )
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div style={{ background: '#1f2111', border: '1px solid #343625', width: '100%', maxWidth: 480, padding: 24, maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', color: '#c4c7c7', fontSize: 13, marginBottom: 4 }}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </div>
  )
}

function FieldArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', color: '#c4c7c7', fontSize: 13, marginBottom: 4 }}>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} />
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', background: '#2a2b1b', border: '1px solid #444748',
  color: '#e4e4cc', fontSize: 13, outline: 'none', boxSizing: 'border-box',
}

const btn: React.CSSProperties = { border: 'none', padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const btnSm: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, padding: '4px 8px' }
const mBtn: React.CSSProperties = { border: 'none', padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const pBtn: React.CSSProperties = { background: '#2a2b1b', border: '1px solid #444748', color: '#c4c7c7', padding: '6px 14px', fontSize: 12, cursor: 'pointer' }
