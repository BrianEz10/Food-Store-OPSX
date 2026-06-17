import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 80, gap: 16 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, color: '#e9c349', margin: 0 }}>404</h1>
      <p style={{ color: '#c4c7c7', fontSize: 16 }}>Página no encontrada</p>
      <Link to="/" style={{ color: '#e9c349', fontSize: 14 }}>Volver al inicio</Link>
    </div>
  )
}
