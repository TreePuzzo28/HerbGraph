# Implementation Plan: Herb Knowledge Navigation

**Branch**: `001-herb-knowledge-navigation` | **Date**: 2026-10-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-herb-knowledge-navigation/spec.md`

## Summary

Deliver a read-only static web app for browsing health challenges, herbal actions, and herbs in
all directions. A small Node.js content-preparation tool will read only curated, approved
Markdown exports, validate frontmatter and Obsidian links, and generate a minimized JSON
catalog. The React app will display that catalog, while a separate Playwright project verifies
the browsing flow and disclaimer. Use GitHub Pages for the initial static deployment because
the project is already hosted on GitHub; keep hosting-specific details isolated so another
static host can be selected later.

The representative vault notes use YAML frontmatter with `type`, `actions`,
`health_challenges`, and optional `aliases`; link targets use Obsidian wikilinks. Challenge
and herb notes declare relationships, while action notes do not consistently list inverse
relationships. The importer will resolve declared links and derive the inverse relationship
lists for browsing. It will not publish Markdown bodies or infer any relationship from prose.

## Technical Context

**Language/Version**: TypeScript; Node.js 22 LTS or newer supported LTS

**Primary Dependencies**: React, Vite, React Router, gray-matter with a YAML 1.2 parser for
frontmatter, Zod for input validation; Playwright in the separate end-to-end test project

**Storage**: Generated static JSON bundled with the app; no database or server-side storage

**Testing**: TypeScript unit tests for import/validation and relationships; separate Playwright
project for browser acceptance flows

**Target Platform**: GitHub Pages static hosting and current desktop/mobile browsers; Vite's
base path is configured for the repository subpath

**Project Type**: Static web application plus content preparation CLI and separate browser-test
project

**Performance Goals**: Main browse and detail views render within 2 seconds on a typical
broadband connection for the initial curated catalog; navigation between already loaded entries
does not require a network request

**Constraints**: Only approved entries and whitelisted metadata may enter generated assets.
Markdown bodies and raw HTML are not rendered. Import errors for malformed metadata, missing,
wrong-type, or ambiguous targets must block generation. Only the documented wikilink subset is
supported. No live vault access, backend, database, account system, or interactive graph in the
MVP.

**Scale/Scope**: Three entry types, a curated initial catalog, browse and detail views, a
repeatable local import/build/deploy workflow, and one complete automated Playwright project.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Curated educational content**: PASS. The app displays approved catalog fields only and
  provides the disclaimer in the shared layout.
- **Explicit and reliable relationships**: PASS. The import tool validates links and derives
  inverse navigation from declared relationships; unresolved or ambiguous links block output.
- **Privacy and security by default**: PASS. Import input is an explicit approved export; raw
  note bodies are excluded from output; the app renders only escaped plain text.
- **Small, maintainable MVP**: PASS. Static React app and a small local CLI; no database,
  backend, live vault integration, or graph.
- **Verified user experience**: PASS. Import validation and separate Playwright tests cover
  relationships, navigation, and the disclaimer before deployment.

No constitution violations or complexity exceptions are required.

## Project Structure

### Documentation (this feature)

```text
specs/001-herb-knowledge-navigation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── content-import.md
└── tasks.md
```

### Source Code (repository root)

```text
content/
└── approved/                 # Minimal, explicitly approved Markdown export files

scripts/
└── import-content.ts         # Validate curated records and emit public JSON

public/
└── data/
    └── catalog.json          # Generated, publishable catalog; never edit by hand

src/
├── app/                      # Router and shared layout, including disclaimer
├── components/               # Entry links, lists, and shared UI
├── data/                     # Catalog loading and relationship selectors
├── pages/                    # Browse and entry detail views
└── types/                    # Runtime and static catalog types

tests/
├── unit/                     # Importer and relationship validation tests
└── e2e/                      # Separate Playwright project with its own package manifest
```

**Structure Decision**: Use one Vite app and one small import CLI in the repository, with
Playwright in a distinct `tests/e2e` project. `content/approved` contains only deliberately
curated export records, not full vault notes. Generated catalog data contains a whitelist of
displayable fields. Keep app presentation, catalog access, and import validation in distinct
modules to support later optional fields such as herb images without expanding MVP scope.
Use React Router hash-based URLs for reliable static deep links and configure Vite's `base`
for the GitHub Pages repository path. The separate Playwright project starts the app through
its `webServer` configuration and tests a production preview build for release validation.

## Complexity Tracking

No constitution violations.
