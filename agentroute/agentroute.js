/* ============================================================
   RADIXEN — agentroute/agentroute.js
   Animations for the /agentroute page
   ============================================================ */

'use strict';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   CANVAS — same constellation as homepage, smaller count
   ============================================================ */
function initCanvas() {
  const canvas = document.getElementById('ar-canvas');
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
      ctx.fillStyle = `rgba(65,214,195,${near ? Math.min(p.a * 2, 0.85) : p.a})`;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j], dx = p.x - q.x, dy = p.y - q.y, dist = Math.hypot(dx, dy);
        if (dist < MAX_DIST) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(122,167,255,${(1 - dist / MAX_DIST) * 0.18})`; ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
    }
    rafId = requestAnimationFrame(draw);
  }

  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (!running) { running = true; draw(); } }
    else { running = false; cancelAnimationFrame(rafId); }
  }, { threshold: 0 });
  obs.observe(document.getElementById('ar-hero'));

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
  gsap.set('#nav-logo', { opacity: 0 });
  gsap.set('#ar-badge-row',      { opacity: 0, y: 14 });
  gsap.set('#ar-hero-title',     { opacity: 0, y: 40 });
  gsap.set('#ar-hero-tagline',   { opacity: 0, y: 24 });
  gsap.set('#ar-hero-sub',       { opacity: 0, y: 18 });
  gsap.set('#ar-hero-cta',       { opacity: 0, y: 16 });
  gsap.set('#ar-install-quick',  { opacity: 0, y: 14 });
  gsap.set('.ar-windows-link',   { opacity: 0, y: 8 });
  gsap.set('#scroll-indicator',  { opacity: 0 });

  const tl = gsap.timeline({ delay: 0.1 });
  tl
    .to('#nav-logo',          { opacity: 1, duration: 0.5, ease: 'power2.out' })
    .to('#ar-badge-row',      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.2')
    .to('#ar-hero-title',     { opacity: 1, y: 0, duration: 0.75, ease: 'expo.out' },   '-=0.25')
    .to('#ar-hero-tagline',   { opacity: 1, y: 0, duration: 0.6,  ease: 'power3.out' }, '-=0.35')
    .to('#ar-hero-sub',       { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.3')
    .to('#ar-hero-cta',       { opacity: 1, y: 0, duration: 0.5,  ease: 'power3.out' }, '-=0.25')
    .to('#ar-install-quick',  { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.2')
    .to('.ar-windows-link',   { opacity: 1, y: 0, duration: 0.4,  ease: 'power2.out' }, '-=0.15')
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
  fadeUp('.ar-problem-text .ar-prose', { from: { opacity: 0, y: 18 }, to: { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, start: 'top 85%', stagger: 0.1 });

  /* Lock-in card reveal */
  ScrollTrigger.create({
    trigger: '.ar-lockin-card',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      document.querySelectorAll('.ar-lockin-blocked').forEach(el => el.classList.add('visible'));
    },
  });
  gsap.fromTo('.ar-lockin-card',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.ar-lockin-card', start: 'top 82%' } }
  );

  /* Architecture diagram reveal */
  ScrollTrigger.create({
    trigger: '.ar-arch-diagram',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      document.querySelectorAll('.ar-arch-node, .ar-arch-arrow').forEach(el => el.classList.add('visible'));
    },
  });

  /* Dashboard preview + sequence */
  ScrollTrigger.create({
    trigger: '#ar-tui-mock',
    start: 'top 75%',
    once: true,
    onEnter: () => initTuiMockSequence(),
  });
  gsap.fromTo('#ar-tui-mock',
    { opacity: 0, y: 35, scale: 0.98 },
    { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '#ar-tui-mock', start: 'top 85%' } }
  );

  /* Principle cards */
  gsap.utils.toArray('.ar-principle-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.07, scrollTrigger: { trigger: card, start: 'top 88%' } }
    );
  });

  /* Install cards */
  gsap.utils.toArray('.ar-install-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 45, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power3.out', delay: i * 0.1, scrollTrigger: { trigger: card, start: 'top 88%' } }
    );
  });
  fadeUp('.ar-install-litellm-note', { from: { opacity: 0, y: 16 }, start: 'top 88%' });

  /* Command rows */
  gsap.utils.toArray('.ar-cmd-row').forEach((row, i) => {
    gsap.fromTo(row,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out', delay: i * 0.06, scrollTrigger: { trigger: '.ar-cmd-list', start: 'top 86%' } }
    );
  });
  fadeUp('.ar-cmd-db-note', { from: { opacity: 0, y: 16 }, start: 'top 86%' });

  /* Setup steps */
  gsap.utils.toArray('.ar-setup-step').forEach((step, i) => {
    gsap.fromTo(step,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', delay: i * 0.08, scrollTrigger: { trigger: step, start: 'top 88%' } }
    );
  });

  /* CTA */
  gsap.fromTo('.ar-cta-inner',
    { opacity: 0, y: 40, scale: 0.98 },
    { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: '.ar-cta-inner', start: 'top 84%' } }
  );
}

/* ============================================================
   DASHBOARD PREVIEW SEQUENCE
   Recreates the real AgentRoute TUI Dashboard's gateway up/down
   flow (see internal/tui/dashboard.go), animated for a live demo.
   ============================================================ */
function initTuiMockSequence() {
  const root = document.getElementById('ar-tui-mock');
  if (!root) return;

  const pill        = root.querySelector('#tui-pill');
  const gatewayLine = root.querySelector('#tui-gateway-line');
  const gatewayBtn  = root.querySelector('#tui-gateway-btn');
  const claudeLine  = root.querySelector('#tui-claude-line');
  const toast       = root.querySelector('#tui-toast');
  const spark       = root.querySelector('#tui-spark');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Build sparkline bars */
  const BAR_COUNT = 24;
  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement('span');
    spark.appendChild(bar);
  }
  const bars = spark.querySelectorAll('span');

  function randomizeBars() {
    bars.forEach(bar => { bar.style.height = (6 + Math.random() * 90) + '%'; });
  }

  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2200);
  }

  if (reduced) {
    pill.dataset.state = 'up';
    pill.textContent = 'gateway: up';
    gatewayLine.textContent = 'up on 127.0.0.1:4505  (sidecar :4510, profile "default")';
    gatewayBtn.textContent = '[d] stop';
    claudeLine.innerHTML = 'claude-code:&nbsp;&nbsp;<span class="tui-mock-accent">linked &rarr; http://127.0.0.1:4505</span>';
    randomizeBars();
    return;
  }

  setTimeout(() => {
    pill.dataset.state = 'pending';
    pill.textContent = 'gateway: starting...';
    gatewayLine.textContent = 'down  (starting...)';
  }, 700);

  setTimeout(() => {
    pill.dataset.state = 'up';
    pill.textContent = 'gateway: up';
    gatewayLine.textContent = 'up on 127.0.0.1:4505  (sidecar :4510, profile "default")';
    gatewayBtn.textContent = '[d] stop';
    claudeLine.innerHTML = 'claude-code:&nbsp;&nbsp;<span class="tui-mock-accent">linked &rarr; http://127.0.0.1:4505</span>';
    showToast('gateway up');
  }, 1900);

  let tick = 0;
  const interval = setInterval(() => {
    randomizeBars();
    tick++;
    if (tick === 6) showToast('model: anthropic/claude-sonnet-4 → openrouter');
  }, 900);

  /* Stop animating if the user scrolls far away, to save cycles */
  ScrollTrigger.create({
    trigger: root,
    start: 'top bottom',
    end: 'bottom top',
    onLeave: () => clearInterval(interval),
    onLeaveBack: () => clearInterval(interval),
  });
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
  const heroBtn = document.querySelector('.ar-copy-cmd');
  if (heroBtn) {
    heroBtn.addEventListener('click', async () => {
      const text = heroBtn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        heroBtn.style.color = '#80DF96';
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
  glow.style.cssText = 'pointer-events:none;position:fixed;top:0;left:0;width:320px;height:320px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(65,214,195,0.05) 0%,transparent 70%);z-index:9999;transition:opacity 0.45s ease;opacity:0;';
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
