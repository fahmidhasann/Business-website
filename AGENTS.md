# AGENTS.md — portfolio-v2

## Project Type

Static single-page portfolio site. Pure HTML + CSS + vanilla JS. **No build step, no framework, no package manager.** Open `index.html` directly in a browser to preview.

## File Map

```
index.html   — All markup (568 lines)
styles.css   — All styles (1728 lines)
script.js    — All behavior (851 lines)
assets/      — Images, videos, and one profile photo
```

All three source files are monolithic. Split carefully if needed — CSS and JS must stay linked from `<head>` via filenames in `index.html`.

## CDN Dependencies (loaded in `index.html` `<head>`)

| Library | CDN | Used For |
|---|---|---|
| particles.js 2.0.0 | jsDelivr | Hero particle background |
| GSAP 3.12.2 + ScrollTrigger | cdnjs | Scroll-reveal animations |
| Typed.js 2.0.12 | cdnjs | Typewriter subtitle |
| Font Awesome 6.4.0 | cdnjs | All icons |
| Google Fonts (Cormorant Garamond + Inter) | fonts.googleapis.com | Typography |

These are the ONLY external dependencies. Do NOT add npm/pnpm/yarn or a build pipeline without explicit request.

## JS Architecture

`script.js` follows a flat initialization pattern:

- **All code runs from a single `DOMContentLoaded` listener** at the top (line 2).
- Each component has its own `initialize*()` function called from that listener.
- Functions are grouped by section (Theme, Animation, Navigation, Projects, Command Palette, UI, Easter Egg).
- No modules, no classes, no `import`/`export`. Everything is global scope.

Key patterns to follow when editing:
- Add new initializers to the `DOMContentLoaded` block.
- Scroll animations have a **GSAP fallback to IntersectionObserver** (see `initializeScrollEffects`).
- Targeting uses CSS classes from `index.html` — never invent new selectors without matching HTML.

## Theme System

Dark/light mode controlled by `data-theme` attribute on `<html>`. Persisted in `localStorage` key `"theme"` with values `"light"` or `"dark"`. The toggle button is created dynamically in JS (`initializeDarkModeToggle`). CSS uses `[data-theme="dark"]` selectors.

## CSS

- **No preprocessor, no Tailwind, no utility classes.** All hand-written.
- Custom properties for colors defined at `:root` and overridden under `[data-theme="dark"]`.
- Breakpoints: 992px, 768px, 576px.
- Has `prefers-reduced-motion` support.
- Has a `.hidden-card` class used by JS for project/video filtering.

## Contact Form

Uses [Web3Forms](https://web3forms.com/) via `fetch` POST to `https://api.web3forms.com/submit`. The access key is hardcoded in `index.html` as a hidden input. `initializeServiceSelection()` prefills the form when a service package CTA is clicked.

## Easter Egg

Konami code (↑↑↓↓←→←→ B A) triggers confetti. Defined in `initializeEasterEgg()`.

## No Dev Tooling Exists

- No tests, no test runner
- No linting or formatting config
- No CI/CD workflows
- Not a git repo
- No `.env` files

Any of these would need to be set up from scratch.

## Deployment

Deployed on GitHub Pages at `https://fahmidhasann.github.io/`. The `<link rel="canonical">` tag in `index.html` references this URL — keep it updated if the domain changes.
