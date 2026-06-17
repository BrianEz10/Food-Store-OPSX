export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #2a2b1b', padding: '32px 24px', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#e9c349', fontSize: 18, margin: '0 0 8px' }}>Food Store</h3>
          <p style={{ color: '#6b6151', fontSize: 13, margin: 0 }}>Los mejores productos al mejor precio</p>
        </div>
        <div>
          <h4 style={{ color: '#c4c7c7', fontSize: 13, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contacto</h4>
          <p style={{ color: '#6b6151', fontSize: 13, margin: 0 }}>info@foodstore.com</p>
        </div>
        <div>
          <h4 style={{ color: '#c4c7c7', fontSize: 13, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Horarios</h4>
          <p style={{ color: '#6b6151', fontSize: 13, margin: 0 }}>Lun-Sab: 10:00 - 22:00</p>
        </div>
      </div>
    </footer>
  )
}
