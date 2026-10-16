import { ArrowRight, CalendarClock, FileDown } from 'lucide-react'
import type { Pathway, PathwayId } from '../lib/types'
import { beats, liveCount, program, stages, stageVars, totalHours, weeks } from '../lib/data'
import { HoursDonut } from '../components/Donut'
import { MindsetRibbon } from '../components/MindsetRibbon'
import { SectionHead } from '../components/ui'
import { PathwaySwitch, type Route } from '../components/Nav'

export function Overview({ p, onPathway, onRoute }: { p: Pathway; onPathway: (id: PathwayId) => void; onRoute: (r: Route) => void }) {
  const hrs = totalHours(p)
  return (
    <>
      <section className="hero">
        <div className="wrap hero-in">
          <div>
            <div className="kicker">OSBI · Enterprise capability programme</div>
            <h1>{p.name}: <em>{p.tagline.split(',')[0].toLowerCase()}</em>{p.tagline.includes(',') ? ',' + p.tagline.split(',').slice(1).join(',') : ''}</h1>
            <p className="sub">{p.line}</p>
            <div className="hero-actions">
              <PathwaySwitch value={p.id} onChange={onPathway} />
              <span className="tbc"><CalendarClock size={14} /> {program.startNote}</span>
              <button className="btn btn-ghost" onClick={() => onRoute('print')}><FileDown size={15} /> Export PDF</button>
            </div>
          </div>
          <div className="stats">
            <div><div className="stat-n">{hrs}<small>hrs</small></div><div className="label">Per pathway</div></div>
            <div><div className="stat-n">{liveCount(p)}<small>live</small></div><div className="label">Sessions of 3 hrs</div></div>
            <div><div className="stat-n">{weeks(p)}<small>wks</small></div><div className="label">2 sessions a week</div></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead kicker="01 · The shape" title="Four stages, from understanding to proof" sub={`${program.sessionShape} per live session.`} />
          <div className="grid g4">
            {stages.map((s) => {
              const m = p.mindset.find((x) => x.stage === s.n)!
              return (
                <article key={s.n} className="card hover stage-card" style={stageVars(s.n)}>
                  <div className="label">Stage {s.n} · {s.label}</div>
                  <h3 style={{ marginTop: 4 }}>{s.name}</h3>
                  <div className="hrs">{s.hours}<small>hrs</small></div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{s.shape}</div>
                  <div className="shift">
                    <span className="kicker" style={{ fontSize: 10 }}>{m.shift}</span>
                    <span className="from">{m.from}</span>
                    <span className="to">{m.to}</span>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid g2" style={{ alignItems: 'stretch' }}>
          <div className="card">
            <div className="kicker">02 · Where the hours go</div>
            <h3 style={{ margin: '6px 0 18px' }}>{hrs} hours, weighted to application</h3>
            <HoursDonut />
          </div>
          <div className="card">
            <div className="kicker">03 · Every session, same rhythm</div>
            <h3 style={{ margin: '6px 0 18px' }}>The mindset shift is woven in, not bolted on</h3>
            <div className="beats">
              {beats.map((b) => (
                <div key={b.id} className={`beat ${b.id}`}>
                  <div className="label">{b.mins}</div>
                  <h4>{b.name}</h4>
                  <p>{b.line}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}><MindsetRibbon mindset={p.mindset} compact /></div>
            <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => onRoute('approach')}>Read the approach note <ArrowRight size={15} /></button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead
            kicker="04 · Outcomes"
            title="By the end, every learner can"
            right={<button className="btn btn-red" onClick={() => onRoute('journey')}>See the journey <ArrowRight size={16} /></button>}
          />
          <div className={`grid ${p.objectives.length > 5 ? 'g3' : 'g5'}`}>
            {p.objectives.map((o, i) => (
              <div key={o.title} className="card obj">
                <span className="n">0{i + 1}</span>
                <div><h4>{o.title}</h4><p>{o.line}</p></div>
              </div>
            ))}
          </div>
          <div className="grid g5" style={{ marginTop: 16 }}>
            {p.facts.map((f) => (
              <div key={f.k}><div className="label">{f.k}</div><div style={{ fontSize: 14, marginTop: 4 }}>{f.v}</div></div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
