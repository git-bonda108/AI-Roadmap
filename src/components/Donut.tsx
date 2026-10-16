import { stages } from '../lib/data'

/** Hours per stage as a ring. Arc lengths are computed from base.json, never hard-coded. */
export function HoursDonut({ size = 168 }: { size?: number }) {
  const total = stages.reduce((a, s) => a + s.hours, 0)
  const r = 15.9155 // circumference = 100
  // Each arc starts where the previous one ended; 25 puts the first at 12 o'clock.
  const starts = stages.map((_, i) => 25 - stages.slice(0, i).reduce((a, s) => a + (s.hours / total) * 100, 0))
  return (
    <div className="donut-wrap">
      <svg width={size} height={size} viewBox="0 0 42 42" role="img" aria-label={`${total} hours by stage`}>
        <circle cx="21" cy="21" r={r} fill="none" stroke="var(--fill)" strokeWidth="5" />
        {stages.map((s, i) => {
          const pct = (s.hours / total) * 100
          return (
            <circle
              key={s.n}
              cx="21" cy="21" r={r} fill="none"
              stroke={`var(--st${s.n})`} strokeWidth="5"
              strokeDasharray={`${pct - 0.6} ${100 - pct + 0.6}`}
              strokeDashoffset={starts[i]}
            >
              <title>{`Stage ${s.n} · ${s.name}: ${s.hours} hrs`}</title>
            </circle>
          )
        })}
        <text x="21" y="21" textAnchor="middle" fontFamily="var(--serif)" fontSize="9" fill="var(--black)">{total}</text>
        <text x="21" y="26.5" textAnchor="middle" fontFamily="var(--label)" fontWeight="700" fontSize="2.6" letterSpacing="0.3" fill="var(--gray)">HOURS</text>
      </svg>
      <div className="donut-legend">
        {stages.map((s) => (
          <div key={s.n}>
            <span className="sw" style={{ background: `var(--st${s.n})` }} />
            <b style={{ fontWeight: 600 }}>{s.name}</b> <span className="muted">· {s.hours} hrs · {s.shape}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
