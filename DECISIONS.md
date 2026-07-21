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
