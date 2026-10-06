import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const appRoot = fileURLToPath(new URL('../..', import.meta.url));
const baseURL = 'http://127.0.0.1:5174/';

export default defineConfig({
  testDir: './curator',
  fullyParallel: true,
  reporter: [['list'], ['html', { outputFolder: 'curator-report', open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run curator:dev -- --host 127.0.0.1 --port 5174 --strictPort',
    cwd: appRoot,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
