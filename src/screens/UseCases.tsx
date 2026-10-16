import { useState } from 'react'
import { ArrowDown, ArrowRight, Check, Ruler, ShieldCheck } from 'lucide-react'
import type { Pathway, PathwayId } from '../lib/types'
import { daily, functions, pathways, stageVars } from '../lib/data'
import { FnIcon } from '../lib/icons'
import { SectionHead, StageChip } from '../components/ui'
import { DailyWins } from '../components/DailyWins'

// Smooth scroll, with an instant fallback where the browser throttles or skips the animation.
function jumpToDaily() {
  const el = document.getElementById('daily-wins')
  if (!el) return
  const start = window.scrollY
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  setTimeout(() => { if (window.scrollY === start) el.scrollIntoView({ behavior: 'instant', block: 'start' }) }, 700)
}

export function UseCases({ p, onOpen, onPathway }: { p: Pathway; onOpen: (key: string) => void; onPathway: (id: PathwayId) => void }) {
  const [fn, setFn] = useState('operations')
  const f = functions.find((x) => x.id === fn)!
  const ucs = p.useCases.filter((u) => u.functionId === fn).sort((a, b) => a.id.localeCompare(b.id))
  const other = (Object.keys(pathways) as PathwayId[]).find((id) => id !== p.id)!

  return (
    <section className="section">
      <div className="wrap">
        <SectionHead
          kicker={`${p.name} · Use cases`}
          title="Pick a function, see the work it opens"
          sub={`${p.useCases.length} programme use cases (two per function) plus ${daily.length} daily quick wins with ready-to-paste prompts (four per function).`}
        />
        <div className="fn-tiles">
          {functions.map((x) => (
            <button key={x.id} className="fn-tile" aria-pressed={fn === x.id} onClick={() => setFn(x.id)}>
              <span className="fn-ic"><FnIcon id={x.id} size={18} /></span>
              <span className="fn-name">{x.name}</span>
            </button>
          ))}
        </div>

        <div className="uc-head">
          <div>
            <h3>{f.name}</h3>
            <p className="muted" style={{ fontSize: 14 }}>{f.context}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-red" onClick={jumpToDaily}>
            Daily quick wins <ArrowDown size={15} />
          </button>
          <button className="btn btn-ghost" onClick={() => onPathway(other)}>
            See {pathways[other].name} use cases <ArrowRight size={15} />
          </button>
          </div>
        </div>

        <div className="label" style={{ margin: '4px 0 10px' }}>In the programme · opening use cases</div>
        <div className="grid g2">
          {ucs.map((u) => {
            const s = p.sessions.find((x) => x.key === u.sessionKey)!
            return (
              <article key={u.id} className="card uc-card" style={stageVars(s.stage)}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className="chip chip-dark mono">{s.code}</span>
                  <StageChip n={s.stage} />
                </div>
                <h3 style={{ margin: '12px 0 6px' }}>{u.title}</h3>
                <p className="muted" style={{ fontSize: 14 }}>{u.scenario}</p>
                <div className="io">
                  <div><div className="label">Input</div><p>{u.input}</p></div>
                  <ArrowRight size={18} className="io-arrow" />
                  <div><div className="label">AI produces</div><p>{u.aiDoes}</p></div>
                </div>
                <ol className="steps" style={{ margin: '4px 0 14px' }}>{u.howTo.map((h) => <li key={h}>{h}</li>)}</ol>
                <div className="uc-foot">
                  <div><Check size={14} /> <span>{u.humanCheck}</span></div>
                  <div><Ruler size={14} /> <span>{u.measure}</span></div>
                  <div><ShieldCheck size={14} /> <span>{u.boundary}</span></div>
                </div>
                <button className="btn btn-red" style={{ marginTop: 16, alignSelf: 'flex-start' }} onClick={() => onOpen(s.key)}>
                  Opens {s.code}: {s.title} <ArrowRight size={15} />
                </button>
              </article>
            )
          })}
        </div>

        <DailyWins functionId={fn} functionName={f.name} />
      </div>
    </section>
  )
}
