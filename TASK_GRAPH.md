# TASK GRAPH

Project: No.One

Version: v0.1.0

Status: Active Development

---

## Current Progress

Current Phase

Foundation

Current Sprint

Sprint 1

Current Task

P2-T03 Separator Component complete — Phase 2 UI primitives done

Next Task

TBD (real page content, e.g. /about)

Overall Progress

16 / 48 Tasks Complete

---

## Completed: P2-T03 Separator Component

- Built `components/ui/Separator.tsx`: visual divider primitive for
  Card sections, form groups, and horizontally laid-out nav/footer
  items.
- `orientation` variant (`horizontal`/`vertical`) via `cva`, using only
  `bg-border` — no new tokens needed.
- Purely presentational: `role="none"` + `aria-hidden="true"`, since a
  visual rule has no semantic meaning by default. A caller needing an
  actual semantic divider (e.g. in prose) should use `<hr>` directly
  instead of this component.
- No `forwardRef` needed (matches Card/Badge, not Button/Input) — a
  static div with no ref-consuming use case.
- Verified with `tsc --noEmit` and `eslint` (clean).
- **Closes out Phase 2's UI primitive set** (Badge, Input, Separator).
  Remaining Phase 2 work is real page content: /about, /projects,
  /notes, /contact.

---

## Completed: P2-T02 Input Component

- Built `components/ui/Input.tsx`: the site-wide text input primitive,
  built with the future Contact form (P2-T05+) in mind but generic
  enough for any labeled field.
- Composes `label`, the `<input>` itself, and `error`/`helperText` into
  one unit, wiring `aria-invalid`/`aria-describedby` automatically so
  forms don't have to hand-build accessible error states themselves.
- `state` (`default`/`error`) and `size` (`sm`/`md`/`lg`) variants via
  `cva`, matching Button's variant/size pattern. `state` is normally
  driven by passing `error` rather than set directly.
- Uses `forwardRef` (like Button, unlike Card/Badge) since form inputs
  commonly need ref access for focus management and validation libs.
- Verified with `tsc --noEmit` and `eslint` (clean).

---

## Completed: P2-T01 Badge Component

- Built `components/ui/Badge.tsx`: status/label primitive for tags on
  project cards, note categories, and status indicators.
- `variant` (`default`/`accent`/`success`/`warning`/`danger`/`outline`)
  and `size` (`sm`/`md`) variants, built entirely from existing tokens —
  reuses the `success`/`warning`/`danger` state colors from Design
  Tokens (P1-T05), so it shares vocabulary with Button's `destructive`
  variant rather than inventing new colors.
- No polymorphism/forwardRef needed (unlike Button) — Badge is always
  a `<span>`, never needs to render as a link.
- Verified with `tsc --noEmit` and `eslint` (clean).

---

## Completed: P1-T13 Footer

- Built `components/navigation/Footer.tsx`: copyright line (auto-updating
  year) + the same `NAV_ITEMS` list (from `config/site.ts`, P1-T10) that
  `Navbar`/`MobileMenu` already read from — no duplicated link list.
- Wired `Footer` into `app/layout.tsx` alongside `Navbar`.
- **Fixed a real layout bug while wiring it in**: `PageLayout` owned its
  own `min-h-screen`, which doesn't account for sibling Navbar/Footer
  height — adding Footer as a sibling after `{children}` would have
  pushed total page height past one viewport on short pages, causing
  unwanted scroll. Fixed with the standard sticky-footer pattern:
  `<body>` now owns `flex min-h-screen flex-col`, and `PageLayout`
  changed from `min-h-screen` to `flex-1`, so it fills exactly the
  space left between Navbar and Footer instead of claiming a full
  extra viewport on top of them.
- Verified with `tsc --noEmit`, `eslint`, and a Turbopack build pass
  (clean; same known Google Fonts network limitation as prior tasks).

---

## Completed: P1-T12 Card Component

- Built `components/ui/Card.tsx`: the site-wide surface primitive for
  project cards, note previews, form groupings — anything that needs
  to read as a distinct block on the pure-black background.
- `padding` variant (`none`/`sm`/`md`/`lg`, default `md`) and `hover`
  variant (boolean — border brightens on hover for clickable cards).
- Uses `border-border` + `bg-card` at rest rather than a shadow, per
  ADR-007's reasoning that a border reads more reliably than a shadow
  on a pure-black (`#000`) surface; instances needing elevation can
  still add a `shadow-*` utility (P1-T05) directly.
- Verified with `tsc --noEmit` and `eslint` (clean).

---

## Completed: P1-T11 Bug Fixes: Button Text Visibility + Hero Spacing

- **Fixed invisible primary Button text.** `globals.css` had a plain
  `a { color: inherit; text-decoration: none; }` rule declared *outside*
  any `@layer` block. In CSS Cascade Layers, unlayered CSS always beats
  layered CSS regardless of selector specificity — so this element
  selector was silently overriding the `text-background` utility class
  (specificity aside) on Button's `<Link>`, forcing `color: inherit`,
  which resolved up to white. Combined with `primary`'s white
  background, the "About" button rendered as solid white with
  invisible white-on-white text. Fixed by wrapping all custom base CSS
  (`*`, `html`, `body`, `a`, `button`, `img`, `:focus-visible`, reduced-
  motion) in `@layer base { }`, matching how Tailwind's own preflight
  declares the exact same `a` reset inside `@layer base`.
- **Fixed excessive hero whitespace on mobile.** `app/page.tsx`'s hero
  used `<Section spacing="lg">` (up to 160px fixed padding) *and*
  `flex flex-1 items-center` (full-height flex centering) at the same
  time — redundant, and on short mobile viewports it squeezed visible
  content into a much smaller band than intended, showing as a large
  dead gap under the navbar. Changed to `spacing="none"` since
  full-height flex centering alone is the correct pattern here.
- Found via a real mobile-viewport screenshot rather than caught by
  `tsc`/`eslint` — both are visual/cascade issues neither tool checks.
- Record decision in DECISIONS.md (ADR-012), advance TASK_GRAPH.md.
- Verified with `tsc --noEmit` and `eslint` (clean).

---

## Completed: P1-T10 Mobile Menu

- Extracted `NAV_ITEMS` out of `Navbar.tsx` into `config/site.ts` — the
  first real file in `config/`, and now the single source both `Navbar`
  and `MobileMenu` read from instead of duplicating the list.
- Built `components/navigation/MobileMenu.tsx`: hamburger toggle (`lucide-react`
  Menu/X icons via `Button` `variant="ghost" size="icon"`) that opens a
  slide-down panel using `framer-motion`'s `AnimatePresence`.
- Panel closes on: clicking a nav link, pressing Escape, or toggling the
  hamburger again. Body scroll locks while open.
- Respects `useReducedMotion` (P1-T07): animation duration drops to 0
  instead of skipping the transition entirely, so the panel still
  opens/closes, just without motion.
- Added optional `onClick` passthrough to `NavLink` so `MobileMenu` can
  close itself on navigation without a `usePathname`-watching effect —
  first attempt used `useEffect` + `setIsOpen` keyed on route change,
  which `eslint` correctly flagged as a cascading-render anti-pattern;
  fixed by closing directly in the click handler instead.
- `Navbar` now renders `MobileMenu` inline (hidden on desktop via the
  `md:hidden` wrapper) rather than owning any open/close state itself.
- Verified with `tsc --noEmit` and `eslint` (clean) and a Turbopack build
  pass (same known Google Fonts network limitation as prior tasks).

---

## Completed: P1-T09 Navigation Primitive

- Built `components/navigation/NavLink.tsx`: client component that reads
  `usePathname()` to apply active-route styling. Kept separate from
  `Button` since nav items need active-state logic a generic button
  variant shouldn't carry.
- Built `components/navigation/Navbar.tsx`: sticky header with logo and
  desktop nav links (About/Projects/Notes/Contact — routes don't exist
  yet, expected to 404 until built). Desktop-only for now; `MobileMenu.tsx`
  stays a stub for a dedicated follow-up task rather than being bolted
  on here.
- Wired `Navbar` into `app/layout.tsx` so it renders on every page.
- Fixed `app/layout.tsx`'s `<body>` to use `bg-background`/`text-foreground`
  tokens instead of hardcoded `bg-black text-white` — leftover from
  before Design Tokens (P1-T05) existed.
- Verified with `tsc --noEmit` and `eslint` (clean).

---

## Completed: P1-T08 Button Component

- Built `components/ui/Button.tsx`: the site-wide button primitive.
- Variants: `primary` (inverted fill, default), `secondary`, `outline`,
  `ghost`, `destructive` — all built from the color tokens (`foreground`,
  `background`, `card`, `border`, `danger`) rather than new hardcoded colors.
- Sizes: `sm`, `md` (default), `lg`, `icon`.
- Polymorphic via `href`: pass `href` to render a Next.js `<Link>` with
  identical styling instead of a `<button>` — one component covers both
  CTAs and nav-style links, no separate `LinkButton` needed.
- Focus-visible ring uses the `--ring` token (also now backed by the
  global `:focus-visible` style from P1-T07).
- Wired into `app/page.tsx` as a live example (About / Projects links —
  routes don't exist yet, expected to 404 until those pages are built).
- Verified with `tsc --noEmit` and `eslint` (clean, after fixing a TS
  interface conflict on the shared `children` prop between the button
  and link variants).

---

## Completed: P1-T07 Accessibility & Motion Foundations

- Added a global `:focus-visible` style using the `--ring` token — the
  first real consumer of that token, which existed since P1-T05 but was
  unused. Keyboard focus is now visible everywhere by default, before
  any interactive component (Button, Input, Nav) exists to need it.
- Added a site-wide `prefers-reduced-motion: reduce` media query that
  collapses all CSS transitions/animations to near-zero duration.
- Added `hooks/useReducedMotion.ts` — the first file in the previously
  empty `hooks/` folder. Uses `useSyncExternalStore` (not
  `useState`/`useEffect`) to subscribe to the media query, which avoids
  both a lint error (`react-hooks/set-state-in-effect`) and an
  SSR/client hydration mismatch. Framer Motion components (not yet
  built) should read this hook directly, since JS-driven animations
  don't respect the CSS media query on their own.
- Verified with `tsc --noEmit` and `eslint` (both clean, after fixing
  one real lint error caught along the way).
- Record decision in DECISIONS.md (ADR-009).

---

## Completed: P1-T06 Spacing & Layout System

- Aliased `--max-width` into Tailwind's container namespace
  (`--container-content`), so `max-w-content` is a real utility.
  `Container.tsx` now uses it instead of a hardcoded `max-w-7xl` that
  only coincidentally matched the same 1280px value.
- Rebuilt `Container.tsx` to use `cn()` instead of manual template
  string concatenation.
- Built `Section.tsx`: the standard vertical-rhythm wrapper for page
  sections. `spacing` variant (`sm`/`md`/`lg`/`none`) controls y-padding,
  `background` variant (`transparent`/`card`) controls fill, and
  `container` prop (default true) wraps children in `Container`.
- Built `PageLayout.tsx`: top-level `<main>` shell every page renders
  into, so page-level structure lives in one place.
- Migrated `app/page.tsx` to `PageLayout` + `Section` instead of a raw
  `<main>` — same visual result, now composed from the reusable system.
- Verified with `tsc --noEmit` and `eslint` (clean), and confirmed via a
  live local dev server request that the page renders correctly
  end-to-end (this task didn't touch fonts, so no network limitation
  applied here).

---

## Completed: P1-T05 Design Tokens

- Wired existing color tokens (`background`, `foreground`, `muted`,
  `border`, `card`) into Tailwind's theme via `--color-*` in
  `@theme inline`, so `bg-background`, `text-muted`, `border-border`
  etc. are now real utilities instead of hand-written `var()`.
- Added a single `--accent` brand color (+ `--accent-foreground`) as the
  one swappable value that re-themes the site.
- Added semantic state colors: `success`, `warning`, `danger` (each with
  a paired `-foreground` for text-on-fill contrast) for future
  `components/feedback` and `components/forms` work.
- Added `--ring`, defaulting to the accent, for consistent focus states.
- Added a radius scale: `radius-sm` (8px), `radius-md` (14px, the site
  default), `radius-lg` (20px), `radius-full`.
- Added a shadow scale (`shadow-sm/md/lg`) tuned for a pure-black
  surface — elevation reads via a faint white hairline + soft black
  falloff rather than a standard light-mode drop shadow.
- Added a z-index scale (`sticky`, `dropdown`, `overlay`, `modal`,
  `toast`, `tooltip`) as the single source of truth for stacking order.
- Migrated `Text.tsx`'s `tone` variants off arbitrary `text-[var(--x)]`
  syntax onto the new real utilities.
- Verified with `tsc --noEmit` and `eslint` (clean); `next build`
  confirmed CSS/theme compiles correctly (same sandbox-only Google
  Fonts network limitation as P1-T04, unrelated to this change).

---

## Completed: P1-T04 Typography System

- Added a full type scale to `app/globals.css` via Tailwind v4 `@theme inline`:
  `display`, `h1`–`h6`, `body-lg`, `body`, `body-sm`, `caption` — each with a
  matched line-height and letter-spacing so `text-*` utilities are correct
  by default.
- Registered `--font-sans` / `--font-mono` theme tokens, mapped to the
  existing Geist variable fonts from `layout.tsx`.
- Built `components/ui/Heading.tsx`: semantic tag (`as`, h1–h6) is decoupled
  from visual `size`, so document outline never has to match visual scale.
- Built `components/ui/Text.tsx`: body copy / caption component with
  `size`, `tone` (default/muted/subtle), and `weight` variants.
- Added `lib/utils/cn.ts` (clsx + tailwind-merge) — now the standard for
  class merging across all `components/ui` primitives.
- Migrated `app/page.tsx` to use `Heading`/`Text` instead of raw utility
  classes, as the first real usage of the system.
- Verified with `tsc --noEmit` and `eslint` (both clean). Production build
  verified up through CSS/Turbopack compilation; full `next build` could
  not complete in this sandbox because Google Fonts is unreachable behind
  the sandbox's network allowlist — expected to build cleanly with normal
  internet access.

---

## Engineering Rules

- Never skip dependencies.

- Build systems before features.

- One task per commit.

- Every task must pass build.

- Every task updates TASK_GRAPH.md.

---

## Folder Status

✓ app

✓ components

✓ content

✓ data

✓ hooks

✓ public

✓ styles

✓ types

✓ components/ui

✓ components/layout

□ components/sections

□ components/providers

✓ lib

---

## Phase Progress

Phase 1

Progress

12 / 12

Status

Complete

Phase 2

In Progress (Badge done; Button, Navigation, Footer, Card already
built during Phase 1 as prerequisites; Input, Separator, and actual
page content remain)

Phase 3

Waiting

...
