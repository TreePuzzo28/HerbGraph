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
disclaimer are implemented. The approved-content importer and deployment remain planned.

## MVP scope

- Browse health challenges, actions, and herbs, and open their detail pages.
- Follow the relationships between these entry types.
- Keep an educational disclaimer visible in the main app layout.
- Import only selected, approved Obsidian Markdown notes, validate their
  metadata and links, and build app data.
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
select or export approved notes, run the import/build process, resolve
validation errors, test the app, and deploy the updated static build. The
deployed content is public; do not include private or unapproved notes.

## Project documents

- [User guide](docs/user-guide.md)
- [Release notes](CHANGELOG.md)
- [Project goals](StakeholderDocuments/ProjectGoals.md)
- [App features](StakeholderDocuments/AppFeatures.md)
- [Recommended tech stack](StakeholderDocuments/TechStack.md)
- [Project constitution](.specify/memory/constitution.md)

## Development and deployment

The stack is React, TypeScript, and Vite, with a planned Node.js/TypeScript
content import tool and a separate Playwright test project. Test, import, and
deployment commands will be documented here as implementation establishes them.
The user guide will be maintained as user-facing features are accepted; each
customer delivery will include the current guide, screenshots, dated or
versioned release notes, and its Playwright HTML report.
