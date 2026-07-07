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

  // Nav compacto al hacer scroll
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
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
