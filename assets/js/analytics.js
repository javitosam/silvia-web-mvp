/* SilvIA — Consentimiento de cookies (RGPD / LSSI art. 22.2) con Google Consent Mode.
   El consentimiento está DENEGADO por defecto (ver el snippet de Consent Mode en el
   <head>, antes de Google Tag Manager). GTM y Google Analytics NO instalan cookies
   de analítica hasta que el usuario pulsa "Aceptar" en el banner. La elección se
   guarda en localStorage y puede cambiarse desde cualquier enlace [data-cookie-settings]
   (por ejemplo, en la Política de cookies). */
(function () {
  var KEY = 'silvia-consent-analytics';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  /* Concede el consentimiento de analítica a GTM/GA (Consent Mode) */
  function grant() {
    gtag('consent', 'update', { 'analytics_storage': 'granted' });
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
      if (value === 'granted') grant();
      box.parentNode.removeChild(box);
    });
    document.body.appendChild(box);
  }

  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) { /* modo privado */ }
  if (choice === 'granted') grant();
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
