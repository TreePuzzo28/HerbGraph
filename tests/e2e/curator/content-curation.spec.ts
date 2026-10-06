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
