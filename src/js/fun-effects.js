// ===== 2006 NOSTALGIC WEB EFFECTS =====

// --- Glitter/Star Cursor Trail ---
function setupGlitterTrail() {
  const glitters = ['✦', '✧', '⋆', '★', '☆', '✶', '✴', '+'];
  const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff69b4', '#00ff00', '#ff6347'];
  let lastTime = 0;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTime < 40) return;
    lastTime = now;

    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.textContent = glitters[Math.floor(Math.random() * glitters.length)];
    sparkle.style.left = (e.clientX + (Math.random() - 0.5) * 20) + 'px';
    sparkle.style.top = (e.clientY + (Math.random() - 0.5) * 20) + 'px';
    sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.fontSize = (8 + Math.random() * 10) + 'px';
    document.body.appendChild(sparkle);

    sparkle.addEventListener('animationend', () => sparkle.remove());
  });
}

// --- Marquee Banner (top of page) ---
function createMarquee() {
  const existing = document.querySelector('.marquee-banner');
  if (existing) return;

  const marquee = document.createElement('div');
  marquee.className = 'marquee-banner';
  marquee.innerHTML = '<span>~*~ WeLcOmE tO mY wEbSiTe!! ~*~ bEsT vIeWeD iN 1024x768 ~*~ sIgN mY gUeStBoOk!! ~*~ YoU aRe ViSiToR #' + (Math.floor(Math.random() * 90000) + 10000) + ' ~*~ LaSt UpDaTeD: JuLy 2006 ~*~</span>';
  document.body.insertBefore(marquee, document.body.firstChild);
}

// --- Visitor Counter ---
function createVisitorCounter() {
  const existing = document.querySelector('.visitor-counter');
  if (existing) return;

  const footer = document.querySelector('.all-footer-section');
  if (!footer) return;

  const counter = document.createElement('div');
  counter.className = 'visitor-counter';
  const count = Math.floor(Math.random() * 90000) + 10000;
  counter.innerHTML = 'You are visitor #<span class="counter-box">' + count.toString().padStart(6, '0') + '</span>';
  footer.insertBefore(counter, footer.firstChild);
}

// --- Under Construction Badge ---
function createUnderConstruction() {
  const existing = document.querySelector('.under-construction');
  if (existing) return;

  const footer = document.querySelector('.all-footer-section');
  if (!footer) return;

  const badge = document.createElement('div');
  badge.className = 'under-construction';
  badge.innerHTML = '<span>🚧 This page is under construction! 🚧</span>';
  footer.appendChild(badge);
}

// --- Guestbook Link ---
function createGuestbookLink() {
  const existing = document.querySelector('.guestbook-link');
  if (existing) return;

  const footer = document.querySelector('.all-footer-section');
  if (!footer) return;

  const link = document.createElement('div');
  link.className = 'guestbook-link';
  link.innerHTML = '<a href="#" onclick="return false">📝 Sign my guestbook! 📝</a>';
  footer.appendChild(link);
}

// --- Neon HR Dividers ---
function addNeonDividers() {
  const h1 = document.querySelector('h1');
  if (h1 && !h1.nextElementSibling?.classList?.contains('neon-hr')) {
    const hr = document.createElement('hr');
    hr.className = 'neon-hr';
    h1.parentNode.insertBefore(hr, h1.nextSibling);
  }
}

// --- Random "AIM" status ---
function createAIMStatus() {
  const hero = document.querySelector('.hero-section') || document.querySelector('.about-me');
  if (!hero) return;
  const existing = document.querySelector('.aim-status');
  if (existing) return;

  const statuses = [
    '~*~ feeling creative ~*~',
    'brb... coding!',
    '♫ listening to Fall Out Boy ♫',
    'away: eating pizza 🍕',
    '~*~ follow ur dreams ~*~',
  ];

  const aim = document.createElement('div');
  aim.className = 'aim-status';
  aim.style.cssText = 'text-align:center;font-family:"Comic Neue","Comic Sans MS",cursive;color:#ffff00;font-size:14px;margin:10px auto;z-index:1;position:relative;';
  aim.innerHTML = '💬 current mood: <em style="color:#ff69b4">' + statuses[Math.floor(Math.random() * statuses.length)] + '</em>';

  const aboutMe = document.querySelector('.about-me');
  if (aboutMe) {
    aboutMe.parentNode.insertBefore(aim, aboutMe.nextSibling);
  }
}

// --- Konami Code Easter Egg ---
function setupKonamiCode() {
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        konamiIndex = 0;
        partyMode();
      }
    } else {
      konamiIndex = 0;
    }
  });
}

function partyMode() {
  // Flash the page like a crazy 2006 MySpace page
  let flashes = 0;
  const interval = setInterval(() => {
    document.body.style.filter = flashes % 2 === 0 ? 'invert(1) hue-rotate(180deg)' : '';
    flashes++;
    if (flashes > 10) {
      clearInterval(interval);
      document.body.style.filter = '';
    }
  }, 200);

  // Spawn tons of stars
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const star = document.createElement('span');
      star.className = 'sparkle';
      star.textContent = '★';
      star.style.left = Math.random() * window.innerWidth + 'px';
      star.style.top = Math.random() * window.innerHeight + 'px';
      star.style.color = ['#ff00ff', '#00ffff', '#ffff00', '#ff69b4', '#00ff00'][Math.floor(Math.random() * 5)];
      star.style.fontSize = (15 + Math.random() * 25) + 'px';
      document.body.appendChild(star);
      star.addEventListener('animationend', () => star.remove());
    }, i * 50);
  }
}

// --- Twinkling Stars Background ---
function setupTwinklingStars() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes twinkle {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }
    .bg-star {
      position: fixed;
      color: #fff;
      pointer-events: none;
      z-index: 0;
      animation: twinkle ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);

  for (let i = 0; i < 30; i++) {
    const star = document.createElement('span');
    star.className = 'bg-star';
    star.textContent = ['·', '✦', '⋆', '.'][Math.floor(Math.random() * 4)];
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.fontSize = (6 + Math.random() * 8) + 'px';
    star.style.animationDuration = (2 + Math.random() * 4) + 's';
    star.style.animationDelay = Math.random() * 3 + 's';
    document.body.appendChild(star);
  }
}

// --- Right-Click Alert (classic 2006 move) ---
function setupRightClickAlert() {
  document.addEventListener('contextmenu', (e) => {
    // Only trigger sometimes to not be too annoying
    if (Math.random() < 0.3) {
      e.preventDefault();
      alert('Hey!! No stealing my code!! 😤\n\nJust kidding 😄');
    }
  });
}

// --- Initialize Everything ---
export function initFunEffects() {
  createMarquee();
  setupGlitterTrail();
  setupTwinklingStars();
  addNeonDividers();
  createAIMStatus();
  setupKonamiCode();
  setupRightClickAlert();

  // Delay these to wait for footer to load
  setTimeout(() => {
    createVisitorCounter();
    createGuestbookLink();
    createUnderConstruction();
  }, 500);
}
