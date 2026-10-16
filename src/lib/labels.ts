import type { Session } from './types'

export const slotLabel = (s: Session) =>
  s.slot === 'async' ? `Week ${s.week} · Self-directed` : `Week ${s.week} · Day ${s.slot === 'day1' ? 1 : 2}`

export const kindLabel: Record<Session['kind'], string> = {
  live: 'Live session',
  selfpaced: 'Self-paced',
  clinic: 'Live clinic',
  independent: 'Independent application',
}

export const leadLabel: Record<string, string> = {
  instructor: 'Instructor',
  trainer: 'Expert trainer',
  mentor: 'Mentor',
  learner: 'Learner, self-directed',
}

export const hrs = (h: number) => `${h} hr${h === 1 ? '' : 's'}`

/** Public-folder URL that works at the site root (Azure) and under a sub-path (GitHub Pages). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
