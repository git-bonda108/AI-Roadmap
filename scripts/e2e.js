// In-page end-to-end check. Paste into the browser console (or run via a JS tool) on any deployment.
// Walks every route × pathway, every session drawer and tab, use-case tiles and the PDF booklet.
(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const fails = []
  const ok = (cond, msg) => { if (!cond) fails.push(msg) }
  const go = async (h) => { location.hash = h; await sleep(260) }
  const overflow = () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  const text = (sel) => document.querySelector(sel)?.textContent?.trim() ?? ''
  let checks = 0
  const C = (cond, msg) => { checks++; ok(cond, msg) }

  for (const p of ['ai-practitioner', 'data-citizen']) {
    const name = p === 'ai-practitioner' ? 'AI Practitioner' : 'Data Citizen'
    // Overview
    await go(`/overview?p=${p}`)
    C(text('.hero h1').startsWith(name), `${p} overview title`)
    C(text('.hero .stats').includes('78') && text('.hero .stats').includes('24') && text('.hero .stats').includes('13'), `${p} overview stats 78/24/13`)
    C(document.querySelectorAll('.stage-card').length === 4, `${p} 4 stage cards`)
    C(!/\b20(26|27)\b/.test(document.body.innerText), `${p} overview shows no calendar year`)
    C(!overflow(), `${p} overview no overflow`)
    // Journey
    await go(`/journey?p=${p}`)
    C(document.querySelectorAll('.map-cell').length === 27, `${p} journey 27 cells`)
    C(document.querySelectorAll('.map-band').length === 4, `${p} journey 4 bands`)
    C(document.querySelectorAll('.map-cell .mc-pulse').length === 4, `${p} journey 4 pulse markers`)
    C(!overflow(), `${p} journey no overflow`)
    // Sessions list + every drawer + every tab
    await go(`/sessions?p=${p}`)
    const rows = [...document.querySelectorAll('.tl-row')]
    C(rows.length === 27, `${p} sessions 27 rows`)
    const keys = ['s1','s2','s3','self','s4','s5','s6','s7','s8','s9','s10','s11','s12','s13','clinic','s14','s15','s16','s17','s18','s19','s20','s21','indep','s22','s23','s24'].map((k) => k.toUpperCase())
    for (const k of keys) {
      await go(`/sessions?p=${p}&s=${k}`)
      const d = document.querySelector('.drawer')
      C(!!d, `${p} ${k} drawer opens`)
      if (!d) continue
      C(d.querySelector('h2')?.textContent.length > 3, `${p} ${k} has title`)
      C(d.querySelectorAll('.hourbar .seg').length >= 1, `${p} ${k} hour bar`)
      for (const tab of [...d.querySelectorAll('.tab')]) {
        tab.click(); await sleep(60)
        const body = d.querySelector('.drawer-body').innerText
        C(body.length > 120, `${p} ${k} tab "${tab.textContent}" has content`)
      }
      const live = /^S\d+$/.test(k)
      C(!!d.querySelector('.tab') && [...d.querySelectorAll('.tab')].some((t) => t.textContent === 'Use case') === live, `${p} ${k} use-case tab only on live sessions`)
      d.querySelector('.tab')?.click()
    }
    await go(`/sessions?p=${p}`)
    C(!document.querySelector('.drawer'), `${p} drawer closes`)
    // Mindset
    await go(`/mindset?p=${p}`)
    C(document.querySelectorAll('.arc-step').length === 4, `${p} mindset 4 steps`)
    C(document.querySelectorAll('.rot-dot').length === 24, `${p} rotation 24 dots`)
    const perFn = [...document.querySelectorAll('.rot-row')].map((r) => r.querySelectorAll('.rot-dot').length)
    C(perFn.length === 12 && perFn.every((n) => n === 2), `${p} each function sparks twice`)
    C(document.querySelectorAll('.pulse-pt').length === 4, `${p} 4 pulse points`)
    C(!overflow(), `${p} mindset no overflow`)
    // Use cases: every tile shows 2 cards
    await go(`/usecases?p=${p}`)
    for (const t of [...document.querySelectorAll('.fn-tile')]) {
      t.click(); await sleep(60)
      C(document.querySelectorAll('.uc-card').length === 2, `${p} use cases for ${t.textContent.trim()} = 2`)
    }
    C(!overflow(), `${p} use cases no overflow`)
    // Roles
    await go(`/roles?p=${p}`)
    C(document.querySelectorAll('.swim-role').length === 6, `${p} 6 roles`)
    C(!overflow(), `${p} roles no overflow`)
  }
  // Booklet
  for (const [b, n] of [['ai-practitioner', 27], ['data-citizen', 27], ['both', 54]]) {
    await go(`/print?b=${b}`)
    C(document.querySelectorAll('.pb-session').length === n, `booklet ${b} has ${n} session blocks`)
  }
  for (const b of ['ai-practitioner', 'data-citizen', 'both']) {
    const r = await fetch(`/pdf/AI-Roadmap-${b}.pdf`, { method: 'HEAD' })
    C(r.ok && (r.headers.get('content-type') || '').includes('pdf'), `PDF ${b} served (${r.status} ${r.headers.get('content-type')})`)
  }
  // Unknown route falls back to overview
  await go('/nope')
  C(!!document.querySelector('.hero'), 'unknown route falls back to overview')
  await go('/overview?p=ai-practitioner')
  return { checks, failed: fails.length, fails }
})()
