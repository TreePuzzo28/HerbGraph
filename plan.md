# HerbGraph Implementation Plan

**Version:** 1.0  
**Last Updated:** October 6, 2026  
**Derived From:** spec.md

## Overview

Two-app architecture implementation plan. Shows phases, dependencies, and which app each phase affects.

**Data Flow Reminder:**
```
Obsidian Vault
    ↓
[Curator] Select & approve files
    ↓
content/approved/ folder
    ↓
npm run content:import
    ↓
public/data/catalog.json
    ↓
[Explorer] Browse catalog
```

---

## Phase 1: Explorer MVP

**Objective:** Build the core knowledge browser app  
**Duration:** Foundation phase  
**Status:** ✅ **COMPLETE**

### Goals
- Load catalog from JSON
- Browse entries by type
- View entry details
- Navigate with hash routing

### Deliverables

| Requirement | Status | Notes |
|-------------|--------|-------|
| [FR-E1] Application shell | ✅ | Header, nav, disclaimer, content area |
| [FR-E2] Catalog loading | ✅ | Loads from public/data/catalog.json |
| [FR-E3] Browse by entry type | ✅ | Health challenges, Actions, Herbs views |
| [FR-E4] Entry detail view | ✅ | Shows all fields, apothecary sections |
| [FR-E6] Educational disclaimer | ✅ | Persistent, non-dismissible |
| [FR-E7] Navigation and routing | ✅ | Hash-based SPA routing |
| [FR-E9] Empty state handling | ✅ | Graceful messages when empty |

### Blockers
- None; phase complete

### Notes
- Explorer is read-only; depends on curator for content
- Gracefully handles empty/partial catalog (FR-E8, FR-E9)

---

## Phase 2: Curator MVP

**Objective:** Build content import and review workflow  
**Duration:** Foundation phase  
**Status:** ✅ **COMPLETE**

### Goals
- Import Markdown files from vault
- Parse records into structured data
- Validate content
- Approve and export records

### Deliverables

| Requirement | Status | Notes |
|-------------|--------|-------|
| [FR-C1] Multi-file selection | ✅ | Sequential accumulation (bug fixed) |
| [FR-C2] File type validation | ✅ | .md extension required |
| [FR-C3] Content parsing | ✅ | Markdown → structured records |
| [FR-C4] Record review interface | ✅ | Display parsed records for review |
| [FR-C7] Record approval control | ✅ | Approve/reject checkboxes |
| [FR-C9] Export functionality | ✅ | .zip file to content/approved/ |
| [FR-C11] Record removal | ✅ | Remove individual records |

### Blockers
- None; phase complete

### Notes
- File selection accumulation bug discovered and fixed (see BUG-ANALYSIS.md)
- Regression test added to prevent recurrence

---

## Phase 3: Curator UX & Validation

**Objective:** Add UX improvements and validation controls  
**Duration:** Polish phase  
**Status:** ✅ **COMPLETE**

### Goals
- Add selection visibility
- Implement strict/lenient validation toggle
- Show validation errors clearly
- Improve user feedback

### Deliverables

| Requirement | Status | Notes |
|-------------|--------|-------|
| [FR-C5] Strict validation toggle | ✅ | Toggle between strict/lenient modes |
| [FR-C6] Duplicate detection | ✅ | Reject duplicate filenames |
| [FR-C8] Relationship validation | ✅ | Check references in strict mode |
| [FR-C10] Selection summary | ✅ | Sidebar showing record counts |
| [FR-C12] Clear all selections | ✅ | Button to reset import state |

### Blockers
- None; phase complete

### Notes
- Strict mode (default): validates all relationships exist
- Lenient mode: allows partial imports for testing
- Selection sidebar provides visibility when switching folders
- Clear button gives user explicit control

---

## Phase 4: Integration

**Objective:** Connect Curator output to Explorer input  
**Duration:** Integration phase  
**Status:** ⏳ **IN PROGRESS / BLOCKED**

### Goals
- Curator exports to content/approved/
- Import script creates catalog.json
- Explorer displays imported records
- Test full workflow

### Deliverables

| Requirement | Status | Notes |
|-------------|--------|-------|
| [IR-1] Curator to Explorer export | ✅ | Exports to content/approved/ folder |
| [IR-2] Content import script | ✅ | `npm run content:import` works |
| [IR-3] Full workflow | ⏳ | Partially complete; see blockers |
| [FR-E5] Relationship navigation | ⏳ | Need complete relationship data |
| [FR-E8] Broken relationship handling | ⚠️ | Filters silently; need test |

### Blockers
- **Missing relationships:** Current test content (Basil, Lavender, Lemon Balm) reference actions/challenges that aren't in approved/ folder
- **Import script strict mode:** Content import script has no lenient mode; fails when relationships don't resolve
- **Solution:** Need to either:
  1. Import ALL referenced actions and challenges to approved/ folder, OR
  2. Add lenient mode to import script

### Current State
```
✅ Curator exports files to content/approved/
✅ Import script reads from content/approved/
❌ Import script fails: unresolved relationships
❌ catalog.json is empty
❌ Explorer shows "No herbs available yet"
```

### Next Steps
1. Import missing action and challenge files to approved/
2. Run `npm run content:import`
3. Test full workflow: Curator → approved/ → catalog.json → Explorer
4. Verify relationship navigation works (FR-E5)
5. Test broken relationship filtering (FR-E8)

---

## Phase 5: Testing & Documentation

**Objective:** Comprehensive testing and requirement documentation  
**Duration:** Quality assurance phase  
**Status:** ✅ **COMPLETE (Partial)**

### Goals
- Document all requirements formally
- Add regression tests
- Create testing patterns guide
- Document lessons learned

### Deliverables

| Item | Status | Notes |
|------|--------|-------|
| [spec.md] Specification | ✅ | Comprehensive requirements (21 total) |
| [BUG-ANALYSIS.md] Bug analysis | ✅ | File selection bug story |
| [tests/e2e/TESTING-PATTERNS.md] Testing guide | ✅ | Patterns for sequential workflows |
| Regression test (file accumulation) | ✅ | Tests multi-step file selection |
| Explorer unit tests | ⏳ | Browse views, detail views |
| Curator unit tests | ⏳ | Parsing, validation, approval |
| Integration tests | ❌ | End-to-end curator → explorer |
| Accessibility audit | ❌ | Keyboard nav, screen readers |
| Performance testing | ❌ | 500+ record catalog |

### Blockers
- Integration phase incomplete; can't test full workflow
- Explorer tests may need mock catalog data
- Performance baseline not established

### Completed Work
- [spec.md] - 700+ line specification with 21 requirements
- [BUG-ANALYSIS.md] - Root cause analysis of file selection bug
- [TESTING-PATTERNS.md] - Guide for testing sequential workflows
- [CURATOR-REQUIREMENTS.md] - Detailed curator spec (now part of spec.md)
- Regression test for file accumulation bug

---

## Phase 6: Future Enhancements

**Objective:** Additional features and improvements  
**Duration:** Post-MVP  
**Status:** 🔮 **PLANNED**

### Curator Enhancements
- [ ] Progress indicator for large imports
- [ ] Keyboard shortcuts (Ctrl+A, Escape, etc.)
- [ ] Toast notifications for duplicate rejections
- [ ] Drag-and-drop file selection
- [ ] Preview of parsed data before approval
- [ ] Bulk approve/reject records
- [ ] Undo/redo for approval changes
- [ ] **Lenient mode for import script** (allow incomplete relationships)

### Explorer Enhancements
- [ ] Search/filter entries
- [ ] Relationship graph visualization
- [ ] Entry history/changelog
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

## Dependency Graph

```
Phase 1: Explorer MVP
├─ FR-E1: Shell
├─ FR-E2: Load catalog
├─ FR-E3: Browse types
├─ FR-E4: Detail view
├─ FR-E6: Disclaimer
├─ FR-E7: Routing
└─ FR-E9: Empty states
    ↓ DEPENDS ON Phase 2

Phase 2: Curator MVP
├─ FR-C1: File selection
├─ FR-C2: Validation
├─ FR-C3: Parsing
├─ FR-C4: Review UI
├─ FR-C7: Approval
├─ FR-C9: Export
└─ FR-C11: Removal
    ↓ DEPENDS ON Phase 3

Phase 3: Curator UX
├─ FR-C5: Strict/lenient toggle
├─ FR-C6: Duplicate detection
├─ FR-C8: Relationship validation
├─ FR-C10: Summary sidebar
└─ FR-C12: Clear all
    ↓ PRODUCES Phase 4 INPUT

Phase 4: Integration
├─ IR-1: Export → content/approved/
├─ IR-2: Import script
├─ FR-E5: Relationship navigation
└─ FR-E8: Broken link handling
    ↓ REQUIRES Phase 4 COMPLETE

Phase 5: Testing & Docs
├─ spec.md (single source of truth)
├─ plan.md (this file)
├─ tasks.md (derived from plan)
├─ Bug analysis & prevention
└─ Testing patterns guide
```

---

## Critical Path

```
Explorer MVP (done)
    ↓
Curator MVP (done)
    ↓
Curator UX (done)
    ↓
Integration ← YOU ARE HERE
    ↓ BLOCKED by missing relationship entries
        ↓
        OPTIONS:
        1. Import all referenced actions/challenges
        2. Add lenient mode to import script
        ↓
Full workflow (blocked until Phase 4 resolved)
    ↓
Testing & Docs (in progress; blocks Phase 4 verification)
```

---

## Current Status Summary

| Phase | Objective | Status | Completeness |
|-------|-----------|--------|--------------|
| 1 | Explorer MVP | ✅ Complete | 100% (7/7 requirements) |
| 2 | Curator MVP | ✅ Complete | 100% (7/7 requirements) |
| 3 | Curator UX | ✅ Complete | 100% (5/5 requirements) |
| 4 | Integration | ⏳ In Progress | 40% (blocked by relationships) |
| 5 | Testing & Docs | ✅ Partial | 60% (spec & tests done, integration tests pending) |
| 6 | Enhancements | 🔮 Planned | 0% |

**Overall Project:** ~60% complete (13 of 21 core requirements fully working)

---

## What's Blocking Phase 4?

The integration phase is blocked because:

1. **Test content is incomplete:** Herbs reference actions and challenges that don't exist
   - Basil.md references: Antispasmodic, Diaphoretic, Antimicrobial, etc. (not approved)
   - Lavender.md references: Anxiety, Nervous Insomnia, Tension Headaches (not approved)
   - etc.

2. **Import script is strict:** Has no lenient mode
   - Fails if any relationship doesn't resolve
   - Produces empty catalog.json
   - Explorer shows "No herbs available yet"

**Solutions:**

**Option A: Complete the data (Recommended for now)**
1. Go to Curator, import all referenced actions
2. Go to Curator, import all referenced challenges
3. Run `npm run content:import`
4. Explorer displays complete graph

**Option B: Add lenient mode to import script (Future enhancement)**
1. Modify `scripts/content/resolveRelationships.ts`
2. Add `lenient` parameter
3. Filters out missing references instead of throwing
4. Allows partial imports to Explorer

---

## Next Actions

**To unblock Phase 4:**

1. [ ] Identify all missing actions in test content
2. [ ] Identify all missing challenges in test content
3. [ ] Create .md files for each missing entry
4. [ ] Add to content/approved/ folder
5. [ ] Run `npm run content:import`
6. [ ] Verify catalog.json is populated
7. [ ] Test Explorer shows entries with relationships
8. [ ] Verify relationship navigation works (FR-E5)
9. [ ] Mark Phase 4 as complete

**Then Phase 5 verification:**
1. [ ] Run full test suite
2. [ ] Test integration workflow end-to-end
3. [ ] Verify all 21 requirements are met
4. [ ] Document any gaps

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Oct 6, 2026 | Copilot | Initial plan derived from spec.md |

---

**Related Documents:**
- **spec.md** - Source specification (21 requirements)
- **tasks.md** - Task breakdown (to be created)
- **BUG-ANALYSIS.md** - File selection bug story
- **TESTING-PATTERNS.md** - Testing guidance
