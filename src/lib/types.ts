export type PathwayId = 'ai-practitioner' | 'data-citizen'
export type Beat = 'spark' | 'build' | 'reflect'
export type ItemKind = 'live' | 'selfpaced' | 'clinic' | 'independent'
export type Slot = 'day1' | 'day2' | 'async'

export interface Segment {
  label: string
  mins: number
  beats?: Beat[]
  focus?: string
}

export interface UseCase {
  id: string
  functionId: string
  sessionKey: string
  title: string
  scenario: string
  input: string
  aiDoes: string
  howTo: string[]
  humanCheck: string
  measure: string
  boundary: string
}

/** Session as delivered: verbatim source fields (skeleton) + authored content. */
export interface Session {
  id: string
  key: string
  code: string | null
  kind: ItemKind
  stage: number
  week: number
  slot: Slot
  title: string
  durationHrs: number
  lead: string
  coverage: string
  produces: string
  pulse: boolean
  sparkFunction: string | null
  materials: unknown[]
  exercises: unknown[]
  concept?: string
  spark?: { useCaseId: string; hook: string }
  segments?: Segment[]
  build?: string
  howTo?: string[]
  reflect?: string[]
}

export interface Stage { n: number; id: string; name: string; label: string; hours: number; lead: string; shape: string }
export interface Role { id: string; name: string; hours: string; line: string; stages: string[] }
export interface Fn { id: string; name: string; context: string }
export interface Mindset { stage: number; shift: string; from: string; to: string }

export interface PathwayMeta {
  id: PathwayId
  name: string
  tagline: string
  line: string
  facts: { k: string; v: string }[]
  objectives: { title: string; line: string }[]
  mindset: Mindset[]
  pulse: string[]
}

export interface Pathway extends PathwayMeta {
  sessions: Session[]
  useCases: UseCase[]
}

/** Everyday quick-win use case: a ready-to-paste prompt for a role in one department. */
export interface DailyUseCase {
  id: string
  functionId: string
  role: string
  title: string
  task: string
  prompt: string
  output: string
  check: string
  tool: 'Copilot Chat' | 'Excel + Copilot Chat'
  frequency: 'Daily' | 'Weekly' | 'Monthly'
}
