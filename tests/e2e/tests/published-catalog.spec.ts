import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '../fixtures';
import { importApprovedContent } from '../../../scripts/content/importApprovedContent';

const appRoot = fileURLToPath(new URL('../../..', import.meta.url));

test('an imported herb update appears in independent approved-content disclosures', async ({
  page,
}) => {
  const outputDir = await mkdtemp(join(tmpdir(), 'herbgraph-published-test-'));
  try {
    const catalog = await importApprovedContent({
      inputDir: resolve(
        appRoot,
        'tests/unit/fixtures/content-import/valid',
      ),
      outputFile: join(outputDir, 'catalog.json'),
    });
    await page.route('**/data/catalog.json', (route) =>
      route.fulfill({ json: catalog }),
    );
    await page.goto('./#/entry/herb:german-chamomile');

    await expect(
      page.getByRole('heading', { name: 'Apothecary & Applications' }),
    ).toBeVisible();
    const sections = page.locator('details');
    await expect(sections).toHaveCount(5);
    await expect(page.locator('details[open]')).toHaveCount(0);
    await expect(
      page.getByText('Synthetic preparation paragraph one.', { exact: false }),
    ).not.toBeVisible();

    await page.getByText('Best Preparations').click();

    await expect(
      page.getByText('Synthetic preparation paragraph one.', { exact: false }),
    ).toBeVisible();
    await expect(page.locator('details[open]')).toHaveCount(1);
    await expect(
      page.getByText('Synthetic safety subsection.', { exact: false }),
    ).not.toBeVisible();
    await expect(
      page.getByText('This body must never be published', { exact: false }),
    ).toHaveCount(0);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
