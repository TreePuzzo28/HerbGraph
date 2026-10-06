import { expect, test } from '../fixtures';

const disclaimerText =
  'Educational information only. This content is not medical advice and is not intended to diagnose, treat, cure, or prevent any condition. Consult a qualified healthcare professional about health concerns.';

async function expectDisclaimerVisible(page: import('@playwright/test').Page) {
  await expect(
    page.getByRole('complementary', { name: 'Educational disclaimer' }),
  ).toContainText(disclaimerText);
}

test('the educational disclaimer is visible on the health challenges browse page', async ({
  page,
}) => {
  await page.goto('./#/challenges');

  await expect(
    page.getByRole('heading', { name: 'Health challenges' }),
  ).toBeVisible();
  await expectDisclaimerVisible(page);
});

test('the educational disclaimer is visible on the actions browse page', async ({
  page,
}) => {
  await page.goto('./#/actions');

  await expect(page.getByRole('heading', { name: 'Actions' })).toBeVisible();
  await expectDisclaimerVisible(page);
});

test('the educational disclaimer is visible on the herbs browse page', async ({
  page,
}) => {
  await page.goto('./#/herbs');

  await expect(page.getByRole('heading', { name: 'Herbs' })).toBeVisible();
  await expectDisclaimerVisible(page);
});

test('the educational disclaimer is visible on the app home page', async ({
  page,
}) => {
  await page.goto('./#/');

  await expect(page.getByRole('heading', { name: 'Explore entries' })).toBeVisible();
  await expectDisclaimerVisible(page);
});

test('the educational disclaimer is visible on an entry detail page', async ({
  page,
}) => {
  await page.goto('./#/entry/challenge:restless-mind');

  await expect(
    page.getByRole('heading', { name: 'Restless Mind' }),
  ).toBeVisible();
  await expectDisclaimerVisible(page);
});

test('the educational disclaimer is visible on the not-found page', async ({
  page,
}) => {
  await page.goto('./#/unknown-page');

  await expect(page.getByRole('heading', { name: 'Entry not found' })).toBeVisible();
  await expectDisclaimerVisible(page);
});

test('the educational disclaimer remains visible while navigating between entries', async ({
  page,
}) => {
  await page.goto('./#/entry/challenge:restless-mind');
  await expectDisclaimerVisible(page);

  await page.getByRole('link', { name: 'Calming' }).click();
  await expect(page.getByRole('heading', { name: 'Calming' })).toBeVisible();
  await expectDisclaimerVisible(page);
});
