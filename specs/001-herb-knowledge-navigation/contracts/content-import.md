# Content Import Contract

This contract defines the boundary between the owner-curated Markdown export, the import
process, and the read-only web app. It is an internal build-time contract, not a public network
API.

## Input location and publication boundary

- The CLI input records are minimal Markdown files placed in `content/approved/`.
- The separate local **Content Curator** app may read source Markdown files explicitly selected by the
  owner. It processes file contents in the browser and does not upload them.
- For source notes, the page copies allowlisted frontmatter and extracts only the five recognized
  herb-template H3 sections under `## 🧪 Apothecary & Applications`. All other note-body text and
  unsupported frontmatter fields are excluded.
- The page previews the exact fields to export, identifies missing subsection headings and
  ignored frontmatter field names, and requires a separate owner approval checkbox for each
  record before creating a ZIP of minimal records.
- The owner extracts that ZIP into the repository root; the CLI then reads only
  `content/approved/`, consumes allowlisted frontmatter, and ignores each curated file's body.
- Every file in the input folder is presumed owner-approved for publication and must contain
  only content intended for the public app and repository.

The source vault is never modified. The selection page makes no network request containing file
contents. The owner remains responsible for reviewing the displayed values and approving each
record; preparing an archive does not deploy or publish it.
The curator app runs separately at `http://127.0.0.1:5174/` using `npm run curator:dev`, binds
to loopback by default, and is not included in the reader app's production build.

## Supported frontmatter

```yaml
type: herb # herb, action, or health_challenge
title: German Chamomile # optional; defaults to source filename
aliases:
  - True Chamomile
summary: Short owner-approved educational summary.
source: Owner-approved attribution or reference.
actions:
  - "[[Nervine]]"
health_challenges:
  - "[[Nervous Tension]]"
apothecaryApplications:
  keyChallengesAddressed: >-
    Owner-approved content copied from the matching herb-template subsection.
  bestPreparations: >-
    Owner-approved content copied from the matching herb-template subsection.
  preparationNotes: >-
    Owner-approved content copied from the matching herb-template subsection.
  keyChemistryMechanics: >-
    Owner-approved content copied from the matching herb-template subsection.
  safetyContraindications: >-
    Owner-approved content copied from the matching herb-template subsection.
```

Allowed relationship fields by source type:

- `herb`: `actions`, `health_challenges`
- `health_challenge`: `actions`
- `action`: no relationship fields are permitted; reverse relationships are derived

The optional `apothecaryApplications` object is allowed only on herb records. Its optional
plain-text fields map one-to-one to the five H3 subsections under the Herb Template's
`## 🧪 Apothecary & Applications` heading: `keyChallengesAddressed` (Key Challenges Addressed),
`bestPreparations` (Best Preparations), `preparationNotes` (Preparation Notes & Apothecary
Secrets), `keyChemistryMechanics` (Key Chemistry & Mechanics), and `safetyContraindications`
(Safety & Contraindications). The owner-curated export copies only approved subsection content
into these fields. Do not parse or publish the rest of the Markdown body, and do not infer
values from other headings. Omit unavailable or unapproved fields; preserve approved paragraph
text as plain text.

The importer supports `[[Target]]` and `[[Target|Display text]]` references in relationship
frontmatter values. The display text is not an identifier. Targets resolve against approved
record titles, filenames, and aliases; each target must resolve uniquely and to an allowed
entry type. Heading links, block links, and links in Markdown bodies are unsupported in the
MVP and must not be treated as relationships.

## Output shape

The importer emits deterministic JSON with a schema version and normalized entries:

```json
{
  "schemaVersion": 1,
  "entries": [
    {
      "id": "herb:german-chamomile",
      "type": "herb",
      "name": "German Chamomile",
      "aliases": [],
      "challengeIds": ["challenge:nervous-tension"],
      "actionIds": ["action:nervine"],
      "herbIds": [],
      "apothecaryApplications": {
        "bestPreparations": "Owner-approved preparation text."
      }
    }
  ]
}
```

Optional text fields may be omitted when unavailable. Relationship arrays are always present in
the generated catalog and contain unique IDs. Generated IDs use normalized type and source
slug; any collision is an error. Frontmatter parsing and shape validation are separate steps;
malformed YAML and malformed field values must produce file-specific errors. Validate the
apothecary subsection object and fields against the herb-only allowlist; reject it on challenge
or action records and reject unknown subsection keys. Do not add `image` values in this MVP; a
future schema version may add optional fields without making them required for existing entries.

## Validation behavior

The import command must:

- Fail with a non-zero exit status and actionable diagnostics for invalid required data.
- Identify each issue by source file and field or wikilink.
- Reject missing/unknown entry types, empty names, malformed relationship values, duplicate
  IDs, ambiguous targets, missing targets, and links to the wrong entry type.
- Emit no new publishable catalog if validation fails.
- Avoid silently ignoring or inventing relationships.
- Validate an empty approved-content folder as an empty catalog. The deployment workflow must
  skip publication unless at least one Markdown record is present in `content/approved/`.

## App navigation contract

- A browse view lists entries of one type and links to that entry's detail view.
- Detail views show the entry's name, approved summary/source where present, and links to
  related entries by type.
- Link targets resolve to the corresponding published detail view; missing IDs produce a
  not-found state rather than a broken page.
- An action view exposes its associated challenges and herbs, including alternative herbs
  sharing that action.
- Herb detail views display the Apothecary & Applications heading and each populated subsection
  as an independently collapsible disclosure; omit subsections without approved content.
- The shared app layout displays the educational disclaimer on browse and detail views.
