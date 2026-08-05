/* Consent Mode v2 + banner RGPD/LSSI.
   GTM ya esta cargado en el <head>. Este script gestiona el consentimiento
   mediante dataLayer y muestra el banner en la primera visita. */
(function () {
  var KEY = 'silvia-consent-analytics';

  /* Consentimiento denegado por defecto para GTM Consent Mode v2 */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  function updateConsent(value) {
    var state = value === 'granted' ? 'granted' : 'denied';
    gtag('consent', 'update', {
      analytics_storage: state,
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
  }

  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }

  var lang = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2);
  var T = {
    es: { msg: 'Usamos cookies analiticas (<b>Google Analytics</b>) para medir el uso de la web. Solo se instalan si las aceptas.', accept: 'Aceptar', reject: 'Rechazar', link: 'Politica de cookies' },
    en: { msg: 'We use analytics cookies (<b>Google Analytics</b>) to measure how the site is used. They are only set if you accept.', accept: 'Accept', reject: 'Reject', link: 'Cookie policy' },
    pt: { msg: 'Utilizamos cookies analiticos (<b>Google Analytics</b>) para medir a utilizacao do site. So se instalam se os aceitar.', accept: 'Aceitar', reject: 'Rejeitar', link: 'Politica de cookies' },
    fr: { msg: "Nous utilisons des cookies analytiques (<b>Google Analytics</b>) pour mesurer l'utilisation du site. Ils ne sont deposes que si vous acceptez.", accept: 'Accepter', reject: 'Refuser', link: 'Politique de cookies' }
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
      updateConsent(value);
      box.parentNode.removeChild(box);
    });
    document.body.appendChild(box);
  }

  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}
  if (choice) {
    updateConsent(choice);
  } else {
    showBanner();
  }

  /* Reabrir el banner desde la politica de cookies u otros enlaces */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-cookie-settings]') : null;
    if (!a) return;
    e.preventDefault();
    try { localStorage.removeItem(KEY); } catch (err) {}
    showBanner();
  });
})();