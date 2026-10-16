import type { Mindset } from '../lib/types'
import { stageVars } from '../lib/data'

export function MindsetRibbon({ mindset, compact = false }: { mindset: Mindset[]; compact?: boolean }) {
  return (
    <div className={`ribbon${compact ? " compact" : ""}`} aria-label="Mindset arc">
      {mindset.map((m) => (
        <div key={m.stage} className="band" style={stageVars(m.stage)}>
          <b>{m.shift}</b>
          {!compact && <span>{m.to}</span>}
        </div>
      ))}
    </div>
  )
}
