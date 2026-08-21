<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# El Presidente

A browser roguelike about running an Argentine football club. You win the
election and get four terms before they throw you out: you manage the cash, the
fans, the members, the squad and your political influence. You never play the
matches — you assemble the squad and the squad performs — and every four
seasons people vote.

Next 16, React 19, Tailwind v4, TypeScript, Vitest, `postgres.js`. Licensed
AGPL-3.0. Player-facing copy, commit messages and UI text are in Rioplatense
Spanish; this file and the code itself are in English.

## Working rules

These two come first and override any habit to the contrary.

**Fixes should make the system simpler, not more complex.** Prefer removing or
consolidating code over adding a new layer, flag, or special case. If a fix
grows the system's surface area, look for the version that shrinks it.

**Never leave comments in the repo.** The standard is zero comments: no
explanatory comments or docblocks, TODO/FIXME notes, lint/type suppression
directives, or commented-out code. Express intent through names, structure, and
tests; put rationale in commit messages or PR descriptions. Interpreter
shebangs are executable directives, not comments.

Applied retroactively: the codebase carries zero comments, not just new code.
Because published commit messages are capped at one line, rationale goes in the
git note attached to the commit — see **Commits** below. A rule this specific
lint or type checkers can enforce belongs in tool config, not an inline
suppression comment: see `eslint.config.mjs`.

## Architecture

### The engine is pure and deterministic

A whole presidency is described by four things: **seed, club, mode, and the
ordered list of choices**. Nothing else. Everything below follows from that, and
breaking it breaks all of it at once:

- The share link carries the game inside it, so sharing needs no server or
  database. `lib/share.ts`.
- The server verifies every submitted score by replaying the game with the same
  engine. It never trusts the browser. `app/api/puntaje/route.ts`.
- Balance is measured by simulating thousands of runs headlessly.
- Tests run in plain Node with no DOM and no component mounting.

Consequences to respect:

- The engine must not read the clock, `Math.random`, the network, or any
  browser API. Randomness comes from `lib/engine/rng.ts`, seeded.
- Anything that consumes the RNG changes every existing seed. Adding or
  removing a single `rand` call silently turns every seed into a different
  game.
- `lib/engine` must not import from `components/` or `app/`.

### Content is data

Events are typed declarative objects in `content/events/`. Adding content means
adding a file and listing it in `content/events/index.ts`. The engine is not
touched. The catalogue is 131 cards across twelve fronts, plus 64 clubs, 8
titles and 18 achievements.

Cards without a `requires` condition are the general pool; conditioned cards
give texture to a specific situation. Only general cards fix repetition in a
long run, because a healthy presidency spends almost all its time in the state
where conditioned cards do not apply.

```
lib/engine/      state, effects, events, market, board meeting, elections
lib/             share links, sanitising, formatting, db access, daily seed
content/         clubs, events, titles, achievements, parody names
components/      the interface, mobile first
app/             pages and the two API routes
scripts/         the measuring tools
db/migrations/   SQL, applied with `npm run migrar`
.githooks/       pre-commit secret scanner
```

### Invariants that must not break

- **Old share links must keep decoding to the same game.** The mode travels
  packed into the club field using `MODOS_EN_LINK`, a wire ordering separate
  from the display ordering, so that `normal` is index 0 and pre-mode links
  still decode correctly. New modes append to the end of that array, never the
  middle. The field is full at four modes.
- **`lib/db.ts` carries `import 'server-only'`.** The connection string must
  never be named `NEXT_PUBLIC_*` and must never reach the browser. If it could,
  server-side verification would be worthless.
- **The game works with no database.** Without `DATABASE_URL` the ranking
  routes answer 503 and the UI hides the table. Everything else plays.
- **Every card needs at least two options with no conditions**, so a run can
  never stall. `lib/engine/engine.test.ts` guards this and other content rules.

## Measure before deciding

When a design decision can be measured, measure it. In this project measurement
has repeatedly contradicted the intuition of whoever wrote the code, and the
result is recorded where the decision lives.

| | |
|---|---|
| `npm run simulate 3000 --modo=todos` | balance: endings, scores, completion rate |
| `npm run cobertura -- --modo=larga` | which cards appear, which never, which repeat |
| `npm run contraste` | palette contrast against WCAG |
| `npm run cracks` | parody names never repeat inside one run |
| `npx tsx scripts/llamas.ts` | how much harder the "en llamas" mode is, and where runs die |

`simulate` reports two policies. `random` is the floor — someone pressing
buttons — and must end badly almost always. `greedy` reads consequences and
picks what suits it short term; it is the calibrated number. If the two curves
look alike, decisions do not matter and the game is broken.

Current completion rates under `greedy`: corta 78.8%, normal 62.7%, larga
46.8%, llamas 15.8%.

## Interface

Mobile first, and 375px is the real target, not an edge case. Interactive
elements get `min-h-11`. Text that can be long must wrap or clamp, never
silently truncate a decision the player is about to confirm.

`/cartas` renders all 131 cards using the real `FaseEvento` component. It is
disabled in production via `notFound()`. Use it to read content at the width it
will be read at; a gallery that draws cards its own way lies about exactly what
you want to check.

Verify UI work in a browser at 375px rather than reasoning about it. Building
UI blind has produced this project's worst screens.

## Secrets

`.env` and its whole family are ignored, in the root and in any subdirectory,
along with keys, `.npmrc`, `.netrc`, database dumps and local tool state.
`.env.example` is the exception and is the only place documenting which
variables exist.

`.githooks/pre-commit` blocks a commit whose staged content contains a
connection string with a real password, a provider token, a private key block,
a forbidden filename, or a file over 5 MB. It is installed by `npm install`.
`.gitignore` filters by name; the hook reads content, which a name cannot see.

## Commits

Published commit messages are **a single line, 150 characters maximum**, plain
and factual. No trailers, no co-authors, no generated-by footers.

The reasoning behind a change — what was measured, which hypothesis fell, what
was tried and failed — goes in the git note attached to the commit, which stays
local and is never pushed:

```
git notes add <hash>       write the long version
git log --notes            read a commit with its full history
```

`.git/historial.md` holds a readable export of every note.

## Before saying it is done

```
npm test
npm run typecheck
npm run lint
npm run build
```

Report what actually happened. If a test fails, say so with the output. If a
step was skipped, say that.
