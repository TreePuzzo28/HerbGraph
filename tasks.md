# HerbGraph Task Breakdown

**Version:** 1.0  
**Last Updated:** October 6, 2026  
**Derived From:** plan.md (phases) and spec.md (requirements)

## Overview

Actionable task list derived from implementation plan. Each task is labeled with affected app(s) and has explicit status and dependencies.

**Status Legend:**
- ✅ Done - Implementation complete, tested
- ⏳ In Progress - Active work
- 🔗 Blocked - Cannot proceed without other task
- ⚠️ At Risk - Partially done, needs completion
- 📋 To Do - Not started
- 🔮 Planned - Future phase

---

# Phase 1: Explorer MVP

**Phase Status:** ✅ Complete (7/7 tasks)  
**Dependencies:** None

### Task E1.1: Application Shell

**Requirement:** [FR-E1] Application shell  
**App:** [Explorer]  
**Status:** ✅ Done  
**Description:** Build React component shell with header, navigation, disclaimer, and content area.

**Deliverables:**
- App.tsx with main layout
- PrimaryNavigation component
- EducationalDisclaimer component
- Semantic HTML (main, header, nav, aside)

**Tests:** Manual verification ✅

**Commits:**
- b535eda: improve: Add selection summary sidebar and grouped records
- (multiple commits building explorer)

---

### Task E1.2: Catalog Loading

**Requirement:** [FR-E2] Catalog loading  
**App:** [Explorer]  
**Status:** ✅ Done  
**Description:** Load PublishedCatalog from public/data/catalog.json on app startup.

**Deliverables:**
- loadCatalog() function
- Loading state ("Loading entries…")
- Error state with error message
- Async loading with cleanup

**Tests:** Manual verification ✅

**Dependencies:** None

---

### Task E1.3: Browse by Entry Type

**Requirement:** [FR-E3] Browse by entry type  
**App:** [Explorer]  
**Status:** ✅ Done  
**Description:** Build BrowsePage component showing entries filtered by type (herb/action/challenge).

**Deliverables:**
- BrowsePage component
- Router with hash routes (/#/herbs, /#/actions, /#/challenges)
- EntryList component
- Empty state messages per type
- Alphabetical sorting

**Tests:** Manual verification ✅

**Dependencies:** Task E1.1, Task E1.2

---

### Task E1.4: Entry Detail View

**Requirement:** [FR-E4] Entry detail view  
**App:** [Explorer]  
**Status:** ✅ Done  
**Description:** Build EntryDetailPage showing complete entry information including apothecary sections.

**Deliverables:**
- EntryDetailPage component
- Detail route (/#/entry/:entryId)
- Field display (title, aliases, summary, source, type badge)
- Apothecary sections for herbs
- "Not found" subsection messaging

**Tests:** Manual verification ✅

**Dependencies:** Task E1.1, Task E1.2

---

### Task E1.5: Educational Disclaimer

**Requirement:** [FR-E6] Educational disclaimer  
**App:** [Explorer]  
**Status:** ✅ Done  
**Description:** Build persistent, non-dismissible disclaimer component.

**Deliverables:**
- EducationalDisclaimer component
- Legal text in HTML
- Semantic `<aside>` with aria-label
- Distinct styling (boxed, colored)
- Always visible (not in route-based conditional)

**Tests:** Manual verification ✅

**Commits:**
- 5b381cf: feat: add persistent educational disclaimer

**Dependencies:** Task E1.1

---

### Task E1.6: Navigation and Routing

**Requirement:** [FR-E7] Navigation and routing  
**App:** [Explorer]  
**Status:** ✅ Done  
**Description:** Implement hash-based SPA routing with browser history support.

**Deliverables:**
- Router component using react-router-dom
- Hash routes (#/)
- Route params for entryType and entryId
- Browser history (back/forward) working
- 404 handling (NotFoundPage)

**Tests:** Manual verification ✅

**Dependencies:** Task E1.1

---

### Task E1.7: Empty State Handling

**Requirement:** [FR-E9] Empty state handling  
**App:** [Explorer]  
**Status:** ✅ Done  
**Description:** Gracefully handle empty catalog and missing entry types.

**Deliverables:**
- Empty message per type ("No herbs are available yet")
- Home page message ("Choose a type of entry to start browsing")
- No errors in UI when catalog is empty
- Filtering that returns empty arrays

**Tests:** Manual verification (tested with empty catalog) ✅

**Dependencies:** Task E1.1, Task E1.3

---

# Phase 2: Curator MVP

**Phase Status:** ✅ Complete (7/7 tasks)  
**Dependencies:** None

### Task C2.1: File Selection Interface

**Requirement:** [FR-C1] Multi-file selection with accumulation  
**App:** [Curator]  
**Status:** ✅ Done  
**Description:** Build file input that accumulates files across multiple selections.

**Deliverables:**
- File input element
- setInputFiles() handler
- Accumulation logic: `setItems([...items, ...uniqueItems])`
- Sequential selection support

**Tests:** ✅ Playwright regression test added

**Commits:**
- 482f648: fix: Allow multiple file selections to accumulate instead of clearing
- 655d4a3: test: Add regression test for multiple sequential file selections

**Bug History:** Initial implementation used `setItems(uniqueItems)` (replace) instead of append. Fixed and tested. See BUG-ANALYSIS.md.

---

### Task C2.2: File Type Validation

**Requirement:** [FR-C2] File type validation  
**App:** [Curator]  
**Status:** ✅ Done  
**Description:** Reject non-.md files with error message.

**Deliverables:**
- Check file.name.endsWith('.md')
- Error message: "[filename]: select a Markdown file with a .md extension."
- Error state display
- Valid .md files still processed in same batch

**Tests:** Manual verification ✅

**Dependencies:** Task C2.1

---

### Task C2.3: Content Parsing

**Requirement:** [FR-C3] Content parsing and validation  
**App:** [Curator]  
**Status:** ✅ Done  
**Description:** Parse Markdown files into structured records (herb/action/challenge).

**Deliverables:**
- parseSourceForCuration() function
- Frontmatter parsing (YAML)
- Section parsing (Markdown heading-based)
- Error message: "[filename]: could not parse this file."
- Client-side processing (no uploads)

**Tests:** Unit tests for parsing ✅

**Dependencies:** Task C2.1, Task C2.2

---

### Task C2.4: Record Review Interface

**Requirement:** [FR-C4] Record review interface  
**App:** [Curator]  
**Status:** ✅ Done  
**Description:** Display parsed records grouped by type with detailed field information.

**Deliverables:**
- GroupedRecords component
- Grouped sections: Herbs, Actions, Challenges, Errors
- Record card display (title, type badge, fields)
- Apothecary section display for herbs
- "Not found" subsection messages
- Expand/collapse (if implemented)

**Tests:** Manual verification ✅

**Commits:**
- b535eda: improve: Add selection summary sidebar and grouped records in curator app

**Dependencies:** Task C2.3

---

### Task C2.5: Record Approval Control

**Requirement:** [FR-C7] Record approval control  
**App:** [Curator]  
**Status:** ✅ Done  
**Description:** Add approval checkbox to each record, unchecked by default.

**Deliverables:**
- Checkbox input per record
- Approval state management
- Error records have disabled checkbox
- Only approved records included in export

**Tests:** Manual verification ✅

**Dependencies:** Task C2.4

---

### Task C2.6: Export Functionality

**Requirement:** [FR-C9] Export functionality  
**App:** [Curator]  
**Status:** ✅ Done  
**Description:** Download approved records as .zip archive.

**Deliverables:**
- "Download approved import files (.zip)" button
- .zip file creation (using fflate)
- Archive structure: content/approved/[records].md
- File naming: preserves source filename
- Download trigger and file delivery
- No data uploads to server

**Tests:** ✅ Playwright test: download button state and .zip content

**Commits:**
- (multiple commits with export logic)

**Dependencies:** Task C2.5

---

### Task C2.7: Record Removal

**Requirement:** [FR-C11] Record removal  
**App:** [Curator]  
**Status:** ✅ Done  
**Description:** Allow users to remove individual records from the review list.

**Deliverables:**
- Remove button/icon per record
- Removes from items state
- Resets validation and download state
- No confirmation needed

**Tests:** Manual verification ✅

**Dependencies:** Task C2.4

---

# Phase 3: Curator UX & Validation

**Phase Status:** ✅ Complete (5/5 tasks)  
**Dependencies:** Phase 2 tasks

### Task C3.1: Strict/Lenient Validation Toggle

**Requirement:** [FR-C5] Strict validation toggle  
**App:** [Curator]  
**Status:** ✅ Done  
**Description:** Add toggle to switch between strict and lenient validation modes.

**Deliverables:**
- Checkbox input labeled "Strict validation"
- Default checked (strict mode)
- State management: `strictValidation` boolean
- Pass to `validateCuratedRelationships(strict)` function
- UI toggle with descriptive labels

**Tests:** Manual verification ✅

**Commits:**
- 08a6212: feat: Add strict validation toggle to curator app

**Behavior:**
- Strict (checked): All relationships must exist, export blocked if errors
- Lenient (unchecked): Relationships ignored, export allowed
- Duplicate detection always runs (strict and lenient)

**Dependencies:** Task C2.3, Task C3.3

---

### Task C3.2: Duplicate Detection

**Requirement:** [FR-C6] Duplicate detection  
**App:** [Curator]  
**Status:** ✅ Done  
**Description:** Reject duplicate filenames with error message.

**Deliverables:**
- Case-insensitive filename comparison
- Check within new batch (same dialog)
- Check against existing selections (previous dialogs)
- Error message: "Duplicate filename(s) not added: [list]..."
- Valid files still processed

**Tests:** Manual verification ✅

**Dependencies:** Task C2.1

---

### Task C3.3: Relationship Validation

**Requirement:** [FR-C8] Relationship validation  
**App:** [Curator]  
**Status:** ✅ Done  
**Description:** Validate that approved records reference only other approved records (strict mode).

**Deliverables:**
- validateCuratedRelationships() function
- Accepts `strict: boolean` parameter
- Strict mode checks: herb→action, herb→challenge, action→herb, challenge→herb
- Lenient mode skips all relationship checks
- Error collection and display
- Block export in strict mode if errors exist

**Tests:** Manual verification ✅

**Commits:**
- (validation logic in curation.ts)

**Dependencies:** Task C2.5, Task C3.1

---

### Task C3.4: Selection Summary Sidebar

**Requirement:** [FR-C10] Selection summary  
**App:** [Curator]  
**Status:** ✅ Done  
**Description:** Display sidebar with summary of selected and approved records.

**Deliverables:**
- Selection summary component
- Display total records
- Breakdown by type (Herbs: X, Actions: Y, Challenges: Z)
- Show approved count
- Show error count
- Real-time updates
- Visible when records exist, hidden when empty

**Tests:** Manual verification ✅

**Commits:**
- b535eda: improve: Add selection summary sidebar and grouped records in curator app

**Dependencies:** Task C2.4, Task C2.5

---

### Task C3.5: Clear All Selections

**Requirement:** [FR-C12] Clear all selections  
**App:** [Curator]  
**Status:** ✅ Done  
**Description:** Add button to clear all selected records at once.

**Deliverables:**
- "Clear all selections" button
- Clears items array
- Button visible when records exist
- No confirmation needed
- User can re-select to continue

**Tests:** Manual verification ✅

**Dependencies:** Task C2.1

---

# Phase 4: Integration

**Phase Status:** ⏳ In Progress, 🔗 BLOCKED (2/5 tasks partially done)  
**Dependencies:** All Phase 1-3 tasks

### Task I4.1: Curator to Explorer Export

**Requirement:** [IR-1] Curator to Explorer export  
**App:** [Curator] [Integration]  
**Status:** ✅ Done  
**Description:** Curator exports .zip files to content/approved/ folder.

**Deliverables:**
- Download .zip from curator
- Extract to content/approved/ folder
- Individual .md files per record
- Preserve filenames
- Frontmatter + content format

**Tests:** Manual verification ✅

**Dependencies:** Task C2.6

---

### Task I4.2: Content Import Script

**Requirement:** [IR-2] Content import script  
**App:** [Integration]  
**Status:** ⚠️ Partially Done  
**Description:** Build `npm run content:import` command that builds catalog.json.

**Deliverables:**
- scripts/content/importApprovedContent.ts
- Read all .md from content/approved/
- Parse with same logic as curator
- Resolve relationships between entries
- Output to public/data/catalog.json
- Error reporting

**Tests:** Manual verification (currently fails: strict validation) ⚠️

**Current Issue:**
- Test content has broken relationships
- Import script strict mode rejects all records
- catalog.json is empty
- See: Task I4.3 (blocker)

**Dependencies:** Task I4.1

---

### Task I4.3: Complete Test Data

**Requirement:** [IR-3] Full workflow (data completeness)  
**App:** [Integration]  
**Status:** 🔗 Blocked  
**Description:** Import all referenced actions and challenges so relationships resolve.

**Current Test Data Gap:**
```
✅ Herbs (4): Basil, German Chamomile, Lavender, Lemon Balm
✅ Actions (4): Antidepressant, Carminative, Nervine, Tonic
✅ Challenges (2): Bloating, Gas

❌ MISSING ACTIONS (referenced by herbs):
   - Antispasmodic, Diaphoretic, Antimicrobial, Galactagogue, Emmenagogue
   - Bitter, Prokinetic, Spasmolytic, Aromatic
   - Anti-inflammatory, Vulnerary, Mild Sedative
   - Anxiolytic, Antiviral, Trophorestorative

❌ MISSING CHALLENGES (referenced by herbs):
   - Abdominal Cramping, Sluggish Digestion, Mental Fatigue
   - Stress-Induced IBS/Gastritis, Insomnia, Infant Colic/Teething, Inflamed Skin/Eczema
   - Anxiety, Nervous Insomnia, Tension Headaches, Mild Burns, Indigestion, Skin Irritations
   - Grief, Nervous Anxiety, Stress-Induced Palpitations, Cold Sores (HSV-1), Nervous Stomach/IBS, Mild Depression
```

**Blocker Reason:**
- Import script strict mode fails when relationships don't resolve
- catalog.json stays empty
- Explorer cannot display anything

**Solutions:**
1. ✅ **Recommended (current task):** Create .md files for all missing entries
2. 🔮 **Future:** Add lenient mode to import script (allows incomplete relationships)

**Deliverables:**
- Create missing action .md files
- Create missing challenge .md files
- Add to content/approved/
- Run `npm run content:import`
- Verify catalog.json is populated
- Verify relationships resolve

**Status:** ⏳ In Progress (needs curator to import these)

---

### Task I4.4: Full Workflow Testing

**Requirement:** [IR-3] Full workflow  
**App:** [Curator] [Explorer] [Integration]  
**Status:** 🔗 Blocked  
**Description:** Test end-to-end workflow from vault to explorer.

**Deliverables:**
- [ ] Curator: Import herbs, actions, challenges
- [ ] Curator: Approve all records
- [ ] Curator: Download .zip
- [ ] Integration: Extract to content/approved/
- [ ] Integration: Run `npm run content:import`
- [ ] Explorer: Load catalog with all entries
- [ ] Explorer: Browse all three types
- [ ] Explorer: Verify relationships display correctly

**Tests:** Manual workflow verification (blocked until Task I4.3 complete)

**Dependencies:** Task I4.1, Task I4.2, Task I4.3

---

### Task I4.5: Relationship Navigation

**Requirement:** [FR-E5] Relationship navigation  
**App:** [Explorer]  
**Status:** 🔗 Blocked  
**Description:** Verify relationship links are clickable and navigate correctly.

**Deliverables:**
- [ ] Herb detail shows related actions (clickable)
- [ ] Herb detail shows related challenges (clickable)
- [ ] Action detail shows related herbs (clickable)
- [ ] Challenge detail shows related herbs (clickable)
- [ ] Clicking navigates to related entry detail
- [ ] Bidirectional relationships work

**Tests:** Manual verification (blocked until Task I4.3 complete)

**Dependencies:** Task E1.4, Task I4.4

---

# Phase 5: Testing & Documentation

**Phase Status:** ✅ Partial (6/10 tasks complete)  
**Dependencies:** Phases 1-4

### Task T5.1: Specification Document

**Requirement:** Document all requirements formally  
**App:** [Both]  
**Status:** ✅ Done  
**Description:** Create spec.md as single source of truth.

**Deliverables:**
- spec.md file (700+ lines)
- 21 requirements total (9 Explorer + 12 Curator)
- Content structure definitions
- User workflows
- Edge cases
- Testing strategy

**Tests:** N/A (documentation)

**Commits:**
- 4019be4: docs: Create comprehensive spec.md as single source of truth

**Dependencies:** None

---

### Task T5.2: Implementation Plan

**Requirement:** Document implementation roadmap  
**App:** [Both]  
**Status:** ✅ Done  
**Description:** Create plan.md showing phases, status, blockers, dependencies.

**Deliverables:**
- plan.md file (400+ lines)
- 6 phases with status
- Dependency graph
- Critical path analysis
- Current blockers
- Next actions

**Tests:** N/A (documentation)

**Commits:**
- 43cae52: docs: Create implementation plan.md from spec.md

**Dependencies:** Task T5.1

---

### Task T5.3: Task Breakdown

**Requirement:** Document actionable task list  
**App:** [Both]  
**Status:** ✅ Done  
**Description:** Create tasks.md (this file) with task breakdown.

**Deliverables:**
- tasks.md file (~300+ lines)
- Tasks grouped by phase
- Status for each task
- Dependencies between tasks
- Clear descriptions and deliverables

**Tests:** N/A (documentation)

**Commits:** (this commit)

**Dependencies:** Task T5.1, Task T5.2

---

### Task T5.4: Bug Analysis & Prevention

**Requirement:** Document file selection bug  
**App:** [Curator]  
**Status:** ✅ Done  
**Description:** Analyze file selection bug, why tests missed it, and prevention strategy.

**Deliverables:**
- BUG-ANALYSIS.md (7.4 KB)
- Root cause analysis
- Test gap explanation
- Prevention guidance
- Code review checklist

**Tests:** N/A (documentation)

**Commits:**
- a43803b: docs: Add comprehensive bug analysis document

**Lessons Learned:**
- Spec gaps lead to implementation gaps
- Bulk operation tests don't catch sequential bugs
- State accumulation patterns need careful review

**Dependencies:** None (post-mortem)

---

### Task T5.5: Testing Patterns Guide

**Requirement:** Document patterns for testing sequential workflows  
**App:** [Both]  
**Status:** ✅ Done  
**Description:** Create TESTING-PATTERNS.md guide.

**Deliverables:**
- tests/e2e/TESTING-PATTERNS.md
- Good patterns (sequential workflows)
- Patterns to avoid (bulk-only tests)
- Vulnerability areas (file uploads, selections, carts)
- Code review checklist
- Examples and test cases

**Tests:** N/A (guidance)

**Commits:**
- cc1943b: docs: Add testing patterns guide and bug analysis comments

**Dependencies:** Task T5.4

---

### Task T5.6: Regression Test for File Accumulation

**Requirement:** Prevent file selection bug recurrence  
**App:** [Curator]  
**Status:** ✅ Done  
**Description:** Add playwright test for sequential file selections.

**Deliverables:**
- tests/e2e/curator/content-curation.spec.ts
- New test: "multiple sequential file selections accumulate records"
- Tests three sequential setInputFiles() calls
- Verifies selections accumulate (not replace)
- Detailed comments explaining the test gap that was missed

**Tests:** ✅ Playwright test passes

**Commits:**
- 655d4a3: test: Add regression test for multiple sequential file selections
- cc1943b: docs: Add testing patterns guide and bug analysis comments

**Dependencies:** Task T5.4

---

### Task T5.7: Explorer Unit Tests

**Requirement:** Test explorer app components  
**App:** [Explorer]  
**Status:** 📋 To Do  
**Description:** Write unit tests for Browse view, Detail view, routing, empty states.

**Deliverables:**
- [ ] BrowsePage.test.tsx (browse by type, empty state)
- [ ] EntryDetailPage.test.tsx (detail view, fields, apothecary sections)
- [ ] Router.test.tsx (navigation, history)
- [ ] App.test.tsx (catalog loading, error handling)
- [ ] Mock catalog data for testing

**Tests:** Not yet written

**Dependencies:** Task T5.1 (needs spec), Task E1.1-E1.7 (code ready)

---

### Task T5.8: Curator Unit Tests

**Requirement:** Test curator app components  
**App:** [Curator]  
**Status:** 📋 To Do  
**Description:** Write unit tests for file selection, parsing, validation, approval.

**Deliverables:**
- [ ] ContentImportPage.test.tsx (file selection, approval, export)
- [ ] Parsing tests (parseSourceForCuration)
- [ ] Validation tests (validateCuratedRelationships)
- [ ] Mock file data for testing

**Tests:** Not yet written

**Dependencies:** Task T5.1 (needs spec), Task C2.1-C3.5 (code ready)

---

### Task T5.9: Integration Tests

**Requirement:** Test end-to-end curator to explorer flow  
**App:** [Curator] [Explorer] [Integration]  
**Status:** 🔗 Blocked  
**Description:** Test full workflow from import to display.

**Deliverables:**
- [ ] Full workflow test (select → approve → export → import → display)
- [ ] Relationship resolution test
- [ ] Complete vs partial data tests
- [ ] Error handling tests

**Tests:** Cannot write until Phase 4 unblocked (Task I4.3)

**Dependencies:** Task I4.4, Task T5.6

---

### Task T5.10: Accessibility & Performance Audit

**Requirement:** Accessibility and performance testing  
**App:** [Both]  
**Status:** 📋 To Do  
**Description:** Audit keyboard navigation, screen reader support, performance.

**Deliverables:**
- [ ] Keyboard navigation audit (Tab, Enter, Escape)
- [ ] Screen reader testing (ARIA labels, semantic HTML)
- [ ] Performance baseline (100+ record catalog)
- [ ] Mobile responsiveness check

**Tests:** Manual accessibility audit + performance profiling

**Dependencies:** Task I4.4 (needs complete data)

---

# Phase 6: Future Enhancements

**Phase Status:** 🔮 Planned (0/10+ tasks)  
**Dependencies:** Phase 5 complete

### Task F6.1: Lenient Mode for Import Script

**Requirement:** Allow incomplete relationships at import time  
**App:** [Integration]  
**Status:** 🔮 Planned  
**Description:** Add `lenient` parameter to import script so it filters missing entries instead of failing.

**Benefit:** Users can test with partial data without needing every referenced entry approved.

**Deliverables:**
- [ ] Add parameter to importApprovedContent()
- [ ] Modify resolveRelationships() to filter vs throw
- [ ] Update error handling
- [ ] Document in spec.md

**Dependencies:** Task I4.2

---

### Task F6.2-F6.10: Additional Enhancements

🔮 Toast notifications, keyboard shortcuts, search, visualization, dark mode, mobile responsive, etc.

**See:** spec.md Future Enhancements section

---

# Current Status Summary

| Phase | Objective | Tasks | Complete | Blocked | To Do | Status |
|-------|-----------|-------|----------|---------|-------|--------|
| 1 | Explorer MVP | 7 | 7 | 0 | 0 | ✅ |
| 2 | Curator MVP | 7 | 7 | 0 | 0 | ✅ |
| 3 | Curator UX | 5 | 5 | 0 | 0 | ✅ |
| 4 | Integration | 5 | 2 | 3 | 0 | 🔗 |
| 5 | Testing & Docs | 10 | 6 | 1 | 3 | ⏳ |
| 6 | Enhancements | 10+ | 0 | 0 | 10+ | 🔮 |
| **TOTAL** | | **44+** | **27** | **4** | **13+** | **~60%** |

---

# Critical Path (What's Blocking Progress)

```
✅ Phase 1-3 COMPLETE
    ↓
Phase 4: Integration IN PROGRESS
    ↓
🔗 BLOCKED BY: Task I4.3 (missing relationship data)
    ↓
    OPTIONS:
    1. ✅ Create .md files for missing actions/challenges
    2. 🔮 Add lenient mode to import script (future task)
    ↓
UNBLOCK: Complete Task I4.3
    ↓
    THEN:
    ✅ Task I4.1: Export ✅
    ✅ Task I4.2: Import script ✅ (currently fails, will pass)
    ✅ Task I4.3: Complete data (in progress)
    ⏳ Task I4.4: Full workflow test
    ⏳ Task I4.5: Relationship navigation
    ↓
Phase 5: Testing & Verification
    ↓
Phase 6: Enhancements 🔮
```

---

# Next Immediate Actions

**To unblock and complete Phase 4:**

1. [ ] **Identify all missing entries** (Task I4.3)
   - Run `npm run content:import` and review errors
   - Extract list of unresolved action and challenge links

2. [ ] **Create missing action .md files** (Task I4.3)
   - Stub files with title, type, and optionally related fields

3. [ ] **Create missing challenge .md files** (Task I4.3)
   - Stub files with title, type, and optionally related fields

4. [ ] **Add to content/approved/** (Task I4.3)
   - Move all .md files to content/approved/

5. [ ] **Run import** (Task I4.2)
   - `npm run content:import`
   - Verify catalog.json is populated

6. [ ] **Test in Explorer** (Task I4.4, I4.5)
   - http://localhost:5173
   - Browse all entries
   - Click relationships
   - Verify navigation works

7. [ ] **Mark Phase 4 complete** (Task I4.1-I4.5)
   - Update this task status to ✅ Done

---

# Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Oct 6, 2026 | Copilot | Initial task breakdown from plan.md |

---

**Related Documents:**
- **spec.md** - Source specification (21 requirements)
- **plan.md** - Implementation roadmap (6 phases)
- **BUG-ANALYSIS.md** - File selection bug analysis
- **TESTING-PATTERNS.md** - Testing patterns guide
