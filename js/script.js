/* ============================================================
   RADIXEN — js/script.js  v2
   Animations: GSAP + ScrollTrigger
   ============================================================ */

'use strict';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   1. CANVAS — CONSTELLATION + MOUSE-REACTIVE PARTICLES
   ============================================================ */

function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const isMobile = window.innerWidth < 600;
  const COUNT    = isMobile ? 52 : 95;
  const MAX_DIST = 160;
  const BASE_SPEED = 0.3;
  const MOUSE_RADIUS = 130;
  const MOUSE_FORCE  = 0.014;
  const MAX_SPEED    = BASE_SPEED * 3.5;

  let W, H, particles = [];
  let running = true;
  let rafId;
  let mouseX = -9999, mouseY = -9999;

  /* ---- Setup -------------------------------------------- */
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = BASE_SPEED * (0.5 + Math.random());
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r:  Math.random() * 1.5 + 0.6,
      a:  Math.random() * 0.35 + 0.12,
    };
  }

  function init() {
    particles = Array.from({ length: COUNT }, createParticle);
  }

  /* ---- Mouse tracking ----------------------------------- */
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  /* ---- Draw loop ---------------------------------------- */
  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      /* Mouse attraction */
      const mdx  = mouseX - p.x;
      const mdy  = mouseY - p.y;
      const mdst = Math.hypot(mdx, mdy);

      if (mdst < MOUSE_RADIUS && mdst > 1) {
        const force = (1 - mdst / MOUSE_RADIUS) * MOUSE_FORCE;
        p.vx += (mdx / mdst) * force;
        p.vy += (mdy / mdst) * force;

        /* Clamp speed */
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > MAX_SPEED) {
          p.vx = (p.vx / spd) * MAX_SPEED;
          p.vy = (p.vy / spd) * MAX_SPEED;
        }
      } else {
        /* Gradually return to base speed */
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > BASE_SPEED * 1.2) {
          p.vx *= 0.993;
          p.vy *= 0.993;
        }
      }

      /* Move */
      p.x += p.vx;
      p.y += p.vy;

      /* Bounce off walls */
      if (p.x < 0)  { p.x = 0;  p.vx = Math.abs(p.vx); }
      if (p.x > W)  { p.x = W;  p.vx = -Math.abs(p.vx); }
      if (p.y < 0)  { p.y = 0;  p.vy = Math.abs(p.vy); }
      if (p.y > H)  { p.y = H;  p.vy = -Math.abs(p.vy); }

      /* Draw dot */
      const nearMouse = mdst < MOUSE_RADIUS * 0.5;
      const alpha = nearMouse ? Math.min(p.a * 2.2, 0.9) : p.a;
      ctx.beginPath();
      ctx.arc(p.x, p.y, nearMouse ? p.r * 1.5 : p.r, 0, Math.PI * 2);
      ctx.fillStyle = nearMouse
        ? `rgba(89,187,215,${alpha})`
        : `rgba(89,187,215,${alpha})`;
      ctx.fill();

      /* Draw connections */
      for (let j = i + 1; j < particles.length; j++) {
        const q  = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MAX_DIST) {
          const a = (1 - dist / MAX_DIST) * 0.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(40,136,194,${a})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(draw);
  }

  /* ---- Visibility observer ------------------------------ */
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

  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
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
   3. MOBILE NAV — hamburger toggle
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
   4. INTRO OVERLAY
   ============================================================ */

function initIntro(onComplete) {
  const overlay  = document.getElementById('intro-overlay');
  const logoWrap = document.getElementById('intro-logo-wrap');
  const bar      = document.getElementById('intro-bar');

  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.style.overflow = '';
      onComplete();
    },
  });

  tl
    .fromTo(logoWrap,
      { opacity: 0, scale: 0.82, y: 16 },
      { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'expo.out' }
    )
    .to(bar,
      { width: '100%', duration: 0.9, ease: 'power2.inOut' },
      '+=0.15'
    )
    .to({}, { duration: 0.1 })
    .to(logoWrap,
      { opacity: 0, scale: 1.12, duration: 0.45, ease: 'power3.in' },
      '-=0.05'
    )
    .to(overlay,
      { yPercent: -100, duration: 0.6, ease: 'expo.inOut' },
      '-=0.15'
    );
}

/* ============================================================
   5. HERO ANIMATIONS
   ============================================================ */

function initHeroAnimations() {
  const titleEl = document.getElementById('hero-title');
  if (!titleEl) return;

  /* Split RADIXEN into letter spans */
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

  /* Initial states */
  gsap.set('#hero-title',    { opacity: 1 });
  gsap.set('#hero-logo',     { scale: 0.78, y: 10 });
  gsap.set('#hero-eyebrow',  { y: 14 });
  gsap.set('.letter',        { y: '115%' });
  gsap.set('#hero-subtitle', { y: 24 });
  gsap.set('#hero-cta',      { y: 18 });

  const tl = gsap.timeline({ delay: 0.12 });

  tl
    .to('#hero-logo', {
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
   6. SCROLL-TRIGGERED ANIMATIONS
   ============================================================ */

function initScrollAnimations() {

  /* Helper */
  function fadeUp(targets, options = {}) {
    const from  = { opacity: 0, y: 30,   ...( options.from  || {} ) };
    const to    = { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', ...(options.to || {}) };
    const start = options.start || 'top 84%';

    gsap.utils.toArray(targets).forEach((el, i) => {
      gsap.fromTo(el, from, {
        ...to,
        delay: (options.stagger || 0) * i,
        scrollTrigger: { trigger: el, start },
      });
    });
  }

  /* Section labels, titles, subtitles */
  fadeUp('.section-label',    { from: { opacity: 0, y: 14 }, to: { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, start: 'top 88%' });
  fadeUp('.section-title',    { from: { opacity: 0, y: 36 }, to: { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, start: 'top 84%' });
  fadeUp('.section-subtitle', { from: { opacity: 0, y: 22 }, to: { opacity: 1, y: 0, duration: 0.7,  ease: 'power2.out' }, start: 'top 84%' });

  /* Areas / work cards — staggered */
  gsap.utils.toArray('.work-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 45 },
      {
        opacity: 1, y: 0,
        duration: 0.7, ease: 'power3.out',
        delay: i * 0.07,
        scrollTrigger: { trigger: card, start: 'top 88%' },
      }
    );
  });

  /* Projects section — info side */
  fadeUp('.project-meta',    { from: { opacity: 0, y: 16 }, to: { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, start: 'top 86%' });
  fadeUp('.project-name',    { from: { opacity: 0, y: 32 }, to: { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, start: 'top 84%' });
  fadeUp('.project-tagline', { from: { opacity: 0, y: 20 }, start: 'top 84%' });
  fadeUp('.project-desc',    { from: { opacity: 0, y: 18 }, start: 'top 84%' });
  fadeUp('.project-tags',    { from: { opacity: 0, y: 14 }, start: 'top 84%' });
  fadeUp('.project-actions', { from: { opacity: 0, y: 14 }, start: 'top 84%' });

  /* Projects section — chat demo */
  const chatEl = document.querySelector('.project-chat');
  if (chatEl) {
    gsap.fromTo('.project-chat',
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: '.project-chat', start: 'top 84%' },
      }
    );

    const chatSteps = chatEl.querySelectorAll('[data-chat-step]');
    gsap.set(chatSteps, { opacity: 0, y: 10 });

    ScrollTrigger.create({
      trigger: '.project-chat',
      start: 'top 76%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ delay: 0.5 });
        tl.to('[data-chat-step="0"]', { opacity: 1, y: 0, duration: 0.4,  ease: 'power2.out' });
        tl.to('[data-chat-step="1"]', { opacity: 1, y: 0, duration: 0.4,  ease: 'power2.out' }, '+=0.55');
        tl.to('[data-chat-step="2"]', { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '+=0.45');
        tl.to('[data-chat-step="3"]', { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '+=0.3');
        tl.to('[data-chat-step="4"]', { opacity: 1, y: 0, duration: 0.3,  ease: 'power2.out' }, '+=0.45');
        tl.to('[data-chat-step="4"]', { opacity: 0, duration: 0.2, ease: 'power2.in' },         '+=1.0');
        tl.to('[data-chat-step="5"]', { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '+=0.1');
      },
    });
  }

  /* Projects section — AgentRoute dashboard demo */
  const homeTuiMock = document.getElementById('home-tui-mock');
  if (homeTuiMock) {
    gsap.fromTo(homeTuiMock,
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: homeTuiMock, start: 'top 84%' },
      }
    );

    ScrollTrigger.create({
      trigger: homeTuiMock,
      start: 'top 76%',
      once: true,
      onEnter: () => initHomeTuiMockSequence(homeTuiMock),
    });
  }

  /* Services heading */
  fadeUp('.services-header .section-title',    { from: { opacity: 0, y: 36 }, start: 'top 84%' });
  fadeUp('.services-header .section-subtitle', { from: { opacity: 0, y: 22 }, start: 'top 84%' });

  /* Service cards */
  gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        duration: 0.72, ease: 'power3.out',
        delay: i * 0.1,
        scrollTrigger: { trigger: card, start: 'top 88%' },
      }
    );
  });

  /* Portfolio header */
  fadeUp('.portfolio-title',    { from: { opacity: 0, y: 30 }, start: 'top 88%' });
  fadeUp('.portfolio-subtitle', { from: { opacity: 0, y: 16 }, start: 'top 88%' });

  /* Portfolio cards */
  gsap.utils.toArray('.portfolio-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 55, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.8, ease: 'power3.out',
        delay: i * 0.12,
        scrollTrigger: { trigger: card, start: 'top 88%' },
      }
    );
  });

  /* Services CTA block */
  gsap.fromTo('.services-cta-block',
    { opacity: 0, y: 35 },
    {
      opacity: 1, y: 0,
      duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.services-cta-block', start: 'top 85%' },
    }
  );

  /* About paragraphs */
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

  /* Disclaimer */
  gsap.fromTo('.disclaimer-bar',
    { opacity: 0, y: 18 },
    {
      opacity: 1, y: 0,
      duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: '.disclaimer-bar', start: 'top 87%' },
    }
  );

  /* Contact flow */
  gsap.fromTo('.contact-flow',
    { opacity: 0, y: 28 },
    {
      opacity: 1, y: 0,
      duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-flow', start: 'top 85%' },
    }
  );
}

/* ============================================================
   AGENTROUTE DASHBOARD DEMO (homepage spotlight)
   Smaller copy of the sequence on /agentroute — recreates the
   real TUI Dashboard's gateway up/down flow for the front-page demo.
   ============================================================ */
function initHomeTuiMockSequence(root) {
  const pill        = root.querySelector('#home-tui-pill');
  const gatewayLine = root.querySelector('#home-tui-gateway-line');
  const gatewayBtn  = root.querySelector('#home-tui-gateway-btn');
  const claudeLine  = root.querySelector('#home-tui-claude-line');
  const toast       = root.querySelector('#home-tui-toast');
  const spark       = root.querySelector('#home-tui-spark');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const BAR_COUNT = 20;
  for (let i = 0; i < BAR_COUNT; i++) spark.appendChild(document.createElement('span'));
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

  ScrollTrigger.create({
    trigger: root,
    start: 'top bottom',
    end: 'bottom top',
    onLeave: () => clearInterval(interval),
    onLeaveBack: () => clearInterval(interval),
  });
}

/* ============================================================
   7. CONTACT FLOW — MULTI-STEP
   ============================================================ */

function initContactFlow() {
  let currentStep = 'step-0';
  let isAnimating = false;

  // Email assembled at runtime - never a plain string in source
  const _e = ['contact', String.fromCharCode(64), 'radixen', '.', 'com'].join('');

  // Populate the display span without hardcoding the address in HTML
  document.getElementById('email-a').textContent = _e;

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

  /* ---- Listeners ---------------------------------------- */

  document.getElementById('flow-start-btn').addEventListener('click', () => {
    showStep('step-1', 'forward');
  });

  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.choice;

      /* URGENT OPTION: commented out until admin@radixen.com is active
      if (choice === 'urgent') {
        showStep('step-2b', 'forward');
        return;
      }
      */

      const icon    = document.getElementById('result-icon-a');
      const heading = document.getElementById('result-heading-a');
      const sub     = document.getElementById('result-sub-a');

      if (choice === 'webdesign') {
        icon.textContent    = '🎨';
        heading.textContent = "Let's build something great.";
        sub.textContent     = "Tell us about your project - scope, ideas, timeline. We'll get back to you.";
      } else {
        /* general / research */
        icon.textContent    = '✉️';
        heading.textContent = "That's the one.";
        sub.textContent     = "Send whatever you've got. We'll get back to you.";
      }

      showStep('step-2a', 'forward');
    });
  });

  document.getElementById('back-to-0')   .addEventListener('click', () => showStep('step-0', 'backward'));
  document.getElementById('back-to-1-a') .addEventListener('click', () => showStep('step-1', 'backward'));
  // document.getElementById('back-to-1-b') .addEventListener('click', () => showStep('step-1', 'backward'));

  /* ---- Copy to clipboard -------------------------------- */
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
        btn.textContent = 'unavailable';
        setTimeout(() => { btn.textContent = 'copy'; }, 2200);
      }
    });
  }

  setupCopy('copy-a', _e);
  // setupCopy('copy-b', /* admin email - inactive */ '');
}

/* ============================================================
   8. CURSOR GLOW  (desktop, respects reduced-motion)
   ============================================================ */

function initCursorGlow() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = [
    'pointer-events:none',
    'position:fixed',
    'top:0','left:0',
    'width:340px','height:340px',
    'transform:translate(-50%,-50%)',
    'border-radius:50%',
    'background:radial-gradient(circle, rgba(89,187,215,0.05) 0%, transparent 70%)',
    'z-index:9999',
    'transition:opacity 0.45s ease',
    'opacity:0',
  ].join(';');
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.opacity = '1';
    gsap.to(glow, { x: e.clientX, y: e.clientY, duration: 0.6, ease: 'power2.out', overwrite: true });
  });

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
}

/* ============================================================
   INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* Hide hero elements before intro plays */
  gsap.set(
    ['#hero-logo', '#nav-logo', '#hero-eyebrow', '#hero-title',
     '#hero-subtitle', '#hero-cta', '#scroll-indicator'],
    { opacity: 0 }
  );

  initCanvas();
  initNavbar();
  initMobileNav();
  initScrollAnimations();
  initContactFlow();
  initCursorGlow();

  initIntro(() => {
    initHeroAnimations();
  });
});
