# App features

The Herb Knowledge Explorer presents approved information from an Obsidian herb reference as a read-only, navigable web app.

## MVP entry types and relationships

The app has three kinds of entries:

- **Health challenge**: a topic a reader wants to explore, such as stress
- **Action**: a described herbal action associated with a challenge or herb, such as anti-anxiety
- **Herb**: an herb entry, such as lemon balm

The MVP must preserve these relationships:

- A health challenge can link to one or more actions.
- An action can link to one or more herbs.
- An herb can link to one or more actions.

The core browsing path is:

**Health challenge → action → herb → another herb linked to that action**

For example, a reader opens stress, selects the anti-anxiety action, opens lemon balm, and uses its related action link to see other herbs associated with anti-anxiety.

## MVP requirements

The MVP MUST:

- Provide a browsable list of health challenges, actions, and herbs.
- Let a reader open a detail view for any listed entry.
- Show the entry's name, a short approved summary, and source information when available.
- Show clickable related-entry links on detail views.
- Let a reader follow the core browsing path above and return to previous entries using app navigation or the browser's Back control.
- Handle entries with no related links with a clear empty state.
- Show a user-visible educational disclaimer in the main app layout on every page, including while browsing entry details.
- Use data generated from selected Obsidian Markdown notes through a repeatable import/build process.
- Report missing required metadata and unresolved or ambiguous internal links during import.
- Display supported Obsidian wikilinks as app links rather than exposing raw `[[wikilink]]` syntax.
- Generate a customer-readable HTML report for each Playwright acceptance run, with a separate plain-English outcome for every US1-US4 browser scenario.
- Include an updated illustrated user guide and dated or versioned release notes with each customer delivery.

Maintain the user guide cumulatively as user-facing features are accepted. Update its instructions
and screenshots to match the current UI, then review all release materials before delivery.
Maintain an `Unreleased` release-notes section during development and prepare a dated or versioned
entry for each customer delivery.

The disclaimer must communicate that the app provides educational information, not medical advice, diagnosis, or treatment recommendations. Initial wording:

> Educational information only. This content is not medical advice and is not intended to diagnose, treat, cure, or prevent any condition. Consult a qualified healthcare professional about health concerns.

## Data import expectations

The app does not edit or synchronize directly with the Obsidian vault. The owner selects and exports/copies approved Markdown notes, then runs the import/build process.

For the MVP, each imported note must be identifiable as a health challenge, action, or herb. The import convention will be documented and kept small. It should use the existing Obsidian wikilinks for relationships where practical, plus a short summary and source/attribution information when available. The implementation plan should confirm the exact metadata convention against representative notes before the importer is built.

The importer must not silently invent relationships or discard broken links. It must identify which source note and link need attention so the owner can fix the source or exclude the note from the curated export.

## Out of scope for MVP

- Diagnosing conditions, making treatment recommendations, or generating health claims
- Editing or creating notes from within the app
- Direct connection to, or automatic synchronization with, an Obsidian vault
- User accounts, personalization, comments, or saved lists
- A database or server-side API
- Automatic ingestion of the entire vault
- Full-text search across all book content
- Interactive network graph visualization
- Automatic scheduled content updates
- A customer report format other than the generated Playwright HTML report

## Later possibilities

Once the MVP's content model and import workflow are proven, later versions could add richer search, graph visualization, filters, or an automated publishing pipeline. These should not delay the MVP's core navigation and repeatable content update process.
