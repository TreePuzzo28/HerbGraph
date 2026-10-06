# Data Model: Herb Knowledge Navigation

The published catalog is a normalized, read-only view of the explicitly approved source
records. Source notes declare relationships; the import process resolves those links and
generates inverse relationship lists so readers can navigate from any entry type.

## Entry

Represents one health challenge, action, or herb.

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | string | yes | Stable, unique identifier derived from entry type and normalized source path or slug. |
| `type` | enum | yes | Exactly `challenge`, `action`, or `herb`; source `health_challenge` normalizes to `challenge`. |
| `name` | string | yes | Non-empty display name derived from explicit metadata or source filename. |
| `aliases` | string array | no | Trimmed, non-empty alternate names; aliases must not ambiguously identify different entries. |
| `summary` | string | no | Short, owner-approved plain text; never inferred from the Markdown body. |
| `source` | string | no | Owner-approved attribution/reference text, displayed as plain text. |
| `challengeIds` | string array | yes | Resolved links to challenge entries; empty when no published relationship exists. |
| `actionIds` | string array | yes | Resolved links to action entries. |
| `herbIds` | string array | yes | Resolved links to herb entries. |
| `image` | reserved optional object | no | Future extension only; not populated or required in the MVP. |

## Herb-specific content

Herb entries may include an optional `apothecaryApplications` object corresponding to the
`## 🧪 Apothecary & Applications` section in the Herb Template. Its optional fields map to the
five `###` subsections in the template:

| Field | Source subsection | Type | Rules |
|---|---|---|---|
| `keyChallengesAddressed` | Key Challenges Addressed | string | Owner-approved content for this subsection. |
| `bestPreparations` | Best Preparations | string | Owner-approved content for this subsection. |
| `preparationNotes` | Preparation Notes & Apothecary Secrets | string | Owner-approved content for this subsection. |
| `keyChemistryMechanics` | Key Chemistry & Mechanics | string | Owner-approved content for this subsection. |
| `safetyContraindications` | Safety & Contraindications | string | Owner-approved content for this subsection. |

The subsection headings and their order are fixed by the template. Each value is optional and
contains only the corresponding approved subsection content; this object does not authorize
publishing the rest of a herb note body.

## Source records and relationship declarations

The curated Markdown export identifies each record with YAML frontmatter:

- All entry types provide a `type`.
- `title` is optional; when absent, the importer uses the filename as the name.
- `aliases`, `summary`, and `source` are optional.
- Herbs may declare `actions` and `health_challenges`.
- Challenges may declare `actions`.
- Actions are standalone definitions; their `herbIds` and `challengeIds` are derived from
  valid declarations on herb and challenge records.

Relationship values use supported Obsidian wikilinks (`[[Target]]` or
`[[Target|Display text]]`). Heading links and block links are unsupported in the MVP. Every link
must resolve to exactly one approved record of the expected type. The importer rejects
malformed values, missing targets, wrong-type targets, duplicate identifiers, and ambiguous
name/alias matches.

## Published Catalog

The app consumes a deterministic catalog containing a schema version and an array of entries.
The catalog contains only the allowlisted fields above and never includes Markdown bodies,
frontmatter unrelated to the app, local vault paths, Dataview code blocks, or raw HTML.

Relationships are stored as IDs, not duplicated rendered objects. At runtime, selectors resolve
those IDs to entries and provide consistent bidirectional navigation.

## State and transitions

Content has an authoring-to-publication lifecycle outside the application:

1. Source material is edited in Obsidian.
2. Owner selects source Markdown files in the browser-local preparation page. The page previews
   the allowlisted metadata and supported herb subsections, then exports only individually
   approved records without uploading or modifying source files.
3. Owner extracts the minimal records into `content/approved/`.
4. Import validates and normalizes entries; invalid input produces errors and no publishable
   catalog.
5. Valid catalog is built into the static app and deployed after a separate owner decision.

Readers do not mutate catalog data. Updates create a new static catalog/build.
