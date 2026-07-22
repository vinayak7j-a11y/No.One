# Architecture Decisions

---

## ADR-001

Date

20 July 2026

Decision

Use Next.js App Router.

Reason

Modern React architecture with Server Components support.

---

## ADR-002

Decision

Tailwind CSS

Reason

Fast development, consistency, excellent ecosystem.

---

## ADR-003

Decision

Dark-first design.

Reason

Matches personal brand and modern developer aesthetic.

---

## ADR-004

Decision

Components before pages.

Reason

Reusable systems reduce technical debt.

---

## ADR-005

Decision

No.One is not a portfolio.

Reason

It is a Digital HQ that grows over time.

---

## ADR-006

Date

21 July 2026

Decision

Type scale lives in `app/globals.css` as Tailwind v4 `@theme` tokens
(`text-display` … `text-caption`), not in a JS config or inline styles.
`Heading` and `Text` components consume these tokens and separate semantic
HTML tag from visual size via an `as` prop.

Reason

Keeps the scale centralized and themeable (matches the "never scatter
magic numbers" rule), while decoupling document outline (h1–h6) from
visual hierarchy so accessibility and design are never in tension.

---

## ADR-007

Date

21 July 2026

Decision

Existing color tokens (`background`, `foreground`, `muted`, `border`,
`card`) are now mirrored into Tailwind's theme as `--color-*` so they're
real utilities (`bg-background`, `text-muted`, ...). One `--accent` color
was added as the single swappable brand value, plus `success` / `warning`
/ `danger` semantic states for future forms/feedback work. Radius, shadow,
and z-index were each turned into small scales rather than single values.

Reason

The tokens already existed in `:root` but weren't wired into Tailwind, so
`page.tsx` had already drifted into hardcoded values like
`text-neutral-500` — exactly what the design system was meant to prevent.
A single accent + semantic states is enough surface area for Phase 2's
Button/Badge/Card work without speculatively building a full color
ramp before anything consumes it.

---

## ADR-008

Date

21 July 2026

Decision

`Section` owns vertical rhythm (`spacing` variant) and optional
background fill; it wraps children in `Container` by default rather
than requiring every page to nest `<Section><Container>` manually.
`PageLayout` owns the top-level `<main>` shell separately from `Section`.

Reason

Keeps the three concerns — page shell, vertical rhythm, horizontal
width — each in exactly one component, so a future Hero/About/Projects
section only writes `<Section spacing="lg">...</Section>` instead of
re-deriving padding and container nesting every time.

---

## ADR-009

Date

21 July 2026

Decision

Focus visibility and reduced-motion support are established globally in
`globals.css` before any interactive component exists, using the
`--ring` token from ADR-007. `useReducedMotion` (in `hooks/`) uses
`useSyncExternalStore` rather than `useState` + `useEffect`.

Reason

Accessibility defaults should exist before the components that need
them, not be retrofitted once Button/Input/Nav are already built —
otherwise every one of them ends up re-declaring its own focus style.
`useSyncExternalStore` is the correct primitive for subscribing to a
browser API that changes outside of React (avoids an effect-driven
`setState` and an SSR/client hydration mismatch); Framer Motion
animations are JS-driven and need this hook directly since they don't
respect the CSS `prefers-reduced-motion` media query on their own.


---

## ADR-010

Date

21 July 2026

Decision

`NavLink` is a separate component from `Button`, not a `Button` variant.
`Navbar` renders desktop nav links directly; mobile collapse is deferred
to `MobileMenu.tsx` as its own task rather than being added inline.

Reason

Nav items need active-route awareness (`usePathname` + `aria-current`)
that a general-purpose button has no reason to carry, and forcing that
logic into `Button` would make it a client component unconditionally.
Keeping mobile nav as a separate task avoids growing this commit into
two unrelated concerns (desktop structure vs. responsive disclosure
pattern) at once.


---

## ADR-011

Date

21 July 2026

Decision

`MobileMenu` closes itself by passing an `onClick` handler down to
`NavLink`, not by watching `usePathname()` in a `useEffect`.

Reason

The route-watching effect calling `setIsOpen(false)` synchronously is
exactly the "cascading render" anti-pattern ESLint's React hooks rules
now catch — the effect exists only to react to a state change the
component itself is about to cause, so it should just do that
directly. `NavLink` gained an optional `onClick` prop instead of
`MobileMenu` needing its own route-tracking logic.


---

## ADR-012

Date

22 July 2026

Decision

All custom global CSS in `app/globals.css` (element resets, focus
styles, reduced-motion) lives inside `@layer base { }`, matching
Tailwind's own layer structure (`theme, base, components, utilities`),
never as bare unlayered rules.

Reason

CSS Cascade Layers give layer order absolute priority over specificity:
any unlayered rule beats every layered rule, no matter how specific the
layered selector is. A bare `a { color: inherit }` in this file was
silently overriding the `text-background` utility class on Button's
`<Link>`, causing invisible white-on-white text on the primary variant.
Tailwind's own preflight already resets `a { color: inherit }` inside
`@layer base` for exactly this reason — our custom CSS needs to live in
the same layer system to compose correctly with it instead of fighting it.
