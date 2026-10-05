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
    expect(
      getRelatedEntries(catalog, { ...action, herbIds: ['action:grounding'] }, 'herbIds'),
    ).toEqual([]);
  });

  it('resolves challenge-to-action and action-to-challenge relationships', () => {
    const challenge = catalog.entries.find(
      (entry) => entry.id === 'challenge:restless-mind',
    );
    const action = catalog.entries.find(
      (entry) => entry.id === 'action:calming',
    );

    if (!challenge || !action) {
      throw new Error('The relationship fixture is incomplete.');
    }

    expect(getRelatedEntries(catalog, challenge, 'actionIds').map(({ id }) => id))
      .toEqual(['action:calming', 'action:grounding']);
    expect(getRelatedEntries(catalog, action, 'challengeIds').map(({ id }) => id))
      .toEqual(['challenge:restless-mind']);
  });

  it('provides bidirectional links from herbs to actions and challenges', () => {
    const relatedIds = getAllRelatedEntries(catalog, sampleHerb).map(
      (entry) => entry.id,
    );

    expect(relatedIds).toContain('action:calming');
    expect(relatedIds).toContain('action:grounding');
    expect(relatedIds).toContain('challenge:restless-mind');
  });

  it('does not duplicate the same entry across relationship groups', () => {
    const challenge = catalog.entries.find(
      (entry) => entry.id === 'challenge:restless-mind',
    );

    if (!challenge) {
      throw new Error('The relationship fixture is missing its challenge.');
    }

    const relatedIds = getAllRelatedEntries(catalog, {
      ...challenge,
      actionIds: ['action:calming', 'action:calming'],
      challengeIds: ['challenge:restless-mind'],
    }).map(({ id }) => id);

    expect(relatedIds.filter((id) => id === 'action:calming')).toHaveLength(1);
  });
});
