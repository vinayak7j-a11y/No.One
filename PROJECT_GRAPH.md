# PROJECT_GRAPH.md

> Product Bible for **No.One**
>
> This document defines the product vision, architecture, principles, roadmap, and long-term direction of No.One.
>
> It is the highest-level source of truth for the project.
>
> This document changes infrequently.
>
> Engineering implementation lives inside `TASK_GRAPH.md`.

---

# Project Information

| Field | Value |
|-------|-------|
| Product | No.One |
| Type | Personal Digital Headquarters |
| Version | v0.1.0 |
| Status | In Development |
| Owner | Vinayak Joshi |
| Repository | No.One |
| Primary Platform | Web |
| Initial Release | MVP |
| Long-Term Vision | Personal Operating System |

---

# Vision

Build the most complete representation of a builder on the internet.

No.One is not intended to be a traditional portfolio.

It is a living digital headquarters that evolves alongside its creator.

Every project, startup, experiment, lesson, article, journey, achievement, failure, and idea should eventually become discoverable through No.One.

The website should continue growing for years without requiring architectural rewrites.

---

# Mission

Create a platform that enables people to understand:

- who I am
- what I build
- how I think
- how I solve problems
- what I believe
- what I am currently building
- where I am going

without needing multiple websites or social platforms.

---

# North Star

A visitor should leave No.One with a complete understanding of my work, personality, thinking process, technical capabilities, and long-term vision.

The website should become the single source of truth for my digital identity.

---

# Product Principles

Every feature must support at least one of these principles.

## 1. Clarity

Information should be understandable within seconds.

Never sacrifice clarity for visual effects.

---

## 2. Authenticity

Everything should represent real work.

No fake metrics.

No fake testimonials.

No inflated achievements.

---

## 3. Timelessness

Avoid trendy design patterns that quickly become outdated.

Design for longevity.

---

## 4. Speed

Performance is a feature.

Every interaction should feel immediate.

---

## 5. Accessibility

The website should be usable by everyone.

Keyboard navigation.

Screen readers.

Reduced motion.

Proper semantic HTML.

---

## 6. Scalability

Every system should be extendable.

Adding a new startup should never require rewriting previous pages.

Adding new content should be data-driven.

---

## 7. Modularity

Every page should be assembled from reusable components.

No duplicated layouts.

No duplicated styling.

---

## 8. Documentation

Every important engineering decision must be documented.

---

# Product Philosophy

No.One is designed around one central idea.

> "Your website should become your digital headquarters—not your digital business card."

Traditional portfolios answer:

"What have you built?"

No.One answers:

"Who are you becoming?"

This changes every design decision.

Instead of showcasing finished work only, the platform documents:

- current work
- experiments
- learning
- failures
- ideas
- research
- roadmap
- future ambitions

The product grows continuously.

---

# Problem Statement

Most personal websites become outdated because they are static.

Problems include:

- Portfolio becomes stale.
- Resume becomes outdated.
- Blog becomes abandoned.
- Projects become disconnected.
- Social media fragments identity.

No.One solves this by acting as a continuously evolving operating system rather than a collection of independent pages.

---

# Target Users

Primary

- Recruiters
- Founders
- Investors
- Engineers
- Designers
- Potential collaborators

Secondary

- Students
- Friends
- Community
- Future employers
- Future teammates

---

# User Personas

## Recruiter

Goal

Evaluate technical ability quickly.

Needs

- Projects
- Skills
- Resume
- Experience

---

## Founder

Goal

Evaluate thinking.

Needs

- Ideas
- Systems
- Vision
- Product quality

---

## Investor

Goal

Understand long-term ambition.

Needs

- Vision
- Execution quality
- Consistency

---

## Builder

Goal

Learn.

Needs

- Notes
- Experiments
- Technical writeups
- Architecture

---

# User Journey

Landing

↓

Understand identity

↓

Explore projects

↓

Read builder notes

↓

Understand journey

↓

Connect

---

# Product Ecosystem

No.One eventually becomes the center connecting:

- GitHub
- LinkedIn
- X
- YouTube
- Medium / Notes
- Startups
- Experiments
- Speaking
- Open Source
- Resume
- Contact

Everything links back to No.One.

---

# Information Architecture

Home

About

Projects

Startups

Builder Notes

Journey

Speaking (Future)

Resources (Future)

Search

Contact

Each section must remain independent while sharing a common design system.

---

# Feature Architecture

Core Layer

- Routing
- Layout
- Navigation
- Footer
- Theme
- SEO

Content Layer

- Projects
- Notes
- Startups
- Journey

Experience Layer

- Search
- Animations
- Command Palette
- Reading Experience

Growth Layer

- Analytics
- Newsletter
- RSS
- CMS

---

# Engineering Principles

Build systems before features.

Prefer composition over duplication.

Server Components by default.

Client Components only when necessary.

Accessibility is mandatory.

Performance is measurable.

Every feature must be testable.

Every page must be reusable.

Every component must have one responsibility.

---

# Technology Stack

Framework

- Next.js

Language

- TypeScript

Styling

- Tailwind CSS

Deployment

- Vercel

Content

- MDX (planned)

Analytics

- Plausible / Vercel Analytics (planned)

Version Control

- Git

Package Manager

- npm

---

**End of Part 1**

Next section begins with:

# Product Modules 
---

# Product Modules

Every feature inside No.One belongs to one of the following modules.

Modules are designed to be independent, reusable, and scalable.

---

## Module 1 — Foundation

Purpose

Provides the infrastructure required for every page.

Contains

- Application Shell
- Layout
- Metadata
- Routing
- Theme
- Fonts
- Global Styles
- Providers
- Error Handling
- Loading States

Dependencies

None

Priority

Critical

---

## Module 2 — Design System

Purpose

Maintain visual consistency across the product.

Contains

- Typography
- Color Tokens
- Buttons
- Inputs
- Cards
- Badges
- Tags
- Containers
- Grid
- Sections
- Icons
- Animations

Dependencies

Foundation

Priority

Critical

---

## Module 3 — Navigation

Purpose

Allow visitors to move effortlessly across the website.

Contains

- Navbar
- Mobile Navigation
- Footer
- Breadcrumbs
- Active Route Detection
- Command Menu
- Search Entry Point

Dependencies

Foundation

Priority

Critical

---

## Module 4 — Home

Purpose

Introduce the creator and provide entry points into every important area.

Contains

- Hero
- Introduction
- Featured Projects
- Current Focus
- Selected Startups
- Builder Notes Preview
- CTA

Dependencies

Navigation
Design System

Priority

High

---

## Module 5 — About

Purpose

Provide depth beyond a traditional biography.

Contains

- Story
- Timeline
- Values
- Skills
- Principles
- Interests
- Experience
- Philosophy

Dependencies

Design System

Priority

High

---

## Module 6 — Projects

Purpose

Showcase technical execution.

Contains

- Project Cards
- Project Detail Pages
- Tech Stack
- Architecture
- Screenshots
- Learnings
- GitHub Links
- Live Demo

Dependencies

Content System

Priority

High

---

## Module 7 — Startups

Purpose

Document products, businesses and ventures.

Contains

- Startup Pages
- Vision
- Progress
- Timeline
- Lessons
- Roadmaps

Dependencies

Content System

Priority

High

---

## Module 8 — Builder Notes

Purpose

Public knowledge base.

Contains

- Articles
- Research
- Experiments
- Engineering Notes
- Startup Thoughts
- AI Notes

Dependencies

MDX

Priority

High

---

## Module 9 — Journey

Purpose

Document growth over years.

Contains

- Timeline
- Milestones
- Wins
- Failures
- Lessons

Dependencies

Content System

Priority

Medium

---

## Module 10 — Search

Purpose

Allow users to discover everything instantly.

Contains

- Global Search
- Command Palette
- Keyboard Navigation
- Filters
- Results

Dependencies

Content Index

Priority

Medium

---

## Module 11 — Contact

Purpose

Provide communication channels.

Contains

- Contact Form
- Social Links
- Resume
- Availability

Priority

Medium

---

# Development Phases

The project will be built incrementally.

Each phase unlocks the next.

---

## Phase 1

Foundation

Goal

Production-ready infrastructure.

Deliverables

- App Structure
- Providers
- Theme
- Metadata
- Fonts
- Utilities
- Global Styling

Exit Criteria

Stable architecture.

---

## Phase 2

Design System

Goal

Create reusable UI components.

Deliverables

- Typography
- Buttons
- Cards
- Inputs
- Layout Components
- Animation Utilities

Exit Criteria

Every page can be assembled from reusable components.

---

## Phase 3

Application Shell

Goal

Global user experience.

Deliverables

- Navbar
- Footer
- Mobile Navigation
- Theme Toggle
- Breadcrumbs

Exit Criteria

Entire application is navigable.

---

## Phase 4

Core Pages

Goal

Ship MVP.

Deliverables

- Home
- About
- Projects
- Contact

Exit Criteria

Website publicly usable.

---

## Phase 5

Content Platform

Goal

Enable long-term publishing.

Deliverables

- Builder Notes
- Journey
- Startups
- MDX

Exit Criteria

Website becomes self-updating.

---

## Phase 6

Experience

Goal

Delight users.

Deliverables

- Search
- Command Palette
- Animations
- Reading Experience
- Shortcuts

Exit Criteria

Premium UX.

---

## Phase 7

Optimization

Goal

Production quality.

Deliverables

- Performance
- Accessibility
- SEO
- Analytics
- Security

Exit Criteria

Launch Ready.

---

# Feature Dependency Graph

Foundation
↓

Design System
↓

Application Shell
↓

Pages
↓

Content Platform
↓

Search
↓

Optimization
↓

Launch

No feature may skip its dependency.

---

# Scalability Strategy

Every system must be built assuming the project will be ten times larger.

Examples

Instead of

One project page

Build

Project Template

Instead of

One startup page

Build

Startup Template

Instead of

Static notes

Build

Content Engine

Instead of

Hardcoded navigation

Build

Navigation Configuration

Data drives UI.

Never the opposite.

---

# Performance Goals

Lighthouse

Performance

95+

Accessibility

100

SEO

100

Best Practices

100

Core Web Vitals

Pass

JavaScript

Minimal

Images

Optimized

Fonts

Self-hosted

Animations

GPU Accelerated

---

# Accessibility Standards

Every feature must support

- Keyboard navigation
- Screen readers
- Focus states
- Semantic HTML
- Color contrast
- Reduced Motion
- ARIA labels where required

Accessibility is never optional.

---

# Security Principles

Never expose secrets.

Validate every input.

Sanitize user content.

Escape rendered markdown.

Secure headers.

HTTPS only.

Rate limiting for APIs.

Principle of least privilege.

---

# SEO Strategy

Every page should include

- Metadata
- Open Graph
- Twitter Cards
- Canonical URLs
- Structured Data
- XML Sitemap
- Robots.txt

Every article should generate rich previews automatically.

---

# Content Strategy

Content is organized into four categories.

Projects

Things built.

Notes

Things learned.

Startups

Things created.

Journey

Things experienced.

Every new piece of content belongs to one category.

---

# Release Strategy

Internal Development

↓

Private Testing

↓

Personal Review

↓

Performance Audit

↓

Accessibility Audit

↓

Production Deployment

↓

Iteration

Quality comes before speed.

---

# Success Metrics

Technical

- Lighthouse >95
- Zero runtime errors
- Zero duplicated UI

Product

- Easy navigation
- Fast discovery
- Clear storytelling

Personal

- Represents current work
- Easy to update
- Useful for recruiters, founders and collaborators

---

**End of Part 2**

Next section begins with:

# Long-Term Vision 
---

# Long-Term Roadmap

The roadmap is intentionally ambitious. Features are added only when they align with the product vision and maintain architectural consistency.

---

## Version 0.1 — Foundation

Status

In Progress

Goals

- Production-ready architecture
- Design system
- Navigation
- Core pages
- Responsive layouts

Success Criteria

The website is publicly usable and easy to extend.

---

## Version 0.5 — Content Platform

Goals

- Builder Notes
- MDX Support
- Project Templates
- Startup Templates
- Journey Timeline

Success Criteria

New content can be published without modifying application code.

---

## Version 1.0 — Digital Headquarters

Goals

- Search
- Command Palette
- Reading Experience
- RSS
- Newsletter
- Analytics
- SEO Optimization

Success Criteria

Every major section of the Digital HQ is complete.

---

## Version 2.0 — Personal Operating System

Possible Features

- AI Search
- AI Assistant
- Public API
- Interactive Timeline
- Knowledge Graph
- Reading Lists
- Bookmarks
- Personal Dashboard
- Dynamic Resume
- Speaking Archive

These features are intentionally deferred until the platform is mature.

---

# Future Vision

No.One should evolve beyond a portfolio into a personal operating system.

Eventually it should become the central hub connecting:

- Projects
- Startups
- Research
- Builder Notes
- Speaking
- Videos
- GitHub
- LinkedIn
- X
- Open Source
- Future Products

Every new platform should link back to No.One.

The website should never become outdated because it is designed as a living system.

---

# Product Constraints

The following constraints are intentional and should not be violated without strong justification.

## Design

- Dark-first
- Minimal
- High readability
- Timeless visual language
- Limited accent colors
- Consistent spacing
- Motion with purpose

---

## Engineering

- TypeScript only
- Server Components by default
- Client Components only when required
- Reusable components
- No duplicated logic
- No duplicated styling
- Strong typing
- Data-driven UI
- Configuration over hardcoding

---

## Performance

- Lighthouse ≥ 95
- Fast page loads
- Lazy loading where appropriate
- Image optimization
- Font optimization
- Minimal JavaScript
- Progressive enhancement

---

## Content

Every piece of content must belong to a defined content type.

Projects

Builder Notes

Journey

Startups

Resources

Future content types should extend—not replace—the existing structure.

---

# Risks

Potential long-term risks and mitigation strategies.

| Risk | Mitigation |
|-------|------------|
| Scope Creep | Follow PROJECT_GRAPH and TASK_GRAPH strictly |
| Duplicate Components | Build reusable systems first |
| Performance Regression | Continuous Lighthouse audits |
| Design Inconsistency | Strict Design System |
| Documentation Drift | Update docs after every completed task |
| Content Sprawl | Structured content architecture |
| Technical Debt | Refactor immediately instead of postponing |

---

# Definition of Done

A task is considered complete only if ALL of the following conditions are satisfied.

## Engineering

- Feature implemented
- Type-safe
- No lint errors
- No TypeScript errors
- No duplicated logic
- No unused code
- Responsive

---

## UI

- Matches design system
- Accessible
- Keyboard friendly
- Mobile optimized
- Tablet optimized
- Desktop optimized

---

## Performance

- No unnecessary renders
- Optimized images
- No layout shift
- No console warnings
- Fast interactions

---

## Documentation

- TASK_GRAPH updated
- CHANGELOG updated (if required)
- DECISIONS updated (if architecture changed)

---

## Git

- Clean commit
- Meaningful commit message
- Pushed to repository

Only then can a task move from **In Progress** to **Completed**.

---

# Quality Checklist

Before merging any feature, verify:

## Code

- [ ] Builds successfully
- [ ] Lints successfully
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] No dead code

---

## UI

- [ ] Responsive
- [ ] Accessible
- [ ] Pixel consistent
- [ ] Matches design tokens

---

## Performance

- [ ] Images optimized
- [ ] Fonts optimized
- [ ] Lighthouse ≥ 95
- [ ] Core Web Vitals pass

---

## Documentation

- [ ] TASK_GRAPH updated
- [ ] CHANGELOG updated
- [ ] ADR added if necessary

---

## Git

- [ ] Feature committed
- [ ] Commit follows convention
- [ ] Repository pushed

---

# Documentation Standards

The repository documentation follows a hierarchy.

README.md

Repository overview.

Updated occasionally.

---

PROJECT_GRAPH.md

Product vision and long-term architecture.

Changes rarely.

---

TASK_GRAPH.md

Engineering execution plan.

Updated after every completed task.

---

DECISIONS.md

Architecture Decision Records (ADRs).

Updated whenever a major technical decision is made.

---

CHANGELOG.md

Version history.

Updated for releases and significant milestones.

---

ARCHITECTURE.md

Detailed explanation of application architecture.

---

DESIGN_SYSTEM.md

Design tokens, components, spacing, typography, colors, and interaction rules.

---

CONTRIBUTING.md

Development workflow and contribution guidelines.

---

# Versioning Strategy

The project follows Semantic Versioning.

Format

MAJOR.MINOR.PATCH

Example

0.1.0

Initial Foundation

0.2.0

Design System

0.3.0

Application Shell

0.4.0

Core Pages

0.5.0

Content Platform

1.0.0

Public Launch

Major versions represent significant product evolution rather than arbitrary milestones.

---

# Git Commit Convention

Every commit follows Conventional Commits.

Examples

feat: add global navigation

feat(projects): build project cards

fix(search): resolve keyboard navigation issue

docs: update PROJECT_GRAPH

refactor(layout): simplify container system

style: improve typography spacing

perf(images): optimize hero assets

test: add navigation tests

chore: update dependencies

---

# Repository Standards

Repository organization must remain predictable.

Rules

- One responsibility per folder.
- One responsibility per component.
- Configuration belongs in `config/`.
- Static content belongs in `content/`.
- Shared logic belongs in `lib/`.
- External integrations belong in `services/`.
- Types belong in `types/`.
- Providers belong in `providers/`.
- Documentation belongs in `/docs` unless it is a root-level governance document.

Never introduce a new folder without a clear architectural reason.

---

# Guiding Principle

> Build a system that can grow for years without requiring architectural rewrites.

Every decision should make the project easier to maintain, easier to extend, and easier to understand.

No.One is not a portfolio.

It is a living Digital Headquarters.

---

**End of PROJECT_GRAPH.md**