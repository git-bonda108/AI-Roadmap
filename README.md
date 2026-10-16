# AI-Roadmap

The training flow for OSBI's AI Practitioner (formerly AI Champion) and Data Citizen pathways, plus daily quick-win use cases by department,, as a static React app hosted on Azure Static Web Apps.

**Live:** https://blue-field-0a3070700.6.azurestaticapps.net
(Static Web App `osbi-ai-hub`, resource group `rg-osbi-ai-hub`, subscription `b6ee57bd-…`, Free tier)

## Content

| File | Holds | Edit? |
|---|---|---|
| `src/data/skeleton.json` | Session titles, coverage and deliverables, word for word from the upGrad journeys HTML, plus week/day slots | Regenerate with `npm run data` |
| `src/data/base.json` | Stages, mindset arc, pulse questions, roles, functions | Yes |
| `src/data/content/<pathway>.json` | Per-session concept, segments, build, how-to and reflect prompts, plus 24 use cases | Yes |
| `src/data/daily.json` | 48 daily quick wins (4 per department): role, task, ready-to-paste prompt, output, check | Yes |

Materials and exercises: each session has empty `materials: []` and `exercises: []` arrays in `skeleton.json`, ready for B7.

## Commands

```bash
npm run dev          # local preview
npm run validate     # hours (78 = 10/31/28/9), spark/use-case integrity, quick wins, word limits, banned claims
npm run build        # validate + typecheck + build to dist/
scripts/make_pdfs.sh # regenerate public/pdf/* (needs `npm run dev` running; embeds no Anthropic fonts)
```

## Deploy

```bash
export SWA_CLI_DEPLOYMENT_TOKEN=$(az staticwebapp secrets list -n osbi-ai-hub -g rg-osbi-ai-hub --subscription b6ee57bd-3206-4e68-aa93-a381111995c9 --query properties.apiKey -o tsv)
npx @azure/static-web-apps-cli@2.0.2 deploy ./dist --env production
```

## Testing

`scripts/e2e.js` runs in the page: it walks every screen in both pathways, every session panel and tab, the use-case tiles and the booklets.

## Guardrails

- **No dates:** the start date is unconfirmed, so only durations are shown.
- **No numeric benefit claims, and no M365 integration or automation claims.**
- **Fonts:** the Anthropic fonts are referenced by installed name only and are never served. Ready-made PDFs use Georgia, Open Sans and Menlo.
- **Not indexed:** `noindex` is set in both the page meta and the response headers.
