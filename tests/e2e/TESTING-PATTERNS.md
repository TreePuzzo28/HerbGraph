# E2E Testing Patterns and Lessons Learned

## Overview
This document captures testing patterns, gaps discovered, and lessons learned from the HerbGraph e2e test suite. It's meant to guide future test development and help catch similar bugs.

## Bug: File Selection Clearing on Sequential Uploads

### What Happened
A critical bug existed in the curator app where sequential file selections would clear previous selections instead of accumulating them. Only the last file selection would be retained.

**User workflow that exposed it:**
1. User selects herb file via "Choose File" button
2. User switches to actions folder, clicks "Choose File" again, selects action file
3. Previous herb selection is now gone; only action remains
4. User switches to challenges folder, selects challenge file
5. Both herb and action are gone; only challenge remains

**Root cause:** `setItems(uniqueItems)` replaced state instead of appending `setItems([...items, ...uniqueItems])`

### Why Tests Missed It

**Existing test called `setInputFiles()` once with all files:**
```typescript
await page.locator('input[type="file"]').setInputFiles([
  resolve(validFixtures, 'German Chamomile.md'),
  resolve(validFixtures, 'Restless Mind.md'),
  resolve(validFixtures, 'Calming.md'),
]);
```

This simulates a bulk upload in a single file dialog, which **never triggers the bug** because `setItems()` is only called once.

**Real user pattern calls `setInputFiles()` multiple times:**
```typescript
// Call 1: User selects herb
await fileInput.setInputFiles(resolve(validFixtures, 'German Chamomile.md'));

// Call 2: User clicks "Choose File" again, selects action
await fileInput.setInputFiles(resolve(validFixtures, 'Calming.md'));

// Call 3: User clicks "Choose File" again, selects challenge
await fileInput.setInputFiles(resolve(validFixtures, 'Restless Mind.md'));
```

This **immediately triggers the bug** because each call to `setInputFiles()` invokes the state update handler multiple times.

### Regression Test Added

**Location:** `content-curation.spec.ts` - "multiple sequential file selections accumulate records instead of clearing"

**What it tests:**
- ✓ First file selection shows 1 record
- ✓ Second file selection adds to the list (shows 2 total, not 1)
- ✓ Third file selection adds to the list (shows 3 total, not 1)
- ✓ All records remain visible after each new selection

This test pattern would have **immediately caught** the "replace vs append" bug.

## Testing Patterns

### ✓ Good: Progressive/Sequential Workflows

When testing features where users perform the same action multiple times, test that behavior:

```typescript
test('multiple sequential actions accumulate', async ({ page }) => {
  // First action
  await page.click('button:has-text("Add Item")');
  await expect(page.getByText('Item 1')).toBeVisible();

  // Second action (item 1 should still be visible)
  await page.click('button:has-text("Add Item")');
  await expect(page.getByText('Item 1')).toBeVisible();
  await expect(page.getByText('Item 2')).toBeVisible();

  // Third action (both should still be visible)
  await page.click('button:has-text("Add Item")');
  await expect(page.getByText('Item 1')).toBeVisible();
  await expect(page.getByText('Item 2')).toBeVisible();
  await expect(page.getByText('Item 3')).toBeVisible();
});
```

### ✗ Avoid: Only Testing Bulk Operations

Don't assume a bulk operation properly handles sequential invocations:

```typescript
// This test only exercises ONE call to setInputFiles()
// It won't catch bugs that manifest on the SECOND call
await fileInput.setInputFiles([file1, file2, file3]);  // ← Only call once!
```

### ✓ Good: State Accumulation Tests

For any UI feature that accumulates state (shopping carts, form fields, selections, uploads), test:
1. State is empty initially
2. First user action creates one item
3. Second user action adds to the list (doesn't clear first item)
4. Third user action adds to the list (doesn't clear previous items)

### State Accumulation Vulnerability Areas

These patterns are particularly prone to "replace vs append" bugs:

- **Multi-file uploads** with repeated file dialogs
- **Shopping carts** (add item, change quantity, add another item)
- **Tag selection** with progressive tag addition
- **Form field accumulation** (add field, fill it, add another field)
- **Folder/path selection** with breadcrumb navigation
- **Search filters** where you add filters progressively
- **Autocomplete selections** where you select multiple items

For all these patterns, **test the sequential case**, not just the bulk case.

## Code Review Checklist

When reviewing state management code:

- [ ] If calling `setState(value)`, is it intentionally replacing or accidentally replacing?
- [ ] If appending to arrays, are you using `[...previous, ...new]` or `[new]`?
- [ ] Does the feature ever call the same handler multiple times? (If yes, test it)
- [ ] Ask: "What happens if the user does this action twice?"
- [ ] Ask: "What happens if they do it in a different order?"

## Related Files

- **Fix commit:** `fix: Allow multiple file selections to accumulate instead of clearing`
- **Regression test:** `content-curation.spec.ts` - last test in the file
- **Implementation:** `src/pages/ContentImportPage.tsx` line 156 in `addFiles()` function

## Future Testing Guidance

- **Sequential operations** deserve their own test (don't combine with bulk operation tests)
- **State accumulation bugs** are runtime bugs that tests must actively verify
- **Bulk vs Progressive** are different code paths—test both separately
- **Documentation matters**: This file helps catch similar bugs in future code reviews
