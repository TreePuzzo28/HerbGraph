# Recommended tech stack: Herb Knowledge Explorer

The MVP is a read-only web app with curated content generated from Obsidian Markdown. A static front end avoids the cost and complexity of a backend, database, and user accounts while still supporting deployment and browser-based navigation.

## Recommended components

- **Web app:** React with TypeScript, built with Vite.
- **Content import/build:** A small Node.js/TypeScript command-line script that reads the selected Markdown export, parses the agreed note metadata and Obsidian wikilinks, validates relationships, and generates structured JSON for the app.
- **Data format at runtime:** Generated JSON bundled with the web app. The browser does not need access to the Obsidian vault or a database.
- **End-to-end tests:** Playwright in a separate test project. The tests should be able to target both a local app and a deployed test/staging URL through configuration.
- **Deployment:** Static web hosting that can serve the built Vite application. The app has no server-side runtime requirement for the MVP.

This stack is a recommendation, not a requirement to retain the RSS sample's ASP.NET Core and Blazor architecture. It keeps the initial application and content pipeline small and uses Playwright for the requested browser testing.

## Content import contract

Obsidian remains the source of truth. The owner exports or copies only notes approved for publication into a designated import location. The importer generates app data from those Markdown files; it does not write back to the vault.

Before implementation, inspect representative notes and settle a minimal convention for:

- Entry type: `challenge`, `action`, or `herb`
- Display name and short summary
- Optional source or attribution information
- Internal links between the supported entry types

Prefer preserving existing Obsidian wikilinks for relationships. If notes do not currently identify their entry type or summary consistently, define a small frontmatter or folder convention for the curated export rather than trying to infer meaning from arbitrary prose.

The import command must:

- Produce deterministic JSON that the app can consume.
- Validate required values and relationship targets.
- Report unresolved, ambiguous, or unsupported links with the source file and link text.
- Fail the build when required data is invalid, rather than silently omitting broken relationships.
- Avoid including notes that were not placed in the approved export.

The exact importer library and JSON schema can be selected during planning, after reviewing sample notes. Do not add a database or a generalized Obsidian plugin/API integration for the MVP.

## App structure and behavior

The front end provides browse views for health challenges, actions, and herbs, plus detail views that display a summary, source information when available, and links to related entries. A selected challenge links to its actions; an action links to its herbs; an herb links back to its actions so the reader can select an alternative herb associated with the same action. Put the educational disclaimer in the shared main app layout so it remains visible on all pages, including detail views.

Use standard browser navigation behavior so users can return to prior entries with the Back control. Keep the initial UI responsive and accessible, but do not build a graph visualization for the MVP.

## Playwright test project

Keep Playwright tests in a separate test project from the web app source. The test project should cover at least:

- Browsing the three entry lists and opening detail views.
- The challenge → action → herb → alternative herb path.
- Back navigation and entries that have no related links.
- Loading the app with data produced by the import/build process.

The import command itself must report invalid required data and broken links before deployment; browser tests are for verifying the running app's user-facing behavior.

Browser tests should target a locally served build in routine development and optionally a deployed test/staging instance before release.

## Deployment and updates

Deploy the generated static site to a static web host. Each content update follows this process:

1. Edit the source notes in Obsidian.
2. Export/copy the approved notes to the import location.
3. Run the importer and fix any reported validation problems.
4. Build the web app and run the relevant tests.
5. Deploy the new static build.

The static app has no protected server-side data: content included in a deployment should be treated as public and must be reviewed for privacy, accuracy, and permission to publish.

## Not required for MVP

- ASP.NET Core API, server-side services, or a database
- Authentication or authorization
- Live vault synchronization or an Obsidian plugin
- Background jobs, scheduled imports, or automatic publishing
- Interactive graph rendering or full-text indexing
