# Website Code Review, Security, and Quality Improvement Plan

## Summary
Review the static portfolio site without adding a build step, package manager, framework, or broad redesign. Keep behavior and visual output stable while improving correctness, security posture, accessibility, maintainability, and performance.

Baseline found: static `index.html`, `styles.css`, `script.js`, tracked in git; no tests/tooling; `script.js` passes `node --check`; external CDN scripts/styles and Web3Forms are the main security review surfaces.

## Key Changes
- Create `tasks/todo.md` and track review progress there; create/update `tasks/lessons.md` only if a correction pattern appears.
- Review security first:
  - Check CDN dependencies, add SRI/crossorigin where safe, and avoid breaking script load order.
  - Review Web3Forms exposure and document dashboard-side restrictions needed for the public access key.
  - Add safe metadata such as `referrer` policy where compatible.
  - Keep `innerHTML` usage limited to fixed icon markup or replace with DOM creation if low-risk.
- Review accessibility and UX regressions:
  - Fix nav toggle keyboard support, `aria-expanded`, and menu state.
  - Improve command palette and video dialog hidden/focus state without changing the UI.
  - Confirm visible focus states, form labels, live regions, and reduced-motion behavior.
- Review code quality:
  - Keep the flat vanilla JS initializer pattern.
  - Add small guard clauses where DOM assumptions can throw.
  - Remove stale comments/selectors only when clearly unused.
  - Do not split files unless a repeated pattern becomes materially safer with a helper.
- Review performance:
  - Add image dimensions/fetch hints where useful.
  - Audit large video loading behavior and avoid eager video downloads.
  - Preserve current visuals and animations unless a problem is proven.

## Public Interfaces
- No new runtime dependencies.
- No npm/pnpm/yarn, bundler, framework, or CI unless explicitly requested later.
- Preserve existing URLs, section IDs, form field names, contact links, theme storage key `theme`, and current GitHub Pages-compatible static deployment.

## Test Plan
- Before changes: capture current behavior with browser smoke checks.
- After each focused change: verify navigation, dark mode persistence, command palette, project demo popup, show-more behavior, contact form UI states, and mobile menu.
- Run `node --check script.js`.
- Run HTML validation with an HTML5-capable validator if available; treat old `tidy` HTML5 element errors as non-authoritative.
- Browser-check desktop and mobile widths for layout overlap, console errors, broken assets, and keyboard accessibility.
- Compare git diff carefully to confirm only review-driven changes were made.

## Assumptions
- The goal is conservative hardening and cleanup, not a redesign.
- The site must remain directly openable from `index.html`.
- Security fixes should favor low-breakage changes over strict CSP work that would require larger inline-script/style refactors.
- Any external dependency version changes require verification against the live page before acceptance.
