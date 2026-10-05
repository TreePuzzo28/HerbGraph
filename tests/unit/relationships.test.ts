import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  getAllRelatedEntries,
  getRelatedEntries,
} from '../../src/data/relationships';
import { parseCatalog } from '../../src/data/catalog';

const fixturePath = resolve(process.cwd(), 'tests/fixtures/catalog.json');
const catalog = parseCatalog(
  JSON.parse(await readFile(fixturePath, 'utf8')),
);
const sampleHerb = catalog.entries.find(
  (entry) => entry.id === 'herb:sample-leaf',
);

if (!sampleHerb) {
  throw new Error('The fixture is missing herb:sample-leaf.');
}

describe('relationship selectors', () => {
  it('resolves related IDs and removes duplicate references', () => {
    const action = catalog.entries.find(
      (entry) => entry.id === 'action:calming',
    );

    if (!action) {
      throw new Error('The fixture is missing action:calming.');
    }

    const relatedHerbs = getRelatedEntries(catalog, action, 'herbIds');

    expect(relatedHerbs.map((entry) => entry.id)).toEqual([
      'herb:sample-leaf',
      'herb:sample-flower',
    ]);
    expect(
      getRelatedEntries(catalog, { ...action, herbIds: ['unknown'] }, 'herbIds'),
    ).toEqual([]);
  });

  it('provides bidirectional links from a herb to its actions and challenges', () => {
    const relatedIds = getAllRelatedEntries(catalog, sampleHerb).map(
      (entry) => entry.id,
    );

    expect(relatedIds).toContain('action:calming');
    expect(relatedIds).toContain('action:grounding');
    expect(relatedIds).toContain('challenge:restless-mind');
  });
});
