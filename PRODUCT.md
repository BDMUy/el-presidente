# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary players are Argentine football fans (hinchas) on a phone, arriving from a
link a friend shares — a finished presidency posted to WhatsApp or a social feed.
The Rioplatense Spanish, the 344 real clubs, and the phonetic parody names
(*Bantiago Sernabéu*, *Mavier Jascherano*) are the point of the game, not a theme
layered on top: the player is expected to recognise the clubs, the archetypes,
and the jokes. A typical session is about ten minutes, single-sitting, often
one-handed. Appeal to roguelike fans or non-Argentine football audiences is
welcome but is not a design goal and never justifies diluting the local
specificity.

## Product Purpose

El Presidente is a browser roguelike about running an Argentine football club.
You win the election and then have four terms before they throw you out, managing
five fronts — the cash (caja), the crowd (hinchada), the members (socios), the
squad (plantel), and political influence. You never play the matches: you
assemble the squad and the squad performs, and every four seasons the people
vote. There is no "game over" screen — there is a lost election, a members'
assembly, bankruptcy, a fatal relegation, and in the best case a stand named
after you. Success is a complete presidency worth sharing: a run that produces a
result, a score, and a link a friend will open.

## Positioning

The whole presidency is defined by exactly four things — **seed, club, mode, and
the ordered list of choices** — and everything else follows from that purity:

- **The share link carries the entire game inside it** (typically 30–140
  characters, depending on mode and how long the presidency lasted; the
  400-decision technical cap has wide headroom to spare). Sharing needs no
  server and no database; the recipient's browser reconstructs the run with the
  same engine (`lib/share.ts`).
- **The server never trusts the browser.** Every submitted score is verified by
  replaying the game with the same deterministic engine
  (`app/api/puntaje/route.ts`).
- **Balance is measured, not argued.** Thousands of headless runs per second let
  design decisions be settled with numbers, and when measurement contradicts the
  author's intuition the result is recorded where the decision lives.

A neighbouring "manage a football club" game cannot truthfully copy this because
it is an architectural commitment, not a feature: a pure, deterministic,
browser-only engine with server-side replay verification and simulation-driven
balance.

## Operating Context

- **Device:** mobile-first; 375px is the real target, not an edge case.
  Interactive elements are at least 44px tall (`min-h-11`). Text that can run
  long wraps or clamps and never silently truncates a decision the player is
  about to confirm.
- **Session:** roughly ten minutes, one sitting, frequently prompted by a
  received link.
- **Distribution:** share links pasted into WhatsApp and social feeds; each
  shared presidency generates a 1200×630 Open Graph preview (green baize, the
  result).
- **Four modes:** Corta (8 seasons), Normal (16), Larga (32), En llamas (16,
  hard). Each has its own ranking table because score grows with seasons played.
  The link's mode field is full at four modes.
- **Content review:** `/cartas` (development only) renders all cards with the
  real `FaseEvento` component at the width they will be read at.
- **Measurement tools:** `npm run simulate`, `cobertura`, `contraste`, `cracks`,
  `scripts/llamas.ts`.

## Capabilities and Constraints

- **Deterministic pure engine.** `lib/engine` must not read the clock,
  `Math.random`, the network, or any browser API; randomness comes only from the
  seeded `lib/engine/rng.ts`. Anything that consumes the RNG changes every
  existing seed, so adding or removing a single `rand` call silently turns every
  seed into a different game. `lib/engine` must not import from `components/` or
  `app/`.
- **Old share links must keep decoding to the same game.** The mode is packed
  into the club field via `MODOS_EN_LINK`, a wire ordering separate from the
  display ordering, so `normal` is index 0 and pre-mode links still decode. New
  modes append to the end of that array, never the middle. Broken deliberately
  twice, before any public deploy or ranking row existed: in `CONTENT_VERSION` 6
  `choices` stopped recording the acknowledgement-only "Continuar" screens, and
  in `CONTENT_VERSION` 7 the content expansion, weighted event bag and balance
  recalibration shifted the RNG stream. Holds again from here on.
- **Works with no database.** Without `DATABASE_URL` the ranking routes answer
  503 and the UI hides the table; without the SMTP variables the `/privacidad`
  contact form disappears and `/api/contacto` answers 503. Everything else plays.
  The game must never require server state to be playable or shareable.
- **Secrets never reach the browser.** `lib/db.ts` carries `import 'server-only'`;
  the connection string is never `NEXT_PUBLIC_*`. `NEXT_PUBLIC_SOURCE_URL` is the
  only legitimately public variable. A pre-commit content scanner blocks
  connection strings, provider tokens, private keys, and files over 5 MB.
- **Content is data.** Events are typed declarative objects in `content/events/`;
  adding content is adding a file and listing it in the index — the engine is not
  touched. Current catalogue: 280 cards across twelve fronts (109 of them
  unconditioned — the "general" pool that sustains a long run — up from 33),
  344 clubs in three categories, 36 titles, 18 achievements. Every card needs
  at least two options with no `requires` condition so a run can never stall.
  Repetition across separate presidencies is also damped by a per-seed weight
  rotation (`rotacionPorSemilla` in `lib/engine/engine.ts`) — the same card is
  common under one seed and rare under another — and by multi-season arcs
  (flag-gated follow-up cards, 4–8 seasons apart, weighted to appear reliably
  once unlocked) that give returning players a throughline instead of
  independent vignettes.
- **Privacy.** The submission rate limiter stores a salted hash of the origin IP,
  never the IP itself (`RANKING_SALT`). No accounts, no analytics, no tracking
  beyond that hash.
- **Terminology:** presidencia (a full run), hinchada (crowd), socios (members),
  mesa chica (board meeting), mercado (transfer market), asamblea (members'
  assembly), vitrina (trophy case), carta (event card), modo (mode),
  corondel / filete / titular (typographic terms used throughout the code).
- **Stack:** Next 16, React 19, Tailwind v4, TypeScript, Vitest, `postgres.js`.
  No provider SDKs — any plain Postgres works. Deploys to any host that runs
  Next; Netlify is the documented target and nothing in the code is
  provider-specific.

## Brand Commitments

- **Name:** El Presidente. Tagline in use: "dirigí tu club".
- **Language:** all player-facing copy, UI text, and commit messages are in
  Rioplatense Spanish (`lang="es-AR"`, voseo). This file and the code are in
  English.
- **Voice:** dry, factual, newspaper-like; understated even at dramatic moments.
  No hype, no exclamation-driven UI.
- **Parody editorial line** (`content/parodias.ts`): clubs are real; all proper
  names are fictional phonetic puns. The joke is always phonetic and never
  implies a real crime by a real person. Corruption cards happen to the fictional
  club of the run, never to a real individual.
- **License:** AGPL-3.0-only. Copyright © 2026 Bruno Martínez. Anyone may run
  their own version; none may be a closed box. When public, the footer must link
  to the source (`NEXT_PUBLIC_SOURCE_URL`) per AGPL §13.
- **No "game over" language.** Endings are named outcomes (lost election,
  assembly, bankruptcy, fatal relegation, a stand with your name), not failure
  screens.

## Evidence on Hand

- **The game itself** is complete and playable end-to-end locally with no
  configuration.
- **Content:** 280 cards, 344 clubs, 36 titles, 18 achievements — written and in
  the repo.
- **Balance data** (measured, `greedy` policy completion rates): Corta 81.7%,
  Normal 63.7%, Larga 49.3%, En llamas 15.6%.
- **Test suite:** 182 tests, no DOM, passing; typecheck, lint, and build green.
- **Docs:** `README.md`, `AGENTS.md`, `DESPLIEGUE.md` (Netlify deployment
  runbook), `.env.example`.
- **Not yet real — must not be implied as done:** the ranking table is empty
  (zero rows); the game has never been played through on a physical phone;
  there is no public deployment yet. No press, reviews, testimonials, or player
  numbers exist;
  future work must not fabricate them.

## Product Principles

1. **The four-part definition is sacred.** Seed, club, mode, choices — and
   nothing else — describe a presidency. Any feature that would need more than
   that, or that reads the clock / RNG / network inside the engine, is the wrong
   feature.
2. **Measure before deciding.** When a design or balance choice can be simulated,
   simulate it, and record the result where the decision lives. Intuition has
   lost to measurement here repeatedly.
3. **The phone at 375px is the product.** Verify UI in a real browser at that
   width. Building it blind has produced the worst screens.
4. **Shareable without a server.** The link is the distribution channel; it must
   keep working with no backend, forever, decoding old runs identically.
5. **Local specificity over broad reach.** The clubs, the slang, and the puns are
   why it exists. Widening the audience never means sanding those down.
6. **Simpler, not more complex.** A fix that grows the system's surface area is
   suspect; prefer the version that shrinks it. Zero comments in the repo.
7. **Free and ungated.** No accounts, no ads, no tracking beyond the anonymised
   rate-limit hash. A donation or support link may be added later; a paywall or
   sign-up may not.

## Accessibility & Inclusion

- Mobile-first, 375px primary; interactive targets at least 44px (`min-h-11`).
- Palette contrast is checked against WCAG with `npm run contraste`; both dark
  (default) and light themes ship.
- `prefers-reduced-motion` is honoured by reducing movement, not erasing
  feedback: the entrance animation drops to an opacity fade, the filete and
  headline-reveal flourishes are removed, the button-press response is kept, and
  remaining transitions snap.
- Decision text never silently truncates: it wraps or clamps so the player always
  sees what they are about to confirm.
- `:focus-visible` outlines are provided globally.
- No formal conformance level has been declared; the working bar is "passes
  `contraste` and is usable one-handed on a 375px phone."
