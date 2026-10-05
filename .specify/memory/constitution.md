<!--
Sync Impact Report
Version change: unratified template → 1.0.0
Modified principles: template placeholders → five project-specific principles
Added sections: Security, Privacy & Content; Development Workflow & Quality Gates
Removed sections: none
Follow-up TODOs: none; constitution reviewed and ratified on 2026-10-05.
-->

# Herb Knowledge Explorer Constitution

## Core Principles

### I. Curated Educational Content
The app MUST present approved reference content for educational browsing only. It MUST NOT
diagnose health challenges or make treatment recommendations. The educational disclaimer MUST
remain visible in the shared app layout on every page. Only content explicitly selected and
approved for publication may be included in the deployed app.

### II. Explicit and Reliable Relationships
The app MUST preserve links among health challenges, actions, and herbs so readers can navigate
from a challenge to an action, to an herb, and to other herbs associated with that action. The
content import process MUST validate required entry types and link targets, and MUST report
unresolved or ambiguous links with their source note and link text. It MUST fail on invalid
required data rather than silently inventing or discarding relationships.

### III. Privacy and Security by Default
The importer MUST read only the designated export of approved Obsidian notes and MUST NOT
connect to or modify the source vault. Content included in a deployment MUST be treated as
public. The project MUST exclude private or unapproved material and secrets from generated
assets and source control. Any rendered note content MUST be handled to prevent executable
markup or scripts from running in the browser.

### IV. Small, Maintainable MVP
Implementation MUST prioritize the read-only browsing flow, repeatable content import, and
static deployment described in the stakeholder documents. New services, databases, accounts,
live vault synchronization, and graph visualization MUST remain out of scope unless a later
approved specification requires them. Code and data contracts MUST be organized so the import
process and user-facing navigation can be tested and maintained independently.

### V. Verified User Experience
Changes MUST be validated at the layer they affect. The separate Playwright test project MUST
cover the core challenge → action → herb → alternative herb path, page navigation, and the
visible disclaimer. The import process MUST be checked against valid and invalid representative
datasets. Builds and relevant tests MUST pass before deployment; failures MUST be reported and
resolved rather than hidden.

## Security, Privacy & Content

- Obsidian is the source of truth; publication uses an explicit, curated export and a documented
  import/build/deploy process.
- Generated app data and static assets are public. The owner MUST review content for accuracy,
  privacy, attribution, and permission to publish before deployment.
- The app MUST display the approved educational disclaimer in the main layout on all pages.
- Health-related content MUST be displayed as reference material and MUST NOT be transformed
  into personalized advice, diagnosis, or treatment instructions.
- The frontend MUST render imported Markdown safely. Raw HTML or other active content MUST NOT
  execute in the browser.

## Development Workflow & Quality Gates

- Each feature MUST have a reviewed specification, implementation plan, and task list that
  reflect the stakeholder documents and this constitution.
- The implementation plan MUST confirm the note metadata/link convention against representative
  source notes before the importer is implemented.
- Import validation, app behavior, and deployment MUST remain reproducible from documented
  commands.
- The web app and its separate Playwright test project MUST be independently runnable and
  configurable for local testing; browser tests SHOULD also support a deployed test/staging URL.
- Pull requests or equivalent change reviews MUST check conformance with this constitution,
  relevant tests, and the public-content constraints above.

## Governance

This constitution governs project specifications, plans, tasks, implementation, and reviews.
When a lower-level artifact conflicts with it, the conflict MUST be resolved in that artifact or
by amending this constitution before implementation proceeds.

Amendments MUST be reviewed, update the version and last-amended date, and explain their impact
in the commit or change description. Versioning follows semantic versioning: increment MAJOR for
backward-incompatible governance changes, MINOR for new or materially expanded principles or
requirements, and PATCH for clarifications or non-semantic wording changes. Reviews MUST verify
that changes meet these principles and that any affected tests, documentation, and data
contracts are updated.

**Version**: 1.0.0 | **Ratified**: 2026-10-05 | **Last Amended**: 2026-10-05
