/* ============================================================
   RADIXEN — script.js
   Animations powered by GSAP + ScrollTrigger
   ============================================================ */

'use strict';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   1. CANVAS — CONSTELLATION PARTICLE NETWORK
   ============================================================ */

function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const COUNT = window.innerWidth < 600 ? 48 : 88;
  const MAX_DIST = 155;
  const SPEED = 0.28;

  let W, H, particles = [];
  let running = true;
  let rafId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r:  Math.random() * 1.4 + 0.7,
      a:  Math.random() * 0.35 + 0.15,
    };
  }

  function init() {
    particles = Array.from({ length: COUNT }, createParticle);
  }

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Update position
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(89,187,215,${p.a})`;
      ctx.fill();

      // Draw connections to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(40,136,194,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(draw);
  }

  // Pause when hero leaves the viewport
  const heroSection = document.getElementById('hero');
  const obs = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!running) { running = true; draw(); }
      } else {
        running = false;
        cancelAnimationFrame(rafId);
      }
    },
    { threshold: 0 }
  );
  obs.observe(heroSection);

  resize();
  init();
  draw();

  window.addEventListener('resize', () => {
    resize();
    init();
  });
}

/* ============================================================
   2. NAVBAR SCROLL EFFECT
   ============================================================ */

function initNavbar() {
  const navbar = document.getElementById('navbar');

  ScrollTrigger.create({
    start: 'top -60px',
    onEnter:     () => navbar.classList.add('scrolled'),
    onLeaveBack: () => navbar.classList.remove('scrolled'),
  });

  // Fade out scroll indicator once user starts scrolling
  const scrollIndicator = document.getElementById('scroll-indicator');
  if (scrollIndicator) {
    ScrollTrigger.create({
      start: 'top -40px',
      onEnter:     () => gsap.to(scrollIndicator, { opacity: 0, y: 10, duration: 0.4, ease: 'power2.in' }),
      onLeaveBack: () => gsap.to(scrollIndicator, { opacity: 1, y: 0,  duration: 0.4, ease: 'power2.out' }),
    });
  }
}

/* ============================================================
   MOBILE NAV — hamburger toggle
   ============================================================ */

function initMobileNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const navbar    = document.getElementById('navbar');
  if (!hamburger) return;

  hamburger.addEventListener('click', () => {
    const open = navbar.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close on nav link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   3. INTRO OVERLAY — plays once, then hero sequence follows
   ============================================================ */

function initIntro(onComplete) {
  const overlay    = document.getElementById('intro-overlay');
  const logoWrap   = document.getElementById('intro-logo-wrap');
  const bar        = document.getElementById('intro-bar');

  // Prevent scroll during intro
  document.body.style.overflow = 'hidden';

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.style.overflow = '';
      onComplete();
    },
  });

  // 1 — Logo/wordmark snap in
  tl.fromTo(logoWrap,
    { opacity: 0, scale: 0.82, y: 16 },
    { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'expo.out' }
  )
  // 2 — Progress bar sweeps across
  .to(bar,
    { width: '100%', duration: 0.9, ease: 'power2.inOut' },
    '+=0.15'
  )
  // 3 — Brief hold
  .to({}, { duration: 0.12 })
  // 4 — Logo/wordmark scale up and fade
  .to(logoWrap,
    { opacity: 0, scale: 1.12, duration: 0.45, ease: 'power3.in' },
    '-=0.05'
  )
  // 5 — Overlay itself splits/slides out upward
  .to(overlay,
    { yPercent: -100, duration: 0.6, ease: 'expo.inOut' },
    '-=0.15'
  );
}

/* ============================================================
   4. HERO ANIMATIONS (page-load sequence)
   ============================================================ */

function initHeroAnimations() {
  const titleEl = document.getElementById('hero-title');
  if (!titleEl) return;

  // ---- Split RADIXEN into wrapped letter spans ----
  const text = titleEl.textContent.trim();
  titleEl.innerHTML = '';
  [...text].forEach(char => {
    const wrap  = document.createElement('span');
    const inner = document.createElement('span');
    wrap.className  = 'letter-wrap';
    inner.className = 'letter';
    inner.textContent = char;
    wrap.appendChild(inner);
    titleEl.appendChild(wrap);
  });

  // ---- Set initial states ----
  gsap.set('#hero-title',      { opacity: 1 }); // container visible; letters hidden by y-transform
  gsap.set('#hero-logo',       { scale: 0.75, y: 10 });
  gsap.set('#hero-eyebrow',    { y: 12 });
  gsap.set('.letter',          { y: '115%' });
  gsap.set('#hero-subtitle',   { y: 22 });
  gsap.set('#hero-cta',        { y: 18 });

  // ---- Timeline ----
  const tl = gsap.timeline({ delay: 0.15 });

  tl.to('#hero-logo', {
      opacity: 1, scale: 1, y: 0,
      duration: 0.9, ease: 'expo.out',
    })
    .to('#nav-logo', {
      opacity: 1,
      duration: 0.5, ease: 'power2.out',
    }, '-=0.55')
    .to('#hero-eyebrow', {
      opacity: 1, y: 0,
      duration: 0.55, ease: 'power3.out',
    }, '-=0.3')
    .to('.letter', {
      y: '0%',
      duration: 0.72,
      stagger: { amount: 0.42, ease: 'power1.inOut' },
      ease: 'expo.out',
    }, '-=0.2')
    .to('#hero-subtitle', {
      opacity: 1, y: 0,
      duration: 0.65, ease: 'power3.out',
    }, '-=0.3')
    .to('#hero-cta', {
      opacity: 1, y: 0,
      duration: 0.55, ease: 'power3.out',
    }, '-=0.35')
    .to('#scroll-indicator', {
      opacity: 1,
      duration: 0.7, ease: 'power2.out',
    }, '-=0.2');
}

/* ============================================================
   5. SCROLL-TRIGGERED ANIMATIONS
   ============================================================ */

function initScrollAnimations() {

  // Helper — simple fade-up with a ScrollTrigger
  function fadeUp(targets, options = {}) {
    const defaults = {
      from:  { opacity: 0, y: 30 },
      to:    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      start: 'top 84%',
    };
    const from  = { ...defaults.from,  ...(options.from  || {}) };
    const to    = { ...defaults.to,    ...(options.to    || {}) };
    const start = options.start || defaults.start;

    if (typeof targets === 'string') {
      gsap.utils.toArray(targets).forEach((el, i) => {
        gsap.fromTo(el, from, {
          ...to,
          delay: (options.stagger || 0) * i,
          scrollTrigger: { trigger: el, start },
        });
      });
    } else {
      gsap.fromTo(targets, from, {
        ...to,
        scrollTrigger: { trigger: targets, start },
      });
    }
  }

  // Section labels, titles, subtitles
  fadeUp('.section-label',    { from: { opacity: 0, y: 16 }, to: { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, start: 'top 88%' });
  fadeUp('.section-title',    { from: { opacity: 0, y: 36 }, to: { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, start: 'top 84%' });
  fadeUp('.section-subtitle', { from: { opacity: 0, y: 24 }, to: { opacity: 1, y: 0, duration: 0.7,  ease: 'power2.out' }, start: 'top 84%' });

  // Work cards — staggered per card
  gsap.utils.toArray('.work-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 45 },
      {
        opacity: 1, y: 0,
        duration: 0.7, ease: 'power3.out',
        delay: i * 0.08,
        scrollTrigger: { trigger: card, start: 'top 88%' },
      }
    );
  });

  // About text paragraphs
  gsap.utils.toArray('.about-p').forEach((p, i) => {
    gsap.fromTo(p,
      { opacity: 0, y: 22 },
      {
        opacity: 1, y: 0,
        duration: 0.65, ease: 'power2.out',
        delay: i * 0.1,
        scrollTrigger: { trigger: p, start: 'top 85%' },
      }
    );
  });

  // Disclaimer
  gsap.fromTo('.disclaimer-bar',
    { opacity: 0, y: 20 },
    {
      opacity: 1, y: 0,
      duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: '.disclaimer-bar', start: 'top 87%' },
    }
  );

  // Contact flow wrapper
  gsap.fromTo('.contact-flow',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0,
      duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-flow', start: 'top 85%' },
    }
  );
}

/* ============================================================
   5. CONTACT FLOW — MULTI-STEP
   ============================================================ */

function initContactFlow() {
  let currentStep = 'step-0';
  let isAnimating = false;

  // On load, make step-0 visible immediately (no animation needed for it)
  gsap.set('#step-0', { opacity: 1 });

  function showStep(targetId, direction = 'forward') {
    if (isAnimating || targetId === currentStep) return;
    isAnimating = true;

    const current = document.getElementById(currentStep);
    const target  = document.getElementById(targetId);
    const xOut = direction === 'forward' ? -36 : 36;
    const xIn  = direction === 'forward' ?  36 : -36;

    gsap.to(current, {
      opacity: 0,
      x: xOut,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: () => {
        current.classList.remove('active');
        gsap.set(current, { x: 0, opacity: 0 });

        target.classList.add('active');
        gsap.fromTo(target,
          { opacity: 0, x: xIn },
          {
            opacity: 1, x: 0,
            duration: 0.38, ease: 'power3.out',
            onComplete: () => { isAnimating = false; },
          }
        );
        currentStep = targetId;
      },
    });
  }

  /* ---- Event listeners ---- */

  document.getElementById('flow-start-btn').addEventListener('click', () => {
    showStep('step-1', 'forward');
  });

  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.choice;

      if (choice === 'urgent') {
        showStep('step-2b', 'forward');
        return;
      }

      // Customise the result UI before showing it
      const icon    = document.getElementById('result-icon-a');
      const heading = document.getElementById('result-heading-a');
      const sub     = document.getElementById('result-sub-a');

      if (choice === 'research') {
        icon.textContent    = '🔬';
        heading.textContent = "Let's think together.";
        sub.textContent     = "Send over what you're working on. Proposals, ideas, half-formed questions — all fine.";
      } else {
        icon.textContent    = '✉️';
        heading.textContent = "That's the one.";
        sub.textContent     = "Send whatever you've got. We'll get back to you.";
      }

      showStep('step-2a', 'forward');
    });
  });

  document.getElementById('back-to-0')   .addEventListener('click', () => showStep('step-0',  'backward'));
  document.getElementById('back-to-1-a') .addEventListener('click', () => showStep('step-1',  'backward'));
  document.getElementById('back-to-1-b') .addEventListener('click', () => showStep('step-1',  'backward'));

  /* ---- Copy-to-clipboard ---- */
  function setupCopy(btnId, email) {
    document.getElementById(btnId).addEventListener('click', async () => {
      const btn = document.getElementById(btnId);
      try {
        await navigator.clipboard.writeText(email);
        btn.textContent = 'copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'copy';
          btn.classList.remove('copied');
        }, 2200);
      } catch (_) {
        // Clipboard API unavailable — silently ignore; user can copy the text manually
        btn.textContent = 'unavailable';
        setTimeout(() => { btn.textContent = 'copy'; }, 2200);
      }
    });
  }

  setupCopy('copy-a', 'contact@radixen.com');
  setupCopy('copy-b', 'admin@radixen.com');
}

/* ============================================================
   6. SUBTLE CURSOR GLOW  (desktop only, respects reduced-motion)
   ============================================================ */

function initCursorGlow() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return; // Touch device

  const glow = document.createElement('div');
  glow.style.cssText = [
    'pointer-events:none',
    'position:fixed',
    'top:0', 'left:0',
    'width:300px', 'height:300px',
    'transform:translate(-50%,-50%)',
    'border-radius:50%',
    'background:radial-gradient(circle, rgba(89,187,215,0.055) 0%, transparent 70%)',
    'z-index:9999',
    'transition:opacity 0.4s ease',
    'opacity:0',
  ].join(';');
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.opacity = '1';
    gsap.to(glow, { x: e.clientX, y: e.clientY, duration: 0.55, ease: 'power2.out', overwrite: true });
  });

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
}

/* ============================================================
   INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Hide hero elements immediately so they're invisible during the intro overlay
  gsap.set(['#hero-logo', '#nav-logo', '#hero-eyebrow', '#hero-title',
            '#hero-subtitle', '#hero-cta', '#scroll-indicator'], { opacity: 0 });

  initCanvas();
  initNavbar();
  initMobileNav();
  initScrollAnimations();
  initContactFlow();
  initCursorGlow();

  // Run intro first, then kick off hero animations
  initIntro(() => {
    initHeroAnimations();
  });
});
