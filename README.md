# Herb Knowledge Explorer

A planned read-only web app for exploring approved content from an Obsidian herb
reference. Readers will be able to browse health challenges, herbal actions, and
herbs, following links such as:

**Health challenge → action → herb → another herb linked to that action**

The app is for educational reference only. It is not intended to diagnose,
treat, cure, or prevent any condition, or to replace advice from a qualified
healthcare professional.

## Project status

This project is in the specification and planning stage. The stakeholder
documents describe the intended MVP; the application, import tool, and
deployment process have not yet been implemented.

## MVP scope

- Browse health challenges, actions, and herbs, and open their detail pages.
- Follow the relationships between these entry types.
- Keep an educational disclaimer visible in the main app layout.
- Import only selected, approved Obsidian Markdown notes, validate their
  metadata and links, and build app data.
- Deploy the read-only web app as a static site.
- Verify the main browsing flow with Playwright tests in a separate test
  project.

The MVP does not include user accounts, editing notes in the app, direct vault
synchronization, a database, or an interactive graph.

## Content and publishing

Obsidian remains the source of truth. The intended publishing workflow is to
select or export approved notes, run the import/build process, resolve
validation errors, test the app, and deploy the updated static build. The
deployed content is public; do not include private or unapproved notes.

## Project documents

- [Project goals](StakeholderDocuments/ProjectGoals.md)
- [App features](StakeholderDocuments/AppFeatures.md)
- [Recommended tech stack](StakeholderDocuments/TechStack.md)
- [Project constitution](.specify/memory/constitution.md)

## Development and deployment

The recommended stack is React, TypeScript, and Vite, with a Node.js/TypeScript
content import tool and a separate Playwright test project. These are design
decisions for the MVP, not yet implemented. Setup, test, import, and deployment
commands will be documented here once the project plan and implementation
establish them.
