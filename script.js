'use strict';

/* ═══════════════════════════════════════════════════════════════
   گزارش عملکرد معاونت آموزش متوسطه استان خراسان جنوبی
   اسکریپت مشترک همه صفحات | پلیر صوتی خودکار + پنل بازشو
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
              <li><span class="material-icons">location_on</span><span>بیرجند، معلم، بین معلم ۳۳ و طهماسبی</span></li>
              <li><span class="material-icons">phone</span><span>056-32424733</span></li>
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

/* ═══════════════ ۲) تزریق پلیر صوتی (با پنل بازشو) و دکمه بازگشت به بالا ═══════════════ */
function injectFloatingUI() {
  const player = document.createElement('div');
  player.className = 'audio-player';
  player.id = 'audioPlayer';
  player.innerHTML = `
    <div class="audio-player-panel" id="audioPlayerPanel" role="dialog" aria-label="کنترل پخش صدا">
      <div class="audio-player-header">
        <span class="audio-player-title">
          <span class="material-icons">graphic_eq</span>
          صدای این بخش
        </span>
        <button class="audio-player-close" id="audioPlayerClose" aria-label="بستن پنل">
          <span class="material-icons">close</span>
        </button>
      </div>

      <div class="audio-player-main">
        <button class="audio-player-play" id="audioPlayerPlay" aria-label="پخش / توقف">
          <span class="material-icons" id="audioPlayerPlayIcon">play_arrow</span>
        </button>
        <div class="audio-player-progress-wrap">
          <div class="audio-player-progress" id="audioPlayerProgress">
            <div class="audio-player-progress-bar" id="audioPlayerProgressBar"></div>
          </div>
          <div class="audio-player-time">
            <span id="audioPlayerCurrent">۰:۰۰</span>
            <span id="audioPlayerDuration">۰:۰۰</span>
          </div>
        </div>
      </div>

      <div class="audio-player-volume-wrap">
        <span class="material-icons" id="audioVolumeIcon">volume_up</span>
        <input type="range" class="audio-player-volume" id="audioPlayerVolume"
               min="0" max="1" step="0.01" value="1" aria-label="میزان صدا">
      </div>
    </div>

    <button class="audio-player-toggle" id="audioPlayerToggle" aria-label="پخش صدای صفحه">
      <span class="material-icons" id="audioPlayerToggleIcon">volume_up</span>
    </button>
  `;
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
function showToast(msg, duration = 3400) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), duration);
}

/* ═══════════════ ۴) منطق پلیر صوتی (خودکار + پنل بازشو) ═══════════════ */
function initAudioPlayer() {
  const playerRoot    = document.getElementById('audioPlayer');
  const panel         = document.getElementById('audioPlayerPanel');
  const toggleBtn     = document.getElementById('audioPlayerToggle');
  const toggleIcon    = document.getElementById('audioPlayerToggleIcon');
  const closeBtn      = document.getElementById('audioPlayerClose');
  const playBtn       = document.getElementById('audioPlayerPlay');
  const playIcon      = document.getElementById('audioPlayerPlayIcon');
  const progressWrap  = document.getElementById('audioPlayerProgress');
  const progressBar   = document.getElementById('audioPlayerProgressBar');
  const currentEl     = document.getElementById('audioPlayerCurrent');
  const durationEl    = document.getElementById('audioPlayerDuration');
  const volumeSlider  = document.getElementById('audioPlayerVolume');
  const volumeIcon    = document.getElementById('audioVolumeIcon');

  if (!playerRoot || !toggleBtn) return;

  const audio = new Audio();
  audio.preload = 'auto';
  audio.loop = false;
  let loadedSrc = '';

  const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
  function toFa(s) { return String(s).replace(/\d/g, d => FA_DIGITS[+d]); }
  function fmtTime(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return toFa(`${m}:${s < 10 ? '0' + s : s}`);
  }

  /* ───── تعیین منبع بر اساس صفحه ───── */
  function resolveSrc() {
    return audioMap[document.body.dataset.page] || '';
  }

  /* ───── به‌روزرسانی UI ───── */
  function setPlayingUI(isPlaying) {
    playerRoot.classList.toggle('playing', isPlaying);
    toggleBtn.classList.toggle('playing', isPlaying);
    toggleIcon.textContent = isPlaying ? 'pause' : 'volume_up';
    playIcon.textContent = isPlaying ? 'pause' : 'play_arrow';
  }

  /* ───── پخش / توقف ───── */
  function togglePlay() {
    if (audio.paused) {
      const src = resolveSrc();
      if (!src) { showToast('برای این صفحه فایل صوتی تعریف نشده است.'); return; }
      if (loadedSrc !== src) {
        audio.src = src;
        loadedSrc = src;
      }
      audio.play().catch(() => {
        showToast(`پخش «${src}» ممکن نشد؛ از وجود فایل در پوشه sed مطمئن شوید.`);
        setPlayingUI(false);
      });
    } else {
      audio.pause();
    }
  }

  /* ───── دکمه باز/بسته کردن پنل ───── */
  toggleBtn.addEventListener('click', e => {
    e.stopPropagation();
    // اگر پنل بسته است، باز کن؛ در غیر این صورت فقط پخش/توقف
    if (!playerRoot.classList.contains('open')) {
      playerRoot.classList.add('open');
      // اگر در حال پخش نیست، پخش کن
      if (audio.paused) togglePlay();
    } else {
      togglePlay();
    }
  });

  /* ───── دکمه پخش داخل پنل ───── */
  playBtn.addEventListener('click', e => {
    e.stopPropagation();
    togglePlay();
  });

  /* ───── دکمه بستن پنل ───── */
  closeBtn.addEventListener('click', e => {
    e.stopPropagation();
    playerRoot.classList.remove('open');
  });

  /* ───── بستن پنل با کلیک بیرون ───── */
  document.addEventListener('click', e => {
    if (!playerRoot.contains(e.target)) {
      playerRoot.classList.remove('open');
    }
  });

  /* ───── به‌روزرسانی نوار پیشرفت ───── */
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration || !isFinite(audio.duration)) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = percent + '%';
    currentEl.textContent = fmtTime(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = fmtTime(audio.duration);
  });

  /* ───── کلیک روی نوار پیشرفت (seek) ───── */
  progressWrap.addEventListener('click', e => {
    e.stopPropagation();
    if (!audio.duration || !isFinite(audio.duration)) return;
    const rect = progressWrap.getBoundingClientRect();
    // RTL: مختصات از راست حساب می‌شود
    const clickX = e.clientX - rect.left;
    const ratio = 1 - (clickX / rect.width);
    audio.currentTime = ratio * audio.duration;
  });

  /* ───── کنترل صدا ───── */
  volumeSlider.addEventListener('input', () => {
    audio.volume = parseFloat(volumeSlider.value);
    updateVolumeIcon();
  });

  function updateVolumeIcon() {
    const v = audio.volume;
    if (v === 0) volumeIcon.textContent = 'volume_off';
    else if (v < 0.5) volumeIcon.textContent = 'volume_down';
    else volumeIcon.textContent = 'volume_up';
  }

  /* ───── رویدادهای صوتی ───── */
  audio.addEventListener('play', () => setPlayingUI(true));
  audio.addEventListener('pause', () => setPlayingUI(false));
  audio.addEventListener('ended', () => {
    setPlayingUI(false);
    progressBar.style.width = '0%';
    currentEl.textContent = '۰:۰۰';
  });

  /* ───── پخش خودکار با اولین تعامل کاربر ───── */
  function tryAutoplay() {
    const src = resolveSrc();
    if (!src) return;
    if (loadedSrc !== src) {
      audio.src = src;
      loadedSrc = src;
    }
    audio.volume = parseFloat(volumeSlider.value);

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.then(() => {
        // پخش موفق — پنل باز می‌شود
        playerRoot.classList.add('open');
        showToast('صدای این بخش به صورت خودکار در حال پخش است.', 2600);
      }).catch(() => {
        // پخش توسط مرورگر مسدود شد — منتظر اولین تعامل کاربر می‌مانیم
        const startOnInteraction = () => {
          audio.play().then(() => {
            playerRoot.classList.add('open');
            showToast('صدای این بخش در حال پخش است.', 2200);
          }).catch(() => {});
          removeListeners();
        };
        const removeListeners = () => {
          document.removeEventListener('click', startOnInteraction, true);
          document.removeEventListener('touchstart', startOnInteraction, true);
          document.removeEventListener('keydown', startOnInteraction, true);
          document.removeEventListener('scroll', startOnInteraction, true);
          window.removeEventListener('scroll', startOnInteraction, true);
        };
        document.addEventListener('click', startOnInteraction, { capture: true, once: true });
        document.addEventListener('touchstart', startOnInteraction, { capture: true, once: true });
        document.addEventListener('keydown', startOnInteraction, { capture: true, once: true });
        document.addEventListener('scroll', startOnInteraction, { capture: true, once: true });
        window.addEventListener('scroll', startOnInteraction, { capture: true, once: true });
      });
    }
  }

  /* با تأخیر کوتاه پس از بارگذاری کامل صفحه، تلاش برای پخش خودکار */
  setTimeout(tryAutoplay, 900);

  /* ───── قطع پخش هنگام ترک صفحه ───── */
  window.addEventListener('beforeunload', () => audio.pause());
  window.addEventListener('pagehide', () => audio.pause());

  /* ───── همگام‌سازی آیکون صدا در ابتدا ───── */
  updateVolumeIcon();
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

/* ═══════════════ ۶) Scroll Reveal ═══════════════ */
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

/* ═══════════════ ۷) شمارنده اعداد ═══════════════ */
const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
function toFa(str) { return String(str).replace(/\d/g, d => FA_DIGITS[+d]); }
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
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = formatNumber(target * eased, decimals) + suffix;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
function initCounters() {
  const els = document.querySelectorAll('.counter');
  if (!('IntersectionObserver' in window)) { els.forEach(animateCounter); return; }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { animateCounter(en.target); obs.unobserve(en.target); }
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
      if (i < text.length) { out.textContent += text[i++]; setTimeout(type, speed); }
      else { cur.classList.add('done'); }
    }
    setTimeout(type, startDelay);
  });
}

/* ═══════════════ ۹) پارالاکس ═══════════════ */
function initParallax() {
  const layers = document.querySelectorAll('[data-parallax]');
  if (!layers.length) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => {
    tx = (e.clientX / window.innerWidth - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
  (function loop() {
    cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05;
    layers.forEach(l => {
      const depth = parseFloat(l.dataset.parallax) || 15;
      l.style.transform = `translate3d(${(-cx * depth).toFixed(1)}px, ${(-cy * depth).toFixed(1)}px, 0)`;
    });
    requestAnimationFrame(loop);
  })();
}

/* ═══════════════ ۱۰) Tilt ═══════════════ */
function initTilt() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.tilt').forEach(card => {
    const strength = parseFloat(card.dataset.tilt) || 7;
    card.addEventListener('mousemove', e => {
      if (/\breveal/.test(card.className) && !card.classList.contains('visible')) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(px * strength).toFixed(2)}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ═══════════════ ۱۱) ذرات شناور ═══════════════ */
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
  document.querySelectorAll('.particles').forEach(c =>
    spawn(c, ['#00f0ff', '#ffd700', '#ffffff'], 30, 0.22));
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

/* ═══════════════ ۱۳) تزریق متن تمیز برای بخش‌های حساس ═══════════════ */
function injectCleanTexts() {
  const CLEAN_TEXTS = {
    'trophy-message': 'لحظه افتخار، ثمره\u200Cی هم\u200Cافزایی ارزشمند دانش\u200Cآموزان، معلمان و مدیران در کنار تلاش\u200Cهای مجدانه کادر اداری، کارشناسان آموزشی و حمایت بی\u200Cدریغ خانواده\u200Cها (پشتیبانان پنهان) و همچنین همراهی معلمان پنهان و قهرمانان آموزشی است'
  };
  Object.entries(CLEAN_TEXTS).forEach(([key, text]) => {
    document.querySelectorAll(`[data-clean-text="${key}"]`).forEach(el => {
      el.textContent = '';
      el.appendChild(document.createTextNode(text));
    });
  });
  const guard = new MutationObserver(() => {
    Object.entries(CLEAN_TEXTS).forEach(([key, text]) => {
      document.querySelectorAll(`[data-clean-text="${key}"]`).forEach(el => {
        if (el.textContent.trim() !== text.trim()) {
          el.textContent = '';
          el.appendChild(document.createTextNode(text));
        }
      });
    });
  });
  guard.observe(document.body, { childList: true, subtree: true, characterData: true });
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
  injectCleanTexts();
});