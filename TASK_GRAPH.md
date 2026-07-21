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

TBD — to be scoped when picked up

Next Task

TBD

Overall Progress

9 / 48 Tasks Complete

---

## Completed: P1-T09 Navigation Primitive

- Built components/navigation/NavLink.tsx: client component that reads
  usePathname() to apply active-route styling. Kept separate from
  Button since nav items need active-state logic a generic button
  variant shouldn't carry.
- Built components/navigation/Navbar.tsx: sticky header with logo and
  desktop nav links (About/Projects/Notes/Contact — routes don't exist
  yet, expected to 404 until built). Desktop-only for now; MobileMenu.tsx
  stays a stub for a dedicated follow-up task.
- Wired Navbar into app/layout.tsx so it renders on every page.
- Fixed app/layout.tsx's <body> to use bg-background/text-foreground
  tokens instead of hardcoded bg-black text-white.
- Verified with tsc --noEmit and eslint (clean).

---

## Completed: P1-T08 Button Component

- Built components/ui/Button.tsx: the site-wide button primitive.
- Variants: primary (inverted fill, default), secondary, outline, ghost,
  destructive — all built from color tokens.
- Sizes: sm, md (default), lg, icon.
- Polymorphic via href: pass href to render a Next.js <Link> with
  identical styling instead of a <button>.
- Wired into app/page.tsx as a live example.
- Verified with tsc --noEmit and eslint (clean).

---

## Completed: P1-T07 Accessibility & Motion Foundations

- Added a global :focus-visible style using the --ring token.
- Added a site-wide prefers-reduced-motion: reduce media query.
- Added hooks/useReducedMotion.ts using useSyncExternalStore.
- Verified with tsc --noEmit and eslint (clean).

---

## Completed: P1-T06 Spacing & Layout System

- Aliased --max-width into Tailwind's container namespace
  (--container-content), so max-w-content is a real utility.
- Rebuilt Container.tsx to use cn() instead of manual template
  string concatenation.
- Built Section.tsx: vertical-rhythm wrapper (spacing + background
  variants, wraps children in Container by default).
- Built PageLayout.tsx: top-level page shell.
- Migrated app/page.tsx to PageLayout + Section.
- Verified with tsc --noEmit and eslint (clean).

---

## Completed: P1-T05 Design Tokens

- Wired existing color tokens into Tailwind theme via --color-*
  (bg-background, text-muted, border-border, etc. now real utilities).
- Added --accent brand color + accent-foreground.
- Added semantic state colors: success, warning, danger.
- Added --ring (defaults to accent) for focus states.
- Added radius scale: radius-sm/md/lg/full.
- Added shadow scale tuned for pure-black surfaces.
- Added z-index scale: sticky, dropdown, overlay, modal, toast, tooltip.
- Verified with tsc --noEmit and eslint (clean).

---

## Completed: P1-T04 Typography System

- Added type scale to globals.css (Tailwind v4 @theme): display, h1-h6,
  body-lg/base/sm, caption — each with matched line-height/letter-spacing.
- Registered --font-sans/--font-mono theme tokens.
- Built Heading component: semantic tag decoupled from visual size.
- Built Text component: body/caption copy with size, tone, weight variants.
- Added lib/utils/cn.ts (clsx + tailwind-merge).
- Migrated app/page.tsx to use Heading/Text.
- Verified with tsc --noEmit and eslint (clean).

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

9 / 12

Status

In Progress

Phase 2

Waiting

Phase 3

Waiting

...
