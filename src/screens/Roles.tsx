import { roles, stages, stageVars } from '../lib/data'
import type { Pathway } from '../lib/types'
import { SectionHead } from '../components/ui'

const STATE_LABEL: Record<string, string> = {
  leads: 'Leads', validates: 'Validates', supports: 'Supports', challenges: 'Challenges',
  builds: 'Builds', practises: 'Practises', owns: 'Owns', defends: 'Defends',
}
// Cell lines paraphrase the support-model table in the upGrad journeys document.
const STATE_LINE: Record<string, Record<number, string>> = {
  instructor: { 1: 'Teaches the foundation live.' },
  trainer: { 2: 'All 31 hours: demonstrate, practise, correct.' },
  mentor: { 3: '24 hrs: discovery, build, measurement, refinement.', 4: '9 hrs: assembly, review, rehearsal.' },
  manager: { 3: 'Helps judge which use case carries business value.', 4: "Sees the outcome in the team's work." },
  panel: { 4: 'Questions the five-minute defence, if approved.' },
  learner: { 1: 'Vocabulary and a baseline diagnostic.', 2: 'Tries every workflow live and gets corrected.', 3: 'Chooses the problem, does the work.', 4: 'Presents the case and answers for it.' },
}

export function Roles({ p }: { p: Pathway }) {
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead
          kicker={`${p.name} · Who does what`}
          title="Support shifts as the learner takes ownership"
          sub="Instructor → expert trainer → mentor, with the reporting manager validating value and a panel (pending approval) challenging the case."
        />
        <div className="swim-scroll">
          <div className="swim">
            <div />
            {stages.map((st) => (
              <div key={st.n} className="swim-head" style={stageVars(st.n)}>
                <span className="label">Stage {st.n}</span>
                <b>{st.name}</b>
                <span className="muted">{st.hours} hrs</span>
              </div>
            ))}
            {roles.map((r) => (
              <div key={r.id} className="swim-row">
                <div className="swim-role">
                  <b>{r.name}</b>
                  <span className="muted">{r.hours}</span>
                  <span>{r.line}</span>
                </div>
                {r.stages.map((state, i) => (
                  <div key={i} className={`swim-cell s-${state}`} style={stageVars(i + 1)}>
                    {state !== 'none' && (
                      <>
                        <span className="swim-state">{STATE_LABEL[state]}</span>
                        <span className="swim-line">{STATE_LINE[r.id]?.[i + 1]}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="map-legend">
          <span><i className="lg lg-lead" /> Leads or owns the stage</span>
          <span><i className="lg lg-sup" /> Actively supports</span>
          <span><i className="lg lg-none" /> Not involved</span>
        </div>
      </div>
    </section>
  )
}
