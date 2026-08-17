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

P3-T02 Search entry point complete

Next Task

/notes page (Phase 5 content-platform work, first real content type
beyond the four MVP pages)

Overall Progress

21 / 48 Tasks Complete

---

## Completed: P2-T04 /about Page

- Built `app/about/page.tsx`: first real content page, replacing the
  404 previously linked from Navbar/Footer/homepage.
- Composed entirely from existing primitives — `PageLayout`, `Section`
  (`spacing="lg"`), `Heading` (`size="h1"`), `Text` (`size="lg"
  tone="muted"`) — no new components needed.
- Copy: "Karma, not categories." — reframes the site's premise as one
  continuous practice across work/health/relationships/adventure rather
  than separate life categories, and positions the site itself as a
  digital headquarters pulling together GitHub/YouTube/X/LinkedIn into
  one record rather than a highlight reel.
- Body copy constrained to `max-w-2xl` for readable line length,
  independent of the page's wider `max-w-content` container.
- Used `&apos;` for all apostrophes in JSX text to satisfy
  `react/no-unescaped-entities` (Next.js's default ESLint config).
- Verified with `tsc --noEmit`, `eslint`, and a live `next dev` check
  in-browser (layout, spacing, nav active-state, and route flow from
  `/` all confirmed working).

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

## Completed: P2-T05 /projects Page (Ventures Module)

- Built `app/projects/page.tsx` and `components/ventures/VentureRow.tsx`,
  replacing the earlier scroll-driven "thread" prototype (a single
  continuous line drawn by scroll position, with per-node status
  confirming as the drawn ink reached it).
- Design journey went through three real iterations before landing
  here:
  - **V1** (static card list with status badges) — rejected: read as a
    conventional portfolio despite the vocabulary, not a rethought
    interaction model.
  - **V2** (vertical spine, per-row `IntersectionObserver` fade-in) —
    self-identified as a failure: functionally the same pattern as
    AOS.js/GSAP ScrollTrigger scroll-reveal used on countless landing
    pages, just relabeled. Dressing a generic effect in No.One
    vocabulary doesn't make it native to No.One.
  - **V3** (thread-draws-progressively, single shared line, node status
    confirms at the pixel the ink reaches it) — built, type-checked,
    but on review the *shape* itself (vertical line + dot markers +
    left-label/right-status) was recognized as a standard roadmap/
    changelog component regardless of how the reveal animates. Still
    failed the standing rejection test: "if this interaction could be
    dropped unchanged into a SaaS landing page, it's probably not the
    right interaction for No.One."
  - **Current (V4)**: no shared line, no dots, no status tag visible
    by default. All five venture names rest at equal visual weight
    (Law of Rest / Non-Ranking). Status and description are hidden
    entirely until a specific venture receives attention — hover,
    keyboard focus, or tap-to-pin all drive the identical `active`
    state (Law of Attention: intent, not input device). Losing
    attention collapses the reveal back to rest (Law of Return, no
    "close" affordance). A soft pointer-tracked glow (desktop-only,
    decorative, gated to `pointerType === "mouse"`) is the one
    signature flourish.
- **Real bug found and fixed during build, worth logging**: an early
  version merged mouse-hover and keyboard-focus into a single JS state
  flag. On touch, tapping a venture both set `pinned` *and* focused the
  button; since focus doesn't clear on a second tap of an
  already-focused element (no `blur` fires), the merged flag stayed
  stuck "active" even after `pinned` toggled back off — the second tap
  silently failed to close it. Fixed by separating `hovered` / `focused`
  / `pinned` into three independent state variables (`active = hovered
  || focused || pinned`), and by blurring the trigger specifically on
  touch-originated clicks (detected via `onPointerDown`'s `pointerType`,
  which has no equivalent before a keyboard-triggered click, so
  keyboard focus behavior is untouched).
- `data/ventures.ts` recreated (was deleted by an unexplained local
  commit, `7158934`, outside any Claude chat — see below). Same shape
  as before: `identity` / `content` / `relations`, no `behavior` field
  (behavior is shared physics, not per-artifact data). `relations`
  arrays remain empty on all five ventures — no real connections
  between ventures have been confirmed by the person, and inventing
  one was explicitly rejected earlier as fabricating a fact not in
  evidence.
- Deleted `components/ventures/VentureThread.tsx` and
  `hooks/useInView.ts` as obsolete — neither is imported anywhere post-
  rebuild, following the same "remove rather than leave as dead code"
  precedent as V2's `useInView` removal.
- **Also resolved this task**: two unexplained local commits
  (`e1efeda`, `7158934`) flagged in a prior handoff as needing
  inspection. Confirmed via `git show` that both touch only one line of
  `package.json` each — `@tabler/icons-react` added then removed, net
  zero — nothing else dangling. Origin of the commits (and of the four
  files `7158934` deleted) remains unexplained, but the diffs
  themselves are confirmed clean.
- Verified with `tsc --noEmit` and `eslint` (both clean). **Not yet
  verified live in-browser** — unlike every prior entry in this file,
  double-tap-to-close on touch, keyboard-focus traversal, and visual
  read against the "not a SaaS template" bar are still pending manual
  confirmation. Update this line once done.

## Completed: P2-T06 /contact Page

- Built `components/contact/ContactChannel.tsx`,
  `components/contact/MessageComposer.tsx`, and `app/contact/page.tsx`.
- Reused Ventures' attention grammar rather than inventing a new one:
  each channel (Email, X, LinkedIn, GitHub) rests at equal weight with
  no badge/icon hierarchy, and reveals its handle plus a one-line
  blurb only on hover, keyboard focus, or tap-to-pin, same hovered,
  focused, pinned state split as VentureRow, including the same touch
  stuck-state fix (see P2-T05).
- Rejected the default "form always visible" pattern as the single
  most SaaS-template-shaped artifact possible. The message composer
  doesn't exist in the page's visible state at rest at all, it's
  collapsed behind a quiet "or write directly" toggle, expanding only
  on explicit engagement (Law of Rest applied to the form itself, not
  just individual fields).
- MessageComposer uses the existing Input primitive (P1-T02) for
  Name/Email as originally intended, plus a plain textarea for
  Message (no Textarea primitive exists yet, worth a future task if a
  second use case shows up). Submit is wired to a placeholder mailto:
  handler with prefilled subject/body; no real backend (Resend,
  Formspree, custom API route) has been chosen yet.
- PLACEHOLDER data, not yet real: all four channel handles/hrefs
  (hello@example.com, @example, etc.) in app/contact/page.tsx are
  placeholders pending the person's real handles, same "don't
  fabricate facts" rule as data/ventures.ts.
- Real, previously undetected bug found and fixed: Button's primary
  variant was rendering invisible white-on-white text whenever paired
  with a size variant. Root cause was in lib/utils/cn.ts: twMerge had
  no awareness of the project's custom typography scale (text-body,
  text-h1, etc., P1-T04) or custom color tokens (text-background,
  P1-T05), since both are defined via @theme inline rather than
  anything twMerge reads by default. twMerge's stock font-size group
  only recognizes standard values (text-sm, text-lg...), so it did
  not classify text-body as a font-size utility; its color-group
  matching is looser and likely misclassified text-body into the same
  conflict group as text-background. Since cva applies the size
  variant after the variant variant, twMerge's last-wins conflict
  resolution silently dropped text-background, leaving the button's
  text color to fall back to the inherited text-foreground (white)
  against its own white bg-foreground fill. Fixed by configuring
  extendTailwindMerge in cn.ts with an explicit font-size class group
  listing all ten custom typography classes. This is a shared utility
  used by every components/ui primitive, so the fix applies sitewide,
  confirmed via DevTools Computed panel (color: #FFFFFF on background:
  #FFFFFF before the fix, visible dark-on-white "Send" label after).
- Verified live in-browser, not just tsc/eslint, a first for this
  project's Contact-adjacent work: mailto compose flow confirmed
  end-to-end (real Gmail compose window populated correctly with
  To/Subject/Body/From), native browser required-field validation
  confirmed on empty submit, hover reveal confirmed on a real channel
  (LinkedIn, browser status bar showed the correct href), and the
  Button fix confirmed visually post-patch on a mobile-responsive
  viewport.
- Deferred, flagged decision: whole-site visual density ("looks
  empty/simple", large unused space on wide viewports, no imagery
  anywhere, sparse copy) was raised and explicitly deferred until
  Notes/Startups exist to fill it out, rather than guessed at now.
  Revisit once more content-bearing pages exist.
- Verified with tsc --noEmit and eslint (clean).

## Completed: P3-T01 Light/Dark Theme Toggle

- Added full light/dark switching via next-themes: ThemeToggle.tsx
  (sun/moon button in Navbar, visible on both desktop and mobile),
  ThemeProvider in layout.tsx (attribute=class, defaultTheme=system,
  enableSystem so it respects OS preference by default), and a .light
  class in globals.css overriding every color token.
- Real architectural gap found and fixed: the shadow scale was
  hardcoded directly inside @theme inline rather than indirected
  through :root custom properties the way every color token already
  is, so a class-based theme swap would have had zero effect on
  shadows, silently leaving dark-tuned white-hairline shadows active
  even in light mode. Renamed to --shadow-*-value in :root/.light and
  referenced via var() from @theme inline, matching the existing
  color-token indirection pattern.
- Accent/success/warning/danger/ring left unchanged across themes
  deliberately, self-contained fill+foreground pairs already read
  fine on both backgrounds, changing them added risk without a clear
  payoff.
- ThemeToggle's mounted-guard effect hit the same
  react-hooks/set-state-in-effect lint rule already documented in
  P1-T07 and the VentureRow touch fix; used the same established fix,
  wrap the setState call in a named function, call by reference.
- Verified with tsc --noEmit and eslint (clean).

---

## Completed: P3-T02 Search Entry Point

- Built components/navigation/SearchPalette.tsx: Cmd+K / Ctrl+K
  command-palette overlay for jumping to existing pages
  (Home/About/Projects/Notes/Contact). Client-side label filtering
  only, not full content search, that is Module 10's job in
  PROJECT_GRAPH.md, a separate later phase.
- Deliberately reused the existing bg-background/80 backdrop-blur
  treatment already established in Navbar rather than inventing new
  overlay styling, and plain color/border tokens rather than a
  bright generic command-palette highlight color.
- Breadcrumbs (the third Phase 3 navigation gap) was deliberately
  skipped: the site currently has zero nested routes; every page is
  flat (/, /about, /projects, /contact). Breadcrumbs exist to
  represent hierarchy that does not exist yet. Revisit once Notes or
  Projects grow real detail pages with genuine nesting.
- Keyboard: type to filter, Up/Down moves selection, Enter navigates,
  Escape closes from anywhere. Body scroll locks while open, same
  precedent as MobileMenu (P1-T10).
- Verified with tsc --noEmit and eslint (clean).
