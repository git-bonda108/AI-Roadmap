import { useMemo, useState } from 'react'
import { ChevronRight, Gauge, Search } from 'lucide-react'
import type { Pathway } from '../lib/types'
import { fnById, stages, stageVars } from '../lib/data'
import { FnIcon } from '../lib/icons'
import { hrs, kindLabel, slotLabel } from '../lib/labels'
import { SectionHead, StageChip } from '../components/ui'
import { FunctionFilter } from '../components/FunctionFilter'

export function Sessions({ p, onOpen }: { p: Pathway; onOpen: (key: string) => void }) {
  const [stage, setStage] = useState<number | null>(null)
  const [fn, setFn] = useState<string | null>(null)
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return p.sessions.filter((s) =>
      (stage === null || s.stage === stage) &&
      (fn === null || s.sparkFunction === fn) &&
      (!needle || [s.code, s.title, s.concept, s.coverage, s.produces].join(' ').toLowerCase().includes(needle)),
    )
  }, [p, stage, fn, q])

  return (
    <section className="section">
      <div className="wrap">
        <SectionHead kicker={`${p.name} · Session by session`} title="The flow, one session at a time" sub="Durations only; clock times follow once the schedule is confirmed." />

        <div className="toolbar">
          <div className="seg-ctl" role="group" aria-label="Stage">
            <button aria-pressed={stage === null} onClick={() => setStage(null)}>All stages</button>
            {stages.map((s) => (
              <button key={s.n} aria-pressed={stage === s.n} onClick={() => setStage(stage === s.n ? null : s.n)}>
                <span className="sw" style={{ background: `var(--st${s.n})` }} />{s.name}
              </button>
            ))}
          </div>
          <label className="search">
            <Search size={15} aria-hidden="true" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sessions" aria-label="Search sessions" />
          </label>
        </div>
        <FunctionFilter value={fn} onChange={setFn} />

        <div className="tl">
          {stages.filter((st) => list.some((s) => s.stage === st.n)).map((st) => {
            const m = p.mindset.find((x) => x.stage === st.n)!
            return (
              <div key={st.n} className="tl-stage" style={stageVars(st.n)}>
                <div className="tl-stage-head">
                  <StageChip n={st.n} />
                  <span className="muted" style={{ fontSize: 13 }}>{st.hours} hrs · {st.label}</span>
                  <span className="tl-shift"><b>{m.shift}</b> · {m.to}</span>
                </div>
                {list.filter((s) => s.stage === st.n).map((s) => {
                  const f = fnById(s.sparkFunction)
                  return (
                    <button key={s.key} className={`tl-row kind-${s.kind}`} onClick={() => onOpen(s.key)}>
                      <span className="tl-when">
                        <span className="label">{slotLabel(s).split(' · ')[0]}</span>
                        <span>{slotLabel(s).split(' · ')[1]}</span>
                      </span>
                      <span className="tl-dot" aria-hidden="true" />
                      <span className="tl-main">
                        <span className="tl-title"><span className="mono tl-code">{s.code ?? '·'}</span>{s.title}</span>
                        {s.concept && <span className="tl-concept">{s.concept}</span>}
                        <span className="tl-meta">
                          <span className="chip chip-outline">{hrs(s.durationHrs)}{s.kind !== 'live' ? ` · ${kindLabel[s.kind]}` : ''}</span>
                          {f && <span className="chip chip-spark"><FnIcon id={f.id} size={12} /> Spark · {f.name}</span>}
                          {s.pulse && <span className="chip chip-pulse"><Gauge size={12} /> Pulse</span>}
                        </span>
                      </span>
                      <span className="tl-out">
                        <span className="label">Produces</span>
                        <span>{s.produces}</span>
                      </span>
                      <ChevronRight size={18} className="tl-chev" aria-hidden="true" />
                    </button>
                  )
                })}
              </div>
            )
          })}
          {list.length === 0 && <div className="empty">No sessions match these filters.</div>}
        </div>
      </div>
    </section>
  )
}
