# Link & Interactivity Audit — Learning Hub

**Audit date:** May 2026  
**Method:** Full static code analysis across all 5 pages, 3 JS files, 1 CSS file, and 28 data objects.  
**Scope:** All `href` links, `<script src>` references, `<link>` refs, interactive elements (theme toggle, burger menu, sidebar nav, filters, sort headers, anchor jump links).

---

## Summary

| # | Severity | Page / File | Issue | Status |
|---|----------|-------------|-------|--------|
| 1 | 🔴 Critical | `tech-issues.html` | Theme toggle button non-functional — `theme.js` not loaded | **Fixed** |
| 2 | 🔴 Critical | `tech-issues.html` | Mobile burger menu non-functional — `theme.js` not loaded | **Fixed** (same root cause) |
| 3 | 🟡 Medium | `js/leetcode.js` | Fetch fallback references `data/leetcode-roadmap.json` (file does not exist) | **Fixed** |
| 4 | 🟡 Medium | `js/leetcode.js` | Unnecessary `async` on `DOMContentLoaded` callback after removing `await` | **Fixed** |
| 5 | 🟠 Low | `benchmarks.html` | "Already tagged" guard in `applyThroughputTags()` always false — checked `textContent`, not DOM | **Fixed** |
| 6 | 🟠 Low | `js/tech-issue-renderer.js` | Dead iframe-era code: `postHeightToParent()`, `ResizeObserver`, iframe nav-hide block | **Fixed** |
| 7 | ⚪ Info | `docs/tech-issues/*.html` | 28 orphaned sub-pages — no navigation path leads to them from the main hub | Not fixed (informational) |

---

## Detailed Findings

---

### 🔴 Bug 1 — Theme Toggle Button: Fully Dead on `tech-issues.html`

**File:** `docs/tech-issues.html`  
**Severity:** Critical — user-reported bug, confirmed by analysis  
**Status:** ✅ Fixed

**Root Cause:**  
`tech-issues.html` was missing the `<script src="../js/theme.js"></script>` tag that all other pages include. `theme.js` is the single script that:
- Wires up the `#theme-toggle` button's `click` event listener
- Toggles `data-theme` on `<html>` and persists to `localStorage`
- Updates the button icon (sun/moon SVG)

The button element exists in the HTML and renders, but clicking it does nothing because no event listener was ever attached.

**Compare — pages that work correctly:**
```html
<!-- index.html, leetcode.html, benchmarks.html, fulfillment.html — all have: -->
<script src="../js/theme.js"></script>
```

**Compare — broken page:**
```html
<!-- tech-issues.html — only loaded these two: -->
<script src="data/tech-issues-data.js"></script>
<script src="js/tech-issue-renderer.js"></script>
<!-- theme.js was MISSING -->
```

**Fix applied:**
```html
<script src="../js/theme.js"></script>   ← inserted here
<script src="data/tech-issues-data.js"></script>
<script src="js/tech-issue-renderer.js"></script>
```

---

### 🔴 Bug 2 — Mobile Burger Menu: Non-Functional on `tech-issues.html`

**File:** `docs/tech-issues.html`  
**Severity:** Critical (mobile UX broken)  
**Status:** ✅ Fixed (same fix as Bug 1 — both caused by missing `theme.js`)

**Root Cause:**  
`theme.js` also contains the Bulma burger-menu click handler:
```javascript
const burgers = document.querySelectorAll('.navbar-burger');
burgers.forEach(function (burger) {
  burger.addEventListener('click', function () {
    const targetId = burger.dataset.target;
    const target = document.getElementById(targetId);
    burger.classList.toggle('is-active');
    if (target) target.classList.toggle('is-active');
  });
});
```
Without `theme.js`, clicking the `☰` burger at mobile widths does nothing — the navbar never opens.

**Secondary effect also fixed by the same fix:**  
The navbar scroll shadow (`navbar.classList.toggle('is-scrolled', ...)`) also lives in `theme.js` and was also missing on `tech-issues.html`.

---

### 🟡 Bug 3 — `leetcode.js`: Fetch Fallback References Non-Existent File

**File:** `docs/js/leetcode.js` line 37  
**Severity:** Medium — silent failure path  
**Status:** ✅ Fixed

**Root Cause:**  
The fallback code tried to `fetch('data/leetcode-roadmap.json')` but the actual data file is `data/leetcode-roadmap.js` (JavaScript, not JSON). The `.json` file has never existed.

```javascript
// Before — broken fallback
if (!roadmap) {
  const res = await fetch('data/leetcode-roadmap.json', { cache: 'force-cache' });
  // ↑ This file does not exist. Also fetch() is blocked on file:// protocol.
  ...
}
```

This was never triggered in practice because `window.LEETCODE_ROADMAP` is always defined by `data/leetcode-roadmap.js` (loaded first via `<script src>`). However, if `leetcode-roadmap.js` ever failed to load, the app would fall through to the fetch path, which would then fail silently or throw a 404 — providing no useful diagnostic.

**Fix applied:**  
Removed the `try/catch` + `fetch` block entirely. The data is always pre-loaded; a clear error message is shown if `window.LEETCODE_ROADMAP` is undefined:

```javascript
// After — clean synchronous check
const roadmap = window.LEETCODE_ROADMAP;
if (!roadmap) {
  content.innerHTML = `<div class="notification is-danger is-light">
    Failed to load roadmap data. Ensure data/leetcode-roadmap.js is included.
  </div>`;
  return;
}
```

Also removed the now-unnecessary `async` keyword from the `DOMContentLoaded` callback.

---

### 🟠 Bug 4 — `benchmarks.html`: "Already Tagged" Guard Always Evaluates False

**File:** `docs/benchmarks.html` inside `applyThroughputTags()`  
**Severity:** Low — harmless today, but would cause double-wrapping if function were called more than once  
**Status:** ✅ Fixed

**Root Cause:**  
The guard used `cell.textContent.trim()` (which strips all HTML) and then checked `raw.includes('<span')`:

```javascript
const raw = cell.textContent.trim();
if (!raw || raw.includes('<span')) return; // always false — textContent has no HTML
```

`textContent` never contains angle brackets from markup, so the check `raw.includes('<span')` is permanently `false`. If `applyThroughputTags()` were called twice, cells would be double-wrapped in `<span>` tags.

**Fix applied:** Replaced the broken string check with a proper DOM query:

```javascript
if (!raw || cell.querySelector('span')) return; // correctly detects already-tagged cells
```

---

### 🟠 Bug 5 — `tech-issue-renderer.js`: Dead Iframe-Era Code

**File:** `docs/js/tech-issue-renderer.js`  
**Severity:** Low — no runtime impact, but clutters the file and creates confusion  
**Status:** ✅ Fixed

**Root Cause:**  
The renderer was originally designed for an iframe-based architecture. When the architecture was changed to inline rendering (data loaded directly into `#root` in the parent page), three blocks of iframe-only code were not removed:

1. **Navbar hide block** (top of file):
   ```javascript
   if (window.self !== window.top) {
     const topNavbar = document.querySelector('.navbar.topbar, .site-navbar');
     if (topNavbar) topNavbar.style.display = 'none';
   }
   ```

2. **`postHeightToParent()` function** — posts `postMessage` to iframe parent

3. **`setInterval` + `ResizeObserver` block** — repeatedly fired height updates to parent

All three are gated by `window.self !== window.top`, which is always `false` in the current architecture (renderer runs in the main document, not inside an iframe).

**Fix applied:** All three dead blocks removed from the file.

---

### ⚪ Info 6 — 28 Orphaned Sub-Pages in `docs/tech-issues/`

**Files:** `docs/tech-issues/*.html` (28 files)  
**Severity:** Informational — no broken links, but stale disk artifacts  
**Status:** Not fixed — left for user decision

**Background:**  
These were the original standalone per-topic HTML pages, each with its own `pageData` object inline. The architecture was later changed so that all 28 data objects are now compiled into `docs/data/tech-issues-data.js` and rendered inline into `tech-issues.html`.

The 28 sub-pages still exist on disk and are individually functional if opened directly (they reference `../../css/style.css`, `../../js/theme.js`, and `../js/tech-issue-renderer.js` — all of which still resolve correctly). However, no link in the main navigation points to them.

**Options:**
- **Delete them** — if the inline rendering approach is final, these files serve no purpose
- **Keep as backup** — in case the inline approach needs to be reverted
- **Link them** — not recommended; the inline approach is better for performance

---

## Verified-Working Elements

The following were inspected and confirmed correct:

| Element | Pages | Result |
|---------|-------|--------|
| All page `href` links (`index.html`, `leetcode.html`, etc.) | All 5 | ✅ All resolve to existing files |
| `../css/style.css` stylesheet path | All 5 | ✅ Resolves to `learning/css/style.css` |
| `data/tech-issues-data.js` — all 28 TECH_ISSUES_DATA keys | `tech-issues.html` | ✅ All 28 keys match sidebar topic list |
| Benchmarks sidebar anchor links (`#core`, `#gateways`, etc.) | `benchmarks.html` | ✅ All match `id` attributes in page |
| `window.LEETCODE_ROADMAP` set by `data/leetcode-roadmap.js` | `leetcode.html` | ✅ Global defined before `leetcode.js` runs |
| LeetCode filter buttons (All / Easy / Medium / Hard) | `leetcode.html` | ✅ Correct event delegation and re-render |
| Tech-issues sidebar search (200ms debounce) | `tech-issues.html` | ✅ Correct filter logic |
| Tech-issues hash routing (`#kafka-throughput` etc.) | `tech-issues.html` | ✅ Correct key derivation and lookup |
| Theme FOUC prevention IIFE in `<head>` | All 5 | ✅ Runs synchronously before paint |
| Benchmarks table sort headers | `benchmarks.html` | ✅ Correct sort + direction toggle |
| Throughput color thresholds (≥100K green, ≥10K yellow, <10K red) | `benchmarks.html` | ✅ Matches sidebar legend |

---

## Files Modified by This Audit

| File | Change |
|------|--------|
| `docs/tech-issues.html` | Added missing `<script src="../js/theme.js"></script>` |
| `docs/js/leetcode.js` | Replaced `async` + broken fetch fallback with synchronous `window.LEETCODE_ROADMAP` check |
| `docs/benchmarks.html` | Fixed `applyThroughputTags()` already-tagged guard to use `cell.querySelector('span')` |
| `docs/js/tech-issue-renderer.js` | Removed dead iframe-era code (navbar hide block, `postHeightToParent`, `ResizeObserver`) |
