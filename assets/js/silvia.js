document.documentElement.classList.add('js');
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var nav = document.getElementById('nav');
  var burger = document.querySelector('.burger');
  if (nav && burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Desplegable "Blog": en móvil el enlace padre abre/cierra el submenú
  // (en escritorio navega y el submenú se muestra al pasar el ratón / con foco).
  var isMobileNav = function () { return window.matchMedia('(max-width:960px)').matches; };
  document.querySelectorAll('.nav-drop').forEach(function (drop) {
    var link = drop.querySelector('a');
    if (!link) return;
    link.addEventListener('click', function (e) {
      if (isMobileNav()) {
        e.preventDefault();
        var open = drop.classList.toggle('open');
        link.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    });
  });

  // Barra de progreso de scroll (verde, fija arriba)
  var scrollbar = document.getElementById('scrollbar');
  if (!scrollbar && !reduced) {
    scrollbar = document.createElement('div');
    scrollbar.id = 'scrollbar';
    scrollbar.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(scrollbar, document.body.firstChild);
  }

  // Nav compacto al hacer scroll + progreso
  var navTicking = false;
  var onScroll = function () {
    if (navTicking) return;
    navTicking = true;
    requestAnimationFrame(function () {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
      if (scrollbar) {
        var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
        scrollbar.style.width = (max > 0 ? (h.scrollTop / max * 100) : 0) + '%';
      }
      navTicking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Controles de la barra: tema (claro/oscuro) + selector de idioma
  var root = document.documentElement;
  var navRight = document.createElement('div');
  navRight.className = 'nav-right';

  // --- Botón de tema ---
  var themeBtn = document.createElement('button');
  themeBtn.className = 'theme-toggle';
  themeBtn.type = 'button';
  themeBtn.setAttribute('aria-label', 'Cambiar tema claro/oscuro');
  themeBtn.innerHTML =
    '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>' +
    '<svg class="icon-moon" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.8 6.8 0 0 0 9.8 9.8Z"/></svg>';
  var applyTheme = function (t) {
    root.setAttribute('data-theme', t);
    root.style.background = t === 'dark' ? '#0d1117' : '#ffffff';
    root.style.colorScheme = t === 'dark' ? 'dark' : 'light';
    themeBtn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
    try { localStorage.setItem('theme', t); } catch (e) {}
  };
  var curTheme = root.getAttribute('data-theme') || 'light';
  themeBtn.setAttribute('aria-pressed', curTheme === 'dark' ? 'true' : 'false');
  themeBtn.addEventListener('click', function () {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // --- Selector de idioma (popup) desde los <link rel="alternate" hreflang> ---
  var langLink = document.querySelector('.lang-link');
  var langNames = { es: 'Español', en: 'English', pt: 'Português', fr: 'Français' };
  var langOrder = ['es', 'en', 'pt', 'fr'];
  var curLang = (root.getAttribute('lang') || 'es').slice(0, 2).toLowerCase();
  if (!langNames[curLang]) curLang = 'es';
  var alts = {};
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(function (l) {
    var lg = (l.getAttribute('hreflang') || '').slice(0, 2).toLowerCase();
    if (langNames[lg]) alts[lg] = l.getAttribute('href');
  });
  var langs = langOrder.filter(function (lg) { return lg === curLang || alts[lg]; });
  if (langLink && langs.length > 1) {
    var opt = function (lg) {
      var active = lg === curLang;
      var href = active ? '#' : (alts[lg] || '#');
      return '<a class="lang-opt' + (active ? ' active' : '') + '" role="menuitem" href="' + href + '"' +
        (active ? ' aria-current="true"' : ' hreflang="' + lg + '" lang="' + lg + '"') +
        '><span class="code">' + lg.toUpperCase() + '</span><span class="name">' + langNames[lg] + '</span></a>';
    };
    var pop = document.createElement('div');
    pop.className = 'lang-pop';
    pop.innerHTML =
      '<button class="lang-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Idioma / Language">' +
        '<svg class="globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>' +
        '<span>' + curLang.toUpperCase() + '</span>' +
        '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
      '</button>' +
      '<div class="lang-menu" role="menu">' +
        '<span class="lang-head">Idioma, Language</span>' +
        langs.map(opt).join('') +
      '</div>';

    var toggle = pop.querySelector('.lang-toggle');
    var closePop = function () { pop.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = pop.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) { if (!pop.contains(e.target)) closePop(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePop(); });
    pop.querySelector('.lang-opt.active').addEventListener('click', function (e) { e.preventDefault(); closePop(); });

    var li = langLink.closest('li');
    if (li) { li.remove(); }
    navRight.appendChild(themeBtn);
    navRight.appendChild(pop);
  } else {
    navRight.appendChild(themeBtn);
  }

  if (nav) {
    var burgerEl = nav.querySelector('.burger');
    nav.insertBefore(navRight, burgerEl || null);
  }

  // Enlace activo según la página actual (respaldo si falta aria-current)
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a[href]').forEach(function (a) {
    var href = (a.getAttribute('href') || '').toLowerCase();
    if (href === here && !a.classList.contains('nav-cta')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  // Animaciones de aparición al hacer scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.16 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // Curvas de nivel: entran como una ola cuando la sección aparece
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('contours-in'); cio.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.hero, .core, .cta, .sub-hero, .case-quote').forEach(function (el) { cio.observe(el); });

  // Texto rotatorio del hero (máquina de escribir)
  var tw = document.querySelector('.type-word[data-words]');
  if (tw) {
    var words = [];
    try { words = JSON.parse(tw.getAttribute('data-words')) || []; } catch (err) { words = []; }
    if (words.length && !reduced) {
      var wi = 0, ci = words[0].length, deleting = false;
      tw.textContent = words[0];
      var tick = function () {
        var word = words[wi];
        var delay;
        if (!deleting) {
          ci++;
          tw.textContent = word.slice(0, ci);
          if (ci >= word.length) { deleting = true; delay = 2800; }
          else { delay = 80; }
        } else {
          ci--;
          tw.textContent = word.slice(0, ci);
          if (ci <= 0) { deleting = false; wi = (wi + 1) % words.length; delay = 350; }
          else { delay = 45; }
        }
        window.setTimeout(tick, delay);
      };
      window.setTimeout(tick, 2800);
    } else if (words.length) {
      tw.textContent = words[0];
    }
  }

  // Carrusel satelital del hero (imágenes locales, orden aleatorio en cada carga)
  var carHost = document.querySelector('.hero-carousel');
  var carCap = document.querySelector('.hero-sat-cap');
  var sats = (window.HERO_SATS || []).slice();
  if (carHost && sats.length) {
    for (var s = sats.length - 1; s > 0; s--) {
      var r = Math.floor(Math.random() * (s + 1)), tmp = sats[s]; sats[s] = sats[r]; sats[r] = tmp;
    }
    var slides = [];      // slides con imagen válida
    var cur = 0;
    var showSat = function (n) {
      if (!slides.length) { if (carCap) carCap.innerHTML = ''; return; }
      cur = ((n % slides.length) + slides.length) % slides.length;
      slides.forEach(function (sl, k) { sl.el.classList.toggle('is-active', k === cur); });
      if (carCap) {
        var d = slides[cur].data;
        carCap.innerHTML = '<b></b><span></span>';
        carCap.querySelector('b').textContent = d.place;
        carCap.querySelector('span').textContent = d.source;
      }
      var im = slides[cur].img; im.style.animation = 'none'; void im.offsetWidth; im.style.animation = '';
    };
    sats.forEach(function (item) {
      var slide = document.createElement('div');
      slide.className = 'hero-slide';
      var im = document.createElement('img');
      im.alt = ''; im.decoding = 'async';
      var rec = { el: slide, img: im, data: item };
      im.addEventListener('error', function () {
        var idx = slides.indexOf(rec);
        if (idx < 0) return;
        var wasActive = slide.classList.contains('is-active');
        slides.splice(idx, 1); slide.remove();
        if (wasActive) showSat(cur);
      });
      slide.appendChild(im); carHost.appendChild(slide); slides.push(rec);
      im.src = item.src;      // src tras insertar en el DOM: así carga (sin lazy)
    });
    showSat(0);   // una sola imagen aleatoria por carga (sin rotación; cambia al recargar)
  }

  // Contadores animados en las cifras (.stat b) al entrar en pantalla
  function animateStat(b) {
    var raw = b.textContent;
    if (raw.indexOf('/') !== -1) return;
    var m = raw.match(/^([^0-9]*?)(\d+(?:[.,]\d+)?)(.*)$/);
    if (!m) return;
    var prefix = m[1], suffix = m[3];
    var sep = m[2].indexOf(',') !== -1 ? ',' : '.';
    var decimals = (m[2].split(/[.,]/)[1] || '').length;
    var target = parseFloat(m[2].replace(',', '.'));
    if (!isFinite(target)) return;
    var t0 = null, dur = 1400;
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(decimals);
      if (decimals) val = val.replace('.', sep);
      b.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else b.textContent = raw;
    }
    requestAnimationFrame(frame);
  }
  if (!reduced && 'IntersectionObserver' in window) {
    var seen = new WeakSet();
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !seen.has(e.target)) {
          seen.add(e.target);
          animateStat(e.target);
          sio.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat b').forEach(function (b) { sio.observe(b); });
  }

  // Navegación interna: el nav no vuelve a "caer" al cambiar de página
  if (document.referrer && document.referrer.indexOf(location.origin) === 0) {
    document.documentElement.classList.add('warm');
  }

  // Pasada de escaneo satelital al cargar la página
  if (!reduced) {
    var bar = document.createElement('div');
    bar.className = 'scan-bar';
    document.body.appendChild(bar);
    bar.addEventListener('animationend', function () { bar.remove(); });
  }

  // Transición de salida cuando el navegador no soporta View Transitions cross-document
  if (!('CSSViewTransitionRule' in window) && !reduced) {
    document.documentElement.classList.add('vt-fallback');
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^[a-z][a-z0-9+.-]*:/i.test(href)) return;
      e.preventDefault();
      document.documentElement.classList.add('page-exit');
      window.setTimeout(function () { window.location.href = href; }, 230);
    });
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) document.documentElement.classList.remove('page-exit');
    });
  }
})();

/* Lightbox de galerías de artículo: ampliar imágenes y navegar entre ellas */
(function () {
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.article-gallery img'));
  if (!imgs.length) return;
  var idx = 0, multiple = imgs.length > 1;

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Galería de imágenes ampliada');
  box.innerHTML =
    '<span class="lightbox-count"></span>' +
    '<button class="lightbox-close" type="button" aria-label="Cerrar">×</button>' +
    '<button class="lightbox-btn lightbox-prev" type="button" aria-label="Imagen anterior"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>' +
    '<img class="lightbox-img" alt="">' +
    '<button class="lightbox-btn lightbox-next" type="button" aria-label="Imagen siguiente"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>' +
    '<span class="lightbox-cap"></span>';
  document.body.appendChild(box);

  var bImg = box.querySelector('.lightbox-img');
  var bCap = box.querySelector('.lightbox-cap');
  var bCount = box.querySelector('.lightbox-count');
  if (!multiple) {
    box.querySelector('.lightbox-prev').style.display = 'none';
    box.querySelector('.lightbox-next').style.display = 'none';
  }

  function show(i) {
    idx = (i + imgs.length) % imgs.length;
    bImg.setAttribute('src', imgs[idx].getAttribute('src'));
    bImg.setAttribute('alt', imgs[idx].getAttribute('alt') || '');
    bCap.textContent = imgs[idx].getAttribute('alt') || '';
    bCount.textContent = multiple ? (idx + 1) + ' / ' + imgs.length : '';
  }
  function open(i) { show(i); box.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { box.classList.remove('open'); document.body.style.overflow = ''; }
  function next() { show(idx + 1); }
  function prev() { show(idx - 1); }

  imgs.forEach(function (im, i) {
    im.setAttribute('tabindex', '0');
    im.setAttribute('role', 'button');
    im.addEventListener('click', function () { open(i); });
    im.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });
  box.querySelector('.lightbox-close').addEventListener('click', close);
  box.querySelector('.lightbox-next').addEventListener('click', function (e) { e.stopPropagation(); next(); });
  box.querySelector('.lightbox-prev').addEventListener('click', function (e) { e.stopPropagation(); prev(); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight' && multiple) next();
    else if (e.key === 'ArrowLeft' && multiple) prev();
  });

  // Deslizar en táctil para moverse entre imágenes
  var sx = 0, sy = 0;
  box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (!multiple) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { if (dx < 0) next(); else prev(); }
  }, { passive: true });
})();
