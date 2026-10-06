# HerbGraph Documentation Index

**Single Source of Truth:** This project follows a disciplined workflow where spec.md → plan.md → tasks.md drives all development.

---

## 📚 Core Documentation (Start Here)

### 1. **[spec.md](spec.md)** - Project Specification
- **What:** Complete specification for both Curator and Explorer apps
- **Contains:** 21 functional requirements, workflows, edge cases, data formats, testing strategy
- **Who should read:** Everyone — this is the single source of truth
- **Length:** ~700 lines

### 2. **[plan.md](plan.md)** - Implementation Roadmap
- **What:** 6-phase implementation plan with status and dependencies
- **Contains:** Phase breakdown, requirement mapping, critical path, current blockers
- **Who should read:** Project leads, developers planning work, anyone tracking progress
- **Length:** ~400 lines

### 3. **[tasks.md](tasks.md)** - Detailed Task Breakdown
- **What:** Actionable tasks with status, dependencies, and deliverables
- **Contains:** 44+ tasks organized by phase, status tracking, next actions
- **Who should read:** Developers executing work
- **Length:** ~700 lines

---

## 🐛 Post-Incident Analysis

### **[BUG-ANALYSIS.md](BUG-ANALYSIS.md)** - File Selection Bug Story
- **What:** Complete analysis of a critical bug discovered during development
- **Key insight:** Bugs are often symptoms of spec gaps, not just code gaps
- **Contains:** What happened, why existing tests missed it, lessons learned
- **Why it matters:** Explains root cause as missing requirements, not just coding error

### **[tests/e2e/TESTING-PATTERNS.md](tests/e2e/TESTING-PATTERNS.md)** - Testing Patterns
- **What:** Guidance on testing sequential/progressive workflows
- **Contains:** Good testing patterns, anti-patterns, code review checklist
- **Why it matters:** Prevents future bugs from being missed by incomplete tests

---

## 💻 Implementation Files

### Curator App (Import & Curation)
- **[src/pages/ContentImportPage.tsx](src/pages/ContentImportPage.tsx)**
  - Main curator UI component
  - Key fix (line 156): `setItems([...items, ...uniqueItems])` for accumulation
  - Features: file selection, validation toggle, approval, export

- **[src/content/curation.ts](src/content/curation.ts)**
  - Content parsing and validation logic
  - `validateCuratedRelationships(strict)` - strict vs lenient modes
  - Duplicate detection and relationship resolution

- **[tests/e2e/curator/content-curation.spec.ts](tests/e2e/curator/content-curation.spec.ts)**
  - Playwright tests including regression test for sequential file selections
  - Detailed comments explaining why the original test missed the bug

### Explorer App (Browsing)
- **[src/pages/BrowsePage.tsx](src/pages/BrowsePage.tsx)** - Browse by entry type
- **[src/pages/EntryDetailPage.tsx](src/pages/EntryDetailPage.tsx)** - Entry detail view
- **[src/App.tsx](src/App.tsx)** - App shell and routing

### Test Data
- **[content/approved/](content/approved/)** - Approved markdown files for explorer
  - Herbs: Basil.md, German Chamomile.md, Lavender.md, Lemon Balm.md
  - Actions: Antidepressant.md, Carminative.md, Nervine.md, Tonic.md
  - Challenges: Bloating.md, Gas.md, Nervous Tension.md
  - ⚠️ Currently missing referenced actions/challenges (Phase 4 blocker)

---

## 🚀 Development Workflow

### For New Developers
1. Read **spec.md** (understand requirements)
2. Read **plan.md** (understand roadmap and current status)
3. Read **tasks.md** (find next task to work on)
4. Reference implementation files as needed

### For Code Review
1. Check against **spec.md** (does it implement the requirement?)
2. Check for sequential/state accumulation issues (see **TESTING-PATTERNS.md**)
3. Ensure tests match progressive workflows, not just bulk operations

### For Project Planning
1. Check **plan.md** for current status and blockers
2. Coordinate Phase 4 blocker: missing test data (see **tasks.md** Task I4.3)
3. Plan Phase 5 testing and Phase 6 enhancements accordingly

---

## 📊 Current Project Status

| Phase | Name | Status | Tasks |
|-------|------|--------|-------|
| 1 | Explorer MVP | ✅ Complete | 7/7 |
| 2 | Curator MVP | ✅ Complete | 7/7 |
| 3 | Curator UX | ✅ Complete | 5/5 |
| 4 | Integration | 🔗 Blocked | 2/5 complete, 3 blocked |
| 5 | Testing & Docs | ⏳ In Progress | 6/10 complete |
| 6 | Enhancements | 🔮 Planned | Future |

**Current Blocker:** Task I4.3 in tasks.md — Missing relationship data for test entries

---

## 🔗 Related Resources

- **README.md** - Project overview and getting started
- **CHANGELOG.md** - Git commit history
- **GitHub Issues & PRs** - Implementation tracking

---

## Key Lessons Learned

1. **Spec first:** Ambiguous requirements lead to bugs. Writing spec.md upfront prevented future misunderstandings.

2. **Sequential testing:** Tests that only verify bulk operations miss bugs in sequential workflows. See **TESTING-PATTERNS.md**.

3. **Root cause analysis:** When a bug is found, ask "is this a code bug or a spec gap?" Often it's both.

4. **Single source of truth:** Having one spec.md prevents duplication and confusion. Redundant requirement docs cause maintenance headaches.

---

**Last Updated:** October 6, 2026  
**Maintained By:** Project team  
**Questions?** Refer to spec.md or check relevant implementation files
