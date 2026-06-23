# Radixen Web

The official Radixen website. Static HTML/CSS/JS, no build step.

**Live:** [radixen.com](https://radixen.com) · **GitHub Org:** [github.com/Radixen-Dev](https://github.com/Radixen-Dev/)

---

## Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styles | CSS3 (custom properties, grid, clamp) |
| Animations | [GSAP 3](https://gsap.com/) + ScrollTrigger |
| Fonts | Exo 2 + JetBrains Mono (Google Fonts) |
| Hosting | GitHub Pages (custom domain via `CNAME`) |

No framework. No build toolchain. No dependencies to install.

---

## Project structure

```text
radixen-web/
├── index.html          # Homepage markup
├── css/
│   └── style.css       # All shared styles (both pages)
├── js/
│   └── script.js       # Homepage interactivity & animation
├── handoff/            # /handoff product page
│   ├── index.html
│   ├── handoff.css
│   └── handoff.js
├── assets/
│   └── logo.png        # Logo, favicon, OG image
├── CNAME               # Custom domain (www.radixen.com)
├── robots.txt
├── sitemap.xml
├── README.md
└── CONTRIBUTING.md
```

---

## Local development

```bash
python3 -m http.server 4242
```

Open [http://localhost:4242](http://localhost:4242). No install, no build.

---

## Pages

- **Homepage** (`index.html`) — Hero, Areas, Projects, Services, About, Contact, Footer.
- **handoff** (`handoff/`) — Product landing page for [handoff](https://github.com/Radixen-Dev/handoff), an open-source Go CLI that transfers knowledge between AI agent sessions.

---

## Homepage sections

- **Hero** — Full-viewport intro with particle canvas, animated title, and entry CTAs
- **Areas** — Six discipline cards: AI/ML, Software Engineering, Web Development, Creative & Interactive, Research & Exploration, Tools & Open Source
- **About** — What Radixen is, with a disclaimer bar
- **Contact** — Multi-step interactive flow routing to the correct email address
- **Footer** — Nav links + GitHub org link

---

## Animations

All animations use GSAP. Load order:

1. `DOMContentLoaded` → hero elements hidden immediately
2. `initIntro()` → full-screen overlay plays, then calls `initHeroAnimations()`
3. `initHeroAnimations()` → letter-split title + staggered hero sequence
4. `initScrollAnimations()` → ScrollTrigger fade-ups on all sections
5. `initContactFlow()` → multi-step GSAP slide transitions
6. `initCursorGlow()` → desktop-only radial glow following cursor

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
