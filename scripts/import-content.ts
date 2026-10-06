import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { importApprovedContent } from './content/importApprovedContent';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

// Parse command line args: --mode=strict|lenient|auto-stub (default: auto-stub)
const modeArg = process.argv.find((arg) => arg.startsWith('--mode='));
const mode = modeArg ? modeArg.replace('--mode=', '') : 'auto-stub';

try {
  const catalog = await importApprovedContent({
    inputDir: resolve(repositoryRoot, 'content/approved'),
    outputFile: resolve(repositoryRoot, 'public/data/catalog.json'),
    mode: mode as 'strict' | 'lenient' | 'auto-stub',
  });
  console.info(
    `Imported ${catalog.entries.length} approved catalog entries (mode: ${mode}).`,
  );
} catch (error) {
  console.error(
    error instanceof Error ? error.message : 'Unknown content import error.',
  );
  process.exitCode = 1;
}
