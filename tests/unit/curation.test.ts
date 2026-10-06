import { describe, expect, it } from 'vitest';
import {
  parseSourceForCuration,
  serializeCuratedRecord,
  validateCuratedRelationships,
} from '../../src/content/curation';

describe('local content curation', () => {
  it('extracts only supported frontmatter and the five herb template subsections', () => {
    const result = parseSourceForCuration(
      'Demo Herb.md',
      `---
type: herb
aliases:
  - Demo Alias
privateMetadata: never export this
---
# Description
This body paragraph is not approved for export.
## 🧪 Apothecary & Applications
### Key Challenges Addressed
Approved challenge text.

Second paragraph.
### Best Preparations
Approved preparation text.
### Preparation Notes & Apothecary Secrets
Approved preparation notes.
### Key Chemistry & Mechanics
Approved chemistry text.
### Safety & Contraindications
Approved safety text.
## Other Notes
This other section must not be included.
`,
    );

    expect(result.error).toBeUndefined();
    expect(result.record).toMatchObject({
      type: 'herb',
      title: 'Demo Herb',
      aliases: ['Demo Alias'],
      omittedMetadataKeys: ['privateMetadata'],
      apothecaryApplications: {
        keyChallengesAddressed: 'Approved challenge text.\n\nSecond paragraph.',
        bestPreparations: 'Approved preparation text.',
        preparationNotes: 'Approved preparation notes.',
        keyChemistryMechanics: 'Approved chemistry text.',
        safetyContraindications: 'Approved safety text.',
      },
    });
    const serialized = serializeCuratedRecord(result.record!);
    expect(serialized).toContain('Approved safety text.');
    expect(serialized).not.toContain('privateMetadata');
    expect(serialized).not.toContain('This body paragraph');
    expect(serialized).not.toContain('This other section');
  });

  it('reports malformed frontmatter and invalid metadata clearly', () => {
    expect(
      parseSourceForCuration('bad.md', '---\ntype: [\n---\n'),
    ).toMatchObject({ error: expect.stringContaining('malformed YAML') });
    expect(
      parseSourceForCuration('missing.md', '## No frontmatter'),
    ).toMatchObject({ error: expect.stringContaining('missing YAML frontmatter') });
  });

  it('blocks exports with unresolved, malformed, or wrong-type relationships', () => {
    const herb = parseSourceForCuration(
      'Demo Herb.md',
      `---
type: herb
actions:
  - "[[Missing Action]]"
---
`,
    ).record!;
    expect(validateCuratedRelationships([herb])).toEqual([
      expect.stringContaining('not among the approved records'),
    ]);
  });

  it('does not mistake a record title and same filename for duplicate labels', () => {
    const herb = parseSourceForCuration(
      'Demo Herb.md',
      `---
type: herb
title: Demo Herb
---
`,
    ).record!;
    expect(validateCuratedRelationships([herb])).toEqual([]);
  });
});
