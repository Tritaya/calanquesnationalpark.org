# calanquesnationalpark.org — site notes for Claude sessions

Information-first GYG affiliate site for the Parc national des Calanques
(Marseille / Cassis / La Ciotat). Built July 2026 per
`wirecutter/_AFFILIATE-GUIDE-SITE-BLUEPRINT.md`. This file is git-tracked but
blocked from the web by `netlify/edge-functions/strip-html.ts` (404).

## Architecture
- 16 static pages, info-first: homepage + /tours catalogue + 6 activity/system
  pages + 8 place pages. Tours appear in-context on editorial pages; /tours is
  the small-pool variant (42 main + 31 niche rows, type-axis filter, 7 chips).
- Research source of truth: `wirecutter/calanques-national-park/` (28 deep-research
  JSONs + report_synthesis.md). RE-READ `report_synthesis.md` before editing facts.
- Tour data: `gyg_analysis.json` (frozen pool) + `editorial-notes.json` (per-row
  notes, survives re-runs) + `build_tours.py` (regenerates both /tours tables
  between BUILD markers).
- Affiliate: cmp=calanquesnationalpark, partner_id=1Q7ZSYC. NEVER construct GYG
  slugs — copy `url` from gyg_analysis.json / tour_manifest.json (two guessed
  slugs 404'd during the build).

## Content rules specific to this site
- Time-sensitive facts carry `checked-stamp` spans (Verified: date). Re-verify on
  the OFFICIAL FRENCH pages before bumping — the park's English pages are stale
  in ≥5 documented places and the operator EN pages show old prices.
- The access system is three independent layers (nightly fire map binary
  open/red; municipal road calendars; Sugiton permit). Never merge them.
- Red-day semantics: navigation legal / landing banned / Frioul + Cosquer open.
- Côte Bleue tours are honestly labelled "not the national park".
- Sugiton 400 cap: attribute to OFB, not the park page.
- Dogs: allowed on lead (park FAQ) — do not "fix" this to the generic ban.
- Dead domains — never link: bateliers-cassis.fr, 123kayak.fr, kayak-attitude.fr.

## Sister network
None declared yet. If cross-links to other Tritaya travel domains are added,
declare them here in a ```sister-network fenced block for the audit.

## Live items to re-check (from build 2026-07-30)
- Fontasse–Port-Miou reservoir works (+1h GR detour; deadline overrun)
- ADEME works Goudes–Callelongue Sept 2026–spring 2027 (bus 20 corridor)
- 2027: Sugiton dates, Cosquer winter closure, ferry fares, all boat prices
