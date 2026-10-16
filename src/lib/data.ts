import base from '../data/base.json'
import skeleton from '../data/skeleton.json'
import dailyData from '../data/daily.json'
import type { CSSProperties } from 'react'
import type { DailyUseCase, Fn, Pathway, PathwayId, PathwayMeta, Role, Session, Stage, UseCase } from './types'

interface ContentFile {
  pathway: PathwayId
  sessions: Record<string, Partial<Session>>
  useCases: UseCase[]
}

// Authored content is optional at build time: the app still renders the verbatim skeleton without it.
const contentModules = import.meta.glob<ContentFile>('../data/content/*.json', { eager: true, import: 'default' })
const content: Partial<Record<PathwayId, ContentFile>> = {}
for (const mod of Object.values(contentModules)) content[mod.pathway] = mod

const skel = skeleton.pathways as Record<PathwayId, Session[]>

export const program = base.program
export const stages: Stage[] = base.stages
export const roles: Role[] = base.roles
export const functions: Fn[] = base.functions
export const beats = base.beats
export const fixesApplied: string[] = skeleton.fixesApplied

export const pathways: Record<PathwayId, Pathway> = Object.fromEntries(
  (base.pathways as PathwayMeta[]).map((meta) => {
    const c = content[meta.id]
    const sessions = skel[meta.id].map((s) => ({ ...s, ...(c?.sessions[s.key] ?? {}) }))
    return [meta.id, { ...meta, sessions, useCases: c?.useCases ?? [] }]
  }),
) as Record<PathwayId, Pathway>

export const daily: DailyUseCase[] = dailyData.daily as DailyUseCase[]

export const fnById = (id: string | null | undefined) => functions.find((f) => f.id === id)
export const stageByN = (n: number) => stages[n - 1]
export const roleById = (id: string) => roles.find((r) => r.id === id)

export const stageVars = (n: number) =>
  ({ '--st-bg': `var(--st${n})`, '--st-ink': n >= 3 ? '#fff' : 'var(--ink)' }) as CSSProperties

export const liveCount = (p: Pathway) => p.sessions.filter((s) => s.kind === 'live').length
export const totalHours = (p: Pathway) => p.sessions.reduce((a, s) => a + s.durationHrs, 0)
export const weeks = (p: Pathway) => Math.max(...p.sessions.map((s) => s.week))
