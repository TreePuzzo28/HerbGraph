# Quickstart: Herb Knowledge Navigation

This guide describes the implemented import, validation, test, and deployment flow.

## Prerequisites

- Node.js 22 LTS or newer supported LTS and npm.
- A local checkout of the HerbGraph repository.
- A curated, approved dataset in `content/approved/`; do not copy unapproved vault content.

## Select, review, and approve content

1. Install root dependencies if needed:

   ```sh
   npm ci
   ```

2. Start the separate Content Curator app:

   ```sh
   npm run curator:dev
   ```

3. Open `http://127.0.0.1:5174/`, select the Markdown records you want considered, and review
   every displayed field. This is a separate localhost app; processing happens in the browser,
   and selected source files are not uploaded or modified.
4. Check the approval box only for each record you approve. Review all five herb subsections;
   the page shows when a heading is absent and identifies frontmatter keys it will ignore.
5. Resolve any relationship errors, then download the approved-record ZIP. Extract it at the
   repository root so its files land in `content/approved/`. This action prepares records; it
   does not commit or deploy them. The curator app runs on its own server and is not included in
   the reader app's production build.

## Validate and run locally

1. Import and validate the approved minimal records:

   ```sh
   npm run content:import
   ```

2. Review `public/data/catalog.json`. With the checked-in empty approved-content folder, the
   importer produces an empty catalog; no real vault records have been approved or added.
3. Build the app; this reruns import validation before creating production assets:

   ```sh
   npm run build
   ```

4. Install and run the separate Playwright project:

   ```sh
   npm ci --prefix tests/e2e
   npm run test:e2e --prefix tests/e2e
   npm run test:curator --prefix tests/e2e
   ```

5. Open the generated HTML report:

   ```sh
   npm run test:e2e:report --prefix tests/e2e
   ```

   Confirm each browser scenario appears as its own plain-English result. The
   report is generated locally under `tests/e2e/playwright-report/` and is not
   committed.

6. Verify the following browser path: open a challenge, follow an action, open an herb, return
   to the action, and select an alternative herb. Also verify the disclaimer on browse and
   detail pages and the empty/not-found states.

## Deployment validation

1. Confirm that the approved export contains no private or unapproved information.
2. Run content validation, build, unit tests, and Playwright tests.
3. Configure repository Pages to use GitHub Actions. The workflow validates pull
   requests and pushes to `main`; it deploys only on `main` when at least one
   Markdown record exists in `content/approved/`. Do not add records until their
   publication has been explicitly approved.
4. Open the deployed URL and repeat the challenge → action → herb → alternative herb path.
5. Update an approved source record, repeat import/build/deploy, and verify the update appears
   in the deployed app.
6. Update the relevant user-guide instructions and screenshots as each user-facing feature is
   accepted; before delivery, compare all screenshots and instructions with the deployed build.
7. Add customer-visible changes to the `Unreleased` section in `CHANGELOG.md`. For each
   customer delivery, prepare a dated/versioned release-notes entry and include the current
   guide, screenshots, release notes, and Playwright HTML report with that delivery.

The app is not considered ready for deployment if import validation or required tests fail, or
if the customer guide, screenshots, release notes, or corresponding test report are missing or
do not match the delivery.
