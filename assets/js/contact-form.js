/* Formulario de contacto de SilvIA — envío por fetch al backend.
   El endpoint se lee de data-endpoint del <form>. Textos por idioma en data-*. */
(function () {
  var form = document.querySelector('.contact-form');
  if (!form) return;

  var status = form.querySelector('.form-status');
  var submitBtn = form.querySelector('button[type="submit"]');
  var endpoint = form.getAttribute('data-endpoint') || '/api/contact';

  var T = {
    sending: form.getAttribute('data-t-sending') || 'Enviando…',
    ok: form.getAttribute('data-t-ok') || '¡Gracias! Te responderemos pronto.',
    err: form.getAttribute('data-t-err') || 'No se pudo enviar. Escríbenos a info@silviaearth.com.',
    send: submitBtn ? submitBtn.textContent : 'Enviar'
  };

  function setStatus(msg, kind) {
    if (!status) return;
    status.textContent = msg;
    status.className = 'form-status' + (kind ? ' is-' + kind : '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (submitBtn && submitBtn.disabled) return;

    var data = {
      name: (form.name && form.name.value || '').trim(),
      email: (form.email && form.email.value || '').trim(),
      organization: (form.organization && form.organization.value || '').trim(),
      sector: (form.sector && form.sector.value || '').trim(),
      territory: (form.territory && form.territory.value || '').trim(),
      message: (form.message && form.message.value || '').trim(),
      company_website: (form.company_website && form.company_website.value || ''), // honeypot
      lang: (document.documentElement.getAttribute('lang') || 'es').slice(0, 2)
    };

    if (!data.name || !data.email || (!data.message && !data.territory)) {
      setStatus(T.err, 'error');
      return;
    }

    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = T.sending; }
    setStatus(T.sending, 'sending');

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
      .then(function (res) {
        if (res && res.ok) {
          form.reset();
          setStatus(T.ok, 'ok');
          if (submitBtn) submitBtn.textContent = T.send;
        } else {
          setStatus((res && res.error) || T.err, 'error');
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = T.send; }
        }
      })
      .catch(function () {
        setStatus(T.err, 'error');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = T.send; }
      });
  });
})();
