import { expect, test } from '../fixtures';

test('health challenge browsing lists only health challenges', async ({ page }) => {
  await page.goto('./#/challenges');

  await expect(
    page.getByRole('heading', { name: 'Health challenges' }),
  ).toBeVisible();
  const entryList = page.getByRole('list', { name: 'Health challenges' });
  await expect(entryList.getByRole('link')).toHaveCount(1);
  await expect(entryList.getByRole('link', { name: 'Restless Mind' })).toBeVisible();
});

test('action browsing lists only actions', async ({ page }) => {
  await page.goto('./#/actions');

  await expect(page.getByRole('heading', { name: 'Actions' })).toBeVisible();
  const entryList = page.getByRole('list', { name: 'Actions' });
  await expect(entryList.getByRole('link')).toHaveCount(2);
  await expect(entryList.getByRole('link', { name: 'Calming' })).toBeVisible();
  await expect(entryList.getByRole('link', { name: 'Grounding' })).toBeVisible();
});

test('herb browsing lists only herbs', async ({ page }) => {
  await page.goto('./#/herbs');

  await expect(page.getByRole('heading', { name: 'Herbs' })).toBeVisible();
  const entryList = page.getByRole('list', { name: 'Herbs' });
  await expect(entryList.getByRole('link')).toHaveCount(2);
  await expect(entryList.getByRole('link', { name: 'Sample Flower' })).toBeVisible();
  await expect(entryList.getByRole('link', { name: 'Sample Leaf' })).toBeVisible();
});

test('selecting a health challenge opens its detail page', async ({ page }) => {
  await page.goto('./#/challenges');
  await page.getByRole('link', { name: 'Restless Mind' }).click();

  await expect(
    page.getByRole('heading', { name: 'Restless Mind' }),
  ).toBeVisible();
});

test('selecting an action opens its detail page', async ({ page }) => {
  await page.goto('./#/actions');
  await page.getByRole('link', { name: 'Calming' }).click();

  await expect(page.getByRole('heading', { name: 'Calming' })).toBeVisible();
});

test('selecting an herb opens its detail page', async ({ page }) => {
  await page.goto('./#/herbs');
  await page.getByRole('link', { name: 'Sample Leaf' }).click();

  await expect(page.getByRole('heading', { name: 'Sample Leaf' })).toBeVisible();
});

test('an empty entry type shows a clear empty-list message', async ({ page }) => {
  await page.route('**/data/catalog.json', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ schemaVersion: 1, entries: [] }),
    });
  });
  await page.goto('./#/herbs');

  await expect(page.getByRole('heading', { name: 'Herbs' })).toBeVisible();
  await expect(page.getByText('No herbs are available yet.')).toBeVisible();
});
