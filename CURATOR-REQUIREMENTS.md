# Curator App Requirements Document

**Version:** 1.0  
**Last Updated:** October 6, 2026  
**Status:** In Use

## Overview

The Curator is a web application that enables users to:
1. Import Obsidian Markdown notes from their personal vault
2. Review and validate herb, action, and health challenge records
3. Selectively approve records for publication
4. Export approved records as a structured knowledge base

**Key Principle:** Curator reads files locally in the browser. No data is uploaded to external servers. Users maintain complete control over their notes.

---

## Functional Requirements

### FR-1: Multi-File Selection with Accumulation

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

**Implementation Notes:**
- Duplicate detection: If user selects the same file twice (by name), the second selection is rejected with an error message
- Each file is identified by (filename + size + lastModified + index)
- Selected files persist until user clicks "Clear all selections" button

**Bug History:** Initial implementation incorrectly replaced selections instead of accumulating them. See BUG-ANALYSIS.md.

---

### FR-2: File Type Validation

**Requirement:** Only Markdown files (.md extension) can be selected.

**Specification:**
- If user selects non-.md files, those files are shown in an error state
- Error message: `"[filename]: select a Markdown file with a .md extension."`
- Non-.md files are NOT added to the approved selection list
- Valid .md files in the same batch are still processed

---

### FR-3: Content Parsing and Validation

**Requirement:** Selected Markdown files are parsed into structured records (herb, action, or challenge entries).

**Specification:**
- Parser recognizes frontmatter fields and Markdown sections defined in the template
- If a file cannot be parsed, it shows an error: `"[filename]: could not parse this file."`
- Parsing happens immediately when files are selected (local browser processing)
- No network requests or data uploads occur during parsing

---

### FR-4: Record Review Interface

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

---

### FR-5: Strict Validation Toggle

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

---

### FR-6: Duplicate Detection

**Requirement:** Prevent importing files with duplicate names, which would create unpredictable catalog IDs.

**Specification:**
- Filename comparison is case-insensitive
- If a file with the same name is selected in a new batch, it is rejected
- Error message: `"Duplicate filename(s) not added: [list]. Select files with unique names so imported entry IDs stay predictable."`
- Duplicate check happens:
  - Within a new batch (if user selects herb1.md and herb1.md in same dialog, only first is added)
  - Against existing selections (if herb1.md already selected, selecting it again rejects it)
- Valid files in the same batch are still processed

---

### FR-7: Record Approval Control

**Requirement:** Users can selectively approve individual records for export.

**Specification:**
- Each record (whether valid or in error state) has an "Approve" checkbox
- Unchecked by default (safe default: nothing exported without explicit approval)
- Only approved records are included in the export
- Error records cannot be approved (checkbox disabled)
- Approving a record doesn't validate it—approval only marks it for export

---

### FR-8: Relationship Validation

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

---

### FR-9: Export Functionality

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

---

### FR-10: Selection Summary

**Requirement:** Users can see at a glance how many records are selected and approved.

**Specification:**
- "Selection Summary" sidebar displays:
  - Total records selected
  - Breakdown by type (Herbs: X, Actions: Y, Challenges: Z)
  - Approved count (e.g., "3 approved")
  - Error count (e.g., "2 errors")
- Summary updates in real-time as user approves/removes records
- Visible when selections exist; empty state when no files selected

---

### FR-11: Record Removal

**Requirement:** Users can remove individual records from the review list without affecting others.

**Specification:**
- Each record has a "Remove" or "Delete" button/icon
- Clicking remove:
  - Immediately removes the record from the list
  - Resets validation state and download button
  - Does NOT require confirmation (can be undone by re-selecting files)

---

### FR-12: Clear All Selections

**Requirement:** Users can quickly start over by clearing all selections at once.

**Specification:**
- "Clear all selections" button appears when records exist
- Clicking clears the entire review list
- User must re-select files to import again
- Use case: User realizes they selected wrong files, or wants to switch to a different set

---

## Non-Functional Requirements

### NFR-1: Local Processing

**Requirement:** All file processing occurs in the browser; no data is sent to external servers.

**Specification:**
- File parsing, validation, and serialization all run client-side
- No network requests to upload file contents
- Network requests are only for initial page load and UI resources

---

### NFR-2: Performance

**Requirement:** The curator should handle typical vault sizes (100-500 records) without significant lag.

**Specification:**
- File parsing completes within 500ms for typical vault
- UI updates (adding records, toggling validation) respond within 200ms
- Export (.zip creation) completes within 1000ms

---

### NFR-3: Error Recovery

**Requirement:** Users can recover from errors without losing their work.

**Specification:**
- If file parsing fails, error is shown but other files are processed
- If export fails, user can try again without re-selecting files
- Users can remove individual error records and continue with valid ones

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

## User Workflows

### Workflow 1: Complete Import with All Records

```
1. User has vault with herbs/, actions/, and challenges/ folders
2. Click "Select Markdown files" → browse herbs/ → select all herbs → confirm
3. Click "Select Markdown files" → browse actions/ → select all actions → confirm
4. Click "Select Markdown files" → browse challenges/ → select all challenges → confirm
5. Review shows all records grouped by type
6. All checkboxes checked by default? [TODO: clarify if auto-approved or not]
7. Click "Download approved import files (.zip)"
8. Inspect downloaded files in external tool, then import to main app
```

### Workflow 2: Partial/Progressive Import for Testing

```
1. User wants to test with just herbs first
2. Click "Select Markdown files" → browse herbs/ → select herb1.md, herb2.md → confirm
3. Toggle "Strict validation" OFF (lenient mode)
4. Review shows 2 herbs, 0 errors
5. Click "Approve" on both herbs
6. Click "Download approved import files (.zip)"
7. Later, user can import more actions/challenges
```

### Workflow 3: Finding and Fixing Missing References

```
1. User imports all records with strict validation ON
2. Alert shows: "3 relationship errors"
3. User sees which herbs reference missing actions
4. User clicks "Clear all selections"
5. User re-selects files including the missing action
6. Validation re-runs, errors resolved
7. Click "Download approved import files (.zip)"
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

---

## Testing Strategy

### Test Categories

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

- Performance testing with 500+ records
- Accessibility testing (keyboard navigation, screen readers)
- Mobile responsiveness (currently desktop-focused)

---

## Lessons Learned

### Lesson 1: Multi-File Selection Needs Explicit Spec

**From Bug:** Initial implementation used `setItems(value)` instead of `setItems([...items, value])` because the multi-file accumulation requirement wasn't explicitly documented.

**For Future:** Always specify "what happens when user repeats this action?" for any feature. See BUG-ANALYSIS.md for full details.

### Lesson 2: Tests Should Exercise Sequential Workflows

**From Bug:** Existing tests called `setInputFiles()` once with all files, missing the sequential file selection bug.

**For Future:** Test progressive/sequential workflows separately from bulk operations. See tests/e2e/TESTING-PATTERNS.md for guidance.

### Lesson 3: Strict vs Lenient Modes Require Clear Documentation

**From User Feedback:** The distinction between strict and lenient validation wasn't clear initially. Stricter requirements can be documented here.

---

## Future Enhancements

- [ ] Progress indicator for large imports
- [ ] Keyboard shortcuts (Ctrl+A select all, etc.)
- [ ] Toast notifications for duplicate rejections
- [ ] Drag-and-drop file selection
- [ ] Preview of parsed data before approval
- [ ] Bulk approve/reject records
- [ ] Undo/redo for approval changes
- [ ] Relationship dependency graph visualization
- [ ] Mobile-responsive layout
- [ ] Dark mode support

---

## Related Documentation

- **BUG-ANALYSIS.md** - Detailed analysis of file selection bug and why tests missed it
- **tests/e2e/TESTING-PATTERNS.md** - Testing guidance for sequential workflows
- **src/pages/ContentImportPage.tsx** - Implementation
- **src/content/curation.ts** - Validation and parsing logic

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Oct 6, 2026 | Copilot | Initial formalization of curator requirements |

---

**Questions?** Refer to BUG-ANALYSIS.md for the file selection accumulation bug story, or TESTING-PATTERNS.md for testing guidance.
