import type { ReactNode } from 'react'
import type { Beat } from '../lib/types'
import { stageByN, stageVars } from '../lib/data'

export function StageChip({ n }: { n: number }) {
  const st = stageByN(n)
  return (
    <span className="chip" style={{ ...stageVars(n), background: 'var(--st-bg)', color: 'var(--st-ink)' }}>
      Stage {n} · {st.name}
    </span>
  )
}

const beatLabel: Record<Beat, string> = { spark: 'Spark', build: 'Build', reflect: 'Reflect' }
export function BeatChip({ beat }: { beat: Beat }) {
  return <span className={`chip chip-${beat}`}>{beatLabel[beat]}</span>
}

export function SectionHead({ kicker, title, sub, right }: { kicker: string; title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="section-head">
      <div>
        <div className="kicker">{kicker}</div>
        <h2 style={{ marginTop: 6 }}>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {right}
    </div>
  )
}
