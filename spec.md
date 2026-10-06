# HerbGraph Specification

**Version:** 1.0  
**Last Updated:** October 6, 2026  
**Status:** In Development

## Project Overview

HerbGraph is a two-app herb knowledge system for exploring and curating herbal medicine information from Obsidian vaults.

**Two-App Architecture:**
1. **Curator** - Import, review, and approve records from personal Obsidian vault
2. **Explorer** - Browse and view approved herb knowledge base

**Core Principle:** Users maintain complete control over their personal notes. No data is uploaded to external servers. All processing occurs locally in the browser.

**Data Flow:**
```
User's Obsidian Vault
        ↓
   Curator App (localhost:5174)
   ├─ Parse Markdown files
   ├─ Validate records
   ├─ Approve/reject
        ↓
  content/approved/ folder
        ↓
  npm run content:import
        ↓
  public/data/catalog.json
        ↓
   Explorer App (localhost:5173)
   └─ Browse knowledge base
```

---

# Feature 1: Explorer App

## Overview

The Explorer is a read-only knowledge browser that displays herbs, actions, and health challenges from an imported catalog. Users can browse entries by type, view detailed information, and see relationships between entries.

## Functional Requirements

### FR-E1: Application Shell

**Requirement:** Application loads and displays consistent structure with navigation, disclaimer, and content area.

**Specification:**
- Header displays "Herb Knowledge Explorer" title
- Primary navigation shows three links: Health challenges, Actions, Herbs
- Educational disclaimer is always visible (see FR-E6)
- Content area shows appropriate page based on current route
- Loading state shows "Loading entries…" while catalog loads
- Error state shows message if catalog fails to load

### FR-E2: Catalog Loading

**Requirement:** Explorer loads entry data from `public/data/catalog.json` (created by curator import).

**Specification:**
- On app load, fetch `public/data/catalog.json`
- Parse JSON into PublishedCatalog type
- Display loading state while fetching
- If load fails, display error message
- If catalog is empty, show empty state messages

### FR-E3: Browse by Entry Type

**Requirement:** Users can browse entries filtered by type (herb, action, or health challenge).

**Specification:**
- Three browse views accessible via navigation links:
  - Health challenges (`#/challenges`)
  - Actions (`#/actions`)
  - Herbs (`#/herbs`)
- Each view displays:
  - Heading (e.g., "Herbs")
  - List of entries of that type
  - Entry name/title
  - Summary if available
  - Aliases if available
- If no entries of type exist, show: `"No [type] are available yet."`
- Entries sorted alphabetically by name

### FR-E4: Entry Detail View

**Requirement:** Users can view detailed information about a specific entry.

**Specification:**
- Clicking an entry name navigates to detail page (`/entry/:entryId`)
- Detail page displays:
  - Title
  - Aliases (if any)
  - Summary
  - Source
  - Entry type badge
- For herbs specifically, display apothecary sections:
  - Key Chemistry & Mechanics
  - Safety & Contraindications
  - Best Preparations
  - Preparation Notes & Apothecary Secrets
  - Other apothecary-specific fields
- Display related entries (action references, health challenge references)
- Relationships are clickable links to related entries

### FR-E5: Relationship Navigation

**Requirement:** Users can follow relationships between entries (herbs to actions, actions to challenges, etc.).

**Specification:**
- Entry detail view shows related entries:
  - For herbs: related actions and health challenges
  - For actions: related herbs and challenges
  - For challenges: related herbs and actions
- Relationship labels indicate direction:
  - "Actions for this herb"
  - "Health challenges addressed by this herb"
  - "Herbs using this action"
  - "Health challenges addressed by this action"
  - "Herbs for this challenge"
  - "Actions for this challenge"
- Related entries are clickable to navigate
- Handles missing relationships gracefully (see FR-E8)

### FR-E6: Educational Disclaimer

**Requirement:** Display legal disclaimer that content is educational, not medical advice.

**Specification:**
- Disclaimer text: "Educational information only. This content is not medical advice and is not intended to diagnose, treat, cure, or prevent any condition. Consult a qualified healthcare professional about health concerns."
- Display on every page (persistent in header or sidebar)
- Styled distinctly (e.g., boxed, colored background)
- Cannot be dismissed (always visible)
- Use semantic HTML `<aside>` with `aria-label="Educational disclaimer"`

### FR-E7: Navigation and Routing

**Requirement:** Single-page application with URL-based navigation using hash routes.

**Specification:**
- Home page (`/#/` or `/#`): Shows entry type selection
- Browse pages (`/#/herbs`, `/#/actions`, `/#/challenges`): List entries by type
- Detail pages (`/#/entry/:entryId`): Show entry details
- 404 page (`/#/notfound` or invalid route): Show not found message
- Back button/navigation returns to previous browse view
- Browser history (back/forward) works correctly

### FR-E8: Broken Relationship Handling

**Requirement:** Handle missing or incomplete relationships gracefully.

**Specification:**
- If an entry references a related entry that isn't in the catalog:
  - The relationship link is omitted (filtered out)
  - No error is shown to user
  - Other relationships continue to display normally
- This is expected behavior: curator can export incomplete subsets
- Reader app responsibility: filter undefined entries at display time
- No "missing reference" errors shown to user

### FR-E9: Empty State Handling

**Requirement:** Gracefully handle empty or partially populated catalog.

**Specification:**
- If catalog is empty: show "No herbs/actions/challenges are available yet" on each browse view
- If catalog has some entries but not all types: show empty message for missing types
- If entry has no relationships: show "No related [type]" or omit section
- No errors or broken UI; always show coherent state

---

# Feature 2: Curator App

## Overview

The Curator is a web application that enables users to import Obsidian Markdown notes from their personal vault, review content, approve records, and export them for use in the Explorer.

**Key Principle:** Curator reads files locally in the browser. No data is uploaded to external servers. Users maintain complete control over their notes.

## Functional Requirements

### FR-C1: Multi-File Selection with Accumulation

**Requirement:** Users must be able to select files from multiple folders sequentially, with all selections accumulating into a single review list.

**Rationale:** Users often organize their vault by folder (herbs/, actions/, challenges/). They need to browse folders and select files without losing previous selections.

**Specification:**
- When user clicks "Select Markdown files" and chooses files, those files are added to the current selection
- If user clicks "Select Markdown files" again and chooses different files, the new files are ADDED to the existing selection (not replacing)
- Files from different folders can be selected across multiple interactions
- Example workflow:
  ```
  1. Browse herbs/ folder → Select "German Chamomile.md" → Shows 1 record
  2. Browse actions/ folder → Select "Calming.md" → Shows 2 records (Chamomile still visible)
  3. Browse challenges/ folder → Select "Restless Mind.md" → Shows 3 records (all visible)
  ```
- Duplicate detection: If user selects the same file twice (by name), the second selection is rejected with an error message
- Each file is identified by (filename + size + lastModified + index)
- Selected files persist until user clicks "Clear all selections" button

**Bug History:** Initial implementation incorrectly replaced selections instead of accumulating them. See BUG-ANALYSIS.md for details. Regression test added to prevent recurrence.

### FR-C2: File Type Validation

**Requirement:** Only Markdown files (.md extension) can be selected.

**Specification:**
- If user selects non-.md files, those files are shown in an error state
- Error message: `"[filename]: select a Markdown file with a .md extension."`
- Non-.md files are NOT added to the approved selection list
- Valid .md files in the same batch are still processed

### FR-C3: Content Parsing and Validation

**Requirement:** Selected Markdown files are parsed into structured records (herb, action, or challenge entries).

**Specification:**
- Parser recognizes frontmatter fields and Markdown sections defined in the template
- If a file cannot be parsed, it shows an error: `"[filename]: could not parse this file."`
- Parsing happens immediately when files are selected (local browser processing)
- No network requests or data uploads occur during parsing

### FR-C4: Record Review Interface

**Requirement:** Users can review detailed information about each record before approval.

**Specification:**
- Records are grouped by type: Herbs, Actions, Health Challenges, Errors
- Each record displays:
  - Title (or filename if no title)
  - Record type (herb/action/challenge)
  - All extracted fields with their values
  - For herbs: Apothecary sections (Key Chemistry & Mechanics, Safety & Contraindications, etc.)
  - Missing subsections noted as: `"Not found in the selected note — this subsection will not be included."`
- Users can expand/collapse each record (if implemented)
- Each record has an "Approve" checkbox to explicitly enable export

### FR-C5: Strict Validation Toggle

**Requirement:** Users can choose between strict and lenient validation modes to control whether partial imports are allowed.

**Rationale:** During development and testing, users may not have all related records available. Strict mode prevents exporting incomplete data; lenient mode enables testing with partial imports.

**Specification:**

**Strict Mode (Default):**
- When enabled, all relationship checks run:
  - All herbs must reference only actions that exist in the approved records
  - All herbs must reference only health challenges that exist in the approved records
  - All actions must reference only herbs that exist in the approved records
  - All health challenges must reference only herbs that exist in the approved records
- Duplicate name detection always runs (even in lenient mode)
- Errors are shown with counts: e.g., `"3 relationship errors"`
- Download button is disabled if any errors exist in strict mode

**Lenient Mode:**
- Relationship validation is skipped
- Duplicate detection still runs (duplicate names cause catalog ID collisions)
- Download button is enabled even if relationships are incomplete
- Use case: Testing with partial data, iterative imports

**UI:**
- Toggle is labeled: "Strict validation — Requires all relationships to exist"
- Toggle is checked by default (strict mode)
- Clicking toggle immediately updates validation state

### FR-C6: Duplicate Detection

**Requirement:** Prevent importing files with duplicate names, which would create unpredictable catalog IDs.

**Specification:**
- Filename comparison is case-insensitive
- If a file with the same name is selected in a new batch, it is rejected
- Error message: `"Duplicate filename(s) not added: [list]. Select files with unique names so imported entry IDs stay predictable."`
- Duplicate check happens:
  - Within a new batch (if user selects herb1.md and herb1.md in same dialog, only first is added)
  - Against existing selections (if herb1.md already selected, selecting it again rejects it)
- Valid files in the same batch are still processed

### FR-C7: Record Approval Control

**Requirement:** Users can selectively approve individual records for export.

**Specification:**
- Each record (whether valid or in error state) has an "Approve" checkbox
- Unchecked by default (safe default: nothing exported without explicit approval)
- Only approved records are included in the export
- Error records cannot be approved (checkbox disabled)
- Approving a record doesn't validate it—approval only marks it for export

### FR-C8: Relationship Validation

**Requirement:** System validates that approved records reference only other approved records (in strict mode).

**Specification:**
- Validates after approval state changes
- For each approved herb:
  - Check that all referenced actions exist in approved records
  - Check that all referenced health challenges exist in approved records
- For each approved action:
  - Check that all referenced herbs exist in approved records
- For each approved health challenge:
  - Check that all referenced herbs exist in approved records
- If missing relationships found: show alert with count and details
- Relationship errors block export in strict mode; ignored in lenient mode

### FR-C9: Export Functionality

**Requirement:** Users can download approved records as a structured archive.

**Specification:**
- Export creates a .zip file named `"approved-herb-content.zip"`
- Archive structure:
  ```
  approved-herb-content.zip
  ├── content/
  │   ├── approved/
  │   │   ├── [record1.md]
  │   │   ├── [record2.md]
  │   │   └── ...
  ```
- Each record is serialized to Markdown with:
  - Frontmatter (YAML) with structured fields
  - Content body (cleaned and validated)
- Download button:
  - Enabled only if at least one record is approved AND no errors in strict mode
  - Text: `"Download approved import files (.zip)"`
  - After successful download, shows success indicator

### FR-C10: Selection Summary

**Requirement:** Users can see at a glance how many records are selected and approved.

**Specification:**
- "Selection Summary" sidebar displays:
  - Total records selected
  - Breakdown by type (Herbs: X, Actions: Y, Challenges: Z)
  - Approved count (e.g., "3 approved")
  - Error count (e.g., "2 errors")
- Summary updates in real-time as user approves/removes records
- Visible when selections exist; empty state when no files selected

### FR-C11: Record Removal

**Requirement:** Users can remove individual records from the review list without affecting others.

**Specification:**
- Each record has a "Remove" or "Delete" button/icon
- Clicking remove:
  - Immediately removes the record from the list
  - Resets validation state and download button
  - Does NOT require confirmation (can be undone by re-selecting files)

### FR-C12: Clear All Selections

**Requirement:** Users can quickly start over by clearing all selections at once.

**Specification:**
- "Clear all selections" button appears when records exist
- Clicking clears the entire review list
- User must re-select files to import again
- Use case: User realizes they selected wrong files, or wants to switch to a different set

---

## Non-Functional Requirements

### NFR-1: Local Processing (Both Apps)

**Requirement:** All file processing occurs in the browser; no data is sent to external servers.

**Specification:**
- File parsing, validation, and serialization all run client-side
- No network requests to upload file contents
- Network requests are only for initial page load and UI resources

### NFR-2: Performance (Both Apps)

**Requirement:** Applications should handle typical vault sizes (100-500 records) without significant lag.

**Specification:**
- Curator: File parsing completes within 500ms for typical vault
- Curator: UI updates (adding records, toggling validation) respond within 200ms
- Curator: Export (.zip creation) completes within 1000ms
- Explorer: Catalog load completes within 500ms
- Explorer: Page navigation responds within 200ms
- Explorer: Relationship resolution completes within 100ms

### NFR-3: Error Recovery (Both Apps)

**Requirement:** Users can recover from errors without losing their work.

**Specification:**
- If file parsing fails, error is shown but other files are processed
- If export fails, user can try again without re-selecting files
- Users can remove individual error records and continue with valid ones
- If catalog load fails, error message clearly explains problem

---

## Content Structure

### Supported Record Types

1. **Herb** (type: 'herb')
   - Fields: title, aliases, summary, source, actions[], health_challenges[]
   - Apothecary sections: Key Chemistry & Mechanics, Safety & Contraindications, Best Preparations, etc.

2. **Action** (type: 'action')
   - Fields: title, aliases, summary, source, herbs[]
   - Represents herbal actions/uses (e.g., "Calming", "Anti-inflammatory")

3. **Health Challenge** (type: 'challenge')
   - Fields: title, aliases, summary, source, herbs[]
   - Represents health conditions or states (e.g., "Restless Mind", "Insomnia")

---

## Integration Requirements

### IR-1: Curator to Explorer Export

**Requirement:** Curator exports files to location where Explorer can import them.

**Specification:**
- Curator exports to: `content/approved/` folder (project root)
- Format: Individual Markdown files with frontmatter
- File naming: Preserves source filename (e.g., "German Chamomile.md")
- Explorer reads from: `public/data/catalog.json` (generated by import script)

### IR-2: Content Import Script

**Requirement:** `npm run content:import` command builds catalog from approved files.

**Specification:**
- Reads all `.md` files from `content/approved/`
- Parses each file with same logic as curator parser
- Resolves relationships between entries
- Validates all relationships exist (strict mode for import script)
- Outputs to: `public/data/catalog.json`
- Current limitation: Fails if relationships don't resolve (no lenient mode yet)

### IR-3: Full Workflow

**Requirement:** Users can complete workflow from vault to explorer.

**Specification:**
```
1. User exports records from vault to Obsidian folder
2. User opens Curator (localhost:5174)
3. User selects Markdown files from vault
4. User approves desired records
5. User downloads .zip file
6. User extracts to content/approved/
7. User runs: npm run content:import
8. User opens Explorer (localhost:5173)
9. Explorer displays imported records
10. User browses and views relationships
```

---

## User Workflows

### Workflow 1: Complete Import with All Records

```
1. User has vault with herbs/, actions/, and challenges/ folders
2. Curator: Click "Select Markdown files" → browse herbs/ → select all herbs → confirm
3. Curator: Click "Select Markdown files" → browse actions/ → select all actions → confirm
4. Curator: Click "Select Markdown files" → browse challenges/ → select all challenges → confirm
5. Curator: Review shows all records grouped by type
6. Curator: Review relationships and approve all records
7. Curator: Click "Download approved import files (.zip)"
8. Curator: Extract .zip to content/approved/
9. Terminal: Run npm run content:import
10. Explorer: Open localhost:5173, browse all entries with complete relationships
```

### Workflow 2: Partial/Progressive Import for Testing

```
1. User wants to test with just herbs first
2. Curator: Click "Select Markdown files" → browse herbs/ → select herb1.md, herb2.md → confirm
3. Curator: Toggle "Strict validation" OFF (lenient mode)
4. Curator: Review shows 2 herbs, 0 errors (missing relationships ignored)
5. Curator: Click "Approve" on both herbs
6. Curator: Click "Download approved import files (.zip)"
7. Curator: Extract .zip to content/approved/
8. Terminal: Run npm run content:import (fails: missing relationship entries)
9. User: Imports more actions/challenges, tries again
```

### Workflow 3: Finding and Fixing Missing References

```
1. User imports all records with strict validation ON
2. Curator: Alert shows "3 relationship errors"
3. Curator: User sees which herbs reference missing actions
4. Curator: Click "Clear all selections"
5. Curator: Re-select files including the missing action
6. Curator: Validation re-runs, errors resolved
7. Curator: Click "Download approved import files (.zip)"
8. Terminal: Run npm run content:import (succeeds)
9. Explorer: Now displays complete relationships
```

---

## Edge Cases and Constraints

### EC-1: Duplicate Files Across Batches

If user selects herb1.md in batch 1, then herb1.md again in batch 2:
- Batch 2 selection is rejected
- Error message guides user to use unique names

**Why:** Catalog system uses filename as ID source. Duplicates create unpredictable IDs.

### EC-2: Partial Record Data

If a herb record is missing an apothecary section:
- Section is shown as: `"Not found in the selected note — this subsection will not be included."`
- Record is still importable
- Missing data won't cause export to fail

### EC-3: Missing Relationships (Strict Mode)

If herb references action that isn't approved:
- Error shown: `"[herb title] references action '[action]' not among the approved records."`
- Export is blocked
- User must either:
  - Import the missing action, OR
  - Switch to lenient mode

### EC-4: Missing Relationships (Lenient Mode)

If herb references action that isn't approved:
- No error shown
- Record exports anyway
- Reader app filters out missing references at runtime

### EC-5: Very Large Vaults (1000+ records)

**Current limitation:** Performance not tested beyond 500 records.

**Potential issues:**
- UI may lag when rendering 1000+ records
- Export .zip creation may take >5 seconds

**Recommendation:** Add progress indicator if supporting large vaults becomes requirement.

### EC-6: Empty Catalog

If catalog has no entries:
- Explorer shows: "Choose a type of entry to start browsing"
- Browse pages show: "No [type] are available yet"
- No errors; graceful empty state

### EC-7: Broken Relationships at Runtime

If imported catalog has broken references (rare edge case):
- Explorer filters them out silently
- Other relationships display normally
- No errors shown to user

---

## Testing Strategy

### Test Categories

#### Explorer Tests
1. **Catalog Loading** - Loads from JSON, parses correctly
2. **Browse Views** - Filters entries by type, displays correctly
3. **Entry Details** - Shows all fields, relationships clickable
4. **Navigation** - Routes work, browser history works
5. **Empty States** - Displays gracefully when empty
6. **Broken References** - Filters missing entries at display time

#### Curator Tests
1. **File Selection Accumulation** (Sequential)
   - Test calling "Choose File" multiple times
   - Verify selections accumulate, not replace
   - See: tests/e2e/curator/content-curation.spec.ts

2. **File Type Validation**
   - Test with .md files (should work)
   - Test with .txt, .json, .pdf (should fail with error)

3. **Duplicate Detection**
   - Test selecting same file twice in one batch
   - Test selecting same file in different batch
   - Test case-insensitivity

4. **Strict vs Lenient Validation**
   - Test with complete data (both modes should export)
   - Test with missing relationships (strict blocks, lenient allows)

5. **Relationship Validation**
   - Herb with missing action reference
   - Herb with missing challenge reference
   - Action with missing herb reference
   - Challenge with missing herb reference

6. **Export Functionality**
   - Verify .zip structure
   - Verify file contents are correct
   - Verify no data is uploaded to server

### Known Test Gaps

- [ ] Performance testing with 500+ records
- [ ] Accessibility testing (keyboard navigation, screen readers)
- [ ] Mobile responsiveness (currently desktop-focused)
- [ ] Explorer integration tests with curator output

---

## Lessons Learned

### Lesson 1: Multi-File Selection Needs Explicit Spec

**From Bug:** Initial implementation used `setItems(value)` instead of `setItems([...items, value])` because the multi-file accumulation requirement wasn't explicitly documented.

**For Future:** Always specify "what happens when user repeats this action?" for any feature. See BUG-ANALYSIS.md for full details.

### Lesson 2: Tests Should Exercise Sequential Workflows

**From Bug:** Existing tests called `setInputFiles()` once with all files, missing the sequential file selection bug.

**For Future:** Test progressive/sequential workflows separately from bulk operations. See tests/e2e/TESTING-PATTERNS.md for guidance.

### Lesson 3: State Accumulation Patterns Need Careful Review

**From Bug:** "Replace vs append" is a common mistake in React state management.

**For Future:** Use code review checklist in tests/e2e/TESTING-PATTERNS.md when reviewing state logic.

### Lesson 4: Spec Comes Before Code

**From Discovery:** Curator was "built on the fly" without explicit requirements, leading to implementation gaps and test gaps.

**For Future:** Write spec.md first, then plan.md, then tasks.md, then code. Never code-first without written requirements.

---

## Future Enhancements

### Curator Enhancements
- [ ] Progress indicator for large imports
- [ ] Keyboard shortcuts (Ctrl+A select all, etc.)
- [ ] Toast notifications for duplicate rejections
- [ ] Drag-and-drop file selection
- [ ] Preview of parsed data before approval
- [ ] Bulk approve/reject records
- [ ] Undo/redo for approval changes
- [ ] Lenient mode for import script (allow incomplete relationships)

### Explorer Enhancements
- [ ] Search/filter entries
- [ ] Relationship graph visualization
- [ ] Entry history/changelog
- [ ] Related entries carousel
- [ ] Favorite/bookmark entries
- [ ] Print/export single entries
- [ ] Dark mode support
- [ ] Mobile-responsive layout

### Integration Enhancements
- [ ] Bidirectional sync (Explorer → Curator)
- [ ] Direct database import (skip file export/import)
- [ ] Web-based vault browser
- [ ] Conflict resolution for re-imports
- [ ] Entry version tracking
- [ ] Multi-user support

---

## Related Documentation

- **BUG-ANALYSIS.md** - Detailed analysis of file selection bug and why tests missed it
- **tests/e2e/TESTING-PATTERNS.md** - Testing guidance for sequential workflows
- **CHANGELOG.md** - Project change history

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Oct 6, 2026 | Copilot | Initial formalization of complete specification |

---

**Questions?** Refer to BUG-ANALYSIS.md for the file selection accumulation bug story, or tests/e2e/TESTING-PATTERNS.md for testing guidance.
