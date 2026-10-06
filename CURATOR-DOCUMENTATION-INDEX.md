# HerbGraph Curator App Documentation Index

## Quick Navigation

### 📋 Requirements & Specs
- **[CURATOR-REQUIREMENTS.md](CURATOR-REQUIREMENTS.md)** - Complete specification (12 functional requirements, 3 non-functional)
  - **For:** Anyone wanting to understand what the curator does and should do
  - **Length:** ~7,000 words
  - **Key sections:** FR-1 through FR-12, user workflows, edge cases, testing strategy

- **[CURATOR-REQUIREMENTS-SUMMARY.md](CURATOR-REQUIREMENTS-SUMMARY.md)** - Overview and prevention guide
  - **For:** Quick reference; understanding how bug led to spec creation
  - **Length:** ~2,000 words
  - **Key sections:** Three-layer solution, prevention checklist, next steps

### 🐛 Bug Analysis
- **[BUG-ANALYSIS.md](BUG-ANALYSIS.md)** - Complete story of the file selection bug
  - **For:** Understanding why tests missed the bug and lessons learned
  - **Length:** ~3,500 words
  - **Key sections:** The bug, root causes (code vs spec), why tests missed it, testing gaps

### 🧪 Testing Guidance
- **[tests/e2e/TESTING-PATTERNS.md](tests/e2e/TESTING-PATTERNS.md)** - Testing patterns and vulnerability areas
  - **For:** Test developers and code reviewers
  - **Length:** ~2,800 words
  - **Key sections:** Good patterns, patterns to avoid, state accumulation vulnerabilities, code review checklist

### 💻 Implementation
- **[src/pages/ContentImportPage.tsx](src/pages/ContentImportPage.tsx)** - Curator UI implementation
  - Key fix: Line 156 changed from `setItems(uniqueItems)` to `setItems([...items, ...uniqueItems])`
  - Key features: File selection, validation toggle, approval UI, export logic

- **[src/content/curation.ts](src/content/curation.ts)** - Parsing and validation logic
  - `validateCuratedRelationships()` accepts `strict` parameter for toggle behavior

- **[tests/e2e/curator/content-curation.spec.ts](tests/e2e/curator/content-curation.spec.ts)** - Playwright tests
  - Includes new regression test for sequential file selections with detailed comments

---

## The Story: Bug → Spec → Prevention

### What Happened

1. **User reported bug:** "When I select herb file, then action file, the herb disappears"
2. **Root cause identified:** `setItems()` was replacing state instead of appending
3. **Question asked:** "Why didn't tests catch this?"
4. **Test analysis:** Existing test only called `setInputFiles()` once; never sequentially
5. **Deeper question:** "Why was this behavior not spec'd?"
6. **Realization:** Curator was "built on the fly" without explicit requirements

### The Three-Layer Fix

```
CODE LAYER (Fix):
src/pages/ContentImportPage.tsx line 156
setItems(uniqueItems) → setItems([...items, ...uniqueItems])

SPEC LAYER (Prevent):
CURATOR-REQUIREMENTS.md
Explicitly define FR-1: Multi-File Selection with Accumulation

TEST LAYER (Verify):
tests/e2e/curator/content-curation.spec.ts
Add regression test for sequential file selections
```

### Prevention Strategy

**For future bugs like this:**

1. **Write spec first** - Define behavior explicitly before coding
2. **Document workflows** - Capture real user patterns (sequential, progressive, etc.)
3. **Write tests based on spec** - Test what the spec requires, including edge cases
4. **Code based on both** - Implement spec + pass tests

**For similar bugs in other features:**
- Use the code review checklist in [TESTING-PATTERNS.md](tests/e2e/TESTING-PATTERNS.md)
- Identify state accumulation patterns (uploads, selections, carts, etc.)
- Test sequential/progressive workflows separately from bulk operations

---

## Documentation Map

```
Project Root
├── CURATOR-REQUIREMENTS.md                  ← Read first for curator overview
├── CURATOR-REQUIREMENTS-SUMMARY.md          ← Read for bug-to-spec story
├── BUG-ANALYSIS.md                          ← Read for "why tests missed it"
├── README.md                                (Project overview)
│
├── src/
│   ├── pages/ContentImportPage.tsx          ← Main curator UI component
│   ├── content/curation.ts                  ← Parsing & validation logic
│   └── styles/global.css                    ← Curator styling
│
├── curator/                                 ← Separate dev app for curator
│   ├── main.tsx                             ← Entry point (runs on :5174)
│   └── vite.config.ts
│
└── tests/
    └── e2e/
        ├── TESTING-PATTERNS.md              ← Read for testing guidance
        ├── curator/
        │   └── content-curation.spec.ts     ← Playwright tests (includes regression test)
        └── fixtures.ts                      ← Test fixtures
```

---

## Key Sections to Read

### For Product Managers / Designers
1. Start: [CURATOR-REQUIREMENTS-SUMMARY.md](CURATOR-REQUIREMENTS-SUMMARY.md)
2. Then: [CURATOR-REQUIREMENTS.md](CURATOR-REQUIREMENTS.md) sections FR-1 through FR-12
3. Reference: User workflows in [CURATOR-REQUIREMENTS.md](CURATOR-REQUIREMENTS.md)

### For Developers
1. Start: [CURATOR-REQUIREMENTS.md](CURATOR-REQUIREMENTS.md) - Know what to build
2. Read: [src/pages/ContentImportPage.tsx](src/pages/ContentImportPage.tsx) - See implementation
3. Learn: [tests/e2e/TESTING-PATTERNS.md](tests/e2e/TESTING-PATTERNS.md) - Avoid similar bugs

### For QA / Test Developers
1. Start: [tests/e2e/TESTING-PATTERNS.md](tests/e2e/TESTING-PATTERNS.md) - Learn vulnerability patterns
2. Review: [tests/e2e/curator/content-curation.spec.ts](tests/e2e/curator/content-curation.spec.ts) - See example tests
3. Reference: Code review checklist in [TESTING-PATTERNS.md](tests/e2e/TESTING-PATTERNS.md)

### For Code Reviewers
1. Reference: Code review checklist in [tests/e2e/TESTING-PATTERNS.md](tests/e2e/TESTING-PATTERNS.md)
2. Remember: Ask "What if the user does this action twice?"
3. Check: State management patterns (replace vs append)

---

## Key Commits

| Commit | Type | What | Why |
|--------|------|------|-----|
| `3b08a21` | docs | Added CURATOR-REQUIREMENTS-SUMMARY.md | Tie bug to spec to prevention |
| `cdfe73b` | docs | Added CURATOR-REQUIREMENTS.md | Formalize curator as spec, prevent ambiguity |
| `a43803b` | docs | Added BUG-ANALYSIS.md | Document bug discovery and prevention |
| `cc1943b` | docs | Added TESTING-PATTERNS.md, test comments | Prevent similar test gaps |
| `655d4a3` | test | Added regression test | Catch file accumulation bug |
| `482f648` | fix | Fixed setItems() logic | Actually fix the bug |

---

## FAQ

**Q: What was the bug?**
A: Sequential file selections (choose herb → choose action → choose challenge) would clear previous selections instead of accumulating them.

**Q: Why didn't tests catch it?**
A: Existing tests called `setInputFiles()` once with all files. They didn't test sequential calls, which is how real users interact.

**Q: What's the real root cause?**
A: Spec gap. Multi-file accumulation wasn't explicitly documented, so developer chose simpler "replace" pattern.

**Q: How do we prevent this?**
A: Write specs before code. Formalize requirements. Test progressive workflows separately. Use code review checklist.

**Q: Where's the spec now?**
A: [CURATOR-REQUIREMENTS.md](CURATOR-REQUIREMENTS.md) - 12 functional requirements, 3 non-functional, workflows, edge cases.

**Q: Which file has the code fix?**
A: [src/pages/ContentImportPage.tsx](src/pages/ContentImportPage.tsx) line 156 - changed to `setItems([...items, ...uniqueItems])`

**Q: Where should I add new curator features?**
A: First update [CURATOR-REQUIREMENTS.md](CURATOR-REQUIREMENTS.md) with new requirements. Then implement. Then test based on spec.

---

## Testing Vulnerability Checklist

Use this when reviewing state management code:

- [ ] If calling `setState(value)`, is it intentionally replacing or accidentally replacing?
- [ ] If appending to arrays, are you using `[...previous, ...new]` or `[new]`?
- [ ] Does the feature ever call the same handler multiple times? (If yes, test it!)
- [ ] What happens if the user does this action twice?
- [ ] What happens if they do it in a different order?

**Vulnerable patterns:** File uploads, selections, shopping carts, tag accumulation, search filters, autocomplete selections

See full details in [tests/e2e/TESTING-PATTERNS.md](tests/e2e/TESTING-PATTERNS.md)

---

## Session Files

Additional reference materials saved in session state:
- `/Users/tree/.copilot/session-state/ef12b3f6-a187-4abd-8f45-95bc8c2aea33/files/bug-analysis.md` (Detailed bug analysis)

---

**Last Updated:** October 6, 2026  
**Maintained By:** Copilot  
**Related Session Checkpoints:**
- `002-curator-ux-validation-toggle-a.md` - Curator UX: validation toggle and file accumulation fix
- `001-curator-ux-selection-visibilit.md` - Curator UX: selection visibility and validation toggle
