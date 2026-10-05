# Feature Specification: Herb Knowledge Navigation

**Feature Branch**: `001-herb-knowledge-navigation`

**Created**: 2026-10-05

**Status**: Draft

**Input**: User description: "MVP, a simple app that demonstrates the ability to traverse from herbs to actions to health challenges in all directions."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explore linked knowledge (Priority: P1)

As a reader, I want to browse health challenges, actions, and herbs and follow links between them in either direction, so that I can explore how the entries are related.

**Why this priority**: Traversing the relationships is the central purpose of the MVP.

**Independent Test**: Using a small approved dataset with linked challenge, action, and herb entries, a reader can start from any entry type, open a related entry, and continue following relationships to another type.

**Acceptance Scenarios**:

1. **Given** a health challenge linked to an action, **When** the reader opens that challenge and selects the action, **Then** the action's details and its linked herbs are shown.
2. **Given** an herb linked to an action, **When** the reader opens that herb and selects the action, **Then** the action's details and its linked health challenges and herbs are shown.
3. **Given** an action linked to herbs and health challenges, **When** the reader opens the action, **Then** each linked entry is available as a navigable link.
4. **Given** an action linked to multiple herbs, **When** the reader opens one herb and follows the shared action link, **Then** the reader can select a different herb linked to that action.
5. **Given** a reader has opened multiple entries, **When** they use app navigation or the browser Back control, **Then** they return to the previous entry or browse view.

---

### User Story 2 - Browse entry types (Priority: P2)

As a reader, I want to browse separate lists of health challenges, actions, and herbs, so that I can choose a starting point even when I do not have a specific link in mind.

**Why this priority**: Entry lists provide predictable starting points for exploring the knowledge base.

**Independent Test**: A reader can open each of the three browse lists and select an entry to view its details.

**Acceptance Scenarios**:

1. **Given** the app contains approved entries of all three types, **When** the reader opens each browse list, **Then** entries of that type are displayed.
2. **Given** an entry appears in a browse list, **When** the reader selects it, **Then** its detail view displays its name, approved summary when available, and linked entries.
3. **Given** an entry has no links to display, **When** the reader opens its detail view, **Then** the app presents a clear empty state rather than a broken or misleading link.

---

### User Story 3 - Browse with clear educational context (Priority: P3)

As a reader, I want to see the app's educational disclaimer while browsing, so that I understand the content is not personal medical advice.

**Why this priority**: The app contains health-related reference material and must communicate its educational purpose consistently.

**Independent Test**: The disclaimer remains visible in the main app layout on browse views and entry detail views.

**Acceptance Scenarios**:

1. **Given** the reader opens any app page, **When** the page is displayed, **Then** the main layout shows the educational disclaimer.
2. **Given** the reader navigates between entry details, **When** each new page is displayed, **Then** the disclaimer remains visible.

---

### User Story 4 - Publish approved content updates (Priority: P2)

As the content owner, I want to prepare an updated app from selected Obsidian notes and deploy it, so that approved changes become available to readers without manually editing app content.

**Why this priority**: Keeping the app in step with the maintained Obsidian reference is necessary for the MVP to remain useful.

**Independent Test**: An owner can use the documented process to provide an approved note set, identify invalid or unresolved relationships, produce an updated app, and verify the changed content after deployment.

**Acceptance Scenarios**:

1. **Given** selected notes identify their entry type and contain links to other notes, **When** the owner runs the documented content preparation process, **Then** valid entries and supported relationships are available in the app.
2. **Given** an imported note has missing required information or a link that cannot be resolved uniquely, **When** the content preparation process runs, **Then** it reports the source note and problem and does not silently publish incomplete relationships.
3. **Given** an updated approved note set passes validation, **When** the owner completes the documented build and deployment process, **Then** readers can access the updated content in the deployed app.

---

### User Story 5 - Review customer-readable test results (Priority: P2)

As a customer or release reviewer, I want a plain-English report of the acceptance scenarios and their outcomes, so that I can understand what was verified for a delivery without reading test code.

**Why this priority**: A clear test report provides evidence that the delivered browsing behavior was checked.

**Independent Test**: Run the Playwright browser-acceptance suite and open its HTML report; confirm each US1-US4 browser scenario has its own readable result and the report identifies the test run.

**Acceptance Scenarios**:

1. **Given** the Playwright browser-acceptance suite has run, **When** the report is opened, **Then** every US1-US4 browser scenario appears as a plain-English test with a passed, failed, or skipped result.
2. **Given** an acceptance scenario fails, **When** a customer opens the report, **Then** the failed scenario and its available diagnostic are identifiable without requiring access to the source code.
3. **Given** a customer delivery is prepared, **When** its test report is attached to the delivery, **Then** the report identifies the corresponding application version or commit and test-run date.

---

### User Story 6 - Use current release documentation (Priority: P2)

As a reader or customer, I want a current illustrated guide and release notes with each delivery, so that I can learn how to use the app and understand what changed.

**Why this priority**: Documentation is part of a usable, reviewable customer delivery, not just an internal implementation note.

**Independent Test**: Review the release materials for a delivered build; confirm the user guide describes the shipped browsing experience with current screenshots and the release notes summarize that delivery's user-visible changes.

**Acceptance Scenarios**:

1. **Given** a user opens the guide for a released app, **When** they follow its instructions, **Then** they can browse challenges, actions, and herbs and follow the supported navigation path.
2. **Given** a feature becomes usable, **When** its implementation phase is accepted, **Then** the corresponding guide instructions and relevant screenshot are updated to match the current app.
3. **Given** a customer delivery is prepared, **When** its release materials are assembled, **Then** an updated user guide and dated/versioned release notes are included with that delivery.
4. **Given** user-visible work is completed but not yet released, **When** the release notes are updated, **Then** its summary is recorded under an Unreleased section and moved into the dated/versioned section for the next delivery.

---

### Edge Cases

- A relationship points to a note that is not included in the approved publication set.
- Two notes have the same title or alias, making a link target ambiguous.
- A link uses an alias, heading, or display text in addition to its target.
- An entry has no related entries or has a relationship to only one entry type.
- An imported note is missing its entry type, display name, or other required information.
- An imported note contains content that is not approved for public display.
- A reader opens a stale or invalid entry URL.
- A content update contains a broken relationship; the published app must not silently present it as a valid link.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST provide browse views for health challenges, actions, and herbs.
- **FR-002**: The app MUST provide a detail view for each published entry.
- **FR-003**: Each detail view MUST identify the entry type and display its name.
- **FR-004**: Each detail view MUST display an approved summary and source or attribution information when available in the published data.
- **FR-005**: The app MUST display navigable links to an entry's published related entries.
- **FR-006**: Readers MUST be able to follow relationships from a health challenge to an action, from an action to a health challenge or herb, and from an herb to an action or health challenge when those relationships exist in the published data.
- **FR-007**: Readers MUST be able to navigate from an herb to one of its actions and select another herb linked to that action when alternatives exist.
- **FR-008**: The app MUST provide usable navigation back to previously viewed entries or browse views.
- **FR-009**: The app MUST show a clear empty state when a published entry has no related entries.
- **FR-010**: The main app layout MUST display a user-visible educational disclaimer on every page, including browse views and entry details. It MUST state that the content is educational, not medical advice, and not intended to diagnose or treat conditions.
- **FR-011**: The owner MUST be able to prepare published data from an explicit selection or export of approved Obsidian Markdown notes without connecting the deployed app to the vault.
- **FR-012**: The content preparation process MUST identify each entry as a health challenge, action, or herb and preserve supported links between published entries.
- **FR-013**: The content preparation process MUST report missing required entry information and unresolved or ambiguous links with the source note and relevant link text.
- **FR-014**: The content preparation process MUST NOT silently invent or discard relationships when required data or link targets are invalid.
- **FR-015**: The owner MUST be able to repeat the documented content preparation, build, and deployment process after approved notes change.
- **FR-016**: The deployed app MUST include only content approved for publication.
- **FR-017**: The app MUST render published note content as non-executable content and MUST NOT run scripts or active markup from imported notes.
- **FR-018**: The app MUST display a useful not-found state when a reader opens an invalid or unpublished entry address.
- **FR-019**: The Playwright browser-acceptance suite MUST produce an HTML report for each run, listing every browser scenario for US1-US4 in plain English with a passed, failed, or skipped result.
- **FR-020**: Each US1-US4 browser scenario intended for customer reporting MUST have a distinct test result; the report MUST identify the application version or commit and test-run date for a customer delivery.
- **FR-021**: A failed acceptance test report MUST identify the failing scenario and include available diagnostics without requiring the reader to inspect test source code.
- **FR-022**: The project MUST maintain a cumulative reader guide at `docs/user-guide.md` with screenshots in `docs/screenshots/`; the guide MUST be updated as each user-facing feature is accepted and MUST match the shipped app at release.
- **FR-023**: Each customer delivery MUST include the current user guide, its applicable screenshots, and a dated or versioned release-notes entry.
- **FR-024**: The project MUST maintain an `Unreleased` release-notes section that is updated with customer-visible changes and organized into a dated or versioned section for each delivery.
- **FR-025**: Customer-facing reports, guides, screenshots, and release notes MUST NOT expose private or unapproved vault content.

### Key Entities

- **Health Challenge**: An educational topic a reader may explore; it has a name, optional approved summary and source information, and links to actions and potentially herbs.
- **Action**: A described herbal action; it has a name, optional approved summary and source information, and links to health challenges and herbs.
- **Herb**: An herb reference entry; it has a name, optional approved summary and source information, and links to actions and potentially health challenges.
- **Relationship**: A navigable association between published entries, retaining its source and target entry identities.
- **Published Content Set**: The explicitly approved collection of entries and relationships made available in an app release.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a test dataset containing at least one linked entry of each type, readers can complete a path from a health challenge to an action, to an herb, and to an alternative herb linked to that action.
- **SC-002**: Readers can begin exploration from each of the three entry types and follow every published relationship in either direction.
- **SC-003**: The educational disclaimer is visible on 100% of browse and detail pages during acceptance testing.
- **SC-004**: Every published relationship in the test dataset resolves to the intended published entry; invalid or ambiguous relationships are reported before a content update can be published.
- **SC-005**: A content owner can repeat the documented update process with a changed approved note set and verify the changed content in the deployed app.
- **SC-006**: No note outside the explicitly approved content set is included in the deployed app's published content.
- **SC-007**: Every US1-US4 browser scenario appears as a separate plain-English result in the generated HTML test report, with no missing or combined scenario outcomes.
- **SC-008**: For every customer delivery, reviewers can identify the tested app version or commit and test date from the report and can access the matching user guide, screenshots, and release notes.
- **SC-009**: After each user-facing feature is accepted, its user-guide instructions are updated before the next customer release; all included screenshots depict the corresponding shipped UI.

## Assumptions

- The app is read-only for its readers; only the content owner changes source material in Obsidian.
- The app will publish a curated subset of notes, not automatically ingest the entire vault.
- The owner will review selected notes for accuracy, privacy, attribution, and permission to publish before each release.
- Notes or the curated export will identify entry types and provide enough information to resolve supported links. The precise metadata and export convention will be confirmed during planning using representative notes.
- An unresolved or ambiguous relationship blocks publication until corrected or explicitly excluded from the approved content set.
- The interface supports ordinary browser navigation and is usable on common desktop and mobile screen sizes.
- Hosting provider, final disclaimer wording, and detailed import conventions are planning decisions; this specification does not prescribe a particular technology.
