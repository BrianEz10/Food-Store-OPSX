import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLogin } from '@/features/auth/hooks/useAuth'
import { parseError } from '@/lib/errorParser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo') || ''
  const loginMutation = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const rol = await loginMutation.mutateAsync({ email, password })
      const targets: Record<string, string> = {
        admin: '/admin/dashboard',
        stock: '/admin/productos',
        cocina: '/admin/cocina',
        cajero: '/admin/cajero',
      }
      const target = returnTo && rol === 'cliente' ? returnTo : (targets[rol] || '/')
      navigate(target, { replace: true })
    } catch (err) {
      setError(parseError(err))
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#131407' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: 32 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#e9c349', textAlign: 'center', marginBottom: 8 }}>Food Store</h1>
        <p style={{ color: '#c4c7c7', textAlign: 'center', marginBottom: 32, fontSize: 14 }}>Iniciá sesión para continuar</p>
        <div style={{ background: '#1f2111', padding: 32 }}>
          {error && <div style={{ background: '#93000a30', border: '1px solid #ffb4ab', padding: '8px 12px', marginBottom: 16 }}><p style={{ color: '#ffb4ab', fontSize: 13, margin: 0 }}>{error}</p></div>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#c4c7c7', fontSize: 14, marginBottom: 4 }}>Email</label>
              <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} placeholder="admin@foodstore.com"
                style={{ width: '100%', padding: '10px 12px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: '#c4c7c7', fontSize: 14, marginBottom: 4 }}>Contraseña</label>
              <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                style={{ width: '100%', padding: '10px 12px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <button type="submit" disabled={loginMutation.isPending}
              style={{ width: '100%', padding: '12px', background: loginMutation.isPending ? '#2a2b1b' : '#121212', color: loginMutation.isPending ? '#666' : '#c4c7c7', border: 'none', fontSize: 14, fontWeight: 600, cursor: loginMutation.isPending ? 'not-allowed' : 'pointer' }}>
              {loginMutation.isPending ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 16, color: '#6b6151', fontSize: 13 }}>
            ¿No tenés cuenta?{' '}
            <a href="/register" style={{ color: '#e9c349', textDecoration: 'none' }}>Registrate</a>
          </p>
        </div>
      </div>
    </div>
  )
}
