import { useEffect, useState } from 'react'
import { fetchCategorias, createCategoria, updateCategoria, deleteCategoria, type Categoria, type CategoriaInput } from '@/lib/categorias'

export default function CategoriasPage() {
  const [items, setItems] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; item?: Categoria; parentId?: number | null } | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    fetchCategorias()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const groupByParent = (items: Categoria[]): Map<number | null, Categoria[]> => {
    const map = new Map<number | null, Categoria[]>()
    for (const item of items) {
      const key = item.parent_id
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(item)
    }
    return map
  }

  const grouped = groupByParent(items)
  const roots = grouped.get(null) || []
  const toggle = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#e4e4cc', fontSize: 24, margin: 0 }}>Categorías</h1>
        <button onClick={() => setModal({ mode: 'create' })} style={{ ...btn, background: '#e9c349', color: '#3c2f00' }}>+ Nueva</button>
      </div>

      <div style={{ background: '#1f2111' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b6151' }}>Cargando...</div>
        ) : items.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b6151' }}>Sin categorías</div>
        ) : (
          <div style={{ padding: '8px 0' }}>
            {roots.map((cat) => (
              <TreeNode
                key={cat.id}
                cat={cat}
                grouped={grouped}
                expanded={expanded}
                onToggle={toggle}
                onEdit={(c) => setModal({ mode: 'edit', item: c })}
                onAddChild={(parentId) => setModal({ mode: 'create', parentId })}
                onDelete={(id) => setDeleteId(id)}
                depth={0}
              />
            ))}
          </div>
        )}
      </div>

      {modal && (
        <CategoriaModal
          mode={modal.mode} item={modal.item} parentId={modal.parentId} categorias={items}
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

function TreeNode({ cat, grouped, expanded, onToggle, onEdit, onAddChild, onDelete, depth }: {
  cat: Categoria
  grouped: Map<number | null, Categoria[]>
  expanded: Set<number>
  onToggle: (id: number) => void
  onEdit: (c: Categoria) => void
  onAddChild: (parentId: number) => void
  onDelete: (id: number) => void
  depth: number
}) {
  const children = grouped.get(cat.id) || []
  const hasChildren = children.length > 0
  const isExpanded = expanded.has(cat.id)

  return (
    <div>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 16px', paddingLeft: 16 + depth * 24,
          borderBottom: '1px solid #2a2b1b', cursor: hasChildren ? 'pointer' : 'default',
        }}
        onClick={() => hasChildren && onToggle(cat.id)}
      >
        <span style={{ width: 16, textAlign: 'center', color: '#6b6151', fontSize: 12 }}>
          {hasChildren ? (isExpanded ? '▼' : '▶') : '•'}
        </span>
        <span style={{ flex: 1, color: '#e4e4cc', fontSize: 14, fontWeight: depth === 0 ? 600 : 400 }}>
          {cat.nombre}
        </span>
        {cat.descripcion && (
          <span style={{ color: '#6b6151', fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {cat.descripcion}
          </span>
        )}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onAddChild(cat.id)} style={{ ...btnSm, color: '#e9c349' }}>+Hijo</button>
          <button onClick={() => onEdit(cat)} style={{ ...btnSm, color: '#c4c7c7' }}>Editar</button>
          <button onClick={() => onDelete(cat.id)} style={{ ...btnSm, color: '#ffb4ab' }}>Eliminar</button>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {children.map((child) => (
            <TreeNode
              key={child.id}
              cat={child}
              grouped={grouped}
              expanded={expanded}
              onToggle={onToggle}
              onEdit={onEdit}
              onAddChild={onAddChild}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CategoriaModal({ mode, item, parentId, categorias, onClose, onSave }: {
  mode: 'create' | 'edit'; item?: Categoria; parentId?: number | null
  categorias: Categoria[]; onClose: () => void; onSave: () => void
}) {
  const [nombre, setNombre] = useState(item?.nombre || '')
  const [descripcion, setDescripcion] = useState(item?.descripcion || '')
  const [parent, setParent] = useState<number | null>(item?.parent_id ?? parentId ?? null)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const handleSave = async () => {
    if (!nombre.trim()) { setErr('El nombre es obligatorio'); return }
    setSaving(true)
    setErr('')
    try {
      const payload: CategoriaInput = { nombre: nombre.trim(), descripcion: descripcion.trim() || null, parent_id: parent }
      if (mode === 'create') await createCategoria(payload)
      else await updateCategoria(item!.id, payload)
      onSave()
    } catch (e: any) {
      setErr(e?.response?.data?.detail?.[0]?.msg || 'Error al guardar')
    }
    setSaving(false)
  }

  return (
    <Modal onClose={onClose}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#e4e4cc', fontSize: 18, margin: '0 0 16px' }}>
        {mode === 'create' ? 'Nueva categoría' : 'Editar categoría'}
      </h3>
      {err && <p style={{ color: '#ffb4ab', fontSize: 13, marginBottom: 12 }}>{err}</p>}
      <Field label="Nombre *" value={nombre} onChange={setNombre} />
      <FieldArea label="Descripción" value={descripcion} onChange={setDescripcion} />
      <Select
        label="Categoría padre"
        value={String(parent ?? '')}
        onChange={(v) => setParent(v ? Number(v) : null)}
        options={[
          { value: '', label: '— Ninguna (raíz) —' },
          ...categorias.filter((c) => c.id !== item?.id).map((c) => ({ value: String(c.id), label: c.nombre })),
        ]}
      />
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
    try { await deleteCategoria(id); onDone() }
    catch { alert('Error al eliminar') }
    setSaving(false)
  }
  return (
    <Modal onClose={onClose}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#e4e4cc', fontSize: 18, margin: '0 0 16px' }}>¿Eliminar categoría?</h3>
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
      <div style={{ background: '#1f2111', border: '1px solid #343625', width: '100%', maxWidth: 420, padding: 24 }} onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', color: '#c4c7c7', fontSize: 13, marginBottom: 4 }}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: '8px 10px', background: '#2a2b1b', border: '1px solid #444748', color: '#e4e4cc', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
    </div>
  )
}

function FieldArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', color: '#c4c7c7', fontSize: 13, marginBottom: 4 }}>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: '8px 10px', background: '#2a2b1b', border: '1px solid #444748', color: '#e4e4cc', fontSize: 13, outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: 60 }} />
    </div>
  )
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', color: '#c4c7c7', fontSize: 13, marginBottom: 4 }}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: '8px 10px', background: '#2a2b1b', border: '1px solid #444748', color: '#e4e4cc', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

const btn: React.CSSProperties = { border: 'none', padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
const btnSm: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, padding: '4px 8px' }
const mBtn: React.CSSProperties = { border: 'none', padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
