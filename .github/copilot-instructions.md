# Copilot Instructions — Radixen Web

## Project overview

This is the official Radixen website. It is a **pure static site** — HTML, CSS, and JavaScript only. There is no framework, no build step, no package manager, and no transpilation.

**Radixen** is an independent organization (not a business) that builds software across AI/ML, software engineering, web development, creative/interactive media, research, and open source tooling.

---

## Stack & dependencies

| Layer | Detail |
|-------|--------|
| Markup | `index.html` — single page, all content |
| Styles | `style.css` — vanilla CSS with custom properties |
| Scripts | `script.js` — vanilla JS, `'use strict'` |
| Animations | GSAP 3.12.5 + ScrollTrigger via cdnjs CDN (**no SRI integrity hashes**) |
| Fonts | Exo 2 (display) + JetBrains Mono (mono) via Google Fonts |
| Hosting | Vercel (static) |

**Important:** Do NOT add `integrity` or `crossorigin` attributes to the GSAP `<script>` tags. They have caused resource-blocking errors in the past.

---

## File structure

```
radixen-web/
├── .github/
│   └── copilot-instructions.md   ← you are here
├── assets/
│   └── logo.png
├── index.html
├── style.css
├── script.js
├── .gitignore
├── README.md
└── CONTRIBUTING.md
```

---

## CSS conventions

- All design tokens are CSS custom properties on `:root`:
  ```css
  --white:       #FCF9F9
  --cyan:        #59BBD7
  --dark-blue:   #1D5B94
  --mid-blue:    #2888C2
  --navy:        #171B33
  --navy-card:   #1c2240
  --navy-border: rgba(40, 136, 194, 0.15)
  --ff-display:  'Exo 2', sans-serif
  --ff-mono:     'JetBrains Mono', monospace
  ```
- Use `clamp()` for fluid typography and spacing — avoid hard-coded `px` sizes for anything that should scale.
- Mobile breakpoints: `768px` (primary), `480px` (small phones). The `900px` breakpoint was removed when the about stats grid was deleted.
- The `#hero` section overrides the generic `section` max-width constraint — keep `max-width: 100%; width: 100%; padding: 0; margin: 0` on it.
- `#hero::after` is a fade gradient (`transparent → --navy`) used to smooth the canvas into the page background. Keep its `pointer-events: none`.

---

## JavaScript conventions

- All functions are named and defined before the `DOMContentLoaded` init block at the bottom.
- Animation init order matters — do not reorder without checking dependencies:
  1. `gsap.set(...)` — hides hero elements before intro plays
  2. `initCanvas()` — particle constellation
  3. `initNavbar()` — scrolled class + scroll indicator fade
  4. `initMobileNav()` — hamburger toggle
  5. `initScrollAnimations()` — ScrollTrigger fade-ups
  6. `initContactFlow()` — multi-step contact UI
  7. `initCursorGlow()` — desktop cursor effect
  8. `initIntro(cb)` → callback fires `initHeroAnimations()`
- GSAP `set()` calls to hide hero elements live in `DOMContentLoaded`, **before** `initIntro()`. This prevents a flash of visible content during the loading overlay. Do not move them into `initHeroAnimations()`.
- `initHeroAnimations()` re-shows `#hero-title` with `gsap.set('#hero-title', { opacity: 1 })` before animating the child `.letter` spans. The title container must be visible; the letters are hidden via `y: 115%` transform clipped by `.letter-wrap { overflow: hidden }`.

---

## HTML conventions

- Single `index.html`, section order: intro overlay → nav → hero → `#work` → `#about` → `#contact` → footer.
- Nav links and footer links must stay in sync — both contain: Areas, About, Contact, GitHub.
- `#work` section is the areas grid (6 cards). The section label/ID stays `work` for anchor targeting.
- The contact flow is a 3-step UI: step-0 (trigger button) → step-1 (three choices) → step-2a (general/research) or step-2b (urgent). Do not add email addresses anywhere outside this flow.
- The `about-inner` div is intentionally single-column (`max-width: 720px`). There is no stats grid — it was removed. Do not re-add it.

---

## Content & tone

- Radixen is **not a business**. Do not frame it as one — no client-facing language, no "services" framing.
- Avoid em dashes (`—`). Use colons or rewrite the sentence.
- Avoid AI-generated sentence structures like "Not X, but Y" or lists of negatives ("no clients, no investors...").
- Do not mention specific project names. Describe capabilities and problem domains instead.
- The disclaimer bar in the About section is intentional — it states Radixen is not a registered business. Do not remove or significantly alter it.
- Contact emails: `contact@radixen.com` (general/research), `admin@radixen.com` (urgent/legal/security). These are only revealed through the contact flow, not hardcoded elsewhere.

---

## Git & contribution workflow

See [CONTRIBUTING.md](../CONTRIBUTING.md) for the full workflow. Summary:

- **Never commit to `main` directly.** Always branch.
- Branch format: `<type>/<short-description>` — e.g. `feat/projects-section`, `fix/mobile-nav`
- Commit format: Conventional Commits — e.g. `fix(hero): restore title opacity after intro`
- PRs are squash-merged into `main` and the branch is deleted after.

---

## Local development

```bash
python3 -m http.server 4242
# http://localhost:4242
```

No install step. No build step.

---

## Deployment

Deployed to Vercel as a static site. Do not add a `vercel.json` unless a specific routing rule is needed. The default static output configuration is sufficient.
