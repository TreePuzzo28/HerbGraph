import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { z } from 'zod';
import type {
  ApothecaryApplications,
  EntryType,
} from '../types/catalog';

const subsectionHeadings = {
  'key challenges addressed': 'keyChallengesAddressed',
  'best preparations': 'bestPreparations',
  'preparation notes apothecary secrets': 'preparationNotes',
  'key chemistry mechanics': 'keyChemistryMechanics',
  'safety contraindications': 'safetyContraindications',
} as const satisfies Record<string, keyof ApothecaryApplications>;

export const apothecarySectionFields = [
  { field: 'keyChallengesAddressed', heading: 'Key Challenges Addressed' },
  { field: 'bestPreparations', heading: 'Best Preparations' },
  {
    field: 'preparationNotes',
    heading: 'Preparation Notes & Apothecary Secrets',
  },
  { field: 'keyChemistryMechanics', heading: 'Key Chemistry & Mechanics' },
  { field: 'safetyContraindications', heading: 'Safety & Contraindications' },
] as const;

const apothecaryApplicationsSchema = z
  .object({
    keyChallengesAddressed: z.string().trim().min(1).optional(),
    bestPreparations: z.string().trim().min(1).optional(),
    preparationNotes: z.string().trim().min(1).optional(),
    keyChemistryMechanics: z.string().trim().min(1).optional(),
    safetyContraindications: z.string().trim().min(1).optional(),
  })
  .strict();

const sourceMetadataSchema = z
  .object({
    type: z.enum(['challenge', 'health_challenge', 'action', 'herb']),
    title: z.string().trim().min(1).optional(),
    aliases: z.array(z.string().trim().min(1)).optional(),
    summary: z.string().trim().min(1).optional(),
    source: z.string().trim().min(1).optional(),
    actions: z.array(z.string()).optional(),
    health_challenges: z.array(z.string()).optional(),
    apothecaryApplications: apothecaryApplicationsSchema.optional(),
  });

export interface CuratedRecord {
  filename: string;
  type: EntryType;
  title: string;
  aliases?: string[];
  summary?: string;
  source?: string;
  actions?: string[];
  health_challenges?: string[];
  apothecaryApplications?: ApothecaryApplications;
  omittedMetadataKeys: string[];
}

export interface CuratedRecordResult {
  record?: CuratedRecord;
  error?: string;
}

export function validateCuratedRelationships(
  records: CuratedRecord[],
  strict: boolean = true,
): string[] {
  const errors: string[] = [];
  const byLabel = new Map<string, CuratedRecord[]>();
  const normalize = (value: string) =>
    value.normalize('NFKC').trim().toLocaleLowerCase('en');

  for (const record of records) {
    const filenameTitle = record.filename
      .replace(/\.md$/i, '')
      .replace(/[_-]+/g, ' ')
      .trim();
    for (const label of new Set([
      record.title,
      filenameTitle,
      ...(record.aliases ?? []),
    ])) {
      const key = normalize(label);
      const owners = byLabel.get(key) ?? [];
      if (!owners.includes(record)) {
        owners.push(record);
      }
      byLabel.set(key, owners);
    }
  }

  for (const [label, owners] of byLabel) {
    if (owners.length > 1) {
      errors.push(
        `The selected records have an ambiguous title, filename, or alias: "${label}".`,
      );
    }
  }

  if (strict) {
    for (const record of records) {
      const relationships = [
        ...(record.actions ?? []).map((value) => ({
          field: 'actions',
          value,
          expectedType: 'action',
        })),
        ...(record.health_challenges ?? []).map((value) => ({
          field: 'health_challenges',
          value,
          expectedType: 'challenge',
        })),
      ];
      for (const relationship of relationships) {
        const match = /^\[\[([^\]|#^]+)(?:\|([^\]]+))?\]\]$/.exec(
          relationship.value.trim(),
        );
        if (!match || !match[1].trim() || (match[2] !== undefined && !match[2].trim())) {
          errors.push(
            `${record.filename}: ${relationship.field} has an unsupported link "${relationship.value}".`,
          );
          continue;
        }
        const target = match[1].trim();
        const matches = byLabel.get(normalize(target)) ?? [];
        if (matches.length === 0) {
          errors.push(
            `${record.filename}: ${relationship.field} links to "${target}", which is not among the approved records.`,
          );
        } else if (matches.length > 1) {
          errors.push(
            `${record.filename}: ${relationship.field} link "${target}" is ambiguous.`,
          );
        } else if (matches[0].type !== relationship.expectedType) {
          errors.push(
            `${record.filename}: ${relationship.field} link "${target}" must refer to a ${relationship.expectedType}.`,
          );
        }
      }
    }
  }

  return errors;
}

function normalizeHeading(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .toLocaleLowerCase('en');
}

function extractApothecarySections(body: string): ApothecaryApplications {
  const result: ApothecaryApplications = {};
  let inApothecarySection = false;
  let currentField: keyof ApothecaryApplications | undefined;
  let currentLines: string[] = [];

  const saveCurrentField = () => {
    const value = currentLines.join('\n').trim();
    if (currentField && value) {
      result[currentField] = value;
    }
    currentLines = [];
  };

  for (const line of body.replace(/\r\n?/g, '\n').split('\n')) {
    const heading = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!heading) {
      if (inApothecarySection && currentField) {
        currentLines.push(line);
      }
      continue;
    }

    const level = heading[1].length;
    const normalized = normalizeHeading(heading[2]);
    if (level === 2) {
      saveCurrentField();
      inApothecarySection =
        normalized === 'apothecary applications' ||
        normalized === 'apothecary and applications';
      currentField = undefined;
      continue;
    }

    if (!inApothecarySection || level !== 3) {
      continue;
    }

    saveCurrentField();
    currentField = subsectionHeadings[normalized as keyof typeof subsectionHeadings];
  }

  saveCurrentField();
  return result;
}

export function parseSourceForCuration(
  filename: string,
  contents: string,
): CuratedRecordResult {
  const normalizedContents = contents.replace(/\r\n?/g, '\n');
  const match = /^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)([\s\S]*)$/.exec(
    normalizedContents,
  );
  if (!match) {
    return { error: `${filename}: missing YAML frontmatter block.` };
  }

  let metadata: unknown;
  try {
    metadata = parseYaml(match[1]);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return { error: `${filename}: malformed YAML frontmatter: ${detail}` };
  }

  if (
    !metadata ||
    typeof metadata !== 'object' ||
    Array.isArray(metadata)
  ) {
    return { error: `${filename}: frontmatter must be a YAML mapping.` };
  }

  const parsed = sourceMetadataSchema.safeParse(metadata);
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || 'frontmatter'}: ${issue.message}`)
      .join('; ');
    return { error: `${filename}: ${detail}` };
  }

  const values = parsed.data;
  const type = values.type === 'health_challenge' ? 'challenge' : values.type;
  if (values.apothecaryApplications && type !== 'herb') {
    return {
      error: `${filename}: apothecaryApplications is allowed only on herb records.`,
    };
  }
  if (type === 'action' && (values.actions || values.health_challenges)) {
    return {
      error: `${filename}: action records cannot declare actions or health_challenges.`,
    };
  }
  if (type === 'challenge' && values.health_challenges) {
    return {
      error: `${filename}: health_challenges is allowed only on herb records.`,
    };
  }

  const title =
    values.title ??
    filename
      .replace(/\.md$/i, '')
      .replace(/[_-]+/g, ' ')
      .trim();
  const apothecaryApplications =
    type === 'herb'
      ? {
          ...values.apothecaryApplications,
          ...extractApothecarySections(match[2]),
        }
      : undefined;
  const record: CuratedRecord = {
    filename: filename.replaceAll('\\', '/').split('/').at(-1) ?? filename,
    type,
    title,
    ...(values.aliases ? { aliases: values.aliases } : {}),
    ...(values.summary ? { summary: values.summary } : {}),
    ...(values.source ? { source: values.source } : {}),
    ...(values.actions ? { actions: values.actions } : {}),
    ...(values.health_challenges
      ? { health_challenges: values.health_challenges }
      : {}),
    ...(apothecaryApplications &&
    Object.keys(apothecaryApplications).length > 0
      ? { apothecaryApplications }
      : {}),
    omittedMetadataKeys: Object.keys(metadata).filter(
      (key) =>
        !Object.hasOwn(sourceMetadataSchema.shape, key),
    ),
  };

  return { record };
}

export function serializeCuratedRecord(record: CuratedRecord): string {
  const metadata = {
    type: record.type,
    title: record.title,
    ...(record.aliases ? { aliases: record.aliases } : {}),
    ...(record.summary ? { summary: record.summary } : {}),
    ...(record.source ? { source: record.source } : {}),
    ...(record.actions ? { actions: record.actions } : {}),
    ...(record.health_challenges
      ? { health_challenges: record.health_challenges }
      : {}),
    ...(record.apothecaryApplications
      ? { apothecaryApplications: record.apothecaryApplications }
      : {}),
  };
  return `---\n${stringifyYaml(metadata)}---\n`;
}
