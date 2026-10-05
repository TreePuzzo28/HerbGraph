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

## Assumptions

- The app is read-only for its readers; only the content owner changes source material in Obsidian.
- The app will publish a curated subset of notes, not automatically ingest the entire vault.
- The owner will review selected notes for accuracy, privacy, attribution, and permission to publish before each release.
- Notes or the curated export will identify entry types and provide enough information to resolve supported links. The precise metadata and export convention will be confirmed during planning using representative notes.
- An unresolved or ambiguous relationship blocks publication until corrected or explicitly excluded from the approved content set.
- The interface supports ordinary browser navigation and is usable on common desktop and mobile screen sizes.
- Hosting provider, final disclaimer wording, and detailed import conventions are planning decisions; this specification does not prescribe a particular technology.
