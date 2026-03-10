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
| Hosting | GitHub Pages |

No framework. No build toolchain. No dependencies to install.

---

## Project structure

```
radixen-web/
├── index.html          # All markup
├── style.css           # All styles
├── script.js           # All interactivity & animation
├── assets/
│   └── logo.png        # Radixen logo
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

## Sections

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
