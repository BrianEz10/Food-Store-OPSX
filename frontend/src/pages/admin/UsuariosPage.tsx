import { useEffect, useState } from 'react'
import { fetchUsuarios, updateUsuario, asignarRoles, deleteUsuario, fetchRoles, type Usuario, type Role } from '@/lib/usuarios'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [editUser, setEditUser] = useState<Usuario | null>(null)
  const [rolesUser, setRolesUser] = useState<Usuario | null>(null)
  const [deleteUser, setDeleteUser] = useState<number | null>(null)

  const load = async (p: number) => {
    setLoading(true)
    try {
      const d = await fetchUsuarios(p, 20)
      setUsuarios(d.items)
      setTotal(d.total)
      setPages(d.pages)
      setPage(d.page)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { load(page) }, [])
  useEffect(() => { fetchRoles().then(setRoles).catch(() => {}) }, [])

  const filtered = search
    ? usuarios.filter((u) => u.email.toLowerCase().includes(search.toLowerCase()) || u.nombre.toLowerCase().includes(search.toLowerCase()))
    : usuarios

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#e4e4cc', fontSize: 24, margin: 0 }}>
          Usuarios
        </h1>
        <p style={{ color: '#6b6151', fontSize: 13, margin: 0 }}>{total} usuarios</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Buscar por email o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: 320, padding: '8px 12px', background: '#1f2111', border: '1px solid #343625',
            color: '#e4e4cc', fontSize: 13, outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ background: '#1f2111', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b6151' }}>Cargando...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b6151' }}>Sin usuarios</div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2b1b' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6b6151', fontWeight: 500 }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6b6151', fontWeight: 500 }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6b6151', fontWeight: 500 }}>Nombre</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6b6151', fontWeight: 500 }}>Apellido</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#6b6151', fontWeight: 500 }}>Roles</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', color: '#6b6151', fontWeight: 500 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #2a2b1b' }}>
                    <td style={{ padding: '10px 12px', color: '#6b6151' }}>{u.id}</td>
                    <td style={{ padding: '10px 12px', color: '#e4e4cc' }}>{u.email}</td>
                    <td style={{ padding: '10px 12px', color: '#c4c7c7' }}>{u.nombre}</td>
                    <td style={{ padding: '10px 12px', color: '#c4c7c7' }}>{u.apellido}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {u.roles.length === 0 ? (
                          <span style={{ color: '#6b6151', fontSize: 12 }}>—</span>
                        ) : (
                          u.roles.map((r) => (
                            <span key={r} style={{
                              display: 'inline-block', padding: '2px 6px', borderRadius: 3, fontSize: 11,
                              background: '#e9c34915', color: '#e9c349', border: '1px solid #e9c34930',
                            }}>
                              {r}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button onClick={() => setEditUser(u)} style={{ ...btnStyle, color: '#c4c7c7' }}>Editar</button>
                        <button onClick={() => { setRolesUser(u); setEditUser(null) }} style={{ ...btnStyle, color: '#e9c349' }}>Roles</button>
                        <button onClick={() => setDeleteUser(u.id)} style={{ ...btnStyle, color: '#ffb4ab' }}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 16 }}>
                <button disabled={page <= 1} onClick={() => load(page - 1)} style={{ ...pBtn, opacity: page <= 1 ? 0.4 : 1 }}>
                  ← Anterior
                </button>
                <span style={{ color: '#6b6151', fontSize: 13, padding: '4px 8px' }}>{page} / {pages}</span>
                <button disabled={page >= pages} onClick={() => load(page + 1)} style={{ ...pBtn, opacity: page >= pages ? 0.4 : 1 }}>
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit modal */}
      {editUser && <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSave={() => { setEditUser(null); load(page) }} />}
      {rolesUser && <RolesModal user={rolesUser} roles={roles} onClose={() => setRolesUser(null)} onSave={() => { setRolesUser(null); load(page) }} />}
      {deleteUser && <DeleteModal userId={deleteUser} onClose={() => setDeleteUser(null)} onDone={() => { setDeleteUser(null); load(page) }} />}
    </div>
  )
}

function EditUserModal({ user, onClose, onSave }: { user: Usuario; onClose: () => void; onSave: () => void }) {
  const [nombre, setNombre] = useState(user.nombre)
  const [apellido, setApellido] = useState(user.apellido)
  const [celular, setCelular] = useState(user.celular || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateUsuario(user.id, { nombre, apellido, celular: celular || null })
      onSave()
    } catch { alert('Error al guardar') }
    setSaving(false)
  }

  return (
    <Modal onClose={onClose}>
      <h3 style={modalTitle}>Editar usuario</h3>
      <p style={{ color: '#6b6151', fontSize: 13, marginBottom: 16 }}>{user.email}</p>
      <Input label="Nombre" value={nombre} onChange={setNombre} />
      <Input label="Apellido" value={apellido} onChange={setApellido} />
      <Input label="Celular" value={celular} onChange={setCelular} />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
        <button onClick={onClose} style={{ ...modalBtn, background: 'transparent', color: '#c4c7c7' }}>Cancelar</button>
        <button onClick={handleSave} disabled={saving} style={{ ...modalBtn, background: '#e9c349', color: '#3c2f00' }}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </Modal>
  )
}

function RolesModal({ user, roles, onClose, onSave }: { user: Usuario; roles: Role[]; onClose: () => void; onSave: () => void }) {
  const [selected, setSelected] = useState<string[]>(user.roles)
  const [saving, setSaving] = useState(false)

  const toggle = (r: string) => {
    setSelected((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r])
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await asignarRoles(user.id, { roles: selected })
      onSave()
    } catch { alert('Error al asignar roles') }
    setSaving(false)
  }

  return (
    <Modal onClose={onClose}>
      <h3 style={modalTitle}>Roles de {user.nombre}</h3>
      <p style={{ color: '#6b6151', fontSize: 13, marginBottom: 16 }}>{user.email}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {roles.map((r) => (
          <label key={r.codigo} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: '#c4c7c7', fontSize: 14 }}>
            <input
              type="checkbox" checked={selected.includes(r.codigo)}
              onChange={() => toggle(r.codigo)}
              style={{ accentColor: '#e9c349' }}
            />
            <div>
              <span style={{ display: 'block' }}>{r.nombre}</span>
              <span style={{ display: 'block', fontSize: 11, color: '#6b6151' }}>{r.descripcion}</span>
            </div>
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
        <button onClick={onClose} style={{ ...modalBtn, background: 'transparent', color: '#c4c7c7' }}>Cancelar</button>
        <button onClick={handleSave} disabled={saving} style={{ ...modalBtn, background: '#e9c349', color: '#3c2f00' }}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </Modal>
  )
}

function DeleteModal({ userId, onClose, onDone }: { userId: number; onClose: () => void; onDone: () => void }) {
  const [saving, setSaving] = useState(false)

  const handleDelete = async () => {
    setSaving(true)
    try {
      await deleteUsuario(userId)
      onDone()
    } catch { alert('Error al eliminar') }
    setSaving(false)
  }

  return (
    <Modal onClose={onClose}>
      <h3 style={modalTitle}>¿Eliminar usuario?</h3>
      <p style={{ color: '#c4c7c7', fontSize: 14, marginBottom: 20 }}>Esta acción no se puede deshacer.</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{ ...modalBtn, background: 'transparent', color: '#c4c7c7' }}>Cancelar</button>
        <button onClick={handleDelete} disabled={saving} style={{ ...modalBtn, background: '#ffb4ab', color: '#690005' }}>
          {saving ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </Modal>
  )
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)',
    }} onClick={onClose}>
      <div style={{
        background: '#1f2111', border: '1px solid #343625', width: '100%', maxWidth: 420, padding: 24,
      }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', color: '#c4c7c7', fontSize: 13, marginBottom: 4 }}>{label}</label>
      <input
        value={value} onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', padding: '8px 10px', background: '#2a2b1b', border: '1px solid #444748',
          color: '#e4e4cc', fontSize: 13, outline: 'none', boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

const modalTitle: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif", color: '#e4e4cc', fontSize: 18, margin: '0 0 4px',
}
const btnStyle: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, padding: '4px 8px',
}
const modalBtn: React.CSSProperties = {
  border: 'none', padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
}
const pBtn: React.CSSProperties = {
  background: '#2a2b1b', border: '1px solid #444748', color: '#c4c7c7',
  padding: '6px 14px', fontSize: 12, cursor: 'pointer',
}
