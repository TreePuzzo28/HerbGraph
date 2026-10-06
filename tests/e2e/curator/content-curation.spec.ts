import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { strFromU8, unzipSync } from 'fflate';
import { expect, test } from '../fixtures';

const validFixtures = fileURLToPath(
  new URL('../../unit/fixtures/content-import/valid/', import.meta.url),
);

test('selected Markdown stays local and only explicitly approved records are exported', async ({
  page,
}) => {
  await page.goto('/');
  const requestBodies: string[] = [];
  page.on('request', (request) => {
    const body = request.postData();
    if (body) requestBodies.push(body);
  });
  await page.locator('input[type="file"]').setInputFiles([
    resolve(validFixtures, 'German Chamomile.md'),
    resolve(validFixtures, 'Restless Mind.md'),
    resolve(validFixtures, 'Calming.md'),
  ]);

  await expect(page.getByText('This body must never be published')).toHaveCount(
    0,
  );
  await expect(
    page.getByRole('button', {
      name: 'Download approved import files (.zip)',
    }),
  ).toHaveCount(0);
  await expect(
    page.getByText('This body must never be published'),
  ).toHaveCount(0);

  for (const checkbox of await page
    .locator('.approval-control input')
    .all()) {
    await checkbox.check();
  }
  const downloadButton = page.getByRole('button', {
    name: 'Download approved import files (.zip)',
  });
  await expect(downloadButton).toBeEnabled();
  const downloadPromise = page.waitForEvent('download');
  await downloadButton.click();
  const download = await downloadPromise;
  const archive = unzipSync(
    await readFile(await download.path()),
  );
  const outputPaths = Object.keys(archive).sort();
  expect(outputPaths).toEqual([
    'content/approved/Calming.md',
    'content/approved/German Chamomile.md',
    'content/approved/Restless Mind.md',
  ]);
  const herbOutput = strFromU8(
    archive['content/approved/German Chamomile.md'],
  );
  expect(herbOutput).toContain('Synthetic preparation paragraph one.');
  expect(herbOutput).not.toContain('This body must never be published');
  expect(herbOutput).not.toContain('<script>');
  expect(requestBodies.join('\n')).not.toContain(
    'Synthetic preparation paragraph one.',
  );
});

test('the page blocks export when an approved relationship target is missing', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .locator('input[type="file"]')
    .setInputFiles(resolve(validFixtures, 'German Chamomile.md'));
  await page.locator('.approval-control input').check();

  await expect(page.getByRole('alert')).toContainText(
    'not among the approved records',
  );
  await expect(
    page.getByRole('button', {
      name: 'Download approved import files (.zip)',
    }),
  ).toBeDisabled();
});

test('the review lists each missing herb subsection before approval', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .locator('input[type="file"]')
    .setInputFiles(resolve(validFixtures, 'Sparse Herb.md'));

  await expect(
    page.getByText(
      'Not found in the selected note — this subsection will not be included.',
    ),
  ).toHaveCount(5);
});

test('multiple sequential file selections accumulate records instead of clearing', async ({
  page,
}) => {
  // REGRESSION TEST: This test catches a bug where file selections would clear
  // instead of accumulate. The bug occurred when users:
  // 1. Selected herb via "Choose File"
  // 2. Switched to actions folder and selected action via "Choose File" again
  //    → herb would disappear
  // 3. Switched to challenges and selected challenge
  //    → both herb and action would disappear
  //
  // ROOT CAUSE: setItems(uniqueItems) was replacing state instead of appending
  // with setItems([...items, ...uniqueItems])
  //
  // EXISTING TESTS MISSED THIS: The first test in this file calls
  // setInputFiles([file1, file2, file3]) ONCE with all files, simulating
  // bulk upload. This doesn't trigger the bug because the state handler is
  // only called once. Real users click "Choose File" multiple times (sequential
  // interactions), calling setInputFiles() multiple times, which triggers the bug.
  //
  // LESSON: Test progressive/sequential workflows separately from bulk workflows.
  // See tests/e2e/TESTING-PATTERNS.md for more guidance.

  await page.goto('/');
  const fileInput = page.locator('input[type="file"]');

  // First selection: add a herb
  await fileInput.setInputFiles(resolve(validFixtures, 'German Chamomile.md'));
  await expect(page.getByRole('heading', { name: 'German Chamomile' })).toBeVisible();
  await expect(page.getByText('Total records')).toContainText('1');

  // Second selection: add an action (herb should still be visible)
  await fileInput.setInputFiles(resolve(validFixtures, 'Calming.md'));
  await expect(page.getByRole('heading', { name: 'German Chamomile' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Calming' })).toBeVisible();
  await expect(page.getByText('Total records')).toContainText('2');

  // Third selection: add a health challenge (both should still be visible)
  await fileInput.setInputFiles(
    resolve(validFixtures, 'Restless Mind.md'),
  );
  await expect(page.getByRole('heading', { name: 'German Chamomile' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Calming' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Restless Mind' })).toBeVisible();
  await expect(page.getByText('Total records')).toContainText('3');
});
