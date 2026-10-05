# Content Import Contract

This contract defines the boundary between the owner-curated Markdown export, the import
process, and the read-only web app. It is an internal build-time contract, not a public network
API.

## Input location and publication boundary

- Input records are Markdown files placed explicitly in `content/approved/`.
- These are minimal, curated publication records, not unfiltered copies of full vault notes.
- Only allowlisted frontmatter fields are consumed; Markdown body content is ignored.
- Every file in the input folder is presumed owner-approved for publication and must contain
  only content intended for the public app and repository.

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
```

Allowed relationship fields by source type:

- `herb`: `actions`, `health_challenges`
- `health_challenge`: `actions`
- `action`: no relationship fields required; reverse relationships are derived

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
      "id": "action:nervine",
      "type": "action",
      "name": "Nervine",
      "aliases": [],
      "challengeIds": ["challenge:nervous-tension"],
      "actionIds": [],
      "herbIds": ["herb:german-chamomile"]
    }
  ]
}
```

Optional text fields may be omitted when unavailable. Relationship arrays are always present in
the generated catalog and contain unique IDs. Generated IDs use normalized type and source
slug; any collision is an error. Frontmatter parsing and shape validation are separate steps;
malformed YAML and malformed field values must produce file-specific errors. Do not add `image`
values in this MVP; a future schema
version may add optional fields without making them required for existing entries.

## Validation behavior

The import command must:

- Fail with a non-zero exit status and actionable diagnostics for invalid required data.
- Identify each issue by source file and field or wikilink.
- Reject missing/unknown entry types, empty names, malformed relationship values, duplicate
  IDs, ambiguous targets, missing targets, and links to the wrong entry type.
- Emit no new publishable catalog if validation fails.
- Avoid silently ignoring or inventing relationships.

## App navigation contract

- A browse view lists entries of one type and links to that entry's detail view.
- Detail views show the entry's name, approved summary/source where present, and links to
  related entries by type.
- Link targets resolve to the corresponding published detail view; missing IDs produce a
  not-found state rather than a broken page.
- An action view exposes its associated challenges and herbs, including alternative herbs
  sharing that action.
- The shared app layout displays the educational disclaimer on browse and detail views.
