import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { parseSourceRecord } from '../../scripts/content/parseSourceRecord';
import { importApprovedContent } from '../../scripts/content/importApprovedContent';

const fixturesDir = resolve(process.cwd(), 'tests/unit/fixtures/content-import');
const temporaryDirs: string[] = [];

async function makeTemporaryDirectory() {
  const directory = await mkdtemp(join(tmpdir(), 'herbgraph-import-test-'));
  temporaryDirs.push(directory);
  return directory;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirs.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

describe('source record parsing', () => {
  it('parses the allowlisted herb subsections and ignores Markdown body content', async () => {
    const filePath = join(fixturesDir, 'valid/German Chamomile.md');
    const source = await readFile(filePath, 'utf8');
    const record = parseSourceRecord(filePath, source);

    expect(record.type).toBe('herb');
    expect(record.apothecaryApplications?.bestPreparations).toContain(
      '\n\nSynthetic preparation paragraph two.',
    );
    expect(JSON.stringify(record)).not.toContain('privateNote');
    expect(JSON.stringify(record)).not.toContain('<script>');
  });

  it('reports malformed YAML with the source filename', async () => {
    const filePath = join(fixturesDir, 'invalid/malformed-yaml.md');
    const source = await readFile(filePath, 'utf8');

    expect(() => parseSourceRecord(filePath, source)).toThrow(
      /malformed-yaml\.md.*frontmatter/i,
    );
  });
});

describe('approved content import', () => {
  it('resolves links, derives inverse relationships, and emits deterministic allowlisted output', async () => {
    const inputDir = join(fixturesDir, 'valid');
    const outputDir = await makeTemporaryDirectory();
    const outputFile = join(outputDir, 'catalog.json');
    const first = await importApprovedContent({ inputDir, outputFile });
    const firstContents = await readFile(outputFile, 'utf8');
    const second = await importApprovedContent({ inputDir, outputFile });
    const secondContents = await readFile(outputFile, 'utf8');

    expect(first).toEqual(second);
    expect(firstContents).toBe(secondContents);
    expect(first.entries.find(({ type }) => type === 'action')).toMatchObject({
      challengeIds: ['challenge:restless-mind'],
      herbIds: ['herb:german-chamomile'],
    });
    expect(first.entries.find(({ type }) => type === 'herb')).toMatchObject({
      apothecaryApplications: {
        bestPreparations:
          'Synthetic preparation paragraph one.\n\nSynthetic preparation paragraph two.',
      },
    });
    expect(firstContents).not.toContain('This body must never be published');
    expect(firstContents).not.toContain('<script>');
    expect(firstContents).not.toContain(fixturesDir);
    const allowedOutputFields = new Set([
      'id',
      'type',
      'name',
      'aliases',
      'summary',
      'source',
      'challengeIds',
      'actionIds',
      'herbIds',
      'apothecaryApplications',
    ]);
    expect(
      first.entries.every((entry) =>
        Object.keys(entry).every((key) => allowedOutputFields.has(key)),
      ),
    ).toBe(true);
  });

  it.each([
    'missing-target.md',
    'wrong-type-target.md',
    'unknown-subsection.md',
    'malformed-wikilink.md',
    'non-herb-subsections.md',
    'actions-on-action.md',
    'health-challenges-on-challenge.md',
  ])('rejects invalid source data (%s) without replacing a prior catalog', async (fixture) => {
    const inputDir = await makeTemporaryDirectory();
    const outputDir = await makeTemporaryDirectory();
    const outputFile = join(outputDir, 'catalog.json');
    const originalCatalog = '{"previous":"catalog"}\n';
    await writeFile(outputFile, originalCatalog);
    await writeFile(
      join(inputDir, fixture),
      await readFile(join(fixturesDir, 'invalid', fixture), 'utf8'),
    );

    await expect(
      importApprovedContent({ inputDir, outputFile, mode: 'strict' }),
    ).rejects.toThrow();
    await expect(readFile(outputFile, 'utf8')).resolves.toBe(originalCatalog);
  });

  it('allows duplicate aliases across records (aliases are metadata only)', async () => {
    const inputDir = await makeTemporaryDirectory();
    const outputDir = await makeTemporaryDirectory();
    const outputFile = join(outputDir, 'catalog.json');
    for (const fixture of [
      'duplicate-alias-a.md',
      'duplicate-alias-b.md',
    ]) {
      await writeFile(
        join(inputDir, fixture),
        await readFile(join(fixturesDir, 'invalid', fixture), 'utf8'),
      );
    }

    // Should succeed because we link via title, not aliases
    const result = await importApprovedContent({ inputDir, outputFile });
    expect(result.entries.length).toBe(2);
    expect(result.entries.every(e => e.type === 'herb')).toBe(true);
  });

  it('rejects duplicate normalized IDs across distinct filenames', async () => {
    const inputDir = await makeTemporaryDirectory();
    const outputFile = join(await makeTemporaryDirectory(), 'catalog.json');
    for (const [folder, filename] of [
      ['duplicate-id-one', 'Duplicate ID.md'],
      ['duplicate-id-two', 'Duplicate_ID.md'],
    ]) {
      await writeFile(
        join(inputDir, filename),
        await readFile(
          join(fixturesDir, 'invalid', folder, filename),
          'utf8',
        ),
      );
    }

    await expect(
      importApprovedContent({ inputDir, outputFile, mode: 'strict' }),
    ).rejects.toThrow(/duplicate entry ID "herb:duplicate-id"/i);
  });

  it('does not create an output catalog when any target is invalid', async () => {
    const inputDir = await makeTemporaryDirectory();
    const outputDir = await makeTemporaryDirectory();
    const outputFile = join(outputDir, 'catalog.json');
    await writeFile(
      join(inputDir, 'herb.md'),
      await readFile(join(fixturesDir, 'invalid/missing-target.md'), 'utf8'),
    );

    await expect(
      importApprovedContent({ inputDir, outputFile, mode: 'strict' }),
    ).rejects.toThrow(/missing-target|herb\.md/i);
    await expect(readFile(outputFile, 'utf8')).rejects.toMatchObject({
      code: 'ENOENT',
    });
  });
});
