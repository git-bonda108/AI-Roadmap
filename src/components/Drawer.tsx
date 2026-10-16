import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function Drawer({ open, onClose, head, children, label }: {
  open: boolean; onClose: () => void; head: ReactNode; children: ReactNode; label: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])

  // Enter animates in CSS; close unmounts immediately so the panel never waits on an animation.
  if (!open) return null
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={label}>
        <div className="drawer-head">
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ minWidth: 0 }}>{head}</div>
            <button className="icon-btn" onClick={onClose} aria-label="Close" autoFocus><X size={16} /></button>
          </div>
        </div>
        <div className="drawer-body">{children}</div>
      </aside>
    </>
  )
}
