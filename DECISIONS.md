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


---

## ADR-013

Date

22 July 2026

Decision

`Card` rests on `border-border` + `bg-card` rather than a `box-shadow`
by default; elevation via `shadow-*` is opt-in per instance, not built
into the component.

Reason

On a pure-black (`#000`) background, a standard shadow is close to
invisible at rest (same reasoning as ADR-007's shadow-scale design) —
a visible border is the more reliable default signal that something is
a distinct surface. Cards that genuinely need to appear "lifted" (e.g.
a hovering dropdown-like card) can still add `shadow-md`/`shadow-lg`
directly since those tokens already exist.

---

## ADR-014

Date

22 July 2026

Decision

`<body>` in `app/layout.tsx` owns `flex min-h-screen flex-col`, not
`PageLayout`. `PageLayout` was changed from `min-h-screen` to `flex-1`.

Reason

Adding `Footer` as a sibling after `{children}` exposed a bug:
`PageLayout`'s own `min-h-screen` doesn't know Navbar/Footer exist, so
on a short page the total stack (Navbar + a full extra viewport from
PageLayout + Footer) would exceed one viewport height, causing
unwanted scroll and pushing Footer below the fold. The standard
sticky-footer fix is for the outermost flex container spanning
Navbar/main/Footer to own the `min-h-screen`, with the middle section
taking `flex-1` to absorb exactly the remaining space — so that's now
`<body>`'s job, not `PageLayout`'s.

## ADR-015

Date

FILL IN DATE

Decision

cn()'s extendTailwindMerge config now declares an explicit font-size
class group listing all ten custom typography classes (text-display,
text-h1 through text-caption).

Reason

twMerge has no awareness of classes defined via Tailwind v4's
@theme inline unless told about them. Its stock font-size group only
recognizes standard values like text-sm/text-lg, so it failed to
classify text-body as a font-size utility; its looser color-group
matching then classified text-body into the same conflict group as
text-background. Since cva applies the size variant after the
variant variant, twMerge's last-wins resolution silently dropped
text-background, causing Button's primary variant to render
invisible white-on-white text whenever paired with a size variant.
This is a distinct bug from ADR-012's cascade-layer issue, found
later during Contact page work. Fix is sitewide since cn() backs
every components/ui primitive.

## ADR-016

Date

FILL IN DATE

Decision

Shadow tokens moved from being hardcoded directly in @theme inline
to custom properties in :root/.light using the same naming prefix
as the color tokens, referenced via var(), matching the existing
color-token indirection pattern.

Reason

Found while building the theme toggle: a class-based theme swap has
no effect on values baked directly into @theme inline, which would
have silently left dark-tuned shadows active in light mode.
Accent/success/warning/danger/ring were deliberately left unchanged
across themes since they already read fine as self-contained
fill/foreground pairs on both backgrounds.

## ADR-017

Date

FILL IN DATE

Decision

Use next-themes for light/dark switching rather than a hand-rolled
implementation.

Reason

Avoids flash-of-wrong-theme on load, which is easy to get wrong by
hand. attribute="class", defaultTheme="system", enableSystem respects
OS preference by default.

## ADR-018

Date

FILL IN DATE

Decision

Notes MDX typography is a hand-rolled .prose-notes class in
globals.css, built from the site's own design tokens, not
@tailwindcss/typography's prose/prose-invert classes.

Reason

@tailwindcss/typography ships its own hardcoded gray scale, which
would introduce a second, inconsistent color system alongside the
existing :root/.light token system.

## ADR-019

Date

FILL IN DATE

Decision

Notes content layer uses next-mdx-remote/rsc plus gray-matter plus a
simple filesystem read of content/notes/*.mdx, rather than a
build-time content plugin such as Contentlayer or Velite.

Reason

Judged sufficient at current scale, content/notes/ is currently
empty. Revisit if content volume ever demands better incremental
build performance.

## ADR-020

Date

FILL IN DATE

Decision

Added scroll and swipe driven page transitions across all routes via
a new PageTransition wrapper in the root layout. Navigating past the
top or bottom edge of any page triggers a spring animated route
change in nav order, with a brief centered label naming the
destination page and a dot rail indicating position in the sequence.
Existing instant navigation, navbar links and the search palette,
was kept fully intact alongside this, PageTransition only adds a
new trigger path, it does not replace router.push based navigation.

Reason

Chose sequential AnimatePresence, mode wait, rather than true
overlapping page transitions, which would require locking every
route to a fixed viewport height so two pages could be positioned
absolutely and stacked during the transition. That would have broken
native scroll on long form Notes articles, the one part of the site
built specifically for reading. The sequential approach keeps every
page's natural, organic scroll height intact at the cost of a small
gap between one page's exit finishing and the next page's entrance
starting, judged an acceptable trade for not compromising Notes.
Respects the existing useReducedMotion hook, falling back to an
instant swap with no animation when that is set.

## ADR-021

Date

FILL IN DATE

Decision

Split the former single Contact page into two, Connect at /connect for
public platforms, currently Instagram, LinkedIn, GitHub, and Contact
at /contact for direct personal reach, email, and eventually WhatsApp
and a personal Instagram distinct from the public one. NAV_ITEMS in
config/site.ts updated to include both, which also updates
PAGE_ORDER for the scroll and swipe page transitions automatically
since both read from the same source.

Reason

The original single Contact page conflated two different visitor
intents, seeing public work and content versus actually reaching the
person directly, with no way to tell which channel served which
purpose. Splitting them makes that distinction explicit rather than
leaving a visitor to guess from an undifferentiated list of four
unlabeled channels.

## ADR-022

Date

FILL IN DATE

Decision

Every page's content, About, Projects, Notes, Connect, Contact, now
wraps its heading, intro paragraph, and list in a single div with
mx-auto max-w-3xl, rather than leaving heading and paragraph with
their own independent max-w classes and no centering of their own.

Reason

Content appeared pinned to the left edge on wide viewports despite
Container itself being correctly centered. Root cause was that block
elements with only a max-width class and no margin auto sit flush
against whatever edge their parent starts at, they do not center
themselves. Wrapping the whole content group in one centered column
makes heading, paragraph, and list share the same edges and move as
one visually coherent block instead of independently.

## ADR-023

Date

FILL IN DATE

Decision

Added data-scroll-behavior="smooth" to the html element in
app/layout.tsx. Also made PageTransition's wheel and touch handlers
bail out early when document.body.style.overflow is "hidden".

Reason

Next.js was logging a warning on every route change about
scroll-behavior: smooth conflicting with its own scroll restoration
during transitions, the documented fix is this one attribute.
Separately, MobileMenu and SearchPalette both lock body scroll via
that same style property while open, but PageTransition's scroll and
swipe listeners never checked for it, so scrolling over either open
overlay could trigger a page navigation underneath it. Reusing the
existing lock flag closes that gap without new state or plumbing.

## ADR-024

Date

FILL IN DATE

Decision

Three fixes from a manual audit pass. NavLink now treats a nested
route as active for its parent nav item, so reading /notes/some-slug
still highlights Notes, not just an exact pathname match. Button's
native button branch now defaults to type="button" rather than
leaving type unset. The Notes detail page,
app/notes/[slug]/page.tsx, was migrated onto the same
PageLayout/Section/Container chain every other page now uses, it had
previously kept its own raw main markup with a different max-width
and no responsive padding scale.

Reason

NavLink's exact match left the nav looking unhighlighted while deep
in Notes content, a real navigation clarity gap. An unset button type
defaults to submit inside a form per the HTML spec, nothing broke yet
since current usages either sit outside forms or already set
type explicitly, but it was a real latent bug waiting for the next
form a Button gets added to. The Notes detail page migration was
purely for consistency, content/notes is still empty so there was
nothing to visually verify yet, worth revisiting once a real note
exists.

## ADR-025

Date

FILL IN DATE

Decision

Added an optional github field to Venture.content alongside the
existing link and instagram fields, rendered in VentureRow as a
third "Code" link next to "Live" and "Instagram" when present.

Reason

Ventures with a shipped live product or public repo had no way to
actually link to either from the Projects page. All three fields
stay optional and only render when filled in, consistent with the
existing no-fabrication rule, none of the current five ventures have
real URLs yet.

## ADR-026

Date

FILL IN DATE

Decision

Defined the Law of Relation in LANGUAGE.md, a connection between two
artifacts is a fact about both of them, discoverable from either end,
revealed under the same attention mechanics as the other artifacts,
rendered at secondary visual weight, and never implying rank between
the connected sides. Confirmed the Sequential, Evidentiary,
Influential, and Collaborative family grouping for RelationType as
intended. LANGUAGE.md's two remaining open items are resolved.

Reason

This was the last gap in the five laws, flagged as the top
documentation risk across three prior handoffs and left unresolved
twice. Closing it now means Startups and Journey, Phase 5 work that
will actually create cross artifact relations, has a defined law to
build against rather than inventing one under deadline pressure.

## ADR-027

Date

FILL IN DATE

Decision

Populated real live URLs for Keepl, MessPass, Bond, and No.One
itself, marked all four active with a Live status label. Removed
LevelUp from ventures entirely. Added No.One as a new venture entry,
including its own GitHub repo link alongside its live URL.

Reason

These were the first real link and github field values entered since
those fields were added earlier, previously every venture left them
empty rather than fabricated. LevelUp was removed at the person's
request rather than left stale. No.One being listed as one of its own
ventures is intentional, the site documents itself as one of the
things being built, consistent with the project's own stated identity
as a living record rather than a finished portfolio.

## ADR-028

Date

FILL IN DATE

Decision

Clicking or tapping a venture's name now redirects straight to its
live URL when one exists, opened in a new tab. Hover and keyboard
focus still reveal the description independently of this, unchanged.
Ventures without a link, currently Rent It, keep the original click
to pin the description open.

Reason

Previously the live and code links only appeared inside the revealed
description, requiring a hover or tap first before a second click
could actually reach the destination. For ventures with a real
shipped product, that extra step added friction for no benefit,
direct navigation on click is the expected behavior once a venture
has somewhere real to send someone.
