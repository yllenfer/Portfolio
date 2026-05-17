(function () {
  'use strict';

  /* ── BOOT SEQUENCE ── */
  const bootOverlay = document.getElementById('boot-overlay');
  const bootText = document.getElementById('boot-text');
  const bootLines = [
    '[ BIOS ]  YF::TERMINAL v1.0 — System Power-On Self Test',
    '[ BIOS ]  Initializing CRT controller... OK',
    '[ BIOS ]  Memory check: 640K conventional, 1024K extended',
    '',
    '[ KERNEL] Loading terminal subsystem...',
    '[ KERNEL] Mounting /home/visitor/yf-portfolio... OK',
    '[ KERNEL] Initializing display buffer (80x24) @ 0xB8000',
    '',
    '[ NET   ] MAC: 00:1A:2B:3C:4D:5E — DHCP lease acquired',
    '[ NET   ] Connection: HOME_LAB_MESH — signal strength: 97%',
    '',
    '[ DAEMON] Starting agent orchestration service... OK',
    '[ DAEMON] Scanning home lab nodes... 4 services found',
    '',
    '[ INIT  ] Portfolios initialized. Ready.',
    '[ INIT  ] Type HELP for available commands.',
    '',
    '━━━ Welcome to YF::TERMINAL ━━━',
    '',
    '> system ready. press any key to continue...'
  ];

  let bootIdx = 0;
  let bootChar = 0;
  let bootDone = false;
  let bootInterval;

  function typeBootLine() {
    if (bootIdx >= bootLines.length) {
      clearInterval(bootInterval);
      bootDone = true;
      return;
    }
    const line = bootLines[bootIdx];
    if (bootChar < line.length) {
      bootChar++;
      bootText.textContent = bootLines.slice(0, bootIdx).join('\n') + '\n' + line.slice(0, bootChar) + '█';
    } else {
      bootText.textContent = bootLines.slice(0, bootIdx + 1).join('\n') + '\n█';
      bootIdx++;
      bootChar = 0;
    }
  }

  bootInterval = setInterval(typeBootLine, 18);

  function dismissBoot() {
    if (!bootDone) return;
    bootOverlay.classList.add('hidden');
    document.removeEventListener('keydown', dismissBoot);
    document.removeEventListener('click', dismissBoot);
    startTypewriter();
  }

  document.addEventListener('keydown', dismissBoot);
  document.addEventListener('click', dismissBoot);

  /* ── HERO TYPEWRITER ── */
  let typewriterStarted = false;

  function startTypewriter() {
    if (typewriterStarted) return;
    typewriterStarted = true;

    const lines = [
      { id: 'hero-line-1', text: '> ./init_profile.sh --user=Yllen_Fernandez', delay: 0 },
      { id: 'hero-line-2', text: '> ROLE: LIMS_Engineer || Open_Source_Knight', delay: 800 },
      { id: 'hero-line-3', text: '> STATUS: ONLINE || HOMELAB: OPERATIONAL', delay: 1600 }
    ];

    let currentLine = 0;

    function typeLine() {
      if (currentLine >= lines.length) return;
      const line = lines[currentLine];
      const el = document.getElementById(line.id);
      if (!el) { currentLine++; typeLine(); return; }

      let charIdx = 0;
      function typeChar() {
        if (charIdx < line.text.length) {
          el.textContent = line.text.slice(0, charIdx + 1);
          charIdx++;
          setTimeout(typeChar, 25 + Math.random() * 15);
        } else {
          currentLine++;
          setTimeout(typeLine, 300);
        }
      }
      setTimeout(typeChar, line.delay);
    }

    typeLine();

    // Stats count-up
    setTimeout(() => {
      document.querySelectorAll('.stat-value').forEach(el => {
        const target = parseInt(el.textContent, 10);
        animateCounter(el, target, 1200);
      });
    }, 3000);

    // Fade in scroll hint
    setTimeout(() => {
      const hint = document.querySelector('.hero-scroll-hint');
      if (hint) hint.style.opacity = '1';
    }, 4000);
  }

  /* ── COUNTER ANIMATION ── */
  function animateCounter(el, target, duration) {
    let start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  /* ── TERMINAL CLOCK ── */
  function updateClock() {
    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    const ts = document.getElementById('ts-time');
    if (ts) ts.textContent = time;
  }
  setInterval(updateClock, 1000);
  updateClock();

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll(
    '.section-shield, .term-line, .project-card, .nft-card, .skill-branch, .contact-item, .about-grid'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
  });

  /* ── NAV SCROLL EFFECT ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(12, 12, 12, 0.98)';
      nav.style.borderBottomColor = 'rgba(51, 255, 51, 0.3)';
    } else {
      nav.style.background = 'rgba(12, 12, 12, 0.95)';
      nav.style.borderBottomColor = 'rgba(51, 255, 51, 0.15)';
    }
  });

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── REBOOT ── */
  const rebootBtn = document.getElementById('reboot-btn');
  if (rebootBtn) {
    rebootBtn.addEventListener('click', (e) => {
      e.preventDefault();
      bootOverlay.classList.remove('hidden');
      bootText.textContent = '';
      bootIdx = 0;
      bootChar = 0;
      bootDone = false;
      bootInterval = setInterval(typeBootLine, 18);
      setTimeout(() => {
        bootDone = true;
        document.addEventListener('keydown', dismissBoot);
        document.addEventListener('click', dismissBoot);
      }, bootLines.length * 18 * 30);
    });
  }

  /* ── NFT GENERATIVE ART ── */
  function drawNFT1(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    let t = 0;

    function draw() {
      ctx.fillStyle = 'rgba(7,5,14,0.18)';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2, cy = h / 2;
      const layers = 8;

      for (let layer = 0; layer < layers; layer++) {
        const spokes = 6 + layer * 2;
        const radius = 30 + layer * 28;
        const alpha = 0.5 - layer * 0.05;

        ctx.beginPath();
        for (let i = 0; i <= spokes; i++) {
          const angle = (i / spokes) * Math.PI * 2 + t * 0.008 * (layer % 2 === 0 ? 1 : -1);
          const r = radius + Math.sin(t * 0.04 + layer + i) * 10;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        const hue = 40 + layer * 5;
        ctx.strokeStyle = `hsla(${hue}, 70%, ${50 + layer * 4}%, ${alpha})`;
        ctx.lineWidth = 1.3 - layer * 0.08;
        ctx.stroke();
      }

      for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2 + t * 0.01;
        const r = 60 + Math.sin(t * 0.03 + i) * 90;
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;
        const size = 1 + Math.sin(t * 0.05 + i) * 1.2;
        const alpha = 0.3 + Math.sin(t * 0.07 + i) * 0.2;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(40, 80%, 70%, ${alpha})`;
        ctx.fill();
      }

      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50);
      grd.addColorStop(0, 'rgba(51, 255, 51, 0.08)');
      grd.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, 50, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      t++;
      requestAnimationFrame(draw);
    }
    draw();
  }

  function drawNFT2(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    let t = 0;

    function draw() {
      ctx.fillStyle = 'rgba(0,5,20,0.2)';
      ctx.fillRect(0, 0, w, h);

      const lines = 16;
      for (let i = 0; i < lines; i++) {
        const y = (i / lines) * h;
        const amp = 15 + Math.sin(t * 0.02 + i) * 25;
        const freq = 0.015 + i * 0.001;

        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= w; x += 3) {
          const waveY = y + Math.sin(x * freq + t * 0.04 + i) * amp;
          ctx.lineTo(x, waveY);
        }
        const hue = 100 + i * 5;
        ctx.strokeStyle = `hsla(${hue}, 80%, 55%, 0.4)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      for (let i = 0; i < 6; i++) {
        const x = (i / 6) * w + Math.sin(t * 0.02 + i) * 15;
        const y = h / 2 + Math.cos(t * 0.03 + i) * 60;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, 15);
        grd.addColorStop(0, 'rgba(51, 255, 51, 0.5)');
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      t++;
      requestAnimationFrame(draw);
    }
    draw();
  }

  function drawNFT3(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    let t = 0;
    const cx = w / 2, cy = h / 2;

    function draw() {
      ctx.fillStyle = 'rgba(5,2,12,0.25)';
      ctx.fillRect(0, 0, w, h);

      const rings = 10;
      for (let r = 0; r < rings; r++) {
        const radius = (r + 1) * (Math.min(w, h) / (rings * 2)) + Math.sin(t * 0.03 + r) * 6;
        const alpha = 0.7 - (r / rings) * 0.5;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        const hue = 40 + r * 8;
        ctx.strokeStyle = `hsla(${hue}, 70%, 55%, ${alpha})`;
        ctx.lineWidth = 1.5 - r * 0.08;
        ctx.stroke();

        const points = 5 + r;
        for (let p = 0; p < points; p++) {
          const angle = (p / points) * Math.PI * 2 + t * 0.01 * (r % 2 ? 1 : -1);
          const dr = radius + Math.sin(t * 0.05 + p + r) * 5;
          const px = cx + Math.cos(angle) * dr;
          const py = cy + Math.sin(angle) * dr;
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(100, 80%, 60%, ${alpha * 0.7})`;
          ctx.fill();
        }
      }

      t++;
      requestAnimationFrame(draw);
    }
    draw();
  }

  function drawNFT4(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    let t = 0;
    const cols = 10, rows = 10;
    const cellW = w / cols, cellH = h / rows;

    function draw() {
      ctx.fillStyle = 'rgba(2,0,8,0.3)';
      ctx.fillRect(0, 0, w, h);

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * cellW + cellW / 2;
          const y = r * cellH + cellH / 2;
          const dist = Math.sqrt((c - cols / 2) ** 2 + (r - rows / 2) ** 2);
          const phase = t * 0.04 - dist * 0.4;
          const brightness = (Math.sin(phase) + 1) / 2;
          const hue = 100 + brightness * 60;
          const size = brightness * cellW * 0.35;

          if (size > 1) {
            ctx.beginPath();
            ctx.rect(x - size / 2, y - size / 2, size, size);
            const alpha = brightness * 0.8;
            if (brightness > 0.7) {
              ctx.fillStyle = `hsla(40, 80%, 60%, ${alpha})`;
            } else {
              ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${alpha})`;
            }
            ctx.fill();
          }
        }
      }

      for (let y = 0; y < h; y += 4) {
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(0, y, w, 1);
      }

      t++;
      requestAnimationFrame(draw);
    }
    draw();
  }

  const nftObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const canvas = entry.target;
        const id = canvas.id;
        if (id === 'nft-canvas-1') drawNFT1(canvas);
        if (id === 'nft-canvas-2') drawNFT2(canvas);
        if (id === 'nft-canvas-3') drawNFT3(canvas);
        if (id === 'nft-canvas-4') drawNFT4(canvas);
        nftObserver.unobserve(canvas);
      }
    });
  }, { threshold: 0.1 });

  ['nft-canvas-1', 'nft-canvas-2', 'nft-canvas-3', 'nft-canvas-4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) nftObserver.observe(el);
  });

  /* ── FORM HANDLER ── */
  window.handleSubmit = function (e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.textContent = 'SENDING...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '✔ MESSAGE_SENT';
      btn.style.borderColor = '#33ff33';
      btn.style.color = '#33ff33';
      e.target.reset();
      setTimeout(() => {
        btn.textContent = 'SEND_MESSAGE ▸';
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 2000);
    }, 1500);
  };

  console.log(
    '%c YF::TERMINAL v1.0 ',
    'background: #33ff33; color: #000; font-family: monospace; font-size: 12px; padding: 4px;'
  );
  console.log('%c Type REBOOT to restart the system.', 'color: #33ff33; font-family: monospace;');

})();
