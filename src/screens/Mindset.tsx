import { ArrowRight, FileText, Gauge } from 'lucide-react'
import type { Pathway } from '../lib/types'
import { beats, functions, stages, stageVars } from '../lib/data'
import { FnIcon } from '../lib/icons'
import { SectionHead } from '../components/ui'

export function Mindset({ p, onOpen, onApproach }: { p: Pathway; onOpen: (key: string) => void; onApproach: () => void }) {
  const live = p.sessions.filter((s) => s.kind === 'live')
  const pulses = p.sessions.filter((s) => s.pulse)
  const example = live[0]
  const exampleUc = p.useCases.find((u) => u.id === example.spark?.useCaseId)

  return (
    <>
      <section className="section">
        <div className="wrap">
          <SectionHead
            kicker={`${p.name} · Mindset arc`}
            title="The shift is built into every session"
            sub="No single session changes a mindset. Four shifts, one rhythm, and a measured pulse do."
            right={<button className="btn btn-red" onClick={onApproach}><FileText size={15} /> Approach note</button>}
          />
          <div className="arc">
            {p.mindset.map((m, i) => {
              const st = stages[m.stage - 1]
              const ss = p.sessions.filter((s) => s.stage === m.stage)
              return (
                <div key={m.stage} className="arc-step" style={stageVars(m.stage)}>
                  <div className="arc-num">{i + 1}</div>
                  <div className="label">Stage {st.n} · {st.name} · Wk {ss[0].week}–{ss[ss.length - 1].week}</div>
                  <h3 className="arc-shift">{m.shift}</h3>
                  <div className="arc-from">{m.from}</div>
                  <div className="arc-to"><ArrowRight size={15} /> {m.to}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid g2" style={{ alignItems: 'start' }}>
          <div className="card">
            <div className="kicker">The rhythm</div>
            <h3 style={{ margin: '6px 0 16px' }}>Spark → Build → Reflect, every live session</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {beats.map((b) => (
                <div key={b.id} className={`beat ${b.id}`} style={{ display: 'grid', gridTemplateColumns: '92px 1fr', gap: 12, alignItems: 'baseline', padding: '12px 14px' }}>
                  <h4 style={{ margin: 0 }}>{b.name}</h4>
                  <p>{b.line} <span className="muted">({b.mins})</span></p>
                </div>
              ))}
            </div>
          </div>
          <button className="card hover example" onClick={() => onOpen(example.key)}>
            <div className="kicker">In practice · {example.code}</div>
            <h3 style={{ margin: '6px 0 14px' }}>{example.title}</h3>
            <div className="ex-row"><span className="chip chip-spark">Spark</span><span>{example.spark?.hook}</span></div>
            <div className="ex-row"><span className="chip chip-build">Build</span><span>{example.build}</span></div>
            <div className="ex-row"><span className="chip chip-reflect">Reflect</span><span>{example.reflect?.[example.reflect.length - 1]}</span></div>
            {exampleUc && <div className="muted" style={{ fontSize: 12.5, marginTop: 10 }}>Use case: {exampleUc.title} → open session</div>}
          </button>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead
            kicker="Function rotation"
            title="Every function opens two sessions"
            sub="Each session opens with a use case from one OSBI function, so every learner sees their own work early and again later. Click a dot to open the session."
          />
          <div className="rot-scroll">
            <div className="rot" style={{ gridTemplateColumns: `150px repeat(${live.length}, minmax(26px, 1fr))` }}>
              <div />
              {live.map((s) => (
                <div key={s.key} className="rot-col mono" style={stageVars(s.stage)}>{s.code?.replace('S', '')}</div>
              ))}
              {functions.map((f) => (
                <div key={f.id} className="rot-row">
                  <div className="rot-fn"><FnIcon id={f.id} size={13} /> {f.name}</div>
                  {live.map((s) => (
                    <div key={s.key} className="rot-cell">
                      {s.sparkFunction === f.id && (
                        <button className="rot-dot" style={stageVars(s.stage)} onClick={() => onOpen(s.key)} title={`${s.code} · ${s.title}`} aria-label={`${f.name} opens ${s.code}: ${s.title}`} />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid g2" style={{ alignItems: 'start' }}>
          <div className="card">
            <div className="kicker">Measured, not assumed</div>
            <h3 style={{ margin: '6px 0 6px' }}>The mindset pulse</h3>
            <p className="muted" style={{ fontSize: 14 }}>Five self-rated statements (1–5), taken at four points. The trend feeds the capability-uplift evidence.</p>
            <div className="pulse-track">
              {pulses.map((s) => (
                <button key={s.key} className="pulse-pt" style={stageVars(s.stage)} onClick={() => onOpen(s.key)}>
                  <Gauge size={16} />
                  <b>{s.code ?? 'Clinic'}</b>
                  <span>Wk {s.week}</span>
                </button>
              ))}
            </div>
            <ol className="pulse-list">{p.pulse.map((q) => <li key={q}>{q}</li>)}</ol>
          </div>
          <div className="card">
            <div className="kicker">What learners build</div>
            <h3 style={{ margin: '6px 0 14px' }}>Each output feeds the capstone</h3>
            <div className="chain">
              {stages.map((st) => (
                <div key={st.n} className="chain-stage" style={stageVars(st.n)}>
                  <div className="label">{st.name}</div>
                  <div className="chain-items">
                    {p.sessions.filter((s) => s.stage === st.n && s.kind === 'live').map((s) => (
                      <button key={s.key} className="chain-item" onClick={() => onOpen(s.key)} title={s.title}>
                        <span className="mono">{s.code}</span> {s.produces}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
