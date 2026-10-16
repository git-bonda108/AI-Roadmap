import { useEffect } from 'react'
import { Download, Printer } from 'lucide-react'
import type { Pathway, PathwayId, Session } from '../lib/types'
import { fnById, pathways, program, roles, stages, stageVars } from '../lib/data'
import { asset, hrs, kindLabel, leadLabel, slotLabel } from '../lib/labels'

export type BookletScope = PathwayId | 'both'

/** Print-first view of the whole flow. "Save as PDF" uses the browser's print dialog. */
export function Booklet({ scope, onScope }: { scope: BookletScope; onScope: (s: BookletScope) => void }) {
  const list = scope === 'both' ? (Object.values(pathways) as Pathway[]) : [pathways[scope]]
  useEffect(() => {
    const prev = document.title
    document.title = `AI-Roadmap · ${scope === 'both' ? 'AI Practitioner and Data Citizen' : pathways[scope].name} · Programme flow`
    return () => { document.title = prev }
  }, [scope])

  return (
    <div className="booklet-shell">
      <div className="booklet-bar no-print">
        <div className="wrap booklet-bar-in">
          <div>
            <div className="kicker">Export</div>
            <b>Programme flow as PDF</b>
          </div>
          <div className="seg-ctl" role="group" aria-label="What to export">
            {(['ai-practitioner', 'data-citizen', 'both'] as BookletScope[]).map((s) => (
              <button key={s} aria-pressed={scope === s} onClick={() => onScope(s)}>
                {s === 'both' ? 'Both pathways' : pathways[s].name}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-red" onClick={() => window.print()}><Printer size={16} /> Save as PDF</button>
            <a className="btn btn-ghost" href={asset(`/pdf/AI-Roadmap-${scope}.pdf`)} download><Download size={16} /> Ready-made PDF</a>
          </div>
        </div>
        <div className="wrap muted booklet-hint">In the print dialog choose <b>Save as PDF</b>, A4, and keep <b>Background graphics</b> on.</div>
      </div>
      <div className="booklet">
        {list.map((p) => <PathwayBook key={p.id} p={p} />)}
      </div>
    </div>
  )
}

function PathwayBook({ p }: { p: Pathway }) {
  const live = p.sessions.filter((s) => s.kind === 'live')
  return (
    <>
      <section className="page cover">
        <div className="cover-top">
          <div className="kicker">OSBI · Enterprise capability programme</div>
          <img src={asset('/upgrad-logo-light.png')} alt="upGrad Enterprise" className="cover-logo" />
        </div>
        <h1 className="cover-title">{p.name}</h1>
        <p className="cover-tag">{p.tagline}</p>
        <p className="cover-line">{p.line}</p>
        <div className="cover-stats">
          <div><b>{p.sessions.reduce((a, s) => a + s.durationHrs, 0)}</b><span>hours</span></div>
          <div><b>{live.length}</b><span>live sessions of 3 hrs</span></div>
          <div><b>{Math.max(...p.sessions.map((s) => s.week))}</b><span>weeks · 2 sessions a week</span></div>
          <div><b>TBC</b><span>{program.startNote.toLowerCase()}</span></div>
        </div>
        <div className="pb-stages">
          {stages.map((st) => {
            const m = p.mindset.find((x) => x.stage === st.n)!
            return (
              <div key={st.n} className="pb-stage" style={stageVars(st.n)}>
                <div className="label">Stage {st.n} · {st.hours} hrs</div>
                <h3>{st.name}</h3>
                <div className="pb-small">{st.label} · {st.shape}</div>
                <div className="pb-shift"><b>{m.shift}</b>: {m.to}</div>
              </div>
            )
          })}
        </div>
        <h3 className="pb-h">By the end, every learner can</h3>
        <ol className="pb-obj">{p.objectives.map((o) => <li key={o.title}><b>{o.title}.</b> {o.line}</li>)}</ol>
        <div className="pb-facts">{p.facts.map((f) => <div key={f.k}><span className="label">{f.k}</span><span>{f.v}</span></div>)}</div>
      </section>

      <section className="page">
        <div className="kicker">{p.name} · The mindset shift</div>
        <h2 className="pb-title">Woven through every session</h2>
        <table className="pb-table">
          <thead><tr><th>Stage</th><th>Shift</th><th>From</th><th>To</th></tr></thead>
          <tbody>{p.mindset.map((m) => (
            <tr key={m.stage}><td><span className="pb-sw" style={stageVars(m.stage)} />{stages[m.stage - 1].name}</td><td><b>{m.shift}</b></td><td className="muted">{m.from}</td><td>{m.to}</td></tr>
          ))}</tbody>
        </table>
        <div className="pb-cols">
          <div>
            <h3 className="pb-h">Every live session: Spark → Build → Reflect</h3>
            <p><b>Spark</b> (10–15 min): a real GenAI use case from one OSBI function. <b>Build</b>: hands-on work through the learner's own function. <b>Reflect</b> (~10 min): two or three prompts and one thing to do differently.</p>
            <h3 className="pb-h">Mindset pulse</h3>
            <p>Self-rated 1–5 at {p.sessions.filter((s) => s.pulse).map((s) => s.code ?? 'the guidance clinic').join(', ')}.</p>
            <ol className="pb-obj">{p.pulse.map((q) => <li key={q}>{q}</li>)}</ol>
          </div>
          <div>
            <h3 className="pb-h">Who does what</h3>
            <table className="pb-table pb-roles">
              <thead><tr><th>Role</th>{stages.map((s) => <th key={s.n}>{s.name}</th>)}</tr></thead>
              <tbody>{roles.map((r) => (
                <tr key={r.id}><td><b>{r.name}</b><div className="pb-small">{r.hours}</div></td>{r.stages.map((x, i) => <td key={i} className={x === 'none' ? 'muted' : ''}>{x === 'none' ? '·' : x[0].toUpperCase() + x.slice(1)}</td>)}</tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        <h3 className="pb-h">Scope and pending confirmations</h3>
        <ul className="pb-scope">{program.scope.map((s) => <li key={s}>{s}</li>)}<li>{program.holidayNote}</li></ul>
      </section>

      <section className="page">
        <div className="kicker">{p.name} · At a glance</div>
        <h2 className="pb-title">The flow, session by session</h2>
        <table className="pb-table pb-flow">
          <thead><tr><th>When</th><th></th><th>Session</th><th>Hrs</th><th>Spark</th><th>Learner produces</th></tr></thead>
          <tbody>{p.sessions.map((s) => (
            <tr key={s.key} className={s.kind !== 'live' ? 'pb-aux' : ''}>
              <td className="nowrap">{slotLabel(s).replace('Week ', 'Wk ')}</td>
              <td className="nowrap"><span className="pb-sw" style={stageVars(s.stage)} /><span className="mono">{s.code ?? '·'}</span></td>
              <td>{s.title}</td>
              <td>{s.durationHrs}</td>
              <td className="nowrap">{fnById(s.sparkFunction)?.name ?? '—'}</td>
              <td>{s.produces}</td>
            </tr>
          ))}</tbody>
        </table>
      </section>

      <section className="page pb-details">
        <div className="kicker">{p.name} · Session detail</div>
        <h2 className="pb-title">Concept, use case, how to, reflect</h2>
        {p.sessions.map((s) => <SessionBlock key={s.key} p={p} s={s} />)}
      </section>
    </>
  )
}

function SessionBlock({ p, s }: { p: Pathway; s: Session }) {
  const u = p.useCases.find((x) => x.id === s.spark?.useCaseId)
  const segs = s.segments?.filter((g) => g.label !== 'Break') ?? []
  return (
    <article className="pb-session" style={stageVars(s.stage)}>
      <header>
        <span className="mono pb-code">{s.code ?? '·'}</span>
        <h3>{s.title}</h3>
        <span className="pb-small">{slotLabel(s)} · {hrs(s.durationHrs)} · {kindLabel[s.kind]} · {leadLabel[s.lead]} · Stage {s.stage} {stages[s.stage - 1].name}</span>
      </header>
      {s.concept && <p className="pb-concept">{s.concept}</p>}
      <div className="pb-grid">
        <div>
          <div className="label">Covers</div><p>{s.coverage}</p>
          <div className="label">Produces</div><p><b>{s.produces}</b></p>
          {segs.length > 0 && (<>
            <div className="label">Flow</div>
            <ul className="pb-list">{segs.map((g) => <li key={g.label}><b>{g.label} · {g.mins} min{g.beats?.length ? ` · ${g.beats.map((b) => b[0].toUpperCase() + b.slice(1)).join(' + ')}` : ''}.</b> {g.focus}</li>)}</ul>
          </>)}
          {s.build && (<><div className="label">Build</div><p>{s.build}</p></>)}
          {s.howTo && (<><div className="label">How to</div><ol className="pb-list">{s.howTo.map((h) => <li key={h}>{h}</li>)}</ol></>)}
        </div>
        <div>
          {u && (
            <div className="pb-uc">
              <div className="label">Spark · {fnById(u.functionId)?.name}</div>
              <b>{u.title}</b>
              <p>{u.scenario}</p>
              <p><b>Input:</b> {u.input}</p>
              <p><b>AI produces:</b> {u.aiDoes}</p>
              <p><b>Human check:</b> {u.humanCheck}</p>
              <p><b>Measure:</b> {u.measure}</p>
              <p><b>Boundary:</b> {u.boundary}</p>
            </div>
          )}
          {s.reflect && (<><div className="label">Reflect</div><ul className="pb-list">{s.reflect.map((r) => <li key={r}>{r}</li>)}</ul></>)}
        </div>
      </div>
    </article>
  )
}
