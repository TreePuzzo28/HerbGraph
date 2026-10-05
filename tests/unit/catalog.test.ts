import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  getEntriesByType,
  getEntryById,
  getEntryType,
  loadCatalog,
  parseCatalog,
} from '../../src/data/catalog';

const fixturePath = resolve(process.cwd(), 'tests/fixtures/catalog.json');
const catalogFixture = parseCatalog(
  JSON.parse(await readFile(fixturePath, 'utf8')),
);

describe('catalog helpers', () => {
  it('parses the synthetic test catalog', () => {
    expect(parseCatalog(catalogFixture)).toEqual(catalogFixture);
  });

  it('finds entries by id and safely returns undefined when missing', () => {
    expect(getEntryById(catalogFixture, 'herb:sample-leaf')?.name).toBe(
      'Sample Leaf',
    );
    expect(getEntryById(catalogFixture, 'herb:not-published')).toBeUndefined();
  });

  it('filters entries by type and normalizes the source challenge type', () => {
    expect(getEntriesByType(catalogFixture, 'action')).toHaveLength(2);
    expect(getEntryType('health_challenge')).toBe('challenge');
    expect(getEntryType('unknown')).toBeUndefined();
  });

  it('loads and validates the published catalog', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(catalogFixture), { status: 200 }),
    );

    await expect(loadCatalog(fetcher)).resolves.toEqual(catalogFixture);
    expect(fetcher).toHaveBeenCalledWith(
      expect.stringMatching(/\/data\/catalog\.json$/),
    );
  });

  it('reports a failed catalog request instead of hiding it', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(null, { status: 503 }),
    );

    await expect(loadCatalog(fetcher)).rejects.toThrow(
      'Could not load the published catalog (503).',
    );
  });

  it('rejects catalog fields outside the published allowlist', () => {
    expect(() =>
      parseCatalog({
        ...catalogFixture,
        unexpected: true,
      }),
    ).toThrow();
  });
});
