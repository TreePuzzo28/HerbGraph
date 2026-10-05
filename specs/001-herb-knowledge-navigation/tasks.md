# Tasks: Herb Knowledge Navigation

**Input**: Design documents from `specs/001-herb-knowledge-navigation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Include importer unit tests and separate Playwright acceptance tests as required by
the specification and constitution. Write tests before the corresponding implementation.

**Organization**: Tasks are grouped by user story. The shared project and catalog foundation
must be complete before story work starts.

**Documentation gate**: Update the reader guide and `Unreleased` notes as each user-facing
US1-US4 story is accepted; do not defer all documentation until the release phase. T049 tracks
this cumulative work and includes a follow-up for the already implemented US1 navigation.
Before a delivery, review the complete guide, screenshots, release notes, and test report against
the shipped build.

**Test report gate**: At every phase checkpoint, generate and review a Playwright HTML report
for the browser acceptance scenarios run in that phase. Reports are local generated output and
must not be committed; once the CI workflow is in place, retain them as downloadable artifacts
identified by the tested commit. If a phase has no browser acceptance tests, report the checks
that did run instead of generating an empty Playwright report.

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

- [X] T012 [P] [US1] Add unit tests for relationship selectors, inverse navigation, missing IDs, and duplicate relationship handling in `tests/unit/relationships.test.ts`.
- [X] T013 [P] [US1] Add Playwright coverage for starting at each entry type, following related-entry links in both directions, choosing an alternative herb, and using browser Back in `tests/e2e/tests/relationship-navigation.spec.ts`.

### Implementation for User Story 1

- [X] T014 [US1] Implement selector behavior to resolve an entry's `challengeIds`, `actionIds`, and `herbIds` to existing catalog entries in `src/data/relationships.ts`.
- [X] T015 [US1] Implement reusable typed related-entry sections and links in `src/components/RelatedEntryLinks.tsx`.
- [X] T016 [US1] Implement entry detail rendering for type, name, optional summary/source, related-entry sections, and empty relationships in `src/pages/EntryDetailPage.tsx`.
- [X] T017 [US1] Connect hash-based detail routes, invalid-ID not-found behavior, and standard browser navigation in `src/app/router.tsx` and `src/pages/NotFoundPage.tsx`.
- [X] T018 [US1] Complete the relationship-navigation Playwright flow against the local app and synthetic catalog, generate the phase-checkpoint HTML report, and review its browser-test results in `tests/e2e/tests/relationship-navigation.spec.ts`, `tests/e2e/playwright.config.ts`, and `tests/e2e/package.json`.

**Checkpoint**: The full linked-entry path is independently testable from the synthetic catalog;
generate and review the Playwright HTML report for the acceptance scenarios run in this phase.

---

## Phase 4: User Story 2 - Browse entry types (Priority: P2)

**Goal**: Provide separate lists for health challenges, actions, and herbs as predictable
starting points.

**Independent Test**: Open each type's browse view, confirm only entries of that type are shown,
and open an entry to its correct detail page.

### Tests for User Story 2

- [X] T019 [P] [US2] Add Playwright checks for the three browse lists, type filtering, selecting a detail entry, and the empty-list state in `tests/e2e/tests/browse-entry-types.spec.ts`.

### Implementation for User Story 2

- [X] T020 [US2] Implement the browse-list selector with stable name sorting and type filtering in `src/data/catalog.ts`.
- [X] T021 [US2] Implement accessible entry-list and entry-link components in `src/components/EntryList.tsx` and `src/components/EntryLink.tsx`.
- [X] T022 [US2] Implement browse views for challenge, action, and herb types, including a clear empty-list state, in `src/pages/BrowsePage.tsx`.
- [X] T023 [US2] Add visible navigation to all three browse views in `src/components/PrimaryNavigation.tsx` and connect it to `src/app/App.tsx`.
- [X] T024 [US2] Complete the browse-list Playwright scenarios against the local app and synthetic catalog in `tests/e2e/tests/browse-entry-types.spec.ts`.

**Checkpoint**: Readers can start from a browse list and continue through the US1 relationship
flow; generate and review this phase's Playwright HTML report.

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

**Checkpoint**: The disclaimer remains visible throughout app navigation; generate and review
this phase's Playwright HTML report.

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

**Checkpoint**: A content owner can repeat the documented, validated import/build/deploy process;
generate and review the Playwright HTML report for the browser scenarios run in this phase.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verify the integrated MVP and its publication boundary.

- [ ] T042 [P] Configure the Playwright `webServer` to serve the production Vite preview build and accept a deployed base URL override in `tests/e2e/playwright.config.ts`.
- [ ] T043 [P] Add automated checks that generated JSON contains only approved catalog fields and no source bodies, local vault paths, or raw HTML in `tests/unit/published-catalog.test.ts`.
- [ ] T044 Run the complete quickstart validation, import, unit, production build, and Playwright flows described in `specs/001-herb-knowledge-navigation/quickstart.md`; record any required command corrections there.
- [ ] T045 Review the final static build output and deployment workflow against the approved-content boundary and constitution in `.github/workflows/deploy-pages.yml` and `public/data/catalog.json`.

---

## Phase 8: User Story 5 - Review customer-readable test results (Priority: P2)

**Goal**: Produce a shareable HTML report with a separate plain-English result for every
acceptance scenario, and retain the customer-delivery report with its matching app version.

**Independent Test**: Run Playwright, open the HTML report, and verify every US1-US4 browser
scenario has its own passed, failed, or skipped result and the report identifies the run date
and app version or commit.

- [ ] T046 [US5] Align Playwright cases and readable test titles one-to-one with the US1-US4 browser scenarios in `specs/001-herb-knowledge-navigation/spec.md`; split tests that currently combine scenario outcomes in `tests/e2e/tests/`.
- [ ] T047 [US5] Configure the CI workflow to retain each phase's Playwright HTML report as a downloadable artifact; preserve screenshots/traces on failure for diagnostics in `.github/workflows/deploy-pages.yml`.
- [ ] T048 [US5] Add the tested app version/commit and test-run date to report metadata and artifact names in `.github/workflows/deploy-pages.yml` and `tests/e2e/playwright.config.ts`.

**Checkpoint**: Customers can review an individual result and available diagnostics for each
acceptance scenario from the matching app delivery.

---

## Phase 9: User Story 6 - Use current release documentation (Priority: P2)

**Goal**: Include a current illustrated user guide and dated/versioned release notes with each
customer delivery.

**Independent Test**: Review the release materials against the delivered UI and confirm the
guide, screenshots, release notes, and test report refer to the same delivery.

- [ ] T049 [US6] Create and maintain the cumulative `docs/user-guide.md` and `docs/screenshots/`: document each user-facing feature as its US1-US4 phase is accepted, including the outstanding US1 navigation follow-up, and refresh screenshots to match the current app rather than deferring all guide work until release.
- [ ] T050 [US6] Create `CHANGELOG.md` with an `Unreleased` section and a dated/versioned customer-release format; record user-visible changes as their feature phases are accepted and move the applicable entries into each delivery section.
- [ ] T051 [US6] Include the current guide, screenshots, release notes, and Playwright HTML report in customer-delivery materials, and document their location and verification steps in `README.md` and `specs/001-herb-knowledge-navigation/quickstart.md`.
- [ ] T052 [US6] Review the final guide, screenshots, release notes, and report against the delivered build for accuracy and absence of private or unapproved vault content in `docs/user-guide.md`, `docs/screenshots/`, `CHANGELOG.md`, and the Playwright report artifact.

**Checkpoint**: The delivery includes the current illustrated guide, dated/versioned release
notes, and the matching HTML test report without private or unapproved content.

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
- **Polish (Phase 7)**: Depends on all core application stories and the integrated content pipeline.
- **US5 (Phase 8)**: Depends on the acceptance tests from US1-US4; report generation and
  delivery metadata must be verified before a customer delivery is prepared.
- **US6 (Phase 9)**: Guide updates accompany acceptance of each user-facing US1-US4 phase;
  release packaging and final review depend on the app and test report being complete.

### User Story Dependencies

- **US1 (P1)**: No dependency on another story; depends on the shared types, fixture catalog,
  router shell, and relationship selectors.
- **US2 (P2)**: Depends on the US1 detail routes for browse-to-detail navigation.
- **US3 (P3)**: Disclaimer component is independent after foundation; final acceptance depends
  on all browse and detail routes.
- **US4 (P2)**: Import/validation core is independently developable after foundation; completion
  depends on US1 and US2 catalog consumers and the deployment workflow. The phase is placed
  after US3 so the public deployment increment includes the required disclaimer.
- **US5 (P2)**: Depends on completion of the applicable US1-US4 acceptance scenarios so each
  can appear as an independent customer-readable report result.
- **US6 (P2)**: The guide and Unreleased notes are maintained as US1-US4 user-facing work is
  accepted; the final delivery materials depend on the matching test report and deployed build.

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
- Guide text and screenshots are updated with the corresponding user-facing story, not
  postponed to the release checkpoint; corresponding customer-visible changes are added to
  `CHANGELOG.md` as each story is accepted.
- US5 report configuration follows the separately named acceptance cases; report artifact
  retention depends on the deployment workflow and app version metadata.
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
6. Generate and validate the US5 report; maintain the US6 guide and Unreleased notes as the
   user-facing stories are accepted, then prepare the release materials for delivery.

### Incremental Delivery

- **Navigation prototype**: US1 with synthetic data demonstrates relationship traversal.
- **Browseable app**: Add US2 and US3; validate all routes and disclaimer locally.
- **Publishable MVP**: Add US4; curate approved content, validate/import, run Playwright, and
  deploy.
- **Release-ready**: Complete Phase 7, generate the scenario-level report, and verify the guide,
  screenshots, and dated/versioned release notes against the deployed update process.

## Notes

- Every task uses the required checkbox, sequential ID, optional `[P]`, required story label
  for user-story tasks, and explicit file paths.
- `[P]` marks only work on distinct files that can proceed without an incomplete prerequisite.
- Tasks T040 and T045 require owner approval/review; no real vault notes are copied by automation.
- T049 is intentionally maintained across story phases; it includes an outstanding documentation
  follow-up for the already implemented US1 behavior before the next customer release.
- The `image` field is reserved for future design only; image implementation is excluded from
  this MVP.
