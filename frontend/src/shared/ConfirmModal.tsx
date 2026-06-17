import { useEffect, useRef } from 'react'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', onConfirm, onCancel }: ConfirmModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  if (!open) return null

  return (
    <dialog ref={dialogRef} onClose={onCancel}
      style={{
        background: '#1f2111', color: '#e4e4cc', border: '1px solid #444748', borderRadius: 8,
        padding: 0, maxWidth: 400, width: '90%',
      }}>
      <div style={{ padding: '24px 24px 0' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 16, color: '#e4e4cc', fontFamily: "'Playfair Display', serif" }}>{title}</h3>
        <p style={{ color: '#c4c7c7', fontSize: 14, margin: 0, lineHeight: 1.5 }}>{message}</p>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', padding: 20 }}>
        <button onClick={onCancel}
          style={{ padding: '8px 20px', background: '#2a2b1b', border: '1px solid #444748', color: '#c4c7c7', fontSize: 13, cursor: 'pointer', borderRadius: 4 }}>
          {cancelLabel}
        </button>
        <button onClick={onConfirm}
          style={{ padding: '8px 20px', background: '#93000a', border: 'none', color: '#ffb4ab', fontSize: 13, cursor: 'pointer', borderRadius: 4, fontWeight: 600 }}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
