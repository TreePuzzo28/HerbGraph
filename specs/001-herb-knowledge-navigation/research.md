# Research: Herb Knowledge Navigation

**Date**: 2026-10-05

## Static web app and deployment

- **Decision**: Use React, TypeScript, and Vite; deploy the static build to GitHub Pages for the
  initial release. Use hash-based routes so entry URLs work under the repository subpath without
  requiring server-side rewrite rules, and configure Vite's `base` to match the repository path.
- **Rationale**: This matches the stakeholder recommendation, avoids a backend, and uses the
  existing GitHub repository for a low-complexity static deployment. Hash routes avoid common
  static-host deep-link fallback problems. Hosting-specific configuration can be replaced if a
  different provider is selected.
- **Alternatives considered**: ASP.NET Core + Blazor (unneeded server/API complexity for this
  read-only MVP); path-based routing (requires a host fallback rule); another static host
  (remains viable if GitHub Pages constraints become unsuitable).

## Curated Obsidian content import

- **Decision**: Accept explicitly curated Markdown records with YAML frontmatter and a small
  supported set of Obsidian wikilinks. Parse frontmatter with gray-matter configured with a
  YAML 1.2 parser; validate parsed values with Zod. Resolve frontmatter link values for
  `[[Target]]` and `[[Target|Display text]]` against filename, title, and declared aliases.
  Reject heading/block links and other unsupported target syntax.
- **Rationale**: Representative notes already use YAML types, relationship arrays, aliases, and
  wikilinks. A limited frontmatter grammar provides predictable imports without interpreting
  full Markdown bodies, Obsidian plugins, embedded queries, or arbitrary Markdown syntax.
- **Alternatives considered**: Parse and render entire Markdown bodies (risks exposing
  unapproved claims, Dataview blocks, or active HTML); use a full Obsidian plugin ecosystem
  (unnecessary dependency and scope); infer links from prose (unreliable and prohibited).

## Relationship normalization and validation

- **Decision**: Treat links declared in challenge and herb frontmatter as source relationships.
  Derive inverse links for action detail pages from those declarations. Validate target type,
  existence, uniqueness, and duplicate identifiers before generating output.
- **Rationale**: Existing action notes identify their type but do not consistently declare
  associated herbs and challenges; inverse indexes enable navigation from every entry type
  without requiring duplicate relationship maintenance in Obsidian.
- **Alternatives considered**: Require reciprocal link lists in all three note types (creates
  redundant data and drift); infer associations from Dataview queries or body text (depends on
  Obsidian runtime behavior and is not deterministic outside Obsidian).

## Safe publication and extensibility

- **Decision**: Use an explicit allowlist of content fields and plain-text rendering. Import only
  curated records from `content/approved`; emit deterministic JSON and omit Markdown bodies and
  raw HTML. Keep optional catalog fields representable without requiring them for MVP entries.
- **Rationale**: The deployed site and repository content may be public. Whitelisting prevents
  accidental publication of unrelated note content, and an additive record shape can later
  support optional fields such as image references without requiring images in this MVP.
- **Alternatives considered**: Copy full vault notes to the app and strip content at runtime
  (unnecessary public exposure); make schema fields rigidly fixed with no optional extension
  fields (needlessly raises the cost of later changes).

## Browser testing

- **Decision**: Keep Playwright in `tests/e2e` as a distinct package with its own manifest and
  configuration. Its `webServer` starts the local Vite app; release validation also serves the
  production build and allows a configured deployed URL.
- **Rationale**: Meets the explicit requirement for a separate test project while covering
  browser-visible navigation and disclaimer behavior against the real app.
- **Alternatives considered**: Place browser tests in app source (weaker dependency and project
  separation); test only components without a browser (does not prove route behavior or rendered
  content).

## Source note findings and remaining planning constraints

- The inspected herb records use `type: herb`, optional `aliases`, and arrays such as `actions`
  and `health_challenges`.
- Health challenge records use `type: health_challenge` and an `actions` array.
- Action records use `type: action`; their reverse relationships are represented in herb and
  challenge records.
- Some referenced note names do not yet match files present in the sample vault. Those links
  must be corrected or excluded from the approved MVP export; they must not be silently ignored.
- The approved export format will include a short `summary` and optional `source` field; the
  importer will not extract narrative body content automatically.
- The selected hosting target is GitHub Pages for the first release. Account/repository Pages
  settings and the production URL must be confirmed during deployment setup.

## Public references

- [Vite production build](https://vite.dev/guide/build)
- [Vite static deployment and base path](https://vite.dev/guide/static-deploy)
- [React Router SPA deployment guidance](https://reactrouter.com/how-to/spa)
- [gray-matter](https://github.com/jonschlinkert/gray-matter)
- [YAML JavaScript parser](https://eemeli.org/yaml/)
- [Zod validation](https://zod.dev/basics)
- [Obsidian internal links](https://obsidian.md/help/Linking+notes+and+files/Internal+links)
- [Obsidian aliases](https://obsidian.md/help/Linking+notes+and+files/Aliases)
- [Playwright web server configuration](https://playwright.dev/docs/test-webserver)
