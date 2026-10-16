import type { Segment } from '../lib/types'

const fallback = (mins: number): Segment[] =>
  mins === 180
    ? [{ label: 'Segment 1', mins: 90 }, { label: 'Break', mins: 15 }, { label: 'Segment 2', mins: 90 }]
    : [{ label: 'Single block', mins }]

/** Durations only — no clock times until the schedule is confirmed. */
export function HourBar({ segments, totalMins }: { segments?: Segment[]; totalMins: number }) {
  const segs = segments?.length ? segments : fallback(totalMins)
  const live = segs.length > 1
  return (
    <div className="hourbar" role="img" aria-label={segs.map((s) => `${s.label} ${s.mins} minutes`).join(', ')}>
      {segs.map((s, i) => {
        const brk = s.label === 'Break'
        return (
          <div
            key={i}
            className={`seg ${brk ? 'brk' : live ? 'work' : 'solo'}`}
            style={{ flex: `${brk ? Math.max(s.mins, 22) : s.mins} 1 0` }}
            title={`${s.label} · ${s.mins} min`}
          >
            {brk ? <span style={{ fontSize: 10 }}>{s.mins}′</span> : (<><b>{s.label}</b><span>{s.mins} min</span></>)}
          </div>
        )
      })}
    </div>
  )
}
