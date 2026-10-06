import matter from 'gray-matter';
import { parse as parseYaml } from 'yaml';
import { basename, extname } from 'node:path';
import { z } from 'zod';
import type { EntryType } from '../../src/types/catalog';
import type { SourceRecord } from './sourceRecord';

const apothecaryApplicationsSchema = z
  .object({
    keyChallengesAddressed: z.string().trim().min(1).optional(),
    bestPreparations: z.string().trim().min(1).optional(),
    preparationNotes: z.string().trim().min(1).optional(),
    keyChemistryMechanics: z.string().trim().min(1).optional(),
    safetyContraindications: z.string().trim().min(1).optional(),
  })
  .strict();

const sourceFrontmatterSchema = z
  .object({
    type: z.enum(['challenge', 'health_challenge', 'action', 'herb']),
    title: z.string().trim().min(1).optional(),
    aliases: z.array(z.string().trim().min(1)).optional(),
    summary: z.string().trim().min(1).optional(),
    source: z.string().trim().min(1).optional(),
    actions: z.array(z.string()).optional(),
    health_challenges: z.array(z.string()).optional(),
    apothecaryApplications: apothecaryApplicationsSchema.optional(),
  })
  .strict();

function normalizeEntryType(
  type: z.infer<typeof sourceFrontmatterSchema>['type'],
): EntryType {
  return type === 'health_challenge' ? 'challenge' : type;
}

function slugify(value: string): string {
  const slug = value
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  if (!slug) {
    throw new Error('filename does not produce a valid entry identifier');
  }
  return slug;
}

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const field = issue.path.length > 0 ? issue.path.join('.') : 'frontmatter';
      return `${field}: ${issue.message}`;
    })
    .join('; ');
}

export function parseSourceRecord(
  sourcePath: string,
  contents: string,
): SourceRecord {
  let data: unknown;
  try {
    data = matter(contents, {
      engines: {
        yaml: {
          parse: (text) => parseYaml(text),
        },
      },
    }).data;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`${sourcePath}: malformed YAML frontmatter: ${detail}`);
  }

  const parsed = sourceFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`${sourcePath}: ${formatIssues(parsed.error)}`);
  }

  const values = parsed.data;
  const type = normalizeEntryType(values.type);
  if (values.apothecaryApplications && type !== 'herb') {
    throw new Error(
      `${sourcePath}: apothecaryApplications is allowed only on herb records`,
    );
  }
  if (type === 'action' && (values.actions || values.health_challenges)) {
    throw new Error(
      `${sourcePath}: action records cannot declare actions or health_challenges`,
    );
  }
  if (type === 'challenge' && values.health_challenges) {
    throw new Error(
      `${sourcePath}: health_challenges is allowed only on herb records`,
    );
  }
  const filename = basename(sourcePath, extname(sourcePath));
  const name = values.title ?? filename.replace(/[_-]+/g, ' ').trim();
  let id: string;
  try {
    id = `${type}:${slugify(filename)}`;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`${sourcePath}: ${detail}`);
  }

  return {
    sourcePath,
    id,
    type,
    name,
    aliases: values.aliases ?? [],
    ...(values.summary ? { summary: values.summary } : {}),
    ...(values.source ? { source: values.source } : {}),
    actions: values.actions ?? [],
    healthChallenges: values.health_challenges ?? [],
    ...(values.apothecaryApplications
      ? { apothecaryApplications: values.apothecaryApplications }
      : {}),
  };
}
