export interface TabDef { id: string; label: string; soon?: boolean }

export function Tabs({ tabs, active, onChange }: { tabs: TabDef[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" className="tab" aria-selected={active === t.id} onClick={() => onChange(t.id)}>
          {t.label}{t.soon && <span className="soon">LATER</span>}
        </button>
      ))}
    </div>
  )
}
