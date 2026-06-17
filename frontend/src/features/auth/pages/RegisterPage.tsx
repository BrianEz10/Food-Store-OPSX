import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useRegister } from '@/features/auth/hooks/useAuth'
import { parseError } from '@/lib/errorParser'
import { useToastStore } from '@/store/useToastStore'

export default function RegisterPage() {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [celular, setCelular] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const toast = useToastStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const rol = await registerMutation.mutateAsync({ nombre, apellido, email, password, celular: celular || undefined })
      toast.success(`¡Bienvenido, ${nombre}!`)
      navigate(rol === 'cliente' ? '/' : '/admin/dashboard', { replace: true })
    } catch (err) {
      setError(parseError(err))
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#131407' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: 32 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#e9c349', textAlign: 'center', marginBottom: 8 }}>Food Store</h1>
        <p style={{ color: '#c4c7c7', textAlign: 'center', marginBottom: 32, fontSize: 14 }}>Creá tu cuenta</p>
        <div style={{ background: '#1f2111', padding: 32 }}>
          {error && <div style={{ background: '#93000a30', border: '1px solid #ffb4ab', padding: '8px 12px', marginBottom: 16 }}><p style={{ color: '#ffb4ab', fontSize: 13, margin: 0 }}>{error}</p></div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: '#c4c7c7', fontSize: 14, marginBottom: 4 }}>Nombre</label>
                <input type="text" value={nombre} required onChange={(e) => setNombre(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: '#c4c7c7', fontSize: 14, marginBottom: 4 }}>Apellido</label>
                <input type="text" value={apellido} required onChange={(e) => setApellido(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#c4c7c7', fontSize: 14, marginBottom: 4 }}>Email</label>
              <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#c4c7c7', fontSize: 14, marginBottom: 4 }}>Celular (opcional)</label>
              <input type="tel" value={celular} onChange={(e) => setCelular(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: '#c4c7c7', fontSize: 14, marginBottom: 4 }}>Contraseña</label>
              <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres"
                style={{ width: '100%', padding: '10px 12px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <button type="submit" disabled={registerMutation.isPending}
              style={{ width: '100%', padding: '12px', background: registerMutation.isPending ? '#2a2b1b' : '#121212', color: registerMutation.isPending ? '#666' : '#c4c7c7', border: 'none', fontSize: 14, fontWeight: 600, cursor: registerMutation.isPending ? 'not-allowed' : 'pointer' }}>
              {registerMutation.isPending ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 16, color: '#6b6151', fontSize: 13 }}>
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" style={{ color: '#e9c349', textDecoration: 'none' }}>Iniciá sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
