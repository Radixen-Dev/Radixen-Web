/* ============================================================
   RADIXEN — handoff/handoff.js
   Animations for the /handoff page
   ============================================================ */

'use strict';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   CANVAS — same constellation as homepage, smaller count
   ============================================================ */
function initCanvas() {
  const canvas = document.getElementById('hf-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const isMobile = window.innerWidth < 600;
  const COUNT     = isMobile ? 40 : 72;
  const MAX_DIST  = 150;
  const BASE_SPD  = 0.28;
  const MOUSE_R   = 120;
  const MOUSE_F   = 0.012;
  const MAX_SPD   = BASE_SPD * 3.2;

  let W, H, particles = [], running = true, rafId;
  let mouseX = -9999, mouseY = -9999;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function make() {
    const a = Math.random() * Math.PI * 2;
    const s = BASE_SPD * (0.5 + Math.random());
    return { x: Math.random() * W, y: Math.random() * H, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: Math.random() * 1.4 + 0.5, a: Math.random() * 0.3 + 0.1 };
  }

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const mdx = mouseX - p.x, mdy = mouseY - p.y;
      const md  = Math.hypot(mdx, mdy);
      if (md < MOUSE_R && md > 1) {
        const f = (1 - md / MOUSE_R) * MOUSE_F;
        p.vx += (mdx / md) * f; p.vy += (mdy / md) * f;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > MAX_SPD) { p.vx = (p.vx / sp) * MAX_SPD; p.vy = (p.vy / sp) * MAX_SPD; }
      } else {
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > BASE_SPD * 1.2) { p.vx *= 0.994; p.vy *= 0.994; }
      }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
      if (p.x > W) { p.x = W; p.vx = -Math.abs(p.vx); }
      if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
      if (p.y > H) { p.y = H; p.vy = -Math.abs(p.vy); }
      const near = md < MOUSE_R * 0.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, near ? p.r * 1.5 : p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(89,187,215,${near ? Math.min(p.a * 2, 0.85) : p.a})`;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j], dx = p.x - q.x, dy = p.y - q.y, dist = Math.hypot(dx, dy);
        if (dist < MAX_DIST) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(40,136,194,${(1 - dist / MAX_DIST) * 0.18})`; ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
    }
    rafId = requestAnimationFrame(draw);
  }

  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (!running) { running = true; draw(); } }
    else { running = false; cancelAnimationFrame(rafId); }
  }, { threshold: 0 });
  obs.observe(document.getElementById('hf-hero'));

  resize(); particles = Array.from({ length: COUNT }, make); draw();
  window.addEventListener('resize', () => { resize(); particles = Array.from({ length: COUNT }, make); }, { passive: true });
}

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  ScrollTrigger.create({
    start: 'top -60px',
    onEnter:     () => navbar.classList.add('scrolled'),
    onLeaveBack: () => navbar.classList.remove('scrolled'),
  });

  const si = document.getElementById('scroll-indicator');
  if (si) {
    ScrollTrigger.create({
      start: 'top -40px',
      onEnter:     () => gsap.to(si, { opacity: 0, y: 10, duration: 0.4, ease: 'power2.in' }),
      onLeaveBack: () => gsap.to(si, { opacity: 1, y: 0,  duration: 0.4, ease: 'power2.out' }),
    });
  }
}

/* ============================================================
   MOBILE NAV
   ============================================================ */
function initMobileNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const navbar    = document.getElementById('navbar');
  if (!hamburger) return;
  hamburger.addEventListener('click', () => {
    const open = navbar.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   HERO ENTRANCE
   ============================================================ */
function initHeroAnimations() {
  /* nav logo */
  gsap.set('#nav-logo', { opacity: 0 });
  gsap.set('#hf-badge-row',      { opacity: 0, y: 14 });
  gsap.set('#hf-hero-title',     { opacity: 0, y: 40 });
  gsap.set('#hf-hero-tagline',   { opacity: 0, y: 24 });
  gsap.set('#hf-hero-sub',       { opacity: 0, y: 18 });
  gsap.set('#hf-hero-cta',       { opacity: 0, y: 16 });
  gsap.set('#hf-install-quick',  { opacity: 0, y: 14 });
  gsap.set('#scroll-indicator',  { opacity: 0 });

  const tl = gsap.timeline({ delay: 0.1 });
  tl
    .to('#nav-logo',          { opacity: 1, duration: 0.5, ease: 'power2.out' })
    .to('#hf-badge-row',      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.2')
    .to('#hf-hero-title',     { opacity: 1, y: 0, duration: 0.75, ease: 'expo.out' },   '-=0.25')
    .to('#hf-hero-tagline',   { opacity: 1, y: 0, duration: 0.6,  ease: 'power3.out' }, '-=0.35')
    .to('#hf-hero-sub',       { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.3')
    .to('#hf-hero-cta',       { opacity: 1, y: 0, duration: 0.5,  ease: 'power3.out' }, '-=0.25')
    .to('#hf-install-quick',  { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.2')
    .to('#scroll-indicator',  { opacity: 1, duration: 0.7, ease: 'power2.out' },         '-=0.2');
}

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */
function initScrollAnimations() {
  function fadeUp(sel, opts = {}) {
    const from  = { opacity: 0, y: 30, ...(opts.from || {}) };
    const to    = { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', ...(opts.to || {}) };
    const start = opts.start || 'top 84%';
    gsap.utils.toArray(sel).forEach((el, i) => {
      gsap.fromTo(el, from, { ...to, delay: (opts.stagger || 0) * i, scrollTrigger: { trigger: el, start } });
    });
  }

  fadeUp('.section-label',    { from: { opacity: 0, y: 12 }, to: { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, start: 'top 88%' });
  fadeUp('.section-title',    { from: { opacity: 0, y: 32 }, to: { opacity: 1, y: 0, duration: 0.72, ease: 'power3.out' }, start: 'top 84%' });
  fadeUp('.section-subtitle', { from: { opacity: 0, y: 20 }, start: 'top 84%' });

  /* Problem text */
  fadeUp('.hf-problem-text .hf-prose', { from: { opacity: 0, y: 18 }, to: { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, start: 'top 85%', stagger: 0.1 });

  /* Context bar animation */
  ScrollTrigger.create({
    trigger: '.hf-context-bar-wrap',
    start: 'top 78%',
    once: true,
    onEnter: () => {
      /* animate items in */
      document.querySelectorAll('.hf-ctx-item').forEach(el => el.classList.add('visible'));
      /* animate bar fill to 92% then trigger warning */
      gsap.to('#hf-bar-fill', {
        width: '92%',
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate: function () {
          const pct = Math.round(parseFloat(document.getElementById('hf-bar-fill').style.width));
          const pctEl = document.getElementById('hf-bar-pct');
          if (pctEl) pctEl.textContent = pct + '%';
          if (pct >= 80) {
            document.getElementById('hf-bar-fill').classList.add('danger');
            const pctEl2 = document.getElementById('hf-bar-pct');
            if (pctEl2) pctEl2.classList.add('danger');
          }
        },
        onComplete: () => {
          const w = document.getElementById('hf-ctx-warning');
          if (w) w.classList.add('visible');
        },
      });
    },
  });

  /* Solution flow */
  gsap.utils.toArray('.hf-flow-session').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', delay: i * 0.15, scrollTrigger: { trigger: '.hf-flow-diagram', start: 'top 82%' } }
    );
  });
  gsap.fromTo('.hf-flow-arrow',
    { opacity: 0, scale: 0.85 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.hf-flow-diagram', start: 'top 82%' } }
  );

  /* Principle cards */
  gsap.utils.toArray('.hf-principle-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.07, scrollTrigger: { trigger: card, start: 'top 88%' } }
    );
  });

  /* Install cards */
  gsap.utils.toArray('.hf-install-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 45, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power3.out', delay: i * 0.1, scrollTrigger: { trigger: card, start: 'top 88%' } }
    );
  });

  /* Command rows */
  gsap.utils.toArray('.hf-cmd-row').forEach((row, i) => {
    gsap.fromTo(row,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out', delay: i * 0.07, scrollTrigger: { trigger: '.hf-cmd-list', start: 'top 86%' } }
    );
  });
  fadeUp('.hf-cmd-db-note', { from: { opacity: 0, y: 16 }, start: 'top 86%' });

  /* Agent cards */
  gsap.utils.toArray('.hf-agent-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.1, scrollTrigger: { trigger: card, start: 'top 88%' } }
    );
  });
  fadeUp('.hf-agents-note', { from: { opacity: 0, y: 14 }, start: 'top 88%' });

  /* CTA */
  gsap.fromTo('.hf-cta-inner',
    { opacity: 0, y: 40, scale: 0.98 },
    { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: '.hf-cta-inner', start: 'top 84%' } }
  );
}

/* ============================================================
   COPY BUTTONS
   ============================================================ */
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        const span = btn.querySelector('span');
        if (span) { span.textContent = 'copied!'; }
        btn.classList.add('copied');
        setTimeout(() => {
          if (span) span.textContent = 'copy';
          btn.classList.remove('copied');
        }, 2200);
      } catch (_) {
        const span = btn.querySelector('span');
        if (span) { span.textContent = 'unavailable'; setTimeout(() => { span.textContent = 'copy'; }, 2000); }
      }
    });
  });

  /* Hero quick-copy button (no span) */
  const heroBtn = document.querySelector('.hf-copy-cmd');
  if (heroBtn) {
    heroBtn.addEventListener('click', async () => {
      const text = heroBtn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        heroBtn.style.color = '#98c379';
        setTimeout(() => { heroBtn.style.color = ''; }, 2200);
      } catch (_) {}
    });
  }
}

/* ============================================================
   CURSOR GLOW
   ============================================================ */
function initCursorGlow() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;
  const glow = document.createElement('div');
  glow.style.cssText = 'pointer-events:none;position:fixed;top:0;left:0;width:320px;height:320px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(89,187,215,0.05) 0%,transparent 70%);z-index:9999;transition:opacity 0.45s ease;opacity:0;';
  document.body.appendChild(glow);
  let tx = 0, ty = 0, cx = 0, cy = 0, visible = false;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; if (!visible) { visible = true; glow.style.opacity = '1'; } }, { passive: true });
  document.addEventListener('mouseleave', () => { visible = false; glow.style.opacity = '0'; });
  (function tick() {
    cx += (tx - cx) * 0.1; cy += (ty - cy) * 0.1;
    glow.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%))`;
    requestAnimationFrame(tick);
  })();
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  /* Set initial hidden states */
  gsap.set('#nav-logo', { opacity: 0 });
  gsap.set('#scroll-indicator', { opacity: 0 });

  initCanvas();
  initNavbar();
  initMobileNav();
  initScrollAnimations();
  initCopyButtons();
  initCursorGlow();
  initHeroAnimations();
});
