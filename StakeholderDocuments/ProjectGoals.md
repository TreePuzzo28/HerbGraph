# Project goals

Build a web-based Herb Knowledge Explorer from a curated portion of the project owner's Obsidian herb reference. The app will let readers browse health challenges, herb actions, and herbs, and follow the relationships between them.

## Purpose

The app makes the linked information in the Obsidian reference easier to explore. For example, a reader can start with a health challenge such as stress, open a related action such as anti-anxiety, choose an associated herb such as lemon balm, and then explore other herbs associated with that same action.

The app presents educational reference material. It does not diagnose health conditions or recommend treatment.

## Target scope

The MVP is a read-only web application for browsing a selected, approved set of notes. It is intended to be deployed so that users can access it in a browser.

The MVP includes:

- Browse lists of health challenges, actions, and herbs
- Open a detail view for each type of entry
- Navigate from a health challenge to a related action, from that action to its herbs, and between herbs that share that action
- Show a short summary and source information when available
- Keep a user-visible educational disclaimer in the main app layout on every page
- A repeatable process for importing approved Obsidian Markdown notes, validating their links, building the app data, and redeploying the updated app
- Separate Playwright end-to-end tests for the deployed or locally hosted web app

The MVP does not include user accounts, editing notes in the app, live access to an Obsidian vault, or a database.

## Data update approach

Obsidian remains the place where the owner edits the source material. To publish an update, the owner will:

1. Select or export the notes approved for the app.
2. Run the app's import/build process.
3. Review any validation errors, such as missing required fields or unresolved links.
4. Build and deploy the updated web app.

The deployed app will use the data produced by this process; it will not connect directly to the owner's vault. Only content approved for publication should be included in the export and deployment.

## What "MVP working" means

The MVP is complete when:

1. The deployed app opens in a supported web browser.
2. A reader can browse the health challenge, action, and herb lists and open their detail views.
3. Starting at a challenge, the reader can follow its related action to an herb and then select another herb linked to the same action.
4. The educational disclaimer is visible in the main app layout while browsing any page.
5. Re-running the documented import/build/deploy process makes approved Obsidian changes visible in the deployed app.
6. A separate Playwright test project verifies the main browsing path in the running web app.
7. The import/build process can be repeated with updated approved notes and produces data that is shown by the app.

## Quality and content expectations

- Keep the MVP focused on browsing the existing relationships rather than adding a general-purpose knowledge-management system.
- Preserve links between entries and report broken or ambiguous links during import instead of silently dropping them.
- Show source or attribution information where available.
- Review all published material for accuracy, privacy, and permission to publish. The app is informational and is not a substitute for professional medical advice.

## Future enhancements

After the MVP is deployed and its import process is reliable, possible enhancements include richer graph visualization, more advanced search and filtering, additional content formats, and automated deployment when approved content changes. These are not MVP requirements.

## How this document fits with the others

- [AppFeatures.md](AppFeatures.md) describes the user-facing behavior and MVP boundaries.
- [TechStack.md](TechStack.md) describes the recommended implementation, data import, testing, and deployment approach.
