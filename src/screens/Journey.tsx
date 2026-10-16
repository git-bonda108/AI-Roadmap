import { useState, type CSSProperties } from 'react'
import { Gauge, PauseCircle } from 'lucide-react'
import type { Pathway, Session } from '../lib/types'
import { fnById, program, stages, stageVars, weeks } from '../lib/data'
import { FnIcon } from '../lib/icons'
import { hrs } from '../lib/labels'
import { SectionHead } from '../components/ui'
import { FunctionFilter } from '../components/FunctionFilter'

/** Each week spans two tracks (Day 1, Day 2) so stage bands can change mid-week, as in Week 2. */
const track = (s: Session) => (s.week - 1) * 2 + (s.slot === 'day2' ? 2 : 1)

export function Journey({ p, onOpen }: { p: Pathway; onOpen: (key: string) => void }) {
  const [fn, setFn] = useState<string | null>(null)
  const nWeeks = weeks(p)
  const dayItems = p.sessions.filter((s) => s.slot !== 'async')
  const bands = stages.map((st) => {
    const t = dayItems.filter((s) => s.stage === st.n).map(track)
    return { st, from: Math.min(...t), to: Math.max(...t), m: p.mindset.find((m) => m.stage === st.n)! }
  })
  const cols: { id: Session['slot']; label: string; col: number }[] = [
    { id: 'day1', label: 'Day 1', col: 3 },
    { id: 'day2', label: 'Day 2', col: 4 },
    { id: 'async', label: 'Self-directed', col: 5 },
  ]
  // Grid rows: 1 = header; each week spans two sub-rows so stage bands can change mid-week (Week 2).
  const weekRow = (w: number) => `${(w - 1) * 2 + 2} / span 2`

  return (
    <section className="section">
      <div className="wrap">
        <SectionHead
          kicker={`${p.name} · Journey map`}
          title={`${nWeeks} weeks, two live sessions a week`}
          sub="Click any session for its concept, use case, how-to and reflection."
        />
        <FunctionFilter value={fn} onChange={setFn} />
        <div className="map-scroll">
          <div className="map">
            <div className="map-head label" style={{ gridRow: 1, gridColumn: 1 }}>Mindset</div>
            <div className="map-head label" style={{ gridRow: 1, gridColumn: 2 }}>Week</div>
            {cols.map((c) => <div key={c.id} className="map-head label" style={{ gridRow: 1, gridColumn: c.col }}>{c.label}</div>)}

            {bands.map(({ st, from, to, m }) => (
              <div key={st.n} className="map-band" style={{ ...stageVars(st.n), gridColumn: 1, gridRow: `${from + 1} / ${to + 2}` }} title={`${m.from} → ${m.to}`}>
                <b>{m.shift}</b><span>Stage {st.n} · {st.name}</span>
              </div>
            ))}
            {Array.from({ length: nWeeks }, (_, i) => (
              <div key={i} className="map-week" style={{ gridRow: weekRow(i + 1), gridColumn: 2 }}>
                <span className="label">Wk</span><span className="map-wn">{i + 1}</span>
              </div>
            ))}
            {p.sessions.map((s) => (
              <Cell key={s.key} s={s} fn={fn} onOpen={onOpen} style={{ ...stageVars(s.stage), gridRow: weekRow(s.week), gridColumn: cols.find((c) => c.id === s.slot)!.col }} />
            ))}
          </div>
        </div>
        <div className="map-legend">
          <span><Gauge size={14} /> Mindset pulse point</span>
          <span><PauseCircle size={14} /> {program.holidayNote}</span>
        </div>
      </div>
    </section>
  )
}

function Cell({ s, fn, onOpen, style }: { s: Session; fn: string | null; onOpen: (k: string) => void; style: CSSProperties }) {
  const dim = fn !== null && s.sparkFunction !== fn
  const f = fnById(s.sparkFunction)
  return (
    <button
      className={`map-cell kind-${s.kind}${dim ? ' dim' : ''}${fn && !dim ? ' hit' : ''}`}
      style={style}
      onClick={() => onOpen(s.key)}
      title={f ? `Spark: ${f.name}` : undefined}
    >
      <span className="mc-top">
        <span className="mono">{s.code ?? '·'}</span>
        <span className="mc-title">{s.title}</span>
        {s.pulse && <Gauge size={14} className="mc-pulse" aria-label="Mindset pulse" />}
      </span>
      <span className="mc-foot">
        {f && <span className="mc-fn"><FnIcon id={f.id} size={12} /> {f.name}</span>}
        <span>{hrs(s.durationHrs)}</span>
      </span>
    </button>
  )
}
