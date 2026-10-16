import { useCallback, useEffect, useState } from 'react'
import type { PathwayId } from './lib/types'
import { pathways, program } from './lib/data'
import { Nav, routes, type Route } from './components/Nav'
import { Overview } from './screens/Overview'
import { Journey } from './screens/Journey'
import { Sessions } from './screens/Sessions'
import { Mindset } from './screens/Mindset'
import { UseCases } from './screens/UseCases'
import { Roles } from './screens/Roles'
import { Booklet, type BookletScope } from './screens/Booklet'
import { Approach } from './screens/Approach'
import { SessionDrawer } from './components/SessionDrawer'

const isRoute = (v: string): v is Route => v === 'print' || v === 'approach' || routes.some((r) => r.id === v)
const isPathway = (v: string): v is PathwayId => v in pathways

/** Hash routing: #/<route>?p=<pathway> — shareable links, no server config needed. */
function readHash(): { route: Route; pathway: PathwayId; session: string | null; scope: BookletScope; safe: boolean } {
  const [path, query] = window.location.hash.replace(/^#\/?/, '').split('?')
  const qs = new URLSearchParams(query)
  const p = (qs.get('p') ?? '').replace(/^ai-champion$/, 'ai-practitioner')
  // 'ai-champion' links pre-date the rename to AI Practitioner; keep them working.
  const pathway = isPathway(p) ? p : 'ai-practitioner'
  const b = (qs.get('b') ?? '').replace(/^ai-champion$/, 'ai-practitioner')
  return {
    route: isRoute(path) ? path : 'overview',
    pathway,
    session: qs.get('s'),
    scope: b === 'both' || isPathway(b) ? (b as BookletScope) : pathway,
    safe: qs.get('safe') === '1',
  }
}

const toHash = (route: Route, pathway: PathwayId, session?: string | null) =>
  `/${route}?p=${pathway}${session ? `&s=${session}` : ''}`

export default function App() {
  const [state, setState] = useState(readHash)
  useEffect(() => {
    const onHash = () => setState(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const go = useCallback((route: Route, pathway: PathwayId = state.pathway) => {
    window.location.hash = toHash(route, pathway)
    window.scrollTo({ top: 0 })
  }, [state.pathway])
  // Opening a session keeps the scroll position; the drawer is shareable via &s=<key>.
  const openSession = useCallback((key: string | null) => {
    window.location.hash = toHash(state.route, state.pathway, key)
  }, [state.route, state.pathway])
  const closeSession = useCallback(() => openSession(null), [openSession])

  const [present, setPresent] = useState(false)
  useEffect(() => { document.documentElement.classList.toggle('present', present) }, [present])
  useEffect(() => { document.documentElement.classList.toggle('safe-fonts', state.safe) }, [state.safe])
  const setScope = (b: BookletScope) => { window.location.hash = `/print?p=${state.pathway}&b=${b}` }

  const p = pathways[state.pathway]
  const setPathway = (id: PathwayId) => go(state.route, id)

  return (
    <>
      <Nav
        route={state.route} onRoute={(r) => go(r)} pathway={state.pathway} onPathway={setPathway}
        present={present} onPresent={() => setPresent((v) => !v)}
      />
      <main>
        {state.route === 'overview' && <Overview p={p} onPathway={setPathway} onRoute={(r) => go(r)} />}
        {state.route === 'journey' && <Journey p={p} onOpen={openSession} />}
        {state.route === 'sessions' && <Sessions p={p} onOpen={openSession} />}
        {state.route === 'mindset' && <Mindset p={p} onOpen={openSession} onApproach={() => go('approach')} />}
        {state.route === 'usecases' && <UseCases p={p} onOpen={openSession} onPathway={setPathway} />}
        {state.route === 'roles' && <Roles p={p} />}
        {state.route === 'print' && <Booklet scope={state.scope} onScope={setScope} />}
        {state.route === 'approach' && <Approach onRoute={(r) => go(r)} />}
      </main>
      <SessionDrawer p={p} sessionKey={state.session} onOpen={openSession} onClose={closeSession} />
      <footer className="foot">
        <div className="wrap foot-in">
          <span>{program.client} capability programme · {program.startNote} · Draft for review</span>
          <img src="/upgrad-logo-dark.png" alt="upGrad Enterprise" />
        </div>
      </footer>
    </>
  )
}
