# OSBI · AI Champion Program — Research Brief & Build Plan

Prepared 13 Oct 2026 · Sources: the four files in this folder (all read in full; spreadsheet formulas recalculated).

## 1. What the four documents are

| File | What it is | Role in the story |
|---|---|---|
| upGrad_OSBI_AI Champion and Data Citizen Journeys (3).html | upGrad Enterprise proposal page: two pathways (AI Champion, Data Citizen), 24-session curricula for each, support model | The table of contents: WHAT will be taught |
| OSBI_AI_Champion_Delivery_Plan.xlsx | Week-by-week calendar for AI Champion only, with formulas that compute dates | WHEN it runs |
| AI Program - eligibility (1).xlsx | OSBI's own selection framework: 8 gates, weighted score, 1–5 use-case rubric, seat allocation | WHO gets in (OSBI-authored) |
| uGE_OSBI_AI_Champion_ROI_Response.docx | upGrad's reply to OSBI leadership feedback | WHY it's worth it: the objections we must answer |

## 2. Program facts (verified)

- Four stages, 78 hrs:
  - Understand 10 hrs (S1–S3 + 1 hr self-paced)
  - Practice 31 hrs (S4–S13 + 1 hr clinic)
  - Apply 28 hrs (S14–S21 + 4 hrs independent)
  - Prove 9 hrs (S22–S24)
  - 24 × 3 hrs = 72 hrs, plus 6 hrs of other work.
- Who leads each stage: Instructor (10 hrs) → Expert Trainer (31 hrs) → Mentor (33 hrs, 11 sessions). The reporting manager validates the use case in S15; a panel (if approved) challenges the case in S24.
- Tool: Copilot Chat with file upload. NO M365 integration (no Outlook, Teams, SharePoint or Graph). Learners paste or upload content.
- Scope: "not developer training, no agent building". No certification. Panel review and 5-min defence are proposed, not approved.
- Calendar: Mon/Tue, 10:00–13:15 with a 15-min break after 90 min.
  - Start Mon 16 Nov 2026. No classes 28–29 Dec. Final session S24 on Mon 15 Feb 2027.
  - 13 teaching weeks over 14 calendar weeks.
  - Key dates: S3 readiness diagnostic 23 Nov · S13 4 Jan · clinic Tue 5 Jan · S14 use-case discovery 11 Jan · S15 manager validation 12 Jan · S18/S19 baseline and measurement 25–26 Jan · S22–S24 8–15 Feb.
- Selection: about 1,000 eligible colleagues for 30 seats (≈3%).
  - 22 seats are guaranteed (one per team); 8 are discretionary, ranked by score.
  - Score = 0.4 × manager score + 0.6 × use-case score. Manager scale {0,1,3,5}; use-case rubric 1–5.
  - Workbook example: 0.4×3 + 0.6×4 = 3.6.
  - Tie-breaks: use-case score, then manager score, then panel. An unused team seat moves to the discretionary pool.
- ROI position: no blended ROI figure is quoted, deliberately.
  - Directional: ~20–30% time saved per drafting or summarising task.
  - Illustration: 5 hrs/wk gives ~50–70 hrs per learner per year, then × blended cost × cohort. The peer multiplier (S20) is left uncosted.
  - Proof comes from each learner's own S18/S19 before/after and the S22–S23 capstone.

## 3. Leadership objections the demo must answer

1. "Too basic." Answer: Stages 3–4 produce a measured, defended business case.
2. "Not applicable to Operations." Answer: show, don't tell. Use the 12-function library and the Ops exception-log example.
3. ROI beyond adoption. Answer: measured before/after, a mentor-reviewed case, capability uplift, and the peer multiplier.
4. Duration of 78 hrs. Answer: the length is driven by the Apply and Prove stages.
5. Also expected: function-wise use cases, eligibility acknowledgement, 2 × 1-hr info sessions, and an ideathon at the end of Stage 2.

## 4. Inconsistencies to fix before the client sees anything

| # | Where | Issue |
|---|---|---|
| 1 | HTML, both pathway tables | Header says "15 sessions, 78 hours"; there are 24 sessions |
| 2 | HTML vs Delivery Plan | HTML: self-paced work is "between the three sessions", notes into "session 2". Plan: after S3, notes into S4 |
| 3 | Delivery Plan, Summary A17 | Says no async item takes a Day 1/Day 2 slot, but the guidance clinic sits in the Tue 5 Jan slot (10–11 AM, live) |
| 4 | Eligibility, Criteria row 16 | Double negative: "Not currently enrolled…" requires the answer "No". The Selection Guide wording is the correct one |
| 5 | Eligibility, rows 20–21 | People-leader and Future-Fit gates have no required answer filled in |
| 6 | Eligibility B8 | Label says "(months)"; value is the text "1 Year" |
| 7 | HTML vs ROI doc | HTML: Copilot Chat "pending confirmation of access". ROI doc: "confirmed". HTML is the newer file (13 Oct) |
| 8 | Teams vs functions | 22 teams for seat allocation; only 12 functions in the use-case library. Need OSBI's team list |
| 9 | S5 Meeting workflows | With no Teams integration this only works on pasted or exported notes; say so explicitly |
| 10 | Naming | "L&S" (eligibility) vs "L&D" (ROI doc) |
| 11 | Delivery Plan | Self-paced row has the same date as S4 (24 Nov); Holiday-end cell B9 is unused by the formula (harmless) |

## 5. Demo strategy — the key constraint

The program excludes agent building and M365 automation, so the Agents-SDK demo must not suggest learners will build agents, or that Copilot will act automatically. Position it as "the program, made tangible":

- The agents work behind the scenes.
- Every workflow stays within the learner's boundary: upload or paste → structured output → human review → measured benefit.
- The guardrails dramatise S3 and S21.

Proposed app "AI Champion Studio" (Streamlit + OpenAI Agents SDK):

| Tab | Shows | SDK features | Answers |
|---|---|---|---|
| 1 Program Navigator | 4-stage timeline, 24 sessions with real dates, roles, deliverables | none | Depth / duration |
| 2 Use-Case Coach | Pick a function + rough problem → rubric-shaped use case (input, workflow, output, review, benefit, controls) | Triage → function-specialist handoffs; Pydantic output_type | "Not for Ops"; application primer |
| 3 Ops Exception Log (live) | Upload a mock log → categorise, rank top 3, draft the handover. Counts via deterministic function_tool. Human approve/edit. Baseline-vs-after timer | function_tool, structured output, tracing | Measured ROI (S18/S19) |
| 4 Guardrails | Pasted PII is blocked. "Auto-monitor Teams" is flagged out of scope | Input/output guardrails | Governance; M365 boundary |
| 5 Selection Simulator | Synthetic applicants → 8 gates → weighted score → 22 + 8 allocation. Scorer agent grades a use case 1–5 with reasons | Scorer agent + deterministic allocation | Eligibility operationalised |
| 6 ROI Planner | Cohort / hrs / % / cost / peer-multiplier sliders, labelled directional | none | ROI beyond adoption |

Rule: the LLM does language; Python does every number. All data is mock or synthetic. An offline replay mode covers network failure.

## 6. Presentation (Anthropic fonts)

About 14 slides:

1. Title.
2. What we heard.
3. Program on a page.
4. Why 78 hrs.
5. Calendar.
6. ROI beyond adoption.
7. Value drivers and economics.
8. The M365 boundary.
9. 12-function library.
10. Ops worked example.
11. LIVE DEMO.
12. Selection framework.
13. Info sessions and ideathon.
14. Pending decisions and next steps.

Speaker notes go on every slide. Fonts: Serif Web Text Light for headings, Sans Web Text for body, Mono Web for code.

Caveat: per the font rule, don't embed the fonts in files sent to OSBI. Present from your Mac; a sent copy falls back to Aptos/Georgia.

## 7. Batches

| Batch | Work | Output |
|---|---|---|
| B0 Decisions (you) | Answer the section 8 questions | Locked scope |
| B1 Content foundation | Program data as JSON; fix sheet for the 11 issues; 12-function library with 2–3 rubric-format examples each; mock datasets (Ops log, survey, synthetic applicants) | data/, content/ |
| B2 Demo app | Streamlit scaffold + font theme; agents, guardrails; 6 tabs; offline replay | demo/ |
| B3 Deck | python-pptx with theme fonts, diagrams, notes, demo screenshots | .pptx |
| B4 Talk track | 20-min run-of-show; objection → answer → proof map; Q&A bank | Talk_Track.md |
| B5 QA | Every number traced to source; demo dry-run; code review | Checklist |

B1 runs in parallel tracks. B2 and B3 start together once B1's data exists.

## 8. Open questions

1. Who is OSBI (sector)? Lending/Savings/Audit suggests a financial institution; this shapes the mock data.
2. Is Data Citizen in scope for this demo, or AI Champion only?
3. Branding: upGrad palette (#FF2500 red / black) + Anthropic fonts, or neutral?
4. Audience and length of the demo meeting; live or recorded?
5. OpenAI API key / model; is an offline fallback required?
6. Is OSBI's 22-team list available?

---

# Addendum (13 Oct 2026): Client research, expectations, training objectives

## Who OSBI is

- **Legal entity:** OSBIndia Pvt Ltd, incorporated 2004. It is the wholly owned, "fully integrated" capability centre of OSB Group PLC.
- **Parent:** the UK's largest independent specialist Buy-to-Let lender.
  - Brands: Kent Reliance, Charter Savings Bank, Precise, InterBay, Heritable, Prestige, Rely.
- **Size:** c.1,000 colleagues, in Bengaluru plus a new Hyderabad site.
  - The India share of Group colleagues grew from 30% (2021) to 41% (2025).
- **Functions:**
  - Ops: mortgage origination and servicing, savings, customer service, QC, strategic ops
  - IT
  - Support: marketing, compliance and financial crime, risk analytics and reporting
  - Finance: regulatory reporting, accounting
  - HR
- **Values:** Aim High, Taking Ownership, Respect, Stewardship, Stronger Together. ISO 9001.

## Strategic drivers

- **Group Plan:** "Efficient growth without expanding headcount".
  - Cost:income 40.4% (2025), aiming for "low 30s%" over 2027–29.
- **Transformation programme:** c.£190m to 2027.
  - AI is part of it: a fraud AI pilot, plus responsible-AI training for senior managers.
  - This program is the colleague-level layer beneath that training, which explains the "not a people leader" gate.
- **New leadership:**
  - New Group CEO Enrique Labiano from 1 Sep 2026 (ex-Santander UK), who is likely to scrutinise spend and ROI.
  - New OSBI Technology Director Anil Pillai, May 2026 (unverified LinkedIn source).
- **Prior Copilot exposure:** a Learning-at-Work-Week Copilot tips session (#FutureFitThinking), and a Future Fit Champion cohort that is excluded from this program. The "too basic" fear means we must go beyond tips.
- **Regulation:** UK FCA Consumer Duty and SM&CR, with no AI-specific rulebook (existing rules apply). Also UK GDPR / DUAA 2025 s.80 on automated decisions, and India's DPDP Act. These explain the strict data and human-review rules in the rubric.
