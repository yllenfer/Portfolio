/**
 * main.js — Portfolio entry point
 *
 * Handles:
 *  - Three.js garden scene init
 *  - Custom cursor
 *  - Sticky nav + hamburger
 *  - Scroll-reveal (IntersectionObserver)
 *  - Staggered child reveal
 *  - Contact form (Netlify function)
 */

import { GardenScene } from './garden.js';

/* ─── Three.js Garden ─────────────────────────── */
// GardenScene reads #garden-canvas from the DOM
new GardenScene();

/* ─── Custom Cursor ───────────────────────────── */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');

let trailX = 0;
let trailY = 0;

window.addEventListener('mousemove', (e) => {
  if (cursor) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  }
  trailX = e.clientX;
  trailY = e.clientY;
});

window.addEventListener('mousedown', () => cursor && cursor.classList.add('clicking'));
window.addEventListener('mouseup',   () => cursor && cursor.classList.remove('clicking'));

// Smooth trailing cursor
(function trailLoop() {
  if (cursorTrail) {
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
  }
  requestAnimationFrame(trailLoop);
})();

/* ─── Nav: scroll shrink ──────────────────────── */
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── Nav: hamburger toggle ───────────────────── */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });
}

/* ─── Smooth anchor scroll ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── Scroll Reveal ───────────────────────────── */
// Section containers fade+rise in
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Staggered children (skill flowers, project cards)
const staggerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.reveal-stagger').forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 80);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.06 }
);

document.querySelectorAll('.skills-garden, .projects-grid').forEach(el =>
  staggerObserver.observe(el)
);

/* ─── Contact Form ────────────────────────────── */
const form      = document.getElementById('contact-form');
const successEl = document.getElementById('form-success');
const errorEl   = document.getElementById('form-error');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('fname').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();

    successEl.classList.add('hidden');
    errorEl.classList.add('hidden');

    if (!name || !email || !subject) {
      errorEl.textContent = 'Please fill in all fields.';
      errorEl.classList.remove('hidden');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEl.textContent = 'Please enter a valid email address.';
      errorEl.classList.remove('hidden');
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Sending... 🌸';
    submitBtn.disabled    = true;

    try {
      const res = await fetch('/.netlify/functions/send-email', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, subject }),
      });

      if (res.ok) {
        form.reset();
        successEl.classList.remove('hidden');
        submitBtn.textContent = 'Sent! 🌸';
      } else {
        throw new Error('server');
      }
    } catch {
      errorEl.textContent   = 'Oops! Something went wrong. Please try again.';
      errorEl.classList.remove('hidden');
      submitBtn.textContent = 'Send Message 🌷';
      submitBtn.disabled    = false;
    }
  });
}
