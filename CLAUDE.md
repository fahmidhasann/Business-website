# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> A detailed companion doc lives in [AGENTS.md](AGENTS.md). This file supersedes it where they disagree (e.g. line counts, git status).

## Project Type

Static single-page portfolio site. Pure HTML + CSS + vanilla JS. **No build step, no framework, no package manager, no tests.** Preview by opening `index.html` directly in a browser. No commands to build, lint, or test exist — adding any of these requires setting them up from scratch and should not be done without an explicit request.

## File Map

All three source files are monolithic; split carefully only if needed, keeping the `styles.css` / `script.js` links in `index.html` intact.

```
index.html   — All markup (~355 lines)
styles.css   — All styles (~2000 lines)
script.js    — All behavior (~700 lines)
assets/      — Profile photo + project videos/thumbnails
```

## External Dependencies

All loaded via CDN in `index.html` `<head>` — there are no local/npm dependencies. Do NOT introduce a package manager or build pipeline without an explicit request.

- **particles.js 2.0.0** (jsDelivr) — hero particle background (`#particles-js`)
- **GSAP 3.12.2 + ScrollTrigger** (cdnjs) — scroll-reveal animations
- **Typed.js 2.0.12** (cdnjs) — typewriter subtitle
- **Font Awesome 6.4.0** (cdnjs) — icons
- **Google Fonts** Cormorant Garamond + Inter

A strict **Content-Security-Policy** is set via `<meta http-equiv>` at the top of `index.html`. Any new external host (script, style, font, or `connect`/`fetch` target) MUST be added to the matching CSP directive or it will be blocked at runtime.

## JS Architecture (`script.js`)

Flat, global-scope, no modules/classes/`import`. Everything boots from a single `DOMContentLoaded` listener (near the bottom, ~line 691) that calls one `initialize*()` function per component:

`initializeTheme`, `initializeParticles`, `initializeScrollEffects`, `initializeNavigation`, `initializeCommandPalette`, `initializeSubtitleSlider`, `initializeFaqAccordions`, `initializeDarkModeToggle`, `initializeNavScroll`, `initializeContactForm`, `initializeEasterEgg`.

When editing:
- Add new components as an `initialize*()` function and wire it into the `DOMContentLoaded` block.
- Selectors must match classes/IDs already in `index.html` — never invent a selector without adding the corresponding markup.
- `initializeScrollEffects` uses GSAP/ScrollTrigger with an **IntersectionObserver fallback** when GSAP is unavailable.

## Theme System

Dark/light controlled by the `data-theme` attribute on `<html>`, persisted in `localStorage["theme"]` (`"light"` | `"dark"`). The toggle button is created dynamically in `initializeDarkModeToggle`. CSS theming uses CSS custom properties at `:root` overridden under `[data-theme="dark"]`.

## CSS

Hand-written, no preprocessor/Tailwind/utility classes. Colors via `:root` custom properties. Breakpoints at 992px / 768px / 576px. Honors `prefers-reduced-motion`. `.hidden-card` is toggled by JS for project/video filtering.

## Contact Form

Submits via `fetch` POST to `https://api.web3forms.com/submit` (allowed in CSP `connect-src` / `form-action`). The Web3Forms `access_key` is a hidden input in `index.html`. `initializeServiceSelection`/service CTAs prefill the form when a package is selected.

## Deployment

GitHub Pages at `https://fahmidhasann.github.io/learnaiwithfahmid/`, served from `main` at the repository root. Vercel is no longer used. Keep `<link rel="canonical">`, `og:url`, `og:image` and `twitter:image` in `index.html` in sync if the URL ever changes.
