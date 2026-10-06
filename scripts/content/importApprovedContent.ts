import { randomUUID } from 'node:crypto';
import { mkdir, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import type { PublishedCatalog } from '../../src/types/catalog';
import { parseSourceRecord } from './parseSourceRecord';
import { resolveRelationships } from './resolveRelationships';

export interface ImportOptions {
  inputDir: string;
  outputFile: string;
  mode?: 'strict' | 'lenient' | 'auto-stub';
}

export async function importApprovedContent({
  inputDir,
  outputFile,
  mode = 'auto-stub',
}: ImportOptions): Promise<PublishedCatalog> {
  const sourceFiles = (await readdir(inputDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.md'))
    .map((entry) => join(inputDir, entry.name))
    .sort((left, right) => basename(left).localeCompare(basename(right), 'en'));

  const parseErrors: string[] = [];
  const records = [];
  for (const sourcePath of sourceFiles) {
    try {
      records.push(parseSourceRecord(sourcePath, await readFile(sourcePath, 'utf8')));
    } catch (error) {
      parseErrors.push(error instanceof Error ? error.message : String(error));
    }
  }
  if (parseErrors.length > 0) {
    throw new Error(parseErrors.join('\n'));
  }

  const catalog = resolveRelationships(records, { mode, inputDir });
  await mkdir(dirname(outputFile), { recursive: true });
  const temporaryPath = `${outputFile}.${randomUUID()}.tmp`;
  try {
    await writeFile(
      temporaryPath,
      `${JSON.stringify(catalog, null, 2)}\n`,
      'utf8',
    );
    await rename(temporaryPath, outputFile);
  } catch (error) {
    await rm(temporaryPath, { force: true });
    throw error;
  }
  return catalog;
}
