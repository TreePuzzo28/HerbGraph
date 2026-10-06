import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { importApprovedContent } from './content/importApprovedContent';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

try {
  const catalog = await importApprovedContent({
    inputDir: resolve(repositoryRoot, 'content/approved'),
    outputFile: resolve(repositoryRoot, 'public/data/catalog.json'),
  });
  console.info(
    `Imported ${catalog.entries.length} approved catalog entries.`,
  );
} catch (error) {
  console.error(
    error instanceof Error ? error.message : 'Unknown content import error.',
  );
  process.exitCode = 1;
}
