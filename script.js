'use strict';

/* ═══════════════════════════════════════════════════════════════
   گزارش عملکرد معاونت آموزش متوسطه استان خراسان جنوبی
   اسکریپت مشترک همه صفحات: تزریق هدر/فوتر، پلیر صوتی،
   انیمیشن‌های اسکرول، شمارنده، تایپ، پارالاکس، تیلت، ذرات
   ═══════════════════════════════════════════════════════════════ */

/* ─────────────── نقشه فایل‌های صوتی هر صفحه ─────────────── */
const audioMap = {
  home:         'sed/intro.wav',
  about:        'sed/about.wav',
  middle:       'sed/section1.wav',
  high:         'sed/section2.wav',
  vocational:   'sed/section3.wav',
  innovation:   'sed/section4.wav',
  achievements: 'sed/achievements.wav',
  contact:      'sed/outro.wav'
};

/* ─────────────── ساختار منوی اصلی ─────────────── */
const NAV_LINKS = [
  { id: 'home',         title: 'خانه',          href: 'index.html' },
  { id: 'about',        title: 'درباره ما',     href: 'about.html' },
  { id: 'middle',       title: 'متوسطه اول',    href: 'middle-school.html' },
  { id: 'high',         title: 'نظری',          href: 'high-school.html' },
  { id: 'vocational',   title: 'فنی و حرفه‌ای', href: 'vocational.html' },
  { id: 'innovation',   title: 'نوآوری',        href: 'innovation.html' },
  { id: 'achievements', title: 'افتخارات',      href: 'achievements.html' },
  { id: 'contact',      title: 'تماس',          href: 'contact.html' }
];

/* ═══════════════ ۱) تزریق خودکار هدر و فوتر ═══════════════ */
function injectHeaderFooter() {
  const page = document.body.dataset.page || 'home';

  const headerPh = document.getElementById('header-placeholder');
  if (headerPh) {
    const links = NAV_LINKS
      .map(l => `<a class="nav-link${l.id === page ? ' active' : ''}" href="${l.href}">${l.title}</a>`)
      .join('\n          ');

    headerPh.outerHTML = `
    <header class="navbar" id="navbar">
      <div class="nav-inner">
        <a class="brand" href="index.html">
          <span class="brand-logo"><span class="material-icons">school</span></span>
          <span class="brand-text">
            <strong>معاونت آموزش متوسطه</strong>
            <small>استان خراسان جنوبی</small>
          </span>
        </a>
        <nav class="nav-links" id="navLinks" aria-label="منوی اصلی">
          ${links}
        </nav>
        <button class="nav-toggle" id="navToggle" aria-label="باز و بسته کردن منو">
          <span class="material-icons" id="navToggleIcon">menu</span>
        </button>
      </div>
    </header>`;
  }

  const footerPh = document.getElementById('footer-placeholder');
  if (footerPh) {
    const colA = NAV_LINKS.slice(0, 4)
      .map(l => `<li><a href="${l.href}">${l.title}</a></li>`).join('');
    const colB = NAV_LINKS.slice(4)
      .map(l => `<li><a href="${l.href}">${l.title}</a></li>`).join('');

    footerPh.outerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-about">
            <div class="brand">
              <span class="brand-logo"><span class="material-icons">school</span></span>
              <span class="brand-text">
                <strong>معاونت آموزش متوسطه</strong>
                <small>استان خراسان جنوبی</small>
              </span>
            </div>
            <p>گزارش عملکرد سال تحصیلی ۱۴۰۴–۱۴۰۵؛ روایت تلاش معلمان، مدیران و دانش‌آموزان استان برای ارتقای کیفیت آموزشی، توسعه عدالت و مهارت‌آموزی.</p>
          </div>
          <div class="footer-col">
            <h4>دسترسی سریع</h4>
            <ul>${colA}</ul>
          </div>
          <div class="footer-col">
            <h4>بخش‌های گزارش</h4>
            <ul>${colB}</ul>
          </div>
          <div class="footer-col">
            <h4>اطلاعات تماس</h4>
            <ul class="footer-contact">
              <li><span class="material-icons">location_on</span><span>بیرجند، مرکز استان خراسان جنوبی</span></li>
              <li><span class="material-icons">phone</span><span>۰۵۶-۳۲۲۲۰۰۰۰</span></li>
              <li><span class="material-icons">email</span><span>info@oip-boej.ir</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container footer-bottom-inner">
          <span>© ۱۴۰۴–۱۴۰۵ معاونت آموزش متوسطه استان خراسان جنوبی</span>
          <span class="footer-motto">ارتقای کیفیت | توسعه عدالت | مهارت‌آموزی</span>
        </div>
      </div>
    </footer>`;
  }
}

/* ═══════════════ ۲) تزریق پلیر صوتی و دکمه بازگشت به بالا ═══════════════ */
function injectFloatingUI() {
  const player = document.createElement('button');
  player.className = 'audio-player';
  player.id = 'audioPlayer';
  player.setAttribute('aria-label', 'پخش صدای صفحه');
  player.title = 'پخش صدای صفحه';
  player.innerHTML = '<span class="material-icons" id="audioPlayerIcon">headset</span>';
  document.body.appendChild(player);

  const top = document.createElement('button');
  top.className = 'back-to-top';
  top.id = 'backToTop';
  top.setAttribute('aria-label', 'بازگشت به بالای صفحه');
  top.title = 'بازگشت به بالا';
  top.innerHTML = '<span class="material-icons">keyboard_arrow_up</span>';
  document.body.appendChild(top);
}

/* ═══════════════ ۳) اعلان کوتاه (Toast) ═══════════════ */
let toastEl = null;
let toastTimer = null;
function showToast(msg) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
}

/* ═══════════════ ۴) منطق پلیر صوتی ═══════════════ */
function initAudioPlayer() {
  const btn = document.getElementById('audioPlayer');
  const icon = document.getElementById('audioPlayerIcon');
  if (!btn) return;

  const audio = new Audio();
  audio.preload = 'auto';
  let loadedSrc = '';

  function stopUI() {
    btn.classList.remove('playing');
    icon.textContent = 'headset';
  }

  btn.addEventListener('click', () => {
    if (audio.paused) {
      const src = audioMap[document.body.dataset.page];
      if (!src) {
        showToast('برای این صفحه فایل صوتی تعریف نشده است.');
        return;
      }
      if (loadedSrc !== src) {
        audio.src = src;
        loadedSrc = src;
      }
      audio.play().catch(() => {
        stopUI();
        showToast(`پخش «${src}» ممکن نشد؛ مطمئن شوید فایل صوتی در مسیر صحیح قرار دارد.`);
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => {
    btn.classList.add('playing');
    icon.textContent = 'pause';
  });
  audio.addEventListener('pause', stopUI);
  audio.addEventListener('ended', stopUI);

  /* با تغییر صفحه (ترک صفحه)، پخش قطع می‌شود */
  window.addEventListener('beforeunload', () => audio.pause());
  window.addEventListener('pagehide', () => audio.pause());
}

/* ═══════════════ ۵) نوبار: اسکرول، همبرگری، بازگشت به بالا ═══════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links = document.getElementById('navLinks');
  const toggle = document.getElementById('navToggle');
  const toggleIcon = document.getElementById('navToggleIcon');
  const backToTop = document.getElementById('backToTop');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    if (backToTop) backToTop.classList.toggle('show', window.scrollY > 480);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  if (toggle && links) {
    function closeMenu() {
      links.classList.remove('open');
      toggleIcon.textContent = 'menu';
    }
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggleIcon.textContent = open ? 'close' : 'menu';
    });
    links.querySelectorAll('.nav-link').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('click', e => {
      if (links.classList.contains('open') && !links.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1160) closeMenu();
    });
  }
}

/* ═══════════════ ۶) Scroll Reveal با IntersectionObserver ═══════════════ */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
  els.forEach(el => {
    if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay + 'ms';
  });

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ═══════════════ ۷) شمارنده اعداد (اعداد فارسی) ═══════════════ */
const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
function toFa(str) {
  return String(str).replace(/\d/g, d => FA_DIGITS[+d]);
}
function formatNumber(value, decimals) {
  let str = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
  const parts = str.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
  return toFa(parts.join('.'));
}
function animateCounter(el) {
  const target = parseFloat(el.dataset.target || '0');
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const duration = parseInt(el.dataset.duration || '2000', 10);
  const suffix = el.dataset.suffix || '';
  const t0 = performance.now();

  function frame(now) {
    const p = Math.min((now - t0) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); /* easeOutCubic */
    el.textContent = formatNumber(target * eased, decimals) + suffix;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
function initCounters() {
  const els = document.querySelectorAll('.counter');
  if (!('IntersectionObserver' in window)) {
    els.forEach(animateCounter);
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        animateCounter(en.target);
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.4 });
  els.forEach(el => obs.observe(el));
}

/* ═══════════════ ۸) افکت تایپ ═══════════════ */
function initTyping() {
  document.querySelectorAll('.typing-text').forEach(el => {
    const text = (el.dataset.text || el.textContent).trim();
    if (!text) return;
    const speed = parseInt(el.dataset.speed || '65', 10);
    const startDelay = parseInt(el.dataset.delay || '400', 10);

    el.textContent = '';
    const out = document.createElement('span');
    out.className = 'typed-output';
    const cur = document.createElement('span');
    cur.className = 'type-cursor';
    el.append(out, cur);

    let i = 0;
    function type() {
      if (i < text.length) {
        out.textContent += text[i++];
        setTimeout(type, speed);
      } else {
        cur.classList.add('done');
      }
    }
    setTimeout(type, startDelay);
  });
}

/* ═══════════════ ۹) پارالاکس با حرکت موس ═══════════════ */
function initParallax() {
  const layers = document.querySelectorAll('[data-parallax]');
  if (!layers.length) return;
  if (window.matchMedia('(pointer: coarse)').matches) return; /* روی صفحه لمسی غیرفعال */

  let tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => {
    tx = (e.clientX / window.innerWidth - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  (function loop() {
    cx += (tx - cx) * 0.05; /* حرکت نرم و لاغر (lerp) */
    cy += (ty - cy) * 0.05;
    layers.forEach(l => {
      const depth = parseFloat(l.dataset.parallax) || 15;
      l.style.transform = `translate3d(${(-cx * depth).toFixed(1)}px, ${(-cy * depth).toFixed(1)}px, 0)`;
    });
    requestAnimationFrame(loop);
  })();
}

/* ═══════════════ ۱۰) هاور سه‌بعدی کارت‌ها (Tilt) ═══════════════ */
function initTilt() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll('.tilt').forEach(card => {
    const strength = parseFloat(card.dataset.tilt) || 7;
    card.addEventListener('mousemove', e => {
      /* اگر کارت هنوز با reveal ظاهر نشده، دست نمی‌زنیم */
      if (/\breveal/.test(card.className) && !card.classList.contains('visible')) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `perspective(900px) rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(px * strength).toFixed(2)}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ═══════════════ ۱۱) ذرات شناور (CSS + JS) ═══════════════ */
function initParticles() {
  function spawn(container, colors, count, starRatio) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle' + (Math.random() < starRatio ? ' star' : '');
      p.style.left = (Math.random() * 100).toFixed(2) + '%';
      p.style.setProperty('--s', (Math.random() * 5 + 3).toFixed(1) + 'px');
      p.style.setProperty('--c', colors[Math.floor(Math.random() * colors.length)]);
      p.style.setProperty('--dur', (Math.random() * 12 + 9).toFixed(1) + 's');
      p.style.setProperty('--delay', (-Math.random() * 20).toFixed(1) + 's');
      p.style.setProperty('--drift', (Math.random() * 140 - 70).toFixed(0) + 'px');
      p.style.setProperty('--o', (Math.random() * 0.45 + 0.35).toFixed(2));
      frag.appendChild(p);
    }
    container.appendChild(frag);
  }

  /* ذرات فیروزه‌ای/طلایی هیروها */
  document.querySelectorAll('.particles').forEach(c =>
    spawn(c, ['#00f0ff', '#ffd700', '#ffffff'], 30, 0.22));

  /* ذرات طلایی صفحه افتخارات */
  document.querySelectorAll('.gold-particles').forEach(c =>
    spawn(c, ['#ffd700', '#ffe97a', '#ffb300'], 46, 0.5));
}

/* ═══════════════ ۱۲) جایگزین تصاویر گمشده ═══════════════ */
function initImageFallback() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      if (img.parentElement) img.parentElement.classList.add('img-missing');
    }, { once: true });
  });
}

/* ═══════════════ راه‌اندازی ═══════════════ */
document.addEventListener('DOMContentLoaded', () => {
  injectHeaderFooter();
  injectFloatingUI();
  initNavbar();
  initAudioPlayer();
  initReveal();
  initCounters();
  initTyping();
  initParallax();
  initTilt();
  initParticles();
  initImageFallback();
});