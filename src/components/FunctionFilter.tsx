import { functions } from '../lib/data'
import { FnIcon } from '../lib/icons'

export function FunctionFilter({ value, onChange }: { value: string | null; onChange: (id: string | null) => void }) {
  return (
    <div className="fn-filter" role="group" aria-label="Highlight by function">
      <button className="fchip" aria-pressed={value === null} onClick={() => onChange(null)}>All functions</button>
      {functions.map((f) => (
        <button key={f.id} className="fchip" aria-pressed={value === f.id} onClick={() => onChange(value === f.id ? null : f.id)} title={f.context}>
          <FnIcon id={f.id} size={13} /> {f.name}
        </button>
      ))}
    </div>
  )
}
