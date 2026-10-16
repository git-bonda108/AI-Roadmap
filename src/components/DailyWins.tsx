import { useState } from 'react'
import { Check, Copy, Repeat, ShieldCheck, Table2, MessageSquare } from 'lucide-react'
import { daily } from '../lib/data'

/** Everyday, role-specific quick wins for one department, each with a copyable prompt. */
export function DailyWins({ functionId, functionName }: { functionId: string; functionName: string }) {
  const items = daily.filter((d) => d.functionId === functionId)
  const [copied, setCopied] = useState<string | null>(null)
  if (items.length === 0) return null

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1600)
    } catch {
      setCopied(null)
    }
  }

  return (
    <div className="dw" id="daily-wins">
      <div className="dw-head">
        <div>
          <div className="kicker">Daily quick wins · {functionName}</div>
          <h3>Try these tomorrow</h3>
          <p className="muted">Popular everyday tasks for roles in {functionName}. Paste anonymised or mock content only, and check the output before you use it.</p>
        </div>
      </div>
      <div className="grid g2">
        {items.map((d) => (
          <article key={d.id} className="card dw-card">
            <div className="dw-chips">
              <span className="chip chip-dark">{d.role}</span>
              <span className="chip chip-outline">{d.tool === 'Copilot Chat' ? <MessageSquare size={12} /> : <Table2 size={12} />} {d.tool}</span>
              <span className="chip chip-outline"><Repeat size={12} /> {d.frequency}</span>
            </div>
            <h4 className="dw-title">{d.title}</h4>
            <p className="dw-task">{d.task}</p>
            <div className="dw-prompt">
              <div className="dw-prompt-bar">
                <span className="label">Prompt</span>
                <button className="dw-copy" onClick={() => copy(d.id, d.prompt)} aria-label={`Copy prompt: ${d.title}`}>
                  {copied === d.id ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                </button>
              </div>
              <p className="mono">{d.prompt}</p>
            </div>
            <dl className="dw-kv">
              <dt>You get</dt><dd>{d.output}</dd>
              <dt><ShieldCheck size={13} /> Check</dt><dd>{d.check}</dd>
            </dl>
          </article>
        ))}
      </div>
    </div>
  )
}
