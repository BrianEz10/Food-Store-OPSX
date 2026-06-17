import { useFormasPago } from '@/features/formas-pago/hooks/useFormasPago'

export function MetodoEnvioSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {[
        { value: 'RETIRO', label: 'Retiro en local' },
        { value: 'DOMICILIO', label: 'Envío a domicilio' },
      ].map((opt) => (
        <button key={opt.value} onClick={() => onChange(opt.value)}
          style={{
            flex: 1, padding: '12px 16px', cursor: 'pointer', fontSize: 14,
            background: value === opt.value ? '#e9c349' : '#2a2b1b',
            color: value === opt.value ? '#131407' : '#c4c7c7',
            border: value === opt.value ? '1px solid #e9c349' : '1px solid #444748',
          }}>
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function PagoSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { data: formas } = useFormasPago()
  const habilitadas = formas?.filter((f) => f.habilitado) || []
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {habilitadas.map((fp) => (
        <label key={fp.codigo} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer',
          background: value === fp.codigo ? '#2a2b1b' : '#1f2111',
          border: value === fp.codigo ? '1px solid #e9c349' : '1px solid #2a2b1b',
        }}>
          <input type="radio" name="pago" value={fp.codigo} checked={value === fp.codigo} onChange={() => onChange(fp.codigo)}
            style={{ accentColor: '#e9c349' }} />
          <span style={{ color: '#e4e4cc', fontSize: 14 }}>{fp.descripcion}</span>
        </label>
      ))}
    </div>
  )
}

export function AddressForm({ values, onChange, onSubmit }: {
  values: { calle: string; numero: string; ciudad: string; provincia: string; codigo_postal: string; piso?: string; referencia?: string }
  onChange: (f: string, v: string) => void
  onSubmit: () => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 2 }}>
          <label style={{ display: 'block', color: '#c4c7c7', fontSize: 12, marginBottom: 4 }}>Calle *</label>
          <input value={values.calle} onChange={(e) => onChange('calle', e.target.value)} required
            style={{ width: '100%', padding: '8px 10px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 13, boxSizing: 'border-box' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', color: '#c4c7c7', fontSize: 12, marginBottom: 4 }}>Número *</label>
          <input value={values.numero} onChange={(e) => onChange('numero', e.target.value)} required
            style={{ width: '100%', padding: '8px 10px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 13, boxSizing: 'border-box' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', color: '#c4c7c7', fontSize: 12, marginBottom: 4 }}>Ciudad *</label>
          <input value={values.ciudad} onChange={(e) => onChange('ciudad', e.target.value)} required
            style={{ width: '100%', padding: '8px 10px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 13, boxSizing: 'border-box' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', color: '#c4c7c7', fontSize: 12, marginBottom: 4 }}>Provincia *</label>
          <input value={values.provincia} onChange={(e) => onChange('provincia', e.target.value)} required
            style={{ width: '100%', padding: '8px 10px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 13, boxSizing: 'border-box' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', color: '#c4c7c7', fontSize: 12, marginBottom: 4 }}>CP *</label>
          <input value={values.codigo_postal} onChange={(e) => onChange('codigo_postal', e.target.value)} required
            style={{ width: '100%', padding: '8px 10px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 13, boxSizing: 'border-box' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', color: '#c4c7c7', fontSize: 12, marginBottom: 4 }}>Piso / Dpto</label>
          <input value={values.piso || ''} onChange={(e) => onChange('piso', e.target.value)}
            style={{ width: '100%', padding: '8px 10px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 13, boxSizing: 'border-box' }} />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', color: '#c4c7c7', fontSize: 12, marginBottom: 4 }}>Referencia</label>
        <input value={values.referencia || ''} onChange={(e) => onChange('referencia', e.target.value)}
          style={{ width: '100%', padding: '8px 10px', background: '#2a2b1b', color: '#e4e4cc', border: '1px solid #444748', outline: 'none', fontSize: 13, boxSizing: 'border-box' }} />
      </div>
      <button onClick={onSubmit}
        style={{ padding: '10px', background: '#2a2b1b', border: '1px solid #444748', color: '#e4e4cc', fontSize: 13, cursor: 'pointer' }}>
        Guardar dirección
      </button>
    </div>
  )
}
