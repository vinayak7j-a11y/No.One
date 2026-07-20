# Architecture

## Philosophy

The architecture should remain simple, scalable, and production-ready.

Prefer clarity over cleverness.

---

## Core Principles

- Reusable components
- Feature-oriented organization
- Strong TypeScript usage
- Accessibility by default
- Performance-first development
- Minimal dependencies
- Consistent naming

---

## Folder Structure

app/
components/
config/
content/
data/
docs/
hooks/
lib/
providers/
services/
styles/
tests/
types/

Each folder has a single responsibility.

---

## Component Hierarchy

UI Components

↓

Layout Components

↓

Section Components

↓

Pages

Keep dependencies flowing downward.

Pages compose sections.

Sections compose layouts.

Layouts compose UI components.

---

## Import Strategy

Always prefer absolute imports.

Example:

@/components/ui/Button

Avoid long relative imports.

---

## File Naming

Components → PascalCase

Hooks → useSomething

Utilities → camelCase

Types → lowercase

Constants → lowercase

---

## General Rules

Keep components small.

Avoid duplicated logic.

Extract reusable code early.

Prefer composition over inheritance.

Write code that is easy to remove, replace, or extend.