import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, Gauge, Package, User } from 'lucide-react'
import type { Pathway, Session } from '../lib/types'
import { fnById, stageVars } from '../lib/data'
import { FnIcon } from '../lib/icons'
import { hrs, kindLabel, leadLabel, slotLabel } from '../lib/labels'
import { Drawer } from './Drawer'
import { HourBar } from './HourBar'
import { Tabs, type TabDef } from './Tabs'
import { BeatChip, StageChip } from './ui'

const TABS: TabDef[] = [
  { id: 'concept', label: 'Concept' },
  { id: 'usecase', label: 'Use case' },
  { id: 'howto', label: 'How to' },
  { id: 'reflect', label: 'Reflect' },
  { id: 'materials', label: 'Materials', soon: true },
  { id: 'exercises', label: 'Exercises', soon: true },
]

export function SessionDrawer({ p, sessionKey, onOpen, onClose }: {
  p: Pathway; sessionKey: string | null; onOpen: (key: string) => void; onClose: () => void
}) {
  const idx = p.sessions.findIndex((s) => s.key === sessionKey)
  const s = idx >= 0 ? p.sessions[idx] : null
  const [picked, setTab] = useState('concept')
  const tabs = s?.spark ? TABS : TABS.filter((t) => t.id !== 'usecase')
  // Keep the chosen tab across sessions; fall back when this session lacks it (no use case off-session).
  const tab = tabs.some((t) => t.id === picked) ? picked : 'concept'

  const prev = idx > 0 ? p.sessions[idx - 1] : null
  const next = idx >= 0 && idx < p.sessions.length - 1 ? p.sessions[idx + 1] : null

  useEffect(() => {
    if (!s) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return
      if (e.key === 'ArrowRight' && next) onOpen(next.key)
      if (e.key === 'ArrowLeft' && prev) onOpen(prev.key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [s, next, prev, onOpen])

  return (
    <Drawer open={!!s} onClose={onClose} label={s ? `${s.code ?? ''} ${s.title}` : 'Session'} head={s && <Head s={s} />}>
      {s && (
        <>
          <HourBar segments={s.segments} totalMins={s.durationHrs * 60} />
          <div style={{ marginTop: 16 }}><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>
          <div style={{ paddingTop: 18, minHeight: 260 }}>
            {tab === 'concept' && <Concept p={p} s={s} />}
            {tab === 'usecase' && <UseCaseTab p={p} s={s} />}
            {tab === 'howto' && <HowTo s={s} />}
            {tab === 'reflect' && <Reflect p={p} s={s} />}
            {(tab === 'materials' || tab === 'exercises') && (
              <div className="empty">
                <Package size={22} style={{ marginBottom: 8 }} />
                <div><b>{tab === 'materials' ? 'Session materials' : 'Practice exercises'}</b> will be added here.</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>The slot is ready for this session.</div>
              </div>
            )}
          </div>
          <div className="drawer-pager">
            <button className="btn btn-ghost" disabled={!prev} onClick={() => prev && onOpen(prev.key)}>
              <ChevronLeft size={16} /> {prev ? prev.code ?? kindLabel[prev.kind] : 'Start'}
            </button>
            <span className="label">{idx + 1} / {p.sessions.length}</span>
            <button className="btn btn-ghost" disabled={!next} onClick={() => next && onOpen(next.key)}>
              {next ? next.code ?? kindLabel[next.kind] : 'End'} <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
    </Drawer>
  )
}

function Head({ s }: { s: Session }) {
  return (
    <>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {s.code && <span className="chip chip-dark mono">{s.code}</span>}
        <StageChip n={s.stage} />
        {s.pulse && <span className="chip chip-pulse"><Gauge size={12} /> Mindset pulse</span>}
      </div>
      <h2 style={{ fontSize: 26, margin: '10px 0 6px' }}>{s.title}</h2>
      <div className="muted" style={{ fontSize: 13, display: 'flex', gap: 14, flexWrap: 'wrap', paddingBottom: 14 }}>
        <span>{slotLabel(s)}</span>
        <span><Clock size={12} style={{ verticalAlign: -1 }} /> {hrs(s.durationHrs)} · {kindLabel[s.kind]}</span>
        <span><User size={12} style={{ verticalAlign: -1 }} /> {leadLabel[s.lead]}</span>
      </div>
    </>
  )
}

function Concept({ p, s }: { p: Pathway; s: Session }) {
  const m = p.mindset.find((x) => x.stage === s.stage)!
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      {s.concept && <p className="lede">{s.concept}</p>}
      <div className="shift-box" style={stageVars(s.stage)}>
        <span className="kicker">{m.shift}</span>
        <span className="from">{m.from}</span>
        <span className="to">→ {m.to}</span>
      </div>
      <dl className="kv">
        <dt>Covers</dt><dd>{s.coverage}</dd>
        <dt>Learner produces</dt><dd><b style={{ fontWeight: 600 }}>{s.produces}</b></dd>
      </dl>
    </div>
  )
}

function UseCaseTab({ p, s }: { p: Pathway; s: Session }) {
  const u = p.useCases.find((x) => x.id === s.spark?.useCaseId)
  if (!u) return null
  const f = fnById(u.functionId)
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div className="spark-card">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <BeatChip beat="spark" />
          <span className="chip chip-outline"><FnIcon id={u.functionId} size={12} /> {f?.name}</span>
        </div>
        <h3 style={{ margin: '10px 0 6px' }}>{u.title}</h3>
        <p className="muted" style={{ fontSize: 14 }}>{s.spark?.hook}</p>
      </div>
      <dl className="kv">
        <dt>Situation</dt><dd>{u.scenario}</dd>
        <dt>Input</dt><dd>{u.input}</dd>
        <dt>AI produces</dt><dd>{u.aiDoes}</dd>
        <dt>Human check</dt><dd>{u.humanCheck}</dd>
        <dt>Measure</dt><dd>{u.measure}</dd>
        <dt>Boundary</dt><dd>{u.boundary}</dd>
      </dl>
      <div>
        <div className="label" style={{ marginBottom: 10 }}>Steps</div>
        <ol className="steps">{u.howTo.map((h) => <li key={h}>{h}</li>)}</ol>
      </div>
    </div>
  )
}

function HowTo({ s }: { s: Session }) {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {s.build && (
        <div className="build-box">
          <BeatChip beat="build" />
          <p style={{ marginTop: 8 }}>{s.build}</p>
        </div>
      )}
      {s.howTo && <ol className="steps">{s.howTo.map((h) => <li key={h}>{h}</li>)}</ol>}
      {s.segments && (
        <div style={{ display: 'grid', gap: 10 }}>
          <div className="label">Session flow</div>
          {s.segments.filter((g) => g.label !== 'Break').map((g) => (
            <div key={g.label} className="seg-row">
              <div><b>{g.label}</b><span className="muted"> · {g.mins} min</span></div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{g.beats?.map((b) => <BeatChip key={b} beat={b} />)}</div>
              {g.focus && <p className="muted" style={{ fontSize: 13.5, gridColumn: '1 / -1' }}>{g.focus}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Reflect({ p, s }: { p: Pathway; s: Session }) {
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div style={{ display: 'grid', gap: 10 }}>
        {s.reflect?.map((r) => <div key={r} className="reflect-q">{r}</div>)}
      </div>
      {s.pulse && (
        <div className="card" style={{ background: '#f4fbf7', borderColor: '#cfe9da' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="chip chip-pulse"><Gauge size={12} /> Mindset pulse</span>
            <span className="muted" style={{ fontSize: 12.5 }}>Self-rated, 1–5</span>
          </div>
          <ol className="pulse-list">{p.pulse.map((q) => <li key={q}>{q}</li>)}</ol>
        </div>
      )}
    </div>
  )
}
