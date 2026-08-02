# Audit findings — calanquesnationalpark.org

Supervisor audit run 2026-08-02 (fresh context, `/audit-gyg-site`), against
`_AFFILIATE-GUIDE-SITE-BLUEPRINT.md` Section Q. Build: 2026-07-30, info-first
16-page GYG variant (deliberate, per `calanquesnationalpark.org-BUILD-WORKFLOW.md`).
Site is LIVE on Netlify (blackboard said "not pushed" — deploy happened after the
handoff was written; live checks run against production).

## Triage table

| Result | Check | Detail | Cause / Novelty |
|---|---|---|---|
| PASS | Site shape | 16 pages, index + tours + 14 info pages | deliberate variant |
| PASS | Theme | `--bg #fafaf8`, `--accent #0e5a7a`, `--highlight #fde68a`; not blueprint default | |
| PASS | Pretty URLs (deploy) | `netlify/edge-functions/strip-html.ts` present; netlify.toml has no `[[redirects]]` | |
| PASS | Pretty URLs (internal) | 0 internal `.html` hrefs across all 16 pages | |
| PASS | Pretty URLs (live) | `/`, `/tours`, `/en-vau` 200; `/tours.html` 301; `/CLAUDE.md` 404 | |
| PASS | Sitemap | exact `http://www.sitemaps.org/schemas/sitemap/0.9`; 16 extensionless URLs | |
| PASS | Affiliate slugs | **201/201** GYG hrefs match `tour_manifest.json` verbatim (full sweep, not 5-sample); 0 not-in-manifest, 0 slug mismatches | 🟡→🟢 blackboard claim validated |
| PASS | og:image | 11/11 unique CDN URLs return HTTP 200, no redirects | 🟡→🟢 validated |
| PASS | Outbound audit | 0 non-affiliate outbound links (no sister network declared) | |
| PASS | Filter chips | 8 chips (`all` + 7 types), single `type` axis, ≤11 | |
| PASS | Anchor-nav order | hero(88) < facts-bar(97) < anchor-nav(108) < #tldr(124) | |
| PASS | Highlighter | em-based stops (.15em / 1.05em), both base and hover | |
| PASS | FAQ | 15 `faq-item` on index; 0 `<a>` inside any `acceptedAnswer` site-wide | |
| PASS | AEO robots | GPTBot / OAI-SearchBot / ClaudeBot / PerplexityBot all `Allow: /` (+Claude-SearchBot, Google-Extended) | |
| PASS | JSON-LD | 9–18 `"@type"` per page (min: tours.html 9 ≥ 3); **all blocks on 16/16 pages parse as valid JSON** | 🟡→🟢 validated |
| PASS | Encoding | no mojibake (grep + python UTF-8 scan) | 🟡→🟢 validated |
| PASS | Discoverability | top10-list 8/8, persona-grid 6/6, season-grid 4/4, activity digest 4/4 cards all carry u-links/chips; flag-list exempt per Q rule | 🟡→🟢 validated (note: audit's own first regex script false-reported 0 links; manual read confirmed clean — trust the eyeball over a buggy script, too) |
| PASS | Phase 2 wiring | all `?type=` values (boat/sailing/kayak-sup/hike/e-bike/dive-snorkel/day-trip) match chips; `?topic=climbing`/`boat-rental` match topicMessages keys; no orphans | 🟡→🟢 validated |
| PASS | Phantom filter links | 0 links to dropped filter values | |
| PASS | .gitignore | `.commit-msg.tmp` + `*.tmp` present | |
| PASS | Editorial sidecar | 42-row main pool → `editorial-notes.json` present (48 notes: 42 main + 6 niche) | |
| PASS | Card clickability | table variant → P.4 N/A; the 4 pick-cards each have img-link + title link + book-cta | |
| PASS | Soft-nav interceptor | `isToursPage` guard =1, `scrollIntoView` =1, `setActiveType` =4 | |
| PASS | Honest-rating x-link | no `*-honest-rating.html` on disk → N/A | |
| PASS | Intra-page u-links | tours-intro deck links all 7 type presets; methodology box has no unlinked preset names | |
| PASS | Cache-Control | css/js ship `public, no-cache, must-revalidate` | |
| PASS | Mobile overflow | `overflow-x: clip` on html/body; `.fact min-width: 0`; `overflow-wrap: anywhere` | see Advisory A2 (labels >15 chars) |
| PASS | Webfont | 16/16 pages `display=optional` | |
| PASS | Sticky filter-bar | no `position: sticky` on `.filter-bar` | |
| PASS | "affiliate" word | appears only in: index byline w/ `/tours#methodology` link, methodology box, footers ("Not affiliated with the park authority" is the independence disclaimer — allowed footer surface) | |
| PASS | Scoring constants | 0 internal tier/threshold leaks | |
| PASS | Catalogue JSON-LD | tours.html: WebPage + BreadcrumbList + ItemList (9 @type) | |
| PASS | Chip JS/HTML match | `.filter-chip` + `dataset.filter` consistent between tours.html and script.js | |
| PASS | Per-site attribution | 201/201 clickable GYG hrefs carry `cmp=calanquesnationalpark` + `partner_id=1Q7ZSYC` (see Doc fix D1 — old rule false-FAILed on 4 JSON-LD ItemList URLs) | Doc-was-wrong / NEW |
| PASS | Pick headline count | h2 "Four picks if you can't decide" = 4 `pick-card` | |
| PASS | Pick CSS inventory | `pick-card`/`pick-body`/`pick-img-link` all covered; `pick-img-link { display: block }` present | |
| PASS | Cosquer no-rating rows | t743946 + t1020571 appear only in prose (cosquer-cave, closures); URLs sitemap-verbatim w/ cmp; **zero star glyphs on cosquer-cave.html** — no fabricated ratings | 🟡→🟢 deliberate variation confirmed |
| PASS | Cross-page facts | Nautic Bar = Morgiou's restaurant (index/morgiou/sormiou consistent); Le Lunch demolished 2017 (5 pages consistent); bus 353 Sunday service (getting-there / la-ciotat consistent, 355 no-Sunday consistent) | 🟡→🟢 blackboard spot-check request satisfied; see Advisory A1 |
| MANUAL | Comparison tables | kayak-and-sup.html:142 (licensed fleet) + :289 (rental prices): reference tables with **no Book column** — GYG links sit in adjacent prose (t948070, t402096, manifest-verbatim). tours.html Book columns are per-row operator-specific URLs. See Deferred #4 | |

**Score: 38 PASS (7 of them 🟡→🟢 validated blackboard claims), 0 site FAIL, 1 MANUAL, 1 doc FAIL (rule over-broad → auto-fixed).**

## Auto-applied doc updates

### D1 — Section Q "Per-site attribution" check scoped to href attributes (doc-was-wrong, NEW)

- **Finding:** the check's grep (`grep -ohE 'https://...(viator|getyourguide)\.com[^"]+' tours.html | grep -vc 'campaign=\|cmp='`) counted 4 URLs on this build — all four are `"url":` fields inside the tours.html JSON-LD `ItemList`. Structured data is a crawler surface, not a click surface; clean canonical URLs there are correct (arguably more correct than tracking-parameterised ones). All 201 clickable hrefs carry `cmp=`. The rule, as written, false-FAILs a defensible implementation.
- **Edit:** `_AFFILIATE-GUIDE-SITE-BLUEPRINT.md` Section Q attribution line — grep now anchors on `href="..."`, plus explicit sentence that JSON-LD-quoted affiliate URLs are exempt and should stay clean. AUDIT-EDIT comment records old wording.
- **Self-verify:** old grep → 4 on this site (false FAIL); new grep → 0 (correct PASS); new grep → 1 on a synthetic page containing one cmp-less href (still catches the real bug). **All three directions pass — edit committed.**

## Deferred items (user decision needed — nothing applied)

1. **[Process pattern — blackboard proposal] `tour_manifest.json` as a blueprint pattern for multi-agent builds.** The existing "slugs from JSON, never from titles" rule (KNOWN) did not stop the build agent's own hand-written drafts from guessing twice (t434925, t504626 — both 404s, caught mid-build); the id→verbatim-URL manifest handed to all 13 page agents produced 201/201 clean URLs. Cannot self-verify (final site has no bug to catch), so per the audit contract it was not auto-applied. Options: **A)** add a Section J bullet: "multi-agent builds MUST generate a tour_manifest.json (id → verbatim affiliate URL) and pass it to every page agent; hand-written pages use it too" — recommended; **B)** skip (site-local CLAUDE.md already carries the rule for this site only).
2. **[Advisory A1 — one-word nit] "Bar Nautic" vs "Nautic Bar".** getting-there.html:278 says "Bar Nautic at Morgiou"; index/morgiou/sormiou all say "Nautic Bar" (4 mentions). Facts agree; only the name order differs. Options: **A)** edit getting-there.html:278 to "the Nautic Bar" — recommended, trivial; **B)** leave.
3. **[Advisory A2] facts-bar labels over the 15-char guideline.** "Red days so far '26" (19), "Lifeguard beaches" (17), "Park entry, 24/7" (16), "Nightly open map" (16). All overflow guards ARE present (clip / min-width:0 / overflow-wrap:anywhere), and the rule is "≤15 where possible", so scored PASS — but per the portfolio's mobile-screenshot rule a 390px render check has not been done headless. Options: **A)** shorten the two longest labels; **B)** accept after a 390px screenshot confirms no track expansion.
4. **[MANUAL] kayak-and-sup operator tables have no Book column.** Deliberate info-first pattern: the tables compare *licensing rights and rental prices* (many operators have no GYG product at all — CSLN, Lo Kayak, Corton Beach, Raskas), and the bookable GYG products are linked in the adjacent prose with manifest-verbatim URLs. Recommend: **accept as-is** — forcing a Book column would fabricate affiliate links for operators GYG doesn't carry, which the blueprint's honesty rules forbid.
5. **[Advisory A3] unused topicMessages keys `cosquer` and `riou`.** script.js defines 4 topic banners; only `?topic=climbing` and `?topic=boat-rental` have inbound links. Harmless dead code (banners still fire if the URL is typed). Options: **A)** add `?topic=cosquer` / `?topic=riou` u-links from cosquer-cave.html and swimming/boat pages; **B)** leave for Phase 2 GSC-driven wiring — recommended.

## Site bugs to fix

**None.** No 🔴 site-level FAILs. The only candidate edits are the two advisory nits above (A1 one-word naming, A2 label lengths), both deferred to user judgment.

## Blueprint sections modified

- Section Q, "Per-site attribution" checklist line (1 line + AUDIT-EDIT comment). Nothing else touched.

## Blackboard disposition

Message from build session 2026-07-30 consumed. Every verification claim in it
was independently re-checked and confirmed (see 🟡→🟢 rows). Its one stale claim
— "NOT pushed" — is superseded: the site is live and serving. Blackboard wiped;
no new message left (no unfixed site bugs).
