# Herb Knowledge Explorer

A read-only web app in development for exploring approved content from an Obsidian herb
reference. Readers will be able to browse health challenges, herbal actions, and
herbs, following links such as:

**Health challenge → action → herb → another herb linked to that action**

The app is for educational reference only. It is not intended to diagnose,
treat, cure, or prevent any condition, or to replace advice from a qualified
healthcare professional.

## Project status

Implementation is underway. Project setup, the shared catalog foundation,
linked-entry navigation, type-specific browse lists, and the shared educational
disclaimer are implemented. The approved-content importer and guarded GitHub
Pages workflow are implemented. A separate local-only curator web app shares
the content parser and review UI code with the reader app but has its own entry
point and development server. Deployment stays skipped until approved Markdown
records exist.

## MVP scope

- Browse health challenges, actions, and herbs, and open their detail pages.
- Follow the relationships between these entry types.
- Keep an educational disclaimer visible in the main app layout.
- Import only selected, approved Obsidian Markdown notes, validate their
  metadata and links, and build app data.
- Prepare minimal import records through a separate curator app bound to
  `localhost`; the curator app is not part of the reader app's production build.
- Deploy the read-only web app as a static site.
- Verify the main browsing flow with Playwright tests in a separate test
  project.
- Generate a plain-English HTML test report with a separate result for each
  acceptance scenario.
- Maintain an illustrated user guide and release notes as customer delivery
  materials.

The MVP does not include user accounts, editing notes in the app, direct vault
synchronization, a database, or an interactive graph.

## Content and publishing

Obsidian remains the source of truth. The intended publishing workflow is to
select notes in the separate **Content Curator** app, review extracted fields,
approve records individually, run the import/build process, resolve validation
errors, test the app, and deploy the updated static build. The curator processes
chosen Markdown files in the browser and does not upload or modify the source
files. It exports only allowlisted frontmatter and recognized herb-template
subsections; other note-body content is excluded. Deployed content is public;
do not include private or unapproved notes. Only
minimal owner-approved Markdown records belong in `content/approved/`; the UI
downloads those records in a ZIP for you to extract at the repository root. The
importer reads allowlisted YAML frontmatter from those minimal files, ignores
their body, and validates links before writing the generated
`public/data/catalog.json`. Herb records may include approved text in the five
optional Apothecary & Applications subsections described in the
[content import contract](specs/001-herb-knowledge-navigation/contracts/content-import.md).
The GitHub Pages workflow validates content and runs tests on pull requests and
pushes to `main`, but it will not publish until at least one approved Markdown
record is present. Do not add real vault content without explicit approval.

## Project documents

- [User guide](docs/user-guide.md)
- [Release notes](CHANGELOG.md)
- [Project goals](StakeholderDocuments/ProjectGoals.md)
- [App features](StakeholderDocuments/AppFeatures.md)
- [Recommended tech stack](StakeholderDocuments/TechStack.md)
- [Project constitution](.specify/memory/constitution.md)

## Development and deployment

The stack is React, TypeScript, and Vite, with a Node.js/TypeScript content
import tool and a separate Playwright test project.

```sh
npm ci
npm run content:import
npm test
npm run build
npm ci --prefix tests/e2e
npm run test:e2e --prefix tests/e2e
```

`npm run build` runs content import and validation before the production build.
For the step-by-step workflow and deployment prerequisites, see the
[quickstart](specs/001-herb-knowledge-navigation/quickstart.md).
