import { useEffect, useRef } from 'react'
import { FileDown, Presentation } from 'lucide-react'
import type { PathwayId } from '../lib/types'
import { pathways } from '../lib/data'

export type Route = 'overview' | 'journey' | 'sessions' | 'mindset' | 'usecases' | 'roles' | 'print' | 'approach'
export const routes: { id: Route; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'journey', label: 'Journey map' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'mindset', label: 'Mindset arc' },
  { id: 'usecases', label: 'Use cases' },
  { id: 'roles', label: 'Roles' },
]

export function Mark({ size = 30 }: { size?: number }) {
  return (
    <svg className="brand-mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0A0A0A" />
      <path d="M32 13 13 22l19 9 19-9-19-9Z" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M21 27v9c0 4 5 7 11 7s11-3 11-7v-9" fill="none" stroke="#fff" strokeWidth="3.5" />
      <path d="M51 22v14" stroke="#FF2500" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="51" cy="40" r="4" fill="#FF2500" />
    </svg>
  )
}

export function PathwaySwitch({ value, onChange }: { value: PathwayId; onChange: (p: PathwayId) => void }) {
  return (
    <div className="switch" role="group" aria-label="Pathway">
      {(Object.keys(pathways) as PathwayId[]).map((id) => (
        <button key={id} aria-pressed={value === id} onClick={() => onChange(id)}>
          <span className="dot" />{pathways[id].name}
        </button>
      ))}
    </div>
  )
}

export function Nav({ route, onRoute, pathway, onPathway, present, onPresent }: {
  route: Route; onRoute: (r: Route) => void; pathway: PathwayId; onPathway: (p: PathwayId) => void
  present: boolean; onPresent: () => void
}) {
  const linksRef = useRef<HTMLElement>(null)
  // Keep the active link visible when the menu scrolls sideways on narrow screens.
  useEffect(() => {
    linksRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [route])
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <button className="brand" onClick={() => onRoute('overview')} aria-label="AI-Roadmap home">
          <Mark />
          <span className="brand-name">AI-<b>Roadmap</b></span>
        </button>
        <nav ref={linksRef} className="nav-links" aria-label="Sections">
          {routes.map((r) => (
            <button key={r.id} className="nav-link" aria-current={route === r.id ? 'page' : undefined} onClick={() => onRoute(r.id)}>
              {r.label}
            </button>
          ))}
        </nav>
        <PathwaySwitch value={pathway} onChange={onPathway} />
        <div className="nav-tools">
          <button className="tool-btn" aria-label="Present mode" aria-pressed={present} onClick={onPresent} title="Present mode: larger type for screen-sharing">
            <Presentation size={14} /><span>Present</span>
          </button>
          <button className="tool-btn" aria-label="Export PDF" aria-pressed={route === 'print'} onClick={() => onRoute('print')} title="Export the programme flow as PDF">
            <FileDown size={14} /><span>PDF</span>
          </button>
        </div>
        <img className="nav-ug" src="/upgrad-logo-light.png" alt="upGrad Enterprise" />
      </div>
    </header>
  )
}
