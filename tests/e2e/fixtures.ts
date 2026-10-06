import { readFileSync } from 'node:fs';
import { test as base } from '@playwright/test';

const fixtureCatalog = JSON.parse(
  readFileSync(new URL('../fixtures/catalog.json', import.meta.url), 'utf8'),
);

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/data/catalog.json', (route) =>
      route.fulfill({ json: fixtureCatalog }),
    );
    await use(page);
  },
});

export { expect } from '@playwright/test';
