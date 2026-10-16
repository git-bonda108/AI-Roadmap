"""Validate program data: verbatim skeleton + authored content + base.

Fails (exit 1) on any structural, arithmetic or policy violation, so it can gate the build.
Usage: python3 -I scripts/validate.py
"""
import json
import re
import sys
from pathlib import Path

D = Path(__file__).resolve().parent.parent / "src" / "data"
base = json.loads((D / "base.json").read_text())
skel = json.loads((D / "skeleton.json").read_text())
fn_ids = {f["id"] for f in base["functions"]}
errs: list[str] = []

LIMITS = {"concept": 30, "hook": 20, "focus": 20, "build": 25, "howTo": 14, "reflect": 15,
          "title": 8, "scenario": 25, "input": 20, "aiDoes": 25, "humanCheck": 20, "measure": 15, "boundary": 20}
# Phrases that would overstate the tool or promise numbers.
BANNED = [r"\b\d+\s?%", r"\boutlook\b(?!.*\bno\b)", r"\bautomatically\b", r"\bpower bi\b", r"\bsql\b(?! or coding)",
          r"\bguarantee", r"\bcertif"]


def words(s: str) -> int:
    return len(s.split())


def check_len(where: str, field: str, val) -> None:
    lim = LIMITS[field]
    for v in (val if isinstance(val, list) else [val]):
        if words(v) > lim:
            errs.append(f"{where}.{field}: {words(v)} words > {lim}: {v!r}")


def check_text(where: str, text: str) -> None:
    low = text.lower()
    for pat in BANNED:
        if re.search(pat, low):
            errs.append(f"{where}: flagged phrase /{pat}/ in {text!r}")


for pid, items in skel["pathways"].items():
    c = json.loads((D / "content" / f"{pid}.json").read_text())
    if c["pathway"] != pid:
        errs.append(f"{pid}: pathway field mismatch")
    if sum(i["durationHrs"] for i in items) != 78:
        errs.append(f"{pid}: total hours != 78")
    keys = {i["key"] for i in items}
    if set(c["sessions"]) != keys:
        errs.append(f"{pid}: session keys differ: {set(c['sessions']) ^ keys}")
    ucs = {u["id"]: u for u in c["useCases"]}
    if len(c["useCases"]) != 24 or len(ucs) != 24:
        errs.append(f"{pid}: expected 24 unique use cases")
    for it in items:
        k, s = it["key"], c["sessions"].get(it["key"], {})
        w = f"{pid}.{k}"
        segs = s.get("segments", [])
        if sum(x["mins"] for x in segs if x["label"] != "Break") != it["durationHrs"] * 60:
            errs.append(f"{w}: segment minutes != {it['durationHrs'] * 60}")
        for f in ("concept", "build"):
            if f in s:
                check_len(w, f, s[f]); check_text(w, s[f])
        for f in ("howTo", "reflect"):
            if not s.get(f):
                errs.append(f"{w}: missing {f}")
            else:
                check_len(w, f, s[f]); [check_text(w, x) for x in s[f]]
        for x in segs:
            if x.get("focus"):
                check_len(w, "focus", x["focus"]); check_text(w, x["focus"])
        if it["kind"] == "live":
            sp = s.get("spark")
            if not sp:
                errs.append(f"{w}: live session without spark"); continue
            check_len(w, "hook", sp["hook"])
            u = ucs.get(sp["useCaseId"])
            if not u:
                errs.append(f"{w}: spark points to unknown use case {sp['useCaseId']}")
            elif u["functionId"] != it["sparkFunction"] or u["sessionKey"] != k:
                errs.append(f"{w}: use case {u['id']} function/session mismatch")
            if [x["mins"] for x in segs] != [90, 15, 90]:
                errs.append(f"{w}: live segments not 90/15/90")
        elif "spark" in s:
            errs.append(f"{w}: non-live item has a spark")
    for u in c["useCases"]:
        w = f"{pid}.{u['id']}"
        if u["functionId"] not in fn_ids:
            errs.append(f"{w}: unknown function")
        if not 3 <= len(u["howTo"]) <= 5:
            errs.append(f"{w}: howTo must have 3–5 steps")
        for f in LIMITS:
            if f in u and f not in ("concept", "hook", "focus", "build", "reflect"):
                check_len(w, f, u[f])
                [check_text(w, x) for x in (u[f] if isinstance(u[f], list) else [u[f]])]

# ---------- Daily quick wins (optional file) ----------
dpath = D / "daily.json"
if dpath.exists():
    items = json.loads(dpath.read_text())["daily"]
    DLIM = {"role": 5, "title": 8, "task": 22, "prompt": 60, "output": 16, "check": 16}
    if len(items) != 48:
        errs.append(f"daily: expected 48 items, got {len(items)}")
    for f in fn_ids:
        mine = [d for d in items if d["functionId"] == f]
        if len(mine) != 4:
            errs.append(f"daily.{f}: expected 4 items, got {len(mine)}")
        if not any(d["tool"] == "Excel + Copilot Chat" for d in mine):
            errs.append(f"daily.{f}: needs at least one Excel + Copilot Chat item")
    for d in items:
        w = f"daily.{d['id']}"
        if d["tool"] not in ("Copilot Chat", "Excel + Copilot Chat") or d["frequency"] not in ("Daily", "Weekly", "Monthly"):
            errs.append(f"{w}: bad tool/frequency")
        # Chat prompts take pasted content via [placeholders]; Excel prompts may instead describe a mock sheet's columns.
        if d["tool"] == "Copilot Chat" and "[" not in d["prompt"]:
            errs.append(f"{w}: prompt has no [placeholder]")
        if d["tool"] == "Excel + Copilot Chat" and "[" not in d["prompt"] and not re.search(r"\b(mock|anonymised|sample)\b|no data shared", d["prompt"].lower()):
            errs.append(f"{w}: Excel prompt must use placeholders or describe mock/anonymised data")
        for k, lim in DLIM.items():
            if words(d[k]) > lim:
                errs.append(f"{w}.{k}: {words(d[k])} words > {lim}")
            check_text(w, d[k])
        if re.search(r"\b(inbox|calendar|teams|sharepoint)\b", " ".join(d.values()).lower()):
            errs.append(f"{w}: implies access to M365 sources")

if errs:
    print(f"FAIL · {len(errs)} issue(s)")
    print("\n".join(" - " + e for e in errs))
    sys.exit(1)
print("PASS · both pathways: 27 items, 78 hrs, 24 sparks → 24 use cases; 48 daily quick wins; limits and policy phrases clean")
