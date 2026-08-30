---
target: critique all the website
total_score: 30
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
timestamp: 2026-08-28T23-37-54Z
slug: el-presidente-website-all-surfaces
---
Method: dual-agent (A: design review, B: detector + browser evidence) - isolated assessments

# $impeccable critique - El Presidente, all surfaces

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | HUD/focus-management/echoed-decision excellent; final score is a context-free number, ranking-submit reports points not position, PanelVacio wrong season count. |
| 2 | Match System / Real World | 4 | Newsroom + club vocabulary exact and total; voseo throughout; endings read like real journalism. Slip: "Renunciar" for a finished presidency. |
| 3 | User Control and Freedom | 3 | Two-step destructive confirm, "No mover nada" always available, mid-game exit keeps save. No undo on a signed decision, no phase back-step, no "run is saved" reassurance. |
| 4 | Consistency and Standards | 3 | Component system rigorously reused; theme toggle missing on 3 of 6 surfaces, minus glyph differs, mesa-chica rolls its own sticky bar. |
| 5 | Error Prevention | 3 | "Te deja en" caja preview, disabled-until-chosen confirm, inhibido lock. No warning when a spend drives caja negative. |
| 6 | Recognition Rather Than Recall | 3 | Resources visible + tap-to-define, choice hints, pending choice restated. Failure thresholds (< 45 hinchada) hidden in tap-to-expand lines. |
| 7 | Flexibility and Efficiency | 3 | Al azar, one-tap daily, combobox type-ahead, full keyboard, resume panel, remembered theme. No acta-skip on replays, no fast mode, Enter does not submit the decision bar. |
| 8 | Aesthetic and Minimalist Design | 3 | In-game world is a genuine 4 (flat, ruled, one accent, detector-clean). Composite 3: home stacks everything at one level, HUD truncates primary numbers at 375px, mesa-chica density. |
| 9 | Help Users Recover from Errors | 3 | 404 names the real cause; form errors specific with role=alert + focus-to-field; ranking 503 degrades cleanly. Share fallback window.prompt inert in mobile webviews. |
| 10 | Help and Documentation | 2 | /privacidad thorough and in-world; acta onboards the premise. No how-to-play / how-you-win anywhere. |
| Total | | 30/40 | Good (28-35 band) |

Divergence from Assessment A: A scored heuristic 8 a 4 and totalled 31; held at 3 on synthesis because HUD truncation + 4/8 home cognitive-load failures exceed "minor visual noise".

## Design Specificity Verdict

Authored for this product overall, but the two surfaces that carry distribution (/p/[code], the OG image) plus the loading state are category-interchangeable.

LLM assessment (A): in-game flow strongly specific (event cards as newspaper sections, ballot-stamp selected row, two-colour club filete, "Acta de escrutinio"). Home mostly specific with a generic 5-control settings form wearing newsprint. /p/[code] is the ResumenPresidencia card with masthead/nav/pitch stripped - a stranger lands on a loss headline + context-free "625". OG image renders in a generic bold sans, not condensed Archivo (wdth 66-80%), and discards ending.text. Loading is a thinking-orbs glowing orb - exactly DESIGN.md's SaaS anti-reference.

Deterministic scan (B): detect.mjs --json components app -> exit 0, 0 findings. Validated genuine (re-run --no-config --no-design-system still [], fixture test confirms engine fires). No design-system drift, no anti-pattern residue; the implementation is coherent and product-specific. A's concerns are composition/strategy on specific surfaces, not code hygiene.

Visual overlays: injection FAILED - strict CSP (script-src 'self') blocks the external detect.js bundle; no live-server started; no user-visible overlay available. Fallback signal: clean CLI detector + B's manual browser measurements.

## Overall Impression

The core loop is the real thing - reading a presidency unfold as a sports newspaper, one decision per screen with every number visible, a dignified obituary instead of "game over". What is underbuilt is everything around the loop: the home asks a stranger to fill a form before acknowledging them, and the share link (PRODUCT.md's named distribution channel) points at the least characterful page and previews in the wrong typeface. Biggest opportunity: treat /p/[code] and the OG card as the advertisement they are.

## What's Working

1. The endings (resumen-presidencia.tsx + endings content) - dry, specific, Rioplatense sports-page prose that gives a loss dignity. The "no game over" principle is fully delivered and it is the peak.
2. The type system in practice (ui.tsx, globals.css) - condensed Archivo -> Newsreader serif -> agate label; structure drawn only with rules and tonal steps; one contrast-solved club accent. Coheres across every in-game surface; detector agrees (0 findings).
3. Persistent HUD + echoed-decision (hud.tsx, BarraDecision) - 5 resources always visible, tap for definition, pending choice restated with a precomputed "te deja en". Working-memory load near zero. Focus moves to the new screen's h1 on every transition.

## Priority Issues

[P1] The home is a settings form, not a "start playing" flow.
Where: components/arranque.tsx - PARTIDA/PAIS/CATEGORIA/CLUB/TU NOMBRE stacked, no primary CTA until a club is chosen (PanelVacio renders instead of a button), self-serve path below a filled green "JUGAR LA DEL DIA". B: home has 1 heading total, everything at one level; A cognitive-load fails 4/8 here.
Why: the Persuade surface demands a form before acknowledging the player; a first-timer's likeliest first tap drops them into a 16-season game with a club they did not pick.
Fix: lead with club + Al azar; collapse mode/pais/categoria into a "Ajustes de la partida" disclosure; keep "Asumir el cargo" always visible (disabled + hint); give the panels real h2s.
Command: $impeccable onboard (then layout).

[P1] The share link is the least persuasive surface, at both ends.
Where: app/p/[code]/page.tsx (no masthead, no pitch, context-free score); app/p/[code]/opengraph-image.tsx (generic sans instead of condensed Archivo, discards ending.text, generic alt).
Why: the share link is the growth loop; both ends are the least characterful artifacts, at the moment a new player decides whether to click.
Fix: nameplate + hook line + percentile on /p/[code]; load Archivo into the ImageResponse, pull-quote a sentence of ending.text, write meaningful alt.
Command: $impeccable adapt + $impeccable typeset.

[P1] Contrast regressions the palette check does not cover.
Where (B measured): club-accent HUD kicker "Copa de Primera - Mandato 1" (text-[var(--club)], 11px/700) at 4.10:1 on fondo-2 (club-dependent); :focus-visible ring (corondel-fuerte) at ~2.6-3.0:1 against raised surfaces in both themes, fails 3:1 non-text; tinta-3 token at 3.6-4.0:1 on both dark surfaces. A's Sam persona independently flagged the focus ring and tinta-3.
Why: npm run contraste validates palette tokens, not the runtime tintaDeClub() output on fondo-2 or the focus ring against raised backgrounds - so these passed every prior audit. A keyboard user cannot reliably see focus on inputs/cards/HUD.
Fix: solve the club accent against fondo-2 too (or raise the target); change the focus ring to tinta; retire tinta-3 for non-disabled text; extend scripts/contraste.ts to cover the runtime accent + focus ring.
Command: $impeccable harden.

[P2] Mesa chica allocation is undiscoverable.
Where: components/fase-mesa-chica.tsx FilaFrente - tap row body adds a ficha, tap the 3-dot cluster removes one, no +/- control, no instruction, only aria-label explains it; 5 frentes each carrying label/+percent/description/cost/risk. B: probability bar and dots are aria-hidden.
Why: densest screen in the product; a sighted first-timer cannot form a model of the interaction.
Fix: explicit [ - N + ] stepper per frente; a "Reparti 3 fichas" instruction; push cost/risk behind a tap; give the probability bar an accessible value.
Command: $impeccable clarify (then shape).

[P2] The primary numbers are unreadable or meaningless where they matter most.
Where: (a) components/hud.tsx Cifra + bespoke gridTemplateColumns - caja > 100M renders "106,...", "Hinchada" always shows "HINCHA..." at 375px. (b) resumen-presidencia.tsx + envio-ranking.tsx - a lone score number with no scale.
Why: the HUD number is the most important thing on screen and it truncates; the score is a dead peak-end.
Fix: widen the caja column, compact format for >=100M, shorten/two-line "Hinchada"; show the score as a band/percentile or table position, and pre-launch against a per-club "par".
Command: $impeccable layout (HUD) + $impeccable clarify (score).

## Persona Red Flags

Jordan (Confused First-Timer):
- Biggest button is "JUGAR LA DEL DIA"; never says what a partida is.
- No how-to-play/how-you-win anywhere; re-election rule buried in a tap-to-expand line.
- PanelVacio says "dieciseis temporadas" even in Corta mode (hardcoded).
- FaseMesaChica: cannot tell tapping a row adds a ficha; no +/- buttons.
- Final "625" tells him nothing.

Casey (Distracted Mobile, one-handed, from WhatsApp):
- Every decision scrolls to top + full re-mount/re-animation; no "you were here" anchor after an interruption.
- HINCHA... / 106,... truncation in the sticky HUD at 375px.
- PresidenciaDelDia countdown ticks every second in the corner of her eye.
- "Volver al inicio" mid-game gives no hint the run is saved.
- Mesa chica: 5 large tap-to-add zones + a separate ~24px dot cluster to remove. (Choice buttons and Firmar are 48-50px, fine; footer Privacidad link is 42px.)

Sam (Screen reader + keyboard, 4.5:1, 200% zoom):
- :focus-visible ring ~2.6-3.0:1 on raised surfaces in both themes, fails 3:1 non-text.
- selector-club.tsx listbox height min(352, available); at 200% zoom available collapses toward the 160px floor -> ~28-item list showing ~3 rows.
- tinta-3 ~3.7-4:1, under 4.5:1 for any non-disabled text.
- Combobox APG-correct, but typing a letter while closed silently changes the selected club.
- FaseMesaChica probability bar and ficha dots are aria-hidden.
- OG image alt conveys nothing.
- Good: main id=principal tabindex=-1 on every page, working skip link, focus moves to the new h1 on every phase change.

El hincha (Argentine fan, opened a friend's link):
- Lands on /p/[code]: "PRESIDENCIA COMPARTIDA" + a loss headline + "625" - recognises the club, no masthead, no hook, meaningless number; in-jokes are all downstream.
- For River / any white-primary club the contrast-solved --club accent collapses to grey.
- Cup finals are one tap and a one-line "No se dio"; no tension.
- WhatsApp preview in a generic sans, not the paper's nameplate.
- Loading spinner is a glowing orb.

## Minor Observations

- app/layout.tsx Script strategy=beforeInteractive inside body throws a React dev warning and serializes into the client RSC payload on the notFound() path.
- fase-fin.tsx share fallback ends in window.prompt (inert in many in-app webviews); replace with an inline selectable link field.
- arranque.tsx PanelVacio hardcodes "dieciseis temporadas"; use TEMPORADAS_POR_MODO[modo].
- Minus-glyph inconsistency: fase-mercado.tsx ASCII "-", fase-evento.tsx U+2212.
- Theme toggle absent on /privacidad, /p/[code], not-found.tsx; no nav landmark anywhere.
- resumen-presidencia.tsx draws its own bg-[var(--club)] top bar inside a Recuadro that already has border-t-4 -> doubled top rule.
- revelar-titular (480ms wipe) long for a brand mark and the payoff headline; caught mid-reveal in screenshots. (Removed under prefers-reduced-motion.)
- A /dirigentes/*.png portrait sub-resource 404 appeared in console; verify the seeded set is complete.
- formulario-contacto.tsx: required fields have no visible marker; "Que necesitas" defaults to "Quiero que borren mis datos"; labels implicit, inputs have no name.
- /privacidad has no "ultima actualizacion" date despite a "Cambios" section.
- /cartas (dev-only, notFound in prod): 168 h1 elements, 13 filter chips at 29px, a 16px checkbox, ~167 stacked dead "FIRMAR" bars.
- envio-ranking.tsx success text + the Novedad block pop in after an async effect - small delayed shift.

## Questions to Consider

1. If the share link is the distribution channel, why does the page it points to have the least product identity of any surface?
2. Why is the mid-game decline delivered without a line of acknowledgement, while a truncated share link gets a lovingly written 404?
3. Is "16 temporadas, 10 minutos" honest given ~48 decisions + markets + mesa chicas + season/election screens, each with a scroll-to-top and a re-animation? Has anyone timed it on a phone?
4. The contrast-solver guarantees the club colour is legible but resolves white/silver-primary clubs to grey. Is legible-but-absent better than falling back to the club's second colour?
5. What is the cost of making Al azar (or the daily) the default first contact and treating manual club selection as the power-user path?
