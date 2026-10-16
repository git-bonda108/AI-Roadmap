import { useEffect } from 'react'
import { ArrowRight, Download, Printer } from 'lucide-react'
import type { Pathway } from '../lib/types'
import { beats, fnById, functions, pathways, stages, stageVars } from '../lib/data'
import type { Route } from '../components/Nav'

const ac = pathways['ai-practitioner']
const dc = pathways['data-citizen']
const pulseList = (p: Pathway) => p.sessions.filter((s) => s.pulse).map((s) => `${s.code ?? 'Clinic'} (Wk ${s.week})`).join(' · ')
const stage1 = ac.sessions.filter((s) => s.stage === 1 && s.kind === 'live')

/** Short approach note on the mindset shift, written for the client connect. Prints to two A4 pages. */
export function Approach({ onRoute }: { onRoute: (r: Route, p?: Pathway['id']) => void }) {
  useEffect(() => {
    const prev = document.title
    document.title = 'AI-Roadmap · GenAI mindset shift · Approach note'
    return () => { document.title = prev }
  }, [])
  const s1 = ac.sessions[0]
  const s1uc = ac.useCases.find((u) => u.id === s1.spark?.useCaseId)!

  return (
    <div className="booklet-shell">
      <div className="booklet-bar no-print">
        <div className="wrap booklet-bar-in">
          <div><div className="kicker">Approach note</div><b>GenAI mindset shift · for the client connect</b></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-red" onClick={() => window.print()}><Printer size={16} /> Save as PDF</button>
            <a className="btn btn-ghost" href="/pdf/AI-Roadmap-Mindset-Approach-Note.pdf" download><Download size={16} /> Ready-made PDF</a>
            <button className="btn btn-ghost" onClick={() => onRoute('mindset')}>See it in the app <ArrowRight size={15} /></button>
          </div>
        </div>
      </div>

      <div className="booklet">
        <section className="page note">
          <div className="cover-top">
            <div className="kicker">OSBI · AI Practitioner and Data Citizen · Approach note</div>
            <img src="/upgrad-logo-light.png" alt="upGrad Enterprise" className="cover-logo" />
          </div>
          <h1 className="note-title">Weaving the GenAI mindset shift through the whole programme</h1>
          <p className="note-lede">
            OSBI asked for a GenAI mindset shift, because learners come from different functional teams with varying levels of GenAI knowledge.
            A single standalone session cannot produce that shift. We build it into every session instead, with a strong start in the first two weeks.
          </p>

          <div className="note-asks">
            <div className="label">What OSBI asked for → how we answer it</div>
            <table className="pb-table">
              <tbody>
                <tr><td><b>A mindset shift, not only tool skills</b></td><td>A four-step arc runs across the four stages: <b>Demystify → Experiment → Redesign → Champion</b>.</td></tr>
                <tr><td><b>A few early sessions on mindset</b></td><td>Stage 1 (S1–S3, Weeks 1–2) is the concentrated start. In AI Practitioner: {stage1.map((s) => `“${s.title}”`).join(', ')}. The shift then continues in every later session.</td></tr>
                <tr><td><b>Learners from different functions</b></td><td>Each session opens with a use case from one OSBI function. All {functions.length} functions open two sessions, so every learner sees their own work early and again later.</td></tr>
                <tr><td><b>Varying levels of GenAI knowledge</b></td><td>A readiness diagnostic in S3; concrete, demonstrated openers before any theory; peer practice and review (S12 in AI Practitioner, S13 in Data Citizen); a guidance clinic before the applied stage; mentor-led application on each learner's own problem.</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="pb-h">1 · The same three beats in every live session</h3>
          <div className="note-beats">
            {beats.map((b) => (
              <div key={b.id} className={`beat ${b.id}`}>
                <div className="label">{b.mins}</div>
                <h4>{b.name}</h4>
                <p>{b.line}</p>
              </div>
            ))}
          </div>
          <p className="note-small">This is what was proposed (open with a short GenAI use case, hands-on activity relevant to each function, close with brief reflection points), applied to every one of the 24 live sessions rather than only to each module.</p>

          <h3 className="pb-h">2 · Four shifts, one per stage</h3>
          <table className="pb-table">
            <thead><tr><th>Stage</th><th>Shift</th><th>AI Practitioner: from → to</th><th>Data Citizen: from → to</th></tr></thead>
            <tbody>
              {stages.map((st) => {
                const a = ac.mindset[st.n - 1]
                const d = dc.mindset[st.n - 1]
                return (
                  <tr key={st.n}>
                    <td className="nowrap"><span className="pb-sw" style={stageVars(st.n)} />{st.name}</td>
                    <td><b>{a.shift}</b></td>
                    <td><span className="muted">{a.from}</span> → {a.to}</td>
                    <td><span className="muted">{d.from}</span> → {d.to}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>

        <section className="page note">
          <h3 className="pb-h" style={{ marginTop: 0 }}>3 · Every function opens two sessions (AI Practitioner shown)</h3>
          <div className="note-rot">
            {functions.map((f) => {
              const keys = ac.sessions.filter((s) => s.sparkFunction === f.id).map((s) => s.code)
              return <div key={f.id}><b>{f.name}</b><span className="mono">{keys.join(' · ')}</span></div>
            })}
          </div>
          <p className="note-small">Operations opens the programme (S1). The Data Citizen pathway follows the same rule with data-focused use cases.</p>

          <h3 className="pb-h">4 · What it looks like in one session: {s1.code}, {s1.title}</h3>
          <table className="pb-table">
            <tbody>
              <tr><td className="nowrap"><span className="chip chip-spark">Spark</span></td><td><b>{fnById(s1uc.functionId)?.name}: {s1uc.title}.</b> {s1.spark?.hook}</td></tr>
              <tr><td className="nowrap"><span className="chip chip-build">Build</span></td><td>{s1.build}</td></tr>
              <tr><td className="nowrap"><span className="chip chip-reflect">Reflect</span></td><td>{s1.reflect?.join(' · ')}</td></tr>
            </tbody>
          </table>

          <h3 className="pb-h">5 · How we show the shift happened</h3>
          <p>A five-statement <b>mindset pulse</b>, self-rated 1–5, taken four times: {pulseList(ac)}. The trend becomes part of the capability-uplift evidence, alongside each learner's measured before-and-after result (S18–S19) and their mentor-reviewed case (S22–S23).</p>
          <ol className="pb-obj note-small">{ac.pulse.map((q) => <li key={q}>{q}</li>)}</ol>

          <h3 className="pb-h">6 · What we need from OSBI</h3>
          <ul className="pb-scope note-need">
            <li>Two or three real pain points per function, so the opening use cases mirror OSBI's actual work.</li>
            <li>Confirmation of permitted data for exercises (anonymised exports or mock data) and of the Copilot Chat configuration.</li>
            <li>Agreement to run the mindset pulse at the four points, and who sees the results.</li>
            <li>The team list behind the 22 teams, to check the function rotation covers every team.</li>
          </ul>

          <div className="note-foot">
            Draft for discussion at the client connect · Start date to be confirmed · The full flow, session by session, is in AI-Roadmap.
          </div>
        </section>
      </div>
    </div>
  )
}
