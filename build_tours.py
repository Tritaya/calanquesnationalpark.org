"""Render tours.html table bodies from gyg_analysis.json + merged_true_pool.json.

Main table  = the 42-tour site pool (rc>=50, rating>=4.3), review-count desc.
Niche table = remaining base-true tours (rating>=4.3, rc 5-49), inside <details>.
Editorial notes from editorial-notes.json (survives re-runs).

Replaces content between build markers in tours.html:
  <!-- BUILD:MAIN --> ... <!-- /BUILD:MAIN -->
  <!-- BUILD:NICHE --> ... <!-- /BUILD:NICHE -->
"""
import json, os, re, html as htmlmod

SITE = os.path.dirname(os.path.abspath(__file__))
RESEARCH_GYG = os.path.join(SITE, "..", "calanques-national-park", "gyg")

AFFIL = "?partner_id=1Q7ZSYC&utm_medium=online_publisher&cmp=calanquesnationalpark"

TYPE_LABEL = {
    "boat": "Boat tour", "sailing": "Sailing", "kayak-sup": "Kayak / SUP",
    "hike": "Hike", "e-bike": "E-bike", "dive-snorkel": "Dive / Snorkel",
    "day-trip": "Day trip",
}

with open(os.path.join(SITE, "gyg_analysis.json"), encoding="utf-8") as fh:
    analysis = json.load(fh)
with open(os.path.join(SITE, "editorial-notes.json"), encoding="utf-8") as fh:
    notes = json.load(fh)
with open(os.path.join(RESEARCH_GYG, "merged_true_pool.json"), encoding="utf-8") as fh:
    pool = json.load(fh)

EXCLUDED = {e["id"] for e in analysis["excluded"]}
main_ids = {t["id"] for t in analysis["tours"]}

def fr(t):
    try:
        return float(t.get("formattedRating") or t.get("rating") or 0)
    except (TypeError, ValueError):
        return 0.0

def rc(t):
    return t.get("reviewCount") or 0

def esc(s):
    return htmlmod.escape(s or "", quote=True)

def clean_title(title):
    # Strip GYG's trailing "- 2026 (Verified Reviews)" boilerplate
    t = re.sub(r"\s*-\s*20\d\d\s*\(Verified Review[s]?\)\s*$", "", title or "")
    return t.strip()

def classify(t):
    # mirror build_analysis.py rules for niche-tier tours (main tours carry type already)
    rules = [
        ("kayak-sup", r"kayak|paddle\b|standup paddle|stand up paddle|sup\b"),
        ("e-bike", r"e-?bike|mountain e-?bike|electric motorcycle|e-?scooter|vtt"),
        ("hike", r"hik|randonn|summit"),
        ("climb", r"climb|via ferrata|via cordata|escalade"),
        ("dive-snorkel", r"scuba|diving|snorkel|plong"),
        ("sailing", r"sail|catamaran|voilier|sunset|evening|brunch at sea"),
        ("day-trip", r"aix|bandol|wine|provence|allauch|buggy|quad"),
    ]
    text = t.get("title") or ""
    for name, rx in rules:
        if re.search(rx, text, re.I):
            return name
    return "boat"

def duration_str(t):
    d = t.get("duration")
    if not d:
        return "&ndash;"
    return esc(str(d))

def price_num(t):
    p = t.get("startingPrice")
    return round(p) if isinstance(p, (int, float)) else 0

def affil_url(t):
    return (t.get("url") or "") + AFFIL

def row(t, tour_type, note, cote_bleue=False):
    tid = str(t.get("id"))
    tags = tour_type + (" cote-bleue" if cote_bleue else "")
    label = TYPE_LABEL.get(tour_type, tour_type.title())
    note_html = ""
    if note:
        note_html = '\n      <small class="tour-note">%s</small>' % esc(note)
    return """    <tr data-type="{ty}" data-tags="{tags}">
      <td class="tc-name"><a href="{url}" target="_blank" rel="noopener noreferrer sponsored">{title}</a>{note}</td>
      <td><span class="type-badge {ty}">{label}</span></td>
      <td>&#9733; {rating}</td>
      <td>{reviews}</td>
      <td>{dur}</td>
      <td>${price}</td>
      <td><a href="{url}" target="_blank" rel="noopener noreferrer sponsored" class="book-cta">Book &rarr;</a></td>
    </tr>""".format(
        ty=esc(tour_type), tags=esc(tags), url=esc(affil_url(t)),
        title=esc(clean_title(t.get("title"))), note=note_html, label=esc(label),
        rating=("%.1f" % fr(t)).rstrip("0").rstrip(".") if fr(t) else "&ndash;",
        reviews=rc(t), dur=duration_str(t), price=price_num(t),
    )

# main rows from analysis (already sorted by reviews desc, carry type + cote_bleue)
pool_by_id = {str(t["id"]): t for t in pool}
main_rows = []
for t in analysis["tours"]:
    full = pool_by_id[t["id"]]
    main_rows.append(row(full, t["type"], notes.get(t["id"]), t.get("cote_bleue")))

# niche rows: base-true, not excluded, not main, rating>=4.3
niche = [
    t for t in pool
    if str(t["id"]) not in main_ids and str(t["id"]) not in EXCLUDED and fr(t) >= 4.3
]
niche.sort(key=rc, reverse=True)
niche_rows = [row(t, classify(t), notes.get(str(t["id"]))) for t in niche]

html_path = os.path.join(SITE, "tours.html")
with open(html_path, encoding="utf-8") as fh:
    doc = fh.read()

doc = re.sub(
    r"(<!-- BUILD:MAIN -->).*?(<!-- /BUILD:MAIN -->)",
    lambda m: m.group(1) + "\n" + "\n".join(main_rows) + "\n    " + m.group(2),
    doc, flags=re.S)
doc = re.sub(
    r"(<!-- BUILD:NICHE -->).*?(<!-- /BUILD:NICHE -->)",
    lambda m: m.group(1) + "\n" + "\n".join(niche_rows) + "\n    " + m.group(2),
    doc, flags=re.S)

with open(html_path, "w", encoding="utf-8") as fh:
    fh.write(doc)

print("main rows: %d | niche rows: %d -> tours.html" % (len(main_rows), len(niche_rows)))
print("niche summary line: %d newer or niche listings" % len(niche_rows))
