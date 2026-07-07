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

  // Selector de idioma como popup compacto (a partir del enlace .lang-link)
  var langLink = document.querySelector('.lang-link');
  if (langLink) {
    var curLang = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2).toLowerCase();
    var isES = curLang !== 'en';
    var otherHref = langLink.getAttribute('href') || '#';
    var LABELS = { es: 'Español', en: 'English' };
    var curCode = isES ? 'ES' : 'EN';
    var otherLang = isES ? 'en' : 'es';

    var pop = document.createElement('div');
    pop.className = 'lang-pop';
    pop.innerHTML =
      '<button class="lang-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Idioma / Language">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>' +
        '<span>' + curCode + '</span>' +
        '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
      '</button>' +
      '<div class="lang-menu" role="menu">' +
        '<a class="lang-opt' + (isES ? ' active' : '') + '" role="menuitem" href="' + (isES ? '#' : otherHref) + '"' + (isES ? ' aria-current="true"' : ' hreflang="es" lang="es"') + '><span class="flag">ES</span>' + LABELS.es + '</a>' +
        '<a class="lang-opt' + (!isES ? ' active' : '') + '" role="menuitem" href="' + (!isES ? '#' : otherHref) + '"' + (!isES ? ' aria-current="true"' : ' hreflang="en" lang="en"') + '><span class="flag">EN</span>' + LABELS.en + '</a>' +
      '</div>';

    var li = langLink.closest('li');
    if (li) { li.textContent = ''; li.appendChild(pop); }
    else { langLink.replaceWith(pop); }

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
    void otherLang;
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
