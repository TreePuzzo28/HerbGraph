# Quickstart: Herb Knowledge Navigation

This guide describes the planned local validation flow. Exact package scripts are established
when implementation tasks are completed; the command names below are the intended interface.

## Prerequisites

- Node.js 22 LTS or newer supported LTS and npm.
- A local checkout of the HerbGraph repository.
- A curated, approved dataset in `content/approved/`; do not copy unapproved vault content.

## Prepare and validate content

1. Create or update minimal Markdown records in `content/approved/` using
   [the content import contract](./contracts/content-import.md).
2. Run the import/validation command:

   ```sh
   npm run content:import
   ```

3. Confirm valid input generates `public/data/catalog.json`.
4. Try a representative invalid link in a temporary test fixture and confirm the command
   reports the source file and link and does not produce a publishable catalog. Do not commit
   the deliberately invalid fixture.

## Run and test locally

1. Install dependencies from the repository root:

   ```sh
   npm install
   ```

2. Build the app with the generated catalog:

   ```sh
   npm run build
   ```

3. Start the local app:

   ```sh
   npm run dev
   ```

4. In a separate terminal, run the Playwright project from `tests/e2e`:

   ```sh
   npm install --prefix tests/e2e
   npm run test:e2e --prefix tests/e2e
   ```

5. Open the generated HTML report:

   ```sh
   npm run test:e2e:report --prefix tests/e2e
   ```

   Confirm each US1-US4 browser scenario appears as its own plain-English
   result. For a customer delivery, retain the complete report directory with the matching app
   version or commit and test-run date.

6. Verify the following browser path: open a challenge, follow an action, open an herb, return
   to the action, and select an alternative herb. Also verify the disclaimer on browse and
   detail pages and the empty/not-found states.

## Deployment validation

1. Confirm that the approved export contains no private or unapproved information.
2. Run content validation, build, unit tests, and Playwright tests.
3. Deploy the static build to GitHub Pages after repository Pages settings and deployment
   workflow are configured.
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
