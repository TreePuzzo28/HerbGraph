# Tasks: Herb Knowledge Navigation

**Input**: Design documents from `specs/001-herb-knowledge-navigation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Include importer unit tests and separate Playwright acceptance tests as required by
the specification and constitution. Write tests before the corresponding implementation.

**Organization**: Tasks are grouped by user story. The shared project and catalog foundation
must be complete before story work starts.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the app and the separate browser-test project.

- [X] T001 Initialize the React, TypeScript, Vite app and root scripts/dependencies in `package.json`, `package-lock.json`, `index.html`, `src/main.tsx`, and `src/vite-env.d.ts`; include React Router, gray-matter, yaml, Zod, and Vitest.
- [X] T002 Create the separate Playwright package and scripts in `tests/e2e/package.json`, `tests/e2e/package-lock.json`, and `tests/e2e/playwright.config.ts`; configure a local `webServer` and environment-configurable base URL.
- [X] T003 Configure Vite repository base path, TypeScript compiler settings, Vitest, and root ignore rules in `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vitest.config.ts`, and `.gitignore`.
- [X] T004 Create the planned app, script, content, generated-data, unit-test, and e2e-test directory structure, adding `.gitkeep` files only where an otherwise-empty directory must be retained, in `src/`, `scripts/content/`, `content/approved/`, `public/data/`, `tests/unit/`, and `tests/e2e/`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared catalog contracts, loading, navigation shell, and test fixtures
required by all user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Define the entry, relationship, and published-catalog TypeScript types in `src/types/catalog.ts`, matching the exact entry types and required relationship arrays in `data-model.md`.
- [X] T006 Create a minimal synthetic, non-medical test catalog with one challenge, two actions, and two herbs in `tests/fixtures/catalog.json`; include bidirectional relationships and do not copy real Obsidian content.
- [X] T007 Implement catalog loading, ID lookup, type filtering, and safe not-found results in `src/data/catalog.ts`, using `tests/fixtures/catalog.json` as the initial test input and the published catalog contract.
- [X] T008 Implement shared relationship selectors and deduplicated link resolution in `src/data/relationships.ts`, using the published `challengeIds`, `actionIds`, and `herbIds` arrays.
- [X] T009 Create the application root, shared route table, and placeholder browse/detail route components in `src/app/App.tsx`, `src/app/router.tsx`, `src/pages/BrowsePage.tsx`, and `src/pages/EntryDetailPage.tsx`.
- [X] T010 Add global responsive baseline styles and accessible link/focus defaults in `src/styles/global.css`, and import them from `src/main.tsx`.
- [X] T011 Configure the root Vitest setup and shared test utilities in `vitest.config.ts` and `tests/unit/setup.ts`.

**Checkpoint**: The app shell, typed catalog, synthetic fixture, and local test runners exist.

---

## Phase 3: User Story 1 - Explore linked knowledge (Priority: P1) 🎯 MVP

**Goal**: Let a reader start from a challenge, action, or herb and follow published relationships
in either direction, including choosing an alternative herb through a shared action.

**Independent Test**: Load the synthetic catalog and verify that each entry detail exposes the
correct related entries, every relationship link opens its intended detail, and the reader can
complete challenge → action → herb → alternative herb and use browser Back.

### Tests for User Story 1

- [ ] T012 [P] [US1] Add unit tests for relationship selectors, inverse navigation, missing IDs, and duplicate relationship handling in `tests/unit/relationships.test.ts`.
- [ ] T013 [P] [US1] Add Playwright coverage for starting at each entry type, following related-entry links in both directions, choosing an alternative herb, and using browser Back in `tests/e2e/tests/relationship-navigation.spec.ts`.

### Implementation for User Story 1

- [ ] T014 [US1] Implement selector behavior to resolve an entry's `challengeIds`, `actionIds`, and `herbIds` to existing catalog entries in `src/data/relationships.ts`.
- [ ] T015 [US1] Implement reusable typed related-entry sections and links in `src/components/RelatedEntryLinks.tsx`.
- [ ] T016 [US1] Implement entry detail rendering for type, name, optional summary/source, related-entry sections, and empty relationships in `src/pages/EntryDetailPage.tsx`.
- [ ] T017 [US1] Connect hash-based detail routes, invalid-ID not-found behavior, and standard browser navigation in `src/app/router.tsx` and `src/pages/NotFoundPage.tsx`.
- [ ] T018 [US1] Complete the relationship-navigation Playwright flow against the local app and synthetic catalog in `tests/e2e/tests/relationship-navigation.spec.ts`.

**Checkpoint**: The full linked-entry path is independently testable from the synthetic catalog.

---

## Phase 4: User Story 2 - Browse entry types (Priority: P2)

**Goal**: Provide separate lists for health challenges, actions, and herbs as predictable
starting points.

**Independent Test**: Open each type's browse view, confirm only entries of that type are shown,
and open an entry to its correct detail page.

### Tests for User Story 2

- [ ] T019 [P] [US2] Add Playwright checks for the three browse lists, type filtering, selecting a detail entry, and the empty-list state in `tests/e2e/tests/browse-entry-types.spec.ts`.

### Implementation for User Story 2

- [ ] T020 [US2] Implement the browse-list selector with stable name sorting and type filtering in `src/data/catalog.ts`.
- [ ] T021 [US2] Implement accessible entry-list and entry-link components in `src/components/EntryList.tsx` and `src/components/EntryLink.tsx`.
- [ ] T022 [US2] Implement browse views for challenge, action, and herb types, including a clear empty-list state, in `src/pages/BrowsePage.tsx`.
- [ ] T023 [US2] Add visible navigation to all three browse views in `src/components/PrimaryNavigation.tsx` and connect it to `src/app/App.tsx`.
- [ ] T024 [US2] Complete the browse-list Playwright scenarios against the local app and synthetic catalog in `tests/e2e/tests/browse-entry-types.spec.ts`.

**Checkpoint**: Readers can start from a browse list and continue through the US1 relationship flow.

---

## Phase 5: User Story 3 - Browse with clear educational context (Priority: P3)

**Goal**: Keep an educational disclaimer visible across browse and entry-detail pages.

**Independent Test**: Verify the approved disclaimer is visibly rendered in the shared layout on
every route and remains visible while navigating among entries.

### Tests for User Story 3

- [ ] T025 [P] [US3] Add Playwright checks for the full disclaimer text on each browse type and on an entry detail page in `tests/e2e/tests/educational-disclaimer.spec.ts`.

### Implementation for User Story 3

- [ ] T026 [US3] Add the approved educational disclaimer text and semantic accessible markup in `src/components/EducationalDisclaimer.tsx`.
- [ ] T027 [US3] Render the disclaimer from the shared app layout on all routes and style it responsively in `src/app/AppLayout.tsx` and `src/styles/global.css`.
- [ ] T028 [US3] Complete the disclaimer visibility Playwright checks for browse and detail navigation in `tests/e2e/tests/educational-disclaimer.spec.ts`.

**Checkpoint**: The disclaimer remains visible throughout app navigation.

---

## Phase 6: User Story 4 - Publish approved content updates (Priority: P2)

**Goal**: Convert an explicit owner-approved Obsidian Markdown export into validated public app
data and deploy repeatable static builds.

**Independent Test**: Import a valid approved fixture and confirm deterministic catalog output;
run invalid fixtures and confirm actionable errors with no new output; build and verify the site
using the generated catalog; repeat the process after a record changes.

### Tests for User Story 4

- [ ] T029 [P] [US4] Add importer unit fixtures for valid records, malformed YAML/frontmatter, duplicate IDs/aliases, missing and wrong-type links, and supported display-text wikilinks in `tests/unit/fixtures/content-import/`.
- [ ] T030 [P] [US4] Add importer tests for allowlisted output fields, derived inverse relationships, deterministic JSON, nonzero failure, and no catalog write on invalid input in `tests/unit/import-content.test.ts`.

### Implementation for User Story 4

- [ ] T031 [US4] Implement YAML frontmatter parsing and strict allowlisted field validation for `type`, `title`, `aliases`, `summary`, `source`, `actions`, and `health_challenges` in `scripts/content/parseSourceRecord.ts`.
- [ ] T032 [US4] Implement stable ID creation and unique title/filename/alias indexing in `scripts/content/entryIndex.ts`, rejecting collisions and ambiguous names.
- [ ] T033 [US4] Implement the supported `[[Target]]` and `[[Target|Display text]]` frontmatter-link parser and expected-target-type validation in `scripts/content/parseRelationship.ts`.
- [ ] T034 [US4] Implement relationship resolution, reverse indexes, duplicate removal, and actionable source-file diagnostics in `scripts/content/resolveRelationships.ts`.
- [ ] T035 [US4] Implement the import CLI to read only `content/approved/`, validate the complete set before writing, and emit deterministic allowlisted JSON to `public/data/catalog.json` in `scripts/import-content.ts`.
- [ ] T036 [US4] Connect runtime catalog loading to the generated `public/data/catalog.json` and retain a clear empty/not-found state when the catalog or requested entry is unavailable in `src/data/catalog.ts` and `src/app/App.tsx`.
- [ ] T037 [US4] Add a documented, owner-curated starter dataset only after the owner approves each Markdown record, placing only approved fields and supported relationships in `content/approved/*.md`.
- [ ] T038 [US4] Add root scripts for content import, unit tests, app build, and local preview in `package.json`; ensure the build runs import validation before Vite emits publishable assets.
- [ ] T039 [US4] Add a GitHub Pages deployment workflow that runs content validation, unit tests, build, and separate Playwright tests before publishing `dist/` in `.github/workflows/deploy-pages.yml`.
- [ ] T040 [US4] Update repository usage, content approval, validation, and deployment instructions with verified commands in `README.md` and `specs/001-herb-knowledge-navigation/quickstart.md`.
- [ ] T041 [US4] Verify a valid content update appears after a fresh build and that invalid or unapproved fixture content cannot enter the deployed catalog using `tests/e2e/tests/published-catalog.spec.ts`.

**Checkpoint**: A content owner can repeat the documented, validated import/build/deploy process.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verify the integrated MVP and its publication boundary.

- [ ] T042 [P] Configure the Playwright `webServer` to serve the production Vite preview build and accept a deployed base URL override in `tests/e2e/playwright.config.ts`.
- [ ] T043 [P] Add automated checks that generated JSON contains only approved catalog fields and no source bodies, local vault paths, or raw HTML in `tests/unit/published-catalog.test.ts`.
- [ ] T044 Run the complete quickstart validation, import, unit, production build, and Playwright flows described in `specs/001-herb-knowledge-navigation/quickstart.md`; record any required command corrections there.
- [ ] T045 Review the final static build output and deployment workflow against the approved-content boundary and constitution in `.github/workflows/deploy-pages.yml` and `public/data/catalog.json`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on setup; blocks all user-story implementation.
- **US1 (Phase 3)**: Depends on foundation; the central linked-navigation increment.
- **US2 (Phase 4)**: Depends on foundation and uses US1 detail routes for list selection.
- **US3 (Phase 5)**: Disclaimer component is independent after foundation; final acceptance
  depends on all browse and detail routes.
- **US4 (Phase 6)**: Importer unit work can begin after foundation. Runtime catalog integration,
  deployment, and full update validation depend on US1 and US2 being functional.
- **Polish (Phase 7)**: Depends on all MVP stories and the integrated content pipeline.

### User Story Dependencies

- **US1 (P1)**: No dependency on another story; depends on the shared types, fixture catalog,
  router shell, and relationship selectors.
- **US2 (P2)**: Depends on the US1 detail routes for browse-to-detail navigation.
- **US3 (P3)**: Disclaimer component is independent after foundation; final acceptance depends
  on all browse and detail routes.
- **US4 (P2)**: Import/validation core is independently developable after foundation; completion
  depends on US1 and US2 catalog consumers and the deployment workflow. The phase is placed
  after US3 so the public deployment increment includes the required disclaimer.

### Parallel Opportunities

- Setup tasks T001-T004 touch separate manifests/configuration or directory paths and may be
  parallelized after confirming the shared root package setup.
- Foundation work T005-T006 and T009-T011 can proceed in parallel across their distinct files;
  T007-T008 follow T005-T006.
- Within US1, T012-T013 test authoring can proceed in parallel; implementation starts after
  shared data types and routes are ready.
- US2 browse components, US3 disclaimer UI, and US4 importer validation can proceed in parallel
  after foundation, provided developers coordinate the shared `src/app/App.tsx`,
  `src/styles/global.css`, and catalog files.
- Within US4, parsing/index/relationship modules have ordered dependencies; fixture authoring
  and contract-focused tests can proceed in parallel with UI stories.
- Do not parallelize tasks that modify the same file (especially `src/data/catalog.ts`,
  `src/styles/global.css`, `package.json`, or shared route/layout files).

## Parallel Example: User Story 1

```text
Task: T012 Write relationship-selector unit tests in tests/unit/relationships.test.ts
Task: T013 Write browser navigation tests in tests/e2e/tests/relationship-navigation.spec.ts
```

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Complete US1 and validate all-direction linked navigation against the synthetic catalog.
3. Complete US2 and US3 so readers have browse entry points and the persistent disclaimer.
4. Complete US4 to import only owner-approved records and deploy the actual published catalog.
5. Run Phase 7 checks and verify locally before deploying to GitHub Pages.

### Incremental Delivery

- **Navigation prototype**: US1 with synthetic data demonstrates relationship traversal.
- **Browseable app**: Add US2 and US3; validate all routes and disclaimer locally.
- **Publishable MVP**: Add US4; curate approved content, validate/import, run Playwright, and
  deploy.
- **Release-ready**: Complete Phase 7 and verify the deployed update process end to end.

## Notes

- Every task uses the required checkbox, sequential ID, optional `[P]`, required story label
  for user-story tasks, and explicit file paths.
- `[P]` marks only work on distinct files that can proceed without an incomplete prerequisite.
- Tasks T033 and T045 require owner approval/review; no real vault notes are copied by automation.
- The `image` field is reserved for future design only; image implementation is excluded from
  this MVP.
