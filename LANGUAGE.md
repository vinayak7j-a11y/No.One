# LANGUAGE.md

The physics, grammar, and anatomy underlying No.One's interaction
design. Written after the fact from what was actually built (Ventures,
Contact) and the reasoning logged in TASK_GRAPH.md, not invented ahead
of use.

Two sections below are marked OPEN rather than filled in. Guessing at
them would mean inventing design principles that were never actually
decided, which is exactly the kind of fabrication this project's own
rules (see data/ventures.ts's comments) exist to prevent.

## The standing rejection test

If an interaction could be dropped unchanged into a SaaS landing page,
agency website, or portfolio template, it is probably not the right
interaction for No.One. This test rejected two real attempts (Ventures
V1 and V2, see TASK_GRAPH.md P2-T05) before V4 passed it, and shaped
Contact's collapsed-by-default message form.

## The five laws

### Law of Rest

Artifacts default to an undecorated, equal-weight idle state. No
badge, status tag, or visual emphasis is visible until something
specifically earns attention. Applied to Ventures (names alone, no
status visible at rest) and to Contact's message form (collapsed
behind a "write directly" toggle rather than always open).

### Law of Attention

Reveal is driven by intent, not by input device. Hover, keyboard
focus, and tap-to-pin all drive the identical active state, so no
single input method gets richer behavior than another. Implemented in
VentureRow.tsx and ContactChannel.tsx as three independent state
flags (hovered, focused, pinned) rather than one merged flag, a
fix that closed a real bug where merged state got stuck active after
a touch tap since focus does not clear itself on a second tap.

### Law of Return

Losing attention collapses an artifact back to rest. There is no
explicit close affordance. Attention is the only thing that opens or
closes a reveal.

### Law of Non-Ranking

No artifact is presented as more important than another by default.
All five ventures render at identical visual weight; a small
deterministic pixel stagger exists purely to break a rigid list read
and is explicitly not a ranking signal, see the stagger prop comment
in VentureRow.tsx.

### Law of Relation

OPEN. Not defined in TASK_GRAPH.md's prose or in code comments. The
RelationType vocabulary below exists in the data layer, but the law
governing how relations should actually surface or behave visually
has not been written down anywhere retrievable. Needs to be defined,
ideally before Startups/Journey Phase 5 work starts creating cross
artifact relations for real.

## Four part artifact anatomy

Every artifact, a Venture today, future Notes/Startups/Journey
entries later, is shaped as three data fields, not four, because
behavior is shared physics rather than per-artifact data:

- identity: name, stage, status label
- content: description, optional link
- relations: optional array of typed connections to other artifacts

Behavior, how an artifact responds to attention, is not a field on
the artifact at all. It lives once, in the interaction component
VentureRow.tsx, and applies uniformly to every artifact of that
type. This is why the interface has no behavior key even though the
concept is called a four part anatomy in earlier discussion, the
fourth part is physics shared across all instances, not data
duplicated onto each one.

## Relationship vocabulary

Defined as RelationType in data/ventures.ts, currently unused,
every venture's relations array is empty because no real
connections between ventures have been confirmed yet:

led_to
expanded_into
continues_as
documents
references
inspired_by
influenced_by
built_with

### Proposed families, NOT confirmed, needs your sign off

The type comment says these are organized into families, but the
code does not label which type belongs to which family, and no other
source does either. The grouping below is inferred from what the
names plainly suggest, not sourced from anywhere. Please confirm or
correct before treating this as settled:

Sequential, time ordered progression: led_to, expanded_into,
continues_as

Evidentiary, one artifact substantiates another: documents,
references

Influential, idea lineage without direct causation: inspired_by,
influenced_by

Collaborative, shared construction: built_with

## Open items

1. Define the Law of Relation.
2. Confirm or correct the family grouping above.
3. Once both are settled, populate real relations entries on actual
   ventures, no invented connections until then.
