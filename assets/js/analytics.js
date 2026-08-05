/* Google Analytics 4 con consentimiento previo (RGPD / LSSI art. 22.2).
   El script de Google NO se carga y no se instala ninguna cookie hasta que
   el usuario pulsa "Aceptar" en el banner. La elección se guarda en
   localStorage y puede cambiarse desde cualquier enlace con
   [data-cookie-settings] (p. ej. en la política de cookies). */
(function () {
  var GA_ID = 'G-XXXXXXXXXX'; /* <-- Sustituir por el ID de medición real de GA4 */
  var KEY = 'silvia-consent-analytics';

  /* Mientras no haya un ID real configurado, no se muestra banner ni se carga nada */
  if (GA_ID === 'G-XXXXXXXXXX' || !/^G-[A-Z0-9]+$/.test(GA_ID)) return;

  function loadGA() {
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* modo privado */ }
  }

  var lang = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2);
  var T = {
    es: { msg: 'Usamos cookies analíticas (<b>Google Analytics</b>) para medir el uso de la web. Solo se instalan si las aceptas.', accept: 'Aceptar', reject: 'Rechazar', link: 'Política de cookies' },
    en: { msg: 'We use analytics cookies (<b>Google Analytics</b>) to measure how the site is used. They are only set if you accept.', accept: 'Accept', reject: 'Reject', link: 'Cookie policy' },
    pt: { msg: 'Utilizamos cookies analíticos (<b>Google Analytics</b>) para medir a utilização do site. Só se instalam se os aceitar.', accept: 'Aceitar', reject: 'Rejeitar', link: 'Política de cookies' },
    fr: { msg: 'Nous utilisons des cookies analytiques (<b>Google Analytics</b>) pour mesurer l’utilisation du site. Ils ne sont déposés que si vous acceptez.', accept: 'Accepter', reject: 'Refuser', link: 'Politique de cookies' }
  };
  var t = T[lang] || T.es;

  function showBanner() {
    if (document.querySelector('.cookie-banner')) return;
    var box = document.createElement('div');
    box.className = 'cookie-banner';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-live', 'polite');
    box.innerHTML =
      '<p>' + t.msg + ' <a href="politica-de-cookies">' + t.link + '</a></p>' +
      '<div class="cookie-banner-actions">' +
        '<button type="button" class="btn btn-primary" data-consent="granted">' + t.accept + '</button>' +
        '<button type="button" class="btn btn-ghost" data-consent="denied">' + t.reject + '</button>' +
      '</div>';
    box.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-consent]') : null;
      if (!btn) return;
      var value = btn.getAttribute('data-consent');
      save(value);
      if (value === 'granted') loadGA();
      box.parentNode.removeChild(box);
    });
    document.body.appendChild(box);
  }

  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) { /* modo privado */ }
  if (choice === 'granted') loadGA();
  else if (choice !== 'denied') showBanner();

  /* Reabrir el banner desde la política de cookies u otros enlaces */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-cookie-settings]') : null;
    if (!a) return;
    e.preventDefault();
    try { localStorage.removeItem(KEY); } catch (err) {}
    showBanner();
  });
})();
