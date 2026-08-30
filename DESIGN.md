---
name: El Presidente
description: A browser roguelike about running an Argentine football club, dressed as the morning sports daily.
colors:
  fondo: "#23242a"
  fondo-2: "#2b2c33"
  tinta: "#e6e3db"
  tinta-2: "#a3a09a"
  tinta-3: "#85827c"
  corondel: "#45474e"
  corondel-fuerte: "#6e7079"
  alerta: "#f07a6b"
  favorable: "#8fbf8a"
typography:
  scale:
    step-10: "10px"
    step-11: "11px"
    step-12: "12px"
    step-13: "13px"
    step-14: "14px"
    step-15: "15px"
    step-16: "16px"
    step-17: "17px"
    step-18: "18px"
    step-19: "19px"
    step-20: "20px"
    step-22: "22px"
    step-26: "26px"
    step-60: "3.75rem"
  masthead:
    fontFamily: "Archivo, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "clamp(2.75rem, 11vw, 4.5rem)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 80"
  display:
    fontFamily: "Archivo, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "clamp(1.75rem, 7vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 66"
  ending:
    fontFamily: "Archivo, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "clamp(2.25rem, 10vw, 4rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 75"
  page-title:
    fontFamily: "Archivo, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "clamp(2rem, 8vw, 3rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 80"
  match-title:
    fontFamily: "Archivo, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "clamp(1.5rem, 7vw, 2rem)"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Archivo, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Archivo, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.14em"
    fontVariation: "'wdth' 75"
  body:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  deck:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  none: "0px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "20px"
  xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.fondo}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "16px 20px"
  button-primary-active:
    backgroundColor: "{colors.tinta-2}"
    textColor: "{colors.fondo}"
    rounded: "{rounded.none}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.tinta-2}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.alerta}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "44px"
  input:
    backgroundColor: "{colors.fondo-2}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "10px 12px"
    height: "44px"
  card:
    backgroundColor: "{colors.fondo-2}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "20px"
  tag:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.fondo}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  choice-row:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "12px"
  choice-row-selected:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.fondo}"
    rounded: "{rounded.none}"
---

# Design System: El Presidente

## Overview

**Creative North Star: "The Sports Daily"**

Every screen is an edition of the newspaper that covers your presidency. The
vocabulary is a print desk's, not an app's: a *volanta* (kicker) sits above a
condensed *titular* (headline), a *bajada* (italic deck) under it, *cuerpo*
(serif body) below that, and the whole thing is held together by *corondeles* —
the hairline column rules a compositor draws between stories. Numbers and labels
are set in agate: small, uppercase, letter-spaced, tabular. The masthead reads
"El Presidente" locked between a 4px rule above and a 2px rule below, the way a
broadsheet nameplate is boxed.

The world is achromatic on purpose — one warm ink on dark newsprint, in four
steps — and the single chromatic voice on any game screen is the club's own
colour, run through a contrast solver so it always clears 4.5:1 against the page.
Depth is flat: no shadows, no gradients, no rounded corners. Blocks are told
apart by a tonal step (`fondo` → `fondo-2`) and a coloured rule across the top,
exactly as a printed page separates a boxed sidebar from the column beside it.
Motion is a press run: the club stripe draws in from the left, the closing
headline wipes open, result lines drop in one after another, and a loading
screen is a line of agate type with the compositor's cursor still blinking at
its end.

It should feel **tactile and press-like** — type locked in a chase, ink pressed
into paper. Buttons are solid slabs that physically depress on tap
(`scale(0.97)`); the selected choice inverts to ink-on-white like a stamped
ballot; the club's two real colours run as a printed stripe along headline and
masthead. The explicit anti-reference is **generic SaaS / dashboard UI**: no
rounded cards, no soft shadows, no blue-500 accent, no gradient buttons, no pill
badges, no emoji. If a screen could be dropped into any other web app without
anyone noticing, it is wrong.

**Key Characteristics:**
- One warm ink on dark newsprint; two semantic colours; one runtime club accent.
- Condensed grotesque display (Archivo, width axis pulled to 66–80%) over a
  serif reading face (Newsreader).
- Structure drawn entirely with rules and borders — zero radius, zero shadow.
- Agate everywhere: every label, timestamp, and figure is uppercase tracked
  Archivo 700.
- The club's colour is the only chroma on a game screen, and it is always
  contrast-solved.
- Mobile-first at 375px; the desktop layout is a newspaper's column-plus-rail.

## Colors

A single warm off-white ink on cool-dark newsprint, in four decreasing weights,
plus two semantic signals and one per-club accent. Both a dark ("Edición
nocturna", the default) and a light ("Edición de día") edition ship; the light
edition swaps `fondo`/`tinta` roles and darkens the semantics for paper-white
contrast. Values below are the dark edition (the canonical `:root`); the light
edition's values live in `.impeccable/design.json`.

### Primary
- **Warm Newsprint Ink** (`#e6e3db`): the one text colour. Headlines, body,
  primary button fills (as ink-on-fondo), the selected-row inversion, and the
  global `:focus-visible` outline (`2px solid`, `2px` offset). This is `tinta` —
  everything readable is one of its four steps.
- **Ink 2 / Secondary** (`#a3a09a`): decks, hints, metadata, inactive nav, the
  active/pressed state of primary buttons (`tinta-2`).
- **Ink 3 / Tertiary** (`#85827c`): agate labels above figures, disabled text,
  the faintest captions (`tinta-3`).

### Secondary
- **Alert Coral** (`#f07a6b` dark / `#b3261e` light): negative deltas, "inhibido"
  flags, destructive-button outline, the left-rule on warnings. Never a fill on
  anything interactive-positive.
- **Favor Sage** (`#8fbf8a` dark / `#2c6a4c` light): positive deltas, unlocked
  titles, "primera vez" callouts.

### Tertiary
- **Club Accent** (`var(--club)`, runtime): the club's real primary colour,
  passed through `tintaDeClub()` — an OKLCH lightness search that walks the
  colour toward the theme's *raised surface* (`fondo-2`, via
  `superficieDelTema()`) until it clears 4.5:1, which also clears it against the
  page (`fondo`), so the accent is safe on both. Set as an inline CSS variable on
  every game-surface wrapper. Used for: the 4px top rule on game cards,
  club-scoped primary buttons ("Asumir el cargo", "Continuar"), section rules in
  results, the "Elegido" / "Resuelto" tags, the HUD league line. There is no
  static value — it is computed per club per theme. (The Open Graph image, which
  has no raised surface and always sits on the dark ground, solves against
  `#23242a` directly.)
- **Raw Club Colours** (`club.colors[0]`, `club.colors[1]`): the club's two
  unmodified brand colours, used *only* in the decorative `aria-hidden` "filete"
  stripe. Never carry text.

### Neutral
- **Newsprint** (`#23242a`): the page. Also the text colour *inside* inverted
  elements (selected rows, primary buttons, tags) — `fondo`.
- **Raised Block** (`#2b2c33`): cards (`Recuadro`), the HUD, sticky action bars,
  input fields. The only elevation cue besides a top rule — `fondo-2`.
- **Corondel** (`#45474e` dark / `#c9c5ba` light): every hairline divider, the
  1px column rule, `divide-x` between rail and column, dotted leader lines.
- **Corondel Fuerte** (`#6e7079` dark / `#8e8b83` light): stronger separators
  and the dotted stat underline at rest. (The `:focus-visible` outline was moved
  to `tinta`.)

### Named Rules
**The One Ink Rule.** A game screen carries exactly one chromatic colour: the
club's, contrast-solved. Alert and Favor appear only as thin semantic accents on
deltas and flags, never as surfaces. Everything else is a step of `tinta` on a
step of `fondo`. No decorative colour, ever.

**The Contrast-Solver Rule.** Club colour never reaches text or a border
directly. It goes through `tintaDeClub()` first, solved against the raised
surface so it holds 4.5:1 on both `fondo` and `fondo-2`. Raw `club.colors[*]` is
`aria-hidden` decoration only.

## Typography

**Display Font:** Archivo (variable, `wdth` axis) — with `"Helvetica Neue", Arial, sans-serif`
**Body Font:** Newsreader (variable, `opsz` axis, roman + italic) — with `Georgia, serif`
**Label / Table Font:** Archivo at weight 700 (the `.font-tabla` role)

**Character:** A condensed grotesque nameplate face against a warm, high-contrast
serif reading face — the exact pairing a sports broadsheet uses for headlines
versus copy. Archivo is compressed hard (`font-stretch` 66–80%) so headlines set
tight to the measure; Newsreader carries the prose and, in italic, the deck.

### Hierarchy
- **Masthead** (Archivo 900, `clamp(2.75rem, 11vw, 4.5rem)`, line-height 0.86,
  `wdth` 80%, uppercase, boxed between a 4px rule above and a 2px rule below):
  the "El Presidente" nameplate — an `<h1>` on the home edition, the same block
  as a `<p>` atop a shared presidency (`/p/[code]`). Set once; static, no
  reveal.
- **Display / Titular** (Archivo 800, `clamp(1.75rem, 7vw, 2.75rem)`, line-height
  0.92, `wdth` 66%, uppercase): the headline of every event card, result, and
  acta.
- **Ending** (Archivo 900, `clamp(2.25rem, 10vw, 4rem)`, line-height 0.9,
  `wdth` 75%, uppercase): the outcome title in `ResumenPresidencia` and its Open
  Graph echo. This is the one headline that still wipes open (`revelar-titular`,
  320ms).
- **Page title** (Archivo 900, `clamp(2rem, 8vw, 3rem)`, `wdth` 80%, uppercase,
  boxed in the 4px/2px rule pair): the standalone-page h1 (`/privacidad`).
- **Match title** (Archivo 900, `clamp(1.5rem, 7vw, 2rem)`, line-height 1.05,
  centred, uppercase): the mesa-chica fixture name.
- **Headline** (Archivo 900, `~22px` / `1.375rem`, line-height 1.05): club-name
  headings and panel titles (20–26px in practice).
- **Title / Volanta** (Archivo 700, `0.75rem`, tracking 0.14em, `wdth` 75%,
  uppercase, `border-bottom` corondel): the kicker line above a headline
  ("Presidencia del día", "La decisión", "Inventario").
- **Body / Cuerpo** (Newsreader 400, `17px`, line-height 1.625, max 66ch):
  event text, explanations, all reading copy.
- **Deck / Bajada** (Newsreader 400 *italic*, `19px`, line-height 1.375, ink-2,
  max 46ch): the standfirst under a headline.
- **Label / Agate** (Archivo 700, `11px`, tracking 0.06–0.14em, uppercase, often
  `tabular-nums`): every label, timestamp, resource name, delta, and figure.

**Step scale.** The non-heading sizes form a fine editorial ramp — 10, 11, 12,
13, 14, 15, 16, 17, 18, 19, 20, 22, 26px — enumerated in the frontmatter
`typography.scale`. 11px is the floor for functional text; 10px is reserved for
`aria-hidden` glyphs (the `▼` select caret) and the "al azar" micro-tag.

### Named Rules
**The Agate Rule.** If it is a label, a number, a date, or a status, it is
`font-tabla` — Archivo 700, uppercase, letter-spaced, tabular where numeric.
Prose is Newsreader serif; interface furniture is condensed Archivo. The two
never trade places.

**The Compression Rule.** Display type uses Archivo's width axis, not just its
weight. Headlines set at `wdth` 66–80% and line-height 0.86–0.92, fitted to the
column the way a compositor fits a broadsheet headline.

**The No-Truncated-Decision Rule.** Text the player is about to act on wraps or
clamps (`line-clamp-2`) — never a hard `truncate`. Only already-known metadata
(a club name in the HUD, the `detalle` line) may ellipsize.

## Layout

Mobile-first, and **375px is the real target, not an edge case**. Interactive
elements are at least 44px tall (`min-h-11`).

- **Game column:** a single centered measure, `max-width: 36rem` (576px,
  `max-w-xl`). Every phase — event, result, mesa chica, market, ending — lives in
  this one column.
- **Home edition:** `max-width: 1280px`. On `lg` it splits into a newspaper
  column-plus-rail: `grid-template-columns: 1fr minmax(300px, 360px)` with a
  vertical `corondel` rule between them (`lg:divide-x`). The rail holds the
  standings table and the trophy case; on mobile those collapse into `Plegable`
  disclosures.
- **Sticky furniture:** the HUD (`sticky top-0 z-20`) and the decision bars
  (`sticky bottom-0`) float on `fondo-2` at 97% opacity with `backdrop-blur`.
  This is the only place surfaces overlap.
- **Spacing rhythm:** Tailwind's scale, with a clear cadence — `mt-3`/`mt-4`
  between tight elements, `mt-6`/`mt-7` between blocks, `mt-10` between major
  sections. Card padding is `20px` rising to `28px` at `sm` (`p-5 sm:p-7`).
- **Reading measures:** body copy `66ch`, decks `46ch`, so lines break like a
  newspaper column regardless of viewport.

## Elevation & Depth

**Flat. There are no shadows anywhere in the system** — no `box-shadow`, no
`drop-shadow`, no `filter`. Depth is conveyed two ways, both from print:

1. **A tonal step.** The page is `fondo` (`#23242a`); anything raised — a card,
   the HUD, an input, a sticky bar — is `fondo-2` (`#2b2c33`). One step, no more.
2. **A rule across the top.** A block announces itself with a `border-top` of
   4px, in `tinta` for neutral blocks and the club accent for game surfaces.
   That coloured rule *is* the elevation.

Sticky bars additionally use `bg-fondo-2/97` + `backdrop-blur` so scrolling
content passes faintly behind them — the one "layer" cue in the system.

### Named Rules
**The Flat-Page Rule.** Never add a shadow to lift something. Raise it with the
tonal step and mark it with a top rule. If a thing needs to feel closer, it gets
a heavier rule, not a glow.

## Shapes

**Zero border-radius on everything structural.** Cards, buttons, inputs, tags,
rows, panels, the OG image — all sharp-cornered. The only rounded elements in
the codebase are functional micro-dots: the 6–8px `rounded-full` club-colour
chips in lists and the mesa-chica token counters. Nothing else.

The form language is entirely **rules and borders**:
- **4px top rule** — a block's identity (`border-t-4`, `tinta` or `var(--club)`).
- **1px corondel hairline** — dividers, list separators, `border-y` frames,
  `divide-x` / `divide-y`.
- **2px left rule** — the "aside" / pull-quote device (`border-l-2 border-alerta`
  for warnings, `border-l-2 border-[var(--club)]` for "this comes back" notes).
- **Dotted leader** — `Puntos`: a `flex-1` dotted `border-bottom` between a label
  and its value, the results-table dot leader.
- **Dotted vs solid underline** — a stat sits on a dotted `corondel-fuerte`
  underline at rest and a solid `tinta` underline when expanded.
- **The filete** — two flush `1px`-tall bars of the club's two raw colours,
  `aria-hidden`, animated with `filete-animado` (scaleX from left). Runs under
  headlines, across the top of the HUD, and bleeding to card edges.

Tags (`Ladillo`) are solid rectangular blocks — coloured fill, `text-fondo`,
`2px 8px` padding, no radius, uppercase agate.

## Components

Every component leads with the same instinct: **set in metal, not drawn in
software.** Sharp, ruled, solid, with a physical press on interaction.

### Buttons
- **Shape:** rectangular, no radius. Full-width for primary actions.
- **Primary (neutral):** solid `bg-tinta` / `text-fondo`, `font-tabla` weight
  black, `tracking-[0.1em]`, uppercase, `py-4`. Active: `bg-tinta-2` plus the
  global `active:scale(0.97)` (160ms `--ease-out`).
- **Primary (club-scoped):** identical but `bg-[var(--club)]` / `text-fondo`,
  active `opacity-90`. Used for the presidency's forward actions ("Asumir el
  cargo", "Continuar", "Ver el epílogo").
- **Ghost / secondary:** `border border-corondel`, `text-tinta-2`, agate label.
  Hover raises to `border-tinta` / `text-tinta`. No fill.
- **Destructive:** `border border-alerta`, `text-alerta`, `hover:bg-alerta/10`.
  Always behind a two-step confirm.
- **Text button:** agate uppercase, `underline underline-offset-4`, hover
  `text-tinta`. For back links and low-stakes toggles.
- **Outlined share button:** `border-2 border-tinta`, fills to `bg-tinta` /
  `text-fondo` on hover — the one "inverting" hover in the system.

### Inputs / Fields
- **Style:** `border border-corondel` on `bg-fondo-2`, no radius, `min-h-11`.
  Selects use `font-titular` bold; text inputs use `font-cuerpo`.
- **Label:** agate uppercase `tracking-[0.1em]` `text-tinta-2`, set above the
  field.
- **Focus:** the `corondel` border shifts to solid `tinta` and the field itself
  takes no outline. No glow, no colour change — just the rule going solid-bright.
  (Buttons and links instead show the global 2px `tinta` `:focus-visible` ring.)
- **Select chevron:** a literal `▼` glyph in `font-titular`, not an SVG.
- **Disabled:** `opacity-45`.

### Tags / Chips (`Ladillo`)
- **Style:** solid rectangular fill, `text-fondo`, `font-tabla` `11px`
  `tracking-[0.1em]` uppercase, `2px 8px` padding, no border, no radius.
- **Tones:** `tinta` (neutral), `alerta`, `favorable`, `club`. The tone carries
  the meaning; the shape never changes.

### Cards / Containers (`Recuadro`)
- **Corner style:** none (0px).
- **Background:** `fondo-2`.
- **Border:** a single `border-t-4` — `tinta` or `var(--club)`. No side or bottom
  border.
- **Shadow:** none (see Elevation).
- **Padding:** `20px`, `28px` at `sm`.
- **Entrance:** `entrar-nota` (translateY 6px + fade, 180ms `--ease-out`).

### Choice Row (`Renglon`) — signature
The ballot line. A full-width `<button>` with a `border-b border-corondel`.
Unselected: hint in `tinta-2`, hover `bg-fondo/60`. **Selected: the whole row
inverts to `bg-tinta` / `text-fondo`** — ink stamped onto paper. Label is
`font-titular` bold; an optional bordered "al azar" micro-tag sits at the end
when the outcome is random. Rows drop in staggered (`animationDelay: index*40ms`).
Below the hint, an optional row of **impact tokens** (see below).

### Impact Token (`lib/impacto.ts` + `Renglon`'s token row)
A `font-tabla` `10px` bold label (`CAJA`, `HINCHADA`, …) followed by its signo
repeated once per grade — `+`, `++`, or `+++` (grade derived from the
catalogue's own effect-size distribution, not a fixed number). Color carries
the direction at rest: `text-favorable` for `+`, `text-alerta` for `−`,
`text-tinta-2` for the neutral `DESPUÉS` token (an effect deferred to a later
season, shown with no magnitude so it warns without spoiling the twist).
**Inside a selected (inverted) `Renglon`, every token drops to `text-fondo/70`
regardless of direction** — `favorable`/`alerta` do not pass contrast against
`bg-tinta`, so on inversion the `+`/`−` glyphs alone carry the meaning. `null`
(an `option.random`) renders no tokens — the "al azar" tag already covers that
case. This is graded prose, not a number: see the prosa-vs-contrato rule under
Do's and Don'ts for where a token is right and where an exact figure is owed
instead.

### Stat (`Cifra`) — signature
Agate label (`11px`, `tinta-2`, uppercase) over a `font-titular` black
`tabular-nums` value, in a `min-h-11` tap target with near-zero horizontal
padding so five sit across a 375px HUD. Sits on a `border-b-2` that is **dotted
`corondel-fuerte` at rest, solid `tinta` when expanded**. Value turns `alerta`
when it crosses a critical threshold (caja < 0, hinchada < 25). Tapping toggles
an inline explanation panel.

### Sticky Action Bar (`BarraDecision`) — signature
`sticky bottom-0 -mx-4`, `border-t-4 border-tinta`, `bg-fondo-2/97
backdrop-blur`. Left: a `line-clamp-2` summary of the pending choice in
`font-titular` bold, with an agate `detalle` line under it. Right: a solid
uppercase confirm slab ("Firmar", "Definir"), disabled state is a hollow
`border border-corondel` with `text-tinta-3`.

### HUD (`Hud`) — signature
`sticky top-0 z-20` on `bg-fondo-2/97 backdrop-blur`. `BarraSuperior` → club
name + `T{season} · {year}` → club-tinted league/mandate line → a 5-column
`divide-x divide-corondel` row of `Cifra` stats on a bespoke
`grid-template-columns` (`minmax(76px, 1.1fr) 1fr 0.8fr 0.89fr 1.11fr`) that
floors "Caja" at 76px and gives "Caja" and "Influencia" the widest tracks so
long figures never clip → optional expanded detail panel → the two-colour
`filete` bar sealing the bottom edge.

### Navigation (`BarraSuperior`)
A thin top strip, `border-b border-corondel py-2`, on every top-level surface —
the home edition, an in-game screen, a shared presidency (`/p/[code]`),
`/privacidad`, and the 404. It holds at most two agate uppercase controls:
"← Volver al inicio" on the left and the theme toggle on the right. In game the
back control is a `<button>` (`onVolver` callback); on standalone pages it is a
`next/link` home (`volverHref`). The toggle label is in-world — "Edición de
día" / "Edición nocturna" — and carries a morphing sun/moon SVG. Switching
themes runs a View Transitions circular wipe from the click point (520ms
`cubic-bezier(0.65, 0, 0.35, 1)`), skipped under `prefers-reduced-motion`.

### Disclosure (`Plegable`)
Bordered box on mobile with a `+` / `−` glyph in `font-titular` black and a
truncated one-line `resumen` under the title while collapsed; on `lg` the border
and toggle vanish and it becomes a static rail section headed by a plain
`Volanta`.

### Loading (`Cargando`) — signature
A line still being set. The message is agate (`font-tabla` `11px`, tracked,
uppercase, `tinta-2`) trailed by a blinking caret — a small `bg-current` block
(`h-[0.85em] w-[0.45em]`, `aria-hidden`) running the `parpadeo` blink (1100ms).
Two forms: `chico` is an inline `<p>` (tracking `0.06em`) dropped into a panel
that is still fetching; the block form fills the viewport (`min-h-dvh`, centred,
`role="status"`, tracking `0.2em`). No spinner, no orbs — the compositor's
cursor is the whole idea. Server-rendered.

### Open Graph card (`/p/[code]/opengraph-image`)
1200×630, `#23242a` ground (always dark), `52px 64px` padding, set in the real
type: condensed **Archivo** (`wdth` 75, weights 900 and 700) and **Newsreader**
400, fetched once from Google Fonts as static-instanced WOFF and memoised; if
the fetch fails the card still renders in the system stack. Composition, top to
bottom: an agate "EL PRESIDENTE" wordmark over a 4px club-tinted rule; a
club-tinted `CLUB · YYYY–YYYY` line; the ending title in Archivo 900
(`letter-spacing: -2`, `line-height: 0.9`, 82px stepping to 66px past 22 chars);
a **pull-quote** — the ending's first sentence (elided past 128 chars) in
Newsreader 400 `#a3a09a` on a 2px club-tinted left rule, `max-width: 880`; a
`1px solid #45474e` rule over the four-figure row (Temporadas / Títulos /
Hinchada / Puntaje); up to four club-tinted solid title chips. The same edition,
printed for WhatsApp.

## Do's and Don'ts

### Do:
- **Do** draw structure with rules: a `border-t-4` for a block's identity, `1px`
  `corondel` hairlines for every divider, `2px` left rules for asides.
- **Do** wrap every game surface in `style={{ '--club': tintaClub }}` and take
  all accent colour from `var(--club)` — never from `club.colors[*]` directly
  except in the `aria-hidden` filete.
- **Do** set every label, figure, timestamp, and status in `font-tabla` —
  Archivo 700, uppercase, letter-spaced, `tabular-nums` when numeric.
- **Do** compress display type with the width axis (`font-stretch: 66%–80%`) and
  set it tight (line-height 0.86–0.92).
- **Do** keep the club accent contrast-solved against the *raised surface*
  (`superficieDelTema()`), so it clears 4.5:1 on both `fondo` and `fondo-2` in
  the active theme (`npm run contraste` is the check).
- **Do** invert on selection — the chosen `Renglon` becomes `bg-tinta` /
  `text-fondo`.
- **Do** follow the prosa-vs-contrato rule for showing impact: a **prose
  screen** (an event card's options) gets graded signs (`HINCHADA ++`) —
  it is reading a newspaper, not a spreadsheet. A **contract screen** (the
  transfer window, the mesa chica) gets exact figures, because the player is
  about to sign something and needs the real number. Never show a grade where
  a figure is owed, or a figure where a grade would do (`Renglon`'s impact
  tokens vs. `FaseMercado`'s `Dato` cells are the reference pair).
- **Do** honour `prefers-reduced-motion` by reducing movement, not erasing
  feedback: `entrar-nota` drops to an opacity-only fade (`aparecer`),
  `filete-animado` / `revelar-titular` / the `cursor-parpadeo` blink / the
  theme-icon morph are all stopped, the `button:active` `scale(0.97)` press keeps
  its ease, and every other non-button transition snaps to ~0.
- **Do** respect the reading measures (66ch body, 46ch deck) and `min-h-11` on
  anything tappable.

### Don't:
- **Don't** add `border-radius` to anything structural, or any `box-shadow`,
  `drop-shadow`, or gradient — the page is flat and sharp. (Functional 6–8px
  `rounded-full` dots are the only exception.)
- **Don't** introduce a decorative colour. One club accent, two semantic signals
  (`alerta`, `favorable`), four steps of `tinta`. Nothing else earns chroma.
- **Don't** let it drift toward generic SaaS / dashboard UI: no rounded cards,
  no soft shadows, no blue-500 accent, no gradient CTAs, no pill badges, no
  emoji, no glassmorphism.
- **Don't** use a glow, ring, or colour-fill for input focus — the `corondel`
  border shifts to solid `tinta`, and that is all.
- **Don't** hard-`truncate` any text the player is about to act on; wrap or
  `line-clamp` it.
- **Don't** mix the type roles — prose stays Newsreader serif, furniture stays
  condensed Archivo.
- **Don't** stack surfaces with overlap except the sticky HUD and action bars
  (`/97` + `backdrop-blur`).
