"""Build the source skeleton for both pathways from the upGrad HTML curriculum.

Source text (titles, coverage, deliverables) is copied verbatim from the HTML.
Week/day slots come from OSBI_AI_Champion_Delivery_Plan.xlsx (same shape on
both pathways, per its Summary sheet). Known source inconsistencies are fixed
here and listed in FIXES so they are traceable.

Usage: python3 -I scripts/build_skeleton.py <journeys.html> <out.json>
"""
import html
import json
import re
import sys

FIXES = [
    "Session-plan header corrected from '15 sessions' to '24 sessions'.",
    "Self-paced foundation placed after S3 with notes carried into S4 (per Delivery Plan; HTML said 'between the three sessions' / 'session 2').",
    "Guidance clinic shown as a live 1-hour slot in Week 7 Day 2 (Delivery Plan places it there).",
]

# Week / slot per item, from the Delivery Plan 'AI Champion' sheet (programme since renamed AI Practitioner).
SLOTS = {
    "S1": (1, "day1"), "S2": (1, "day2"), "S3": (2, "day1"), "SELF": (2, "async"),
    "S4": (2, "day2"), "S5": (3, "day1"), "S6": (3, "day2"), "S7": (4, "day1"),
    "S8": (4, "day2"), "S9": (5, "day1"), "S10": (5, "day2"), "S11": (6, "day1"),
    "S12": (6, "day2"), "S13": (7, "day1"), "CLINIC": (7, "day2"), "S14": (8, "day1"),
    "S15": (8, "day2"), "S16": (9, "day1"), "S17": (9, "day2"), "S18": (10, "day1"),
    "S19": (10, "day2"), "S20": (11, "day1"), "S21": (11, "day2"), "INDEP": (11, "async"),
    "S22": (12, "day1"), "S23": (12, "day2"), "S24": (13, "day1"),
}

LEAD = {1: "instructor", 2: "trainer", 3: "mentor", 4: "mentor"}

# Spark rotation: each of the 12 functions opens exactly two sessions per pathway.
ROTATION = {
    "ai-practitioner": {
        "S1": "operations", "S2": "hr", "S3": "risk", "S4": "lending", "S5": "savings",
        "S6": "finance", "S7": "quality", "S8": "procurement", "S9": "customer-insights",
        "S10": "accounts", "S11": "audit", "S12": "learning", "S13": "operations",
        "S14": "hr", "S15": "finance", "S16": "savings", "S17": "procurement",
        "S18": "accounts", "S19": "quality", "S20": "learning", "S21": "risk",
        "S22": "customer-insights", "S23": "audit", "S24": "lending",
    },
    "data-citizen": {
        "S1": "operations", "S2": "quality", "S3": "risk", "S4": "lending", "S5": "accounts",
        "S6": "savings", "S7": "finance", "S8": "procurement", "S9": "customer-insights",
        "S10": "hr", "S11": "operations", "S12": "learning", "S13": "audit",
        "S14": "hr", "S15": "finance", "S16": "savings", "S17": "lending",
        "S18": "quality", "S19": "customer-insights", "S20": "procurement",
        "S21": "risk", "S22": "accounts", "S23": "audit", "S24": "learning",
    },
}

# Mindset pulse points: end of Stage 1, end of Stage 2, end of Stage 3 live, programme close.
PULSE = {"S3", "CLINIC", "S21", "S24"}

ROW = re.compile(
    r'<tr(?: class="(?P<cls>aux)")?><td class="sid">(?P<sid>[^<]*)</td>'
    r'<td class="sn">(?P<title>[^<]*)</td><td class="sh">(?P<hrs>\d+)</td>'
    r'<td>(?P<cov>[^<]*)</td><td class="so">(?P<prod>[^<]*)</td></tr>'
)


def clean(s: str) -> str:
    return html.unescape(s).strip()


def parse_pathway(block: str, pid: str) -> list[dict]:
    items, stage = [], 0
    for line in block.splitlines():
        if 'class="grp"' in line:
            stage += 1
            continue
        m = ROW.search(line)
        if not m:
            continue
        sid, title = clean(m["sid"]), clean(m["title"])
        if m["cls"] == "aux":
            key = {"Self-paced foundation": "SELF", "Guidance clinic": "CLINIC",
                   "Independent application": "INDEP"}[title]
            kind = {"SELF": "selfpaced", "CLINIC": "clinic", "INDEP": "independent"}[key]
            code = None
        else:
            key, kind, code = sid, "live", sid
        week, slot = SLOTS[key]
        produces = clean(m["prod"])
        coverage = clean(m["cov"])
        if key == "SELF":
            coverage = coverage.replace("completed between the three sessions",
                                        "completed after Session 3, before Stage 2 begins")
            produces = "Consolidated notes carried into Session 4"
        items.append({
            "id": f"{pid}-{key.lower()}",
            "key": key,
            "code": code,
            "kind": kind,
            "stage": stage,
            "week": week,
            "slot": slot,
            "title": title,
            "durationHrs": int(m["hrs"]),
            "lead": "learner" if kind in ("selfpaced", "independent") else LEAD[stage],
            "coverage": coverage,
            "produces": produces,
            "pulse": key in PULSE,
            "sparkFunction": ROTATION[pid].get(key),
            "materials": [],
            "exercises": [],
        })
    return items


def main(src: str, out: str) -> None:
    doc = open(src, encoding="utf-8").read()
    ai_block = doc[doc.index('id="p-ai"'):doc.index('id="p-dc"')]
    dc_block = doc[doc.index('id="p-dc"'):doc.index('id="support"')]
    data = {
        "fixesApplied": FIXES,
        "pathways": {
            "ai-practitioner": parse_pathway(ai_block, "ai-practitioner"),
            "data-citizen": parse_pathway(dc_block, "data-citizen"),
        },
    }
    for pid, items in data["pathways"].items():
        assert len(items) == 27, (pid, len(items))
        assert sum(i["durationHrs"] for i in items) == 78, pid
        by_stage = [sum(i["durationHrs"] for i in items if i["stage"] == s) for s in (1, 2, 3, 4)]
        assert by_stage == [10, 31, 28, 9], (pid, by_stage)
        sparks = [i["sparkFunction"] for i in items if i["kind"] == "live"]
        assert len(set(sparks)) == 12 and all(sparks.count(f) == 2 for f in set(sparks)), pid
    with open(out, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("ok", {k: len(v) for k, v in data["pathways"].items()})


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
