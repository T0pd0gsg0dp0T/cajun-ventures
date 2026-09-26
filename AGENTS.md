# Repository Guidelines

## Project Structure & Module Organization
This repository is a static marketing site (no build step required).

- Root HTML pages: `index.html`, `services.html`, `gallery.html`, `about.html`, `equipment.html`, `testimonials.html`, `faq.html`, `quote.html`, `contact.html`, `articles.html`
- Styles: `css/styles.css` (main), `css/critical.css` (critical/inlined support)
- Scripts: `js/main.js` (UI behavior), `js/hubspot.js` (tracking/form integration)
- Assets: `images/` plus topic folders like `images/equipment/` and `images/gallery/`
- Notes: `AMP-EVALUATION.md` contains AMP constraints and migration considerations.

## Build, Test, and Development Commands
No package manager scripts are configured in this folder.

- `python3 -m http.server 8080` - run a local static server from repo root
- `rg --files` - list project files quickly
- `rg -n "YOUR_PORTAL_ID|TODO|FIXME" .` - find placeholders and unfinished content

Open `http://localhost:8080` and validate all top-level pages after changes.

## Coding Style & Naming Conventions
- Use 4-space indentation in HTML, CSS, and JS to match existing files.
- Prefer semantic, kebab-case CSS class names (example: `.hero-badge`, `.nav-main`).
- Use camelCase for JavaScript functions/variables (example: `initMobileMenu`).
- Keep page filenames lowercase and kebab/simple style (example: `services.html`).
- Preserve existing SEO/structured-data tags when editing `<head>` content.

## Testing Guidelines
There is no automated test framework currently; use manual regression checks:

- Verify navigation, mobile menu, sliders, FAQ toggles, and forms on changed pages.
- Confirm asset paths and image loading from `images/` subfolders.
- Check desktop and mobile responsive layouts in browser dev tools.
- Re-test any page that shares global CSS/JS after edits.

## Commit & Pull Request Guidelines
Local `.git` history is not available in this snapshot, so use this standard:

- Commit format: `type(scope): concise summary` (for example, `fix(nav): correct mobile menu close behavior`).
- Keep commits focused by concern (content, styling, behavior, assets).
- PRs should include: what changed, affected pages, before/after screenshots for UI changes, and manual test notes.
- Link related issue/ticket IDs when available.
