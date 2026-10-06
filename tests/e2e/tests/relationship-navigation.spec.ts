import { expect, test } from '../fixtures';

test('readers can follow challenge, action, herb, and alternative herb links', async ({
  page,
}) => {
  await page.goto('./#/entry/challenge:restless-mind');
  await expect(
    page.getByRole('heading', { name: 'Restless Mind' }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Calming' }).click();
  await expect(page.getByRole('heading', { name: 'Calming' })).toBeVisible();
  await page.getByRole('link', { name: 'Sample Leaf' }).click();
  await expect(page.getByRole('heading', { name: 'Sample Leaf' })).toBeVisible();

  await page.getByRole('link', { name: 'Calming' }).click();
  await expect(page.getByRole('heading', { name: 'Calming' })).toBeVisible();
  await page.getByRole('link', { name: 'Sample Flower' }).click();
  await expect(page.getByRole('heading', { name: 'Sample Flower' })).toBeVisible();
});

test('readers can start from an action or herb and navigate in both directions', async ({
  page,
}) => {
  await page.goto('./#/entry/action:grounding');
  await expect(page.getByRole('heading', { name: 'Grounding' })).toBeVisible();
  await page.getByRole('link', { name: 'Restless Mind' }).click();
  await expect(
    page.getByRole('heading', { name: 'Restless Mind' }),
  ).toBeVisible();

  await page.goto('./#/entry/herb:sample-flower');
  await expect(page.getByRole('heading', { name: 'Sample Flower' })).toBeVisible();
  await page.getByRole('link', { name: 'Calming' }).click();
  await expect(page.getByRole('heading', { name: 'Calming' })).toBeVisible();
});

test('browser Back returns to the previously viewed entry', async ({ page }) => {
  await page.goto('./#/entry/challenge:restless-mind');
  await page.getByRole('link', { name: 'Calming' }).click();
  await expect(page.getByRole('heading', { name: 'Calming' })).toBeVisible();

  await page.goBack();

  await expect(
    page.getByRole('heading', { name: 'Restless Mind' }),
  ).toBeVisible();
});

test('unknown entry IDs show a useful not-found state', async ({ page }) => {
  await page.goto('./#/entry/herb:not-published');

  await expect(page.getByRole('heading', { name: 'Entry not found' })).toBeVisible();
  await expect(page.getByText(/may have been removed/i)).toBeVisible();
});
