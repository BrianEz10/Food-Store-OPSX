import { useEffect, useState } from 'react'
import { fetchIngredientes, createIngrediente, updateIngrediente, deleteIngrediente, type Ingrediente, type IngredienteInput } from '@/lib/ingredientes'

export default function IngredientesPage() {
  const [items, setItems] = useState<Ingrediente[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; item?: Ingrediente } | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    fetchIngredientes()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = search
    ? items.filter((i) => i.nombre.toLowerCase().includes(search.toLowerCase()))
    : items

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#e4e4cc', fontSize: 24, margin: 0 }}>Ingredientes</h1>
        <button onClick={() => setModal({ mode: 'create' })} style={{ ...btn, background: '#e9c349', color: '#3c2f00' }}>
          + Nuevo
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: 280, padding: '8px 12px', background: '#1f2111', border: '1px solid #343625', color: '#e4e4cc', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ background: '#1f2111', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b6151' }}>Cargando...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b6151' }}>Sin ingredientes</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2b1b' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6b6151', fontWeight: 500 }}>ID</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6b6151', fontWeight: 500 }}>Nombre</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6b6151', fontWeight: 500 }}>Descripción</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', color: '#6b6151', fontWeight: 500 }}>Alérgeno</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', color: '#6b6151', fontWeight: 500 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} style={{ borderBottom: '1px solid #2a2b1b' }}>
                  <td style={{ padding: '10px 12px', color: '#6b6151' }}>{i.id}</td>
                  <td style={{ padding: '10px 12px', color: '#e4e4cc' }}>{i.nombre}</td>
                  <td style={{ padding: '10px 12px', color: '#c4c7c7', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.descripcion || '—'}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    {i.es_alergeno
                      ? <span style={{ color: '#ffb4ab', fontSize: 12 }}>⚠ Sí</span>
                      : <span style={{ color: '#6b6151', fontSize: 12 }}>No</span>
                    }
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <button onClick={() => setModal({ mode: 'edit', item: i })} style={{ ...btnSm, color: '#c4c7c7' }}>Editar</button>
                    <button onClick={() => setDeleteId(i.id)} style={{ ...btnSm, color: '#ffb4ab' }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <IngredienteModal
          mode={modal.mode} item={modal.item}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load() }}
        />
      )}
      {deleteId && (
        <DeleteModal id={deleteId} onClose={() => setDeleteId(null)} onDone={() => { setDeleteId(null); load() }} />
      )}
    </div>
  )
}

function IngredienteModal({ mode, item, onClose, onSave }: {
  mode: 'create' | 'edit'
  item?: Ingrediente
  onClose: () => void
  onSave: () => void
}) {
  const [nombre, setNombre] = useState(item?.nombre || '')
  const [descripcion, setDescripcion] = useState(item?.descripcion || '')
  const [esAlergeno, setEsAlergeno] = useState(item?.es_alergeno || false)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const handleSave = async () => {
    if (!nombre.trim()) { setErr('El nombre es obligatorio'); return }
    setSaving(true)
    setErr('')
    try {
      const payload: IngredienteInput = { nombre: nombre.trim(), descripcion: descripcion.trim() || null, es_alergeno: esAlergeno }
      if (mode === 'create') await createIngrediente(payload)
      else await updateIngrediente(item!.id, payload)
      onSave()
    } catch (e: any) {
      setErr(e?.response?.data?.detail?.[0]?.msg || 'Error al guardar')
    }
    setSaving(false)
  }

  return (
    <Modal onClose={onClose}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#e4e4cc', fontSize: 18, margin: '0 0 16px' }}>
        {mode === 'create' ? 'Nuevo ingrediente' : 'Editar ingrediente'}
      </h3>
      {err && <p style={{ color: '#ffb4ab', fontSize: 13, marginBottom: 12 }}>{err}</p>}
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', color: '#c4c7c7', fontSize: 13, marginBottom: 4 }}>Nombre *</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)}
          style={{ width: '100%', padding: '8px 10px', background: '#2a2b1b', border: '1px solid #444748', color: '#e4e4cc', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', color: '#c4c7c7', fontSize: 13, marginBottom: 4 }}>Descripción</label>
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
          style={{ width: '100%', padding: '8px 10px', background: '#2a2b1b', border: '1px solid #444748', color: '#e4e4cc', fontSize: 13, outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: 60 }} />
      </div>
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" checked={esAlergeno} onChange={(e) => setEsAlergeno(e.target.checked)}
          style={{ accentColor: '#e9c349' }} />
        <label style={{ color: '#c4c7c7', fontSize: 13, cursor: 'pointer' }}>Es alérgeno</label>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
        <button onClick={onClose} style={{ ...mBtn, background: 'transparent', color: '#c4c7c7' }}>Cancelar</button>
        <button onClick={handleSave} disabled={saving} style={{ ...mBtn, background: '#e9c349', color: '#3c2f00' }}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </Modal>
  )
}

function DeleteModal({ id, onClose, onDone }: { id: number; onClose: () => void; onDone: () => void }) {
  const [saving, setSaving] = useState(false)

  const handleDelete = async () => {
    setSaving(true)
    try { await deleteIngrediente(id); onDone() }
    catch { alert('Error al eliminar') }
    setSaving(false)
  }

  return (
    <Modal onClose={onClose}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#e4e4cc', fontSize: 18, margin: '0 0 16px' }}>¿Eliminar ingrediente?</h3>
      <p style={{ color: '#c4c7c7', fontSize: 14, marginBottom: 20 }}>Esta acción no se puede deshacer.</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{ ...mBtn, background: 'transparent', color: '#c4c7c7' }}>Cancelar</button>
        <button onClick={handleDelete} disabled={saving} style={{ ...mBtn, background: '#ffb4ab', color: '#690005' }}>
          {saving ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </Modal>
  )
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div style={{ background: '#1f2111', border: '1px solid #343625', width: '100%', maxWidth: 420, padding: 24 }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

const btn: React.CSSProperties = { border: 'none', padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const btnSm: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, padding: '4px 8px' }
const mBtn: React.CSSProperties = { border: 'none', padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
