/* ============================================================
   قصر الأجداد — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar scroll ---------- */
  const navbar   = document.getElementById('navbar');
  const backTop  = document.getElementById('back-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Sticky style
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back-to-top button
    if (scrollY > 400) {
      backTop.classList.add('visible');
    } else {
      backTop.classList.remove('visible');
    }

    // Active nav link
    highlightNavLink();
  });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ---------- Active nav link on scroll ---------- */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function highlightNavLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle(
        'active-link',
        link.getAttribute('href') === `#${current}`
      );
    });
  }


  /* ---------- Hamburger mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });

  // Close on link click
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });


  /* ---------- CAROUSEL ---------- */
  const track      = document.getElementById('carousel-track');
  const slides     = track.querySelectorAll('.carousel-slide');
  const prevBtn    = document.getElementById('carousel-prev');
  const nextBtn    = document.getElementById('carousel-next');
  const dotsWrap   = document.getElementById('carousel-indicators');

  let current      = 0;
  let autoTimer    = null;
  const TOTAL      = slides.length;
  const AUTO_DELAY = 4000;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    dot.setAttribute('aria-label', `الشريحة ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = dotsWrap.querySelectorAll('.carousel-dot');

  function goTo(index) {
    // Wrap around
    if (index < 0) index = TOTAL - 1;
    if (index >= TOTAL) index = 0;

    current = index;
    track.style.transform = `translateX(${current * 100}%)`;

    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  function startAuto() {
    autoTimer = setInterval(next, AUTO_DELAY);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }
  startAuto();

  // Touch / swipe support
  let touchStartX = 0;
  const carouselEl = document.getElementById('carousel');

  carouselEl.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  carouselEl.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      // RTL: swipe left → next (previous in LTR thinking), swipe right → prev
      if (diff > 0) { next(); } else { prev(); }
      resetAuto();
    }
  }, { passive: true });

  // Keyboard support
  carouselEl.setAttribute('tabindex', '0');
  carouselEl.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { next(); resetAuto(); }
    if (e.key === 'ArrowRight') { prev(); resetAuto(); }
  });


  /* ---------- Scroll-reveal ---------- */
  const revealEls = document.querySelectorAll(
    '.about-grid, .about-stats, .order-card, .location-grid, .contact-card, .section-title, .section-sub'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObs.observe(el));


  /* ---------- Order cards: staggered reveal ---------- */
  const orderCards = document.querySelectorAll('.order-card');
  const orderObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 120);
        orderObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  orderCards.forEach(c => { c.classList.add('reveal'); orderObs.observe(c); });

});
