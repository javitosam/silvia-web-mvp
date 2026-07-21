'use strict';

/**
 * SilvIA — backend del formulario de contacto.
 *
 * Recibe los envíos del formulario (POST /api/contact) y los reenvía por
 * correo mediante SMTP. Toda la configuración sensible (credenciales SMTP,
 * destinatario, orígenes permitidos) se lee de variables de entorno: NO hay
 * ningún secreto en el código. Ver .env.example y README.md.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

const app = express();
app.set('trust proxy', 1); // detrás de proxy/reverse-proxy (nginx, etc.)

// ---------- Configuración ----------
const PORT = process.env.PORT || 3000;
const MAIL_TO = process.env.MAIL_TO || 'info@silviaearth.com';
const MAIL_FROM = process.env.MAIL_FROM || 'SilvIA Web <no-reply@silviaearth.com>';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  'https://silviaearth.com,https://www.silviaearth.com')
  .split(',')
  .map(function (s) { return s.trim(); })
  .filter(Boolean);

// ---------- CORS ----------
const corsOptions = {
  origin: function (origin, cb) {
    // Permite herramientas sin origin (curl, health checks) y los orígenes de la lista.
    if (!origin || ALLOWED_ORIGINS.indexOf(origin) !== -1) return cb(null, true);
    return cb(new Error('Origin no permitido: ' + origin));
  },
  methods: ['POST', 'OPTIONS'],
  maxAge: 86400
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '32kb' }));

// ---------- Rate limiting (anti-abuso) ----------
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 5,                   // 5 envíos por IP y ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Demasiados envíos. Inténtalo de nuevo en unos minutos.' }
});

// ---------- Transporte SMTP ----------
function buildTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true', // true para 465
    auth: (process.env.SMTP_USER && process.env.SMTP_PASS)
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined
  });
}
const transporter = buildTransport();

// ---------- Utilidades ----------
function isEmail(v) {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;
}
function clean(v, max) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max || 2000);
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// ---------- Endpoints ----------
app.get('/health', function (req, res) {
  res.json({ ok: true, service: 'silvia-contact', time: new Date().toISOString() });
});

app.post('/api/contact', contactLimiter, async function (req, res) {
  try {
    const body = req.body || {};

    // Honeypot: campo oculto que un humano nunca rellena. Si viene con datos,
    // fingimos éxito y descartamos (así el bot no reintenta).
    if (clean(body.company_website, 200)) {
      return res.json({ ok: true });
    }

    const name = clean(body.name, 120);
    const email = clean(body.email, 254);
    const organization = clean(body.organization, 160);
    const territory = clean(body.territory, 500);
    const sector = clean(body.sector, 80);
    const message = clean(body.message, 4000);
    const lang = clean(body.lang, 5) || 'es';

    if (!name) return res.status(400).json({ ok: false, error: 'Falta el nombre.' });
    if (!isEmail(email)) return res.status(400).json({ ok: false, error: 'Email no válido.' });
    if (!message && !territory) {
      return res.status(400).json({ ok: false, error: 'Cuéntanos algo sobre tu territorio o tu caso.' });
    }

    const rows = [
      ['Nombre', name],
      ['Email', email],
      ['Organización', organization],
      ['Sector', sector],
      ['Territorio', territory],
      ['Idioma', lang]
    ].filter(function (r) { return r[1]; });

    const textBody =
      rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n') +
      (message ? ('\n\nMensaje:\n' + message) : '') +
      '\n\n— Enviado desde el formulario de contacto de silviaearth.com';

    const htmlBody =
      '<h2>Nuevo contacto — SilvIA</h2>' +
      '<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">' +
      rows.map(function (r) {
        return '<tr><td style="color:#666"><b>' + escapeHtml(r[0]) +
          '</b></td><td>' + escapeHtml(r[1]) + '</td></tr>';
      }).join('') +
      '</table>' +
      (message ? ('<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap"><b>Mensaje:</b><br>' +
        escapeHtml(message) + '</p>') : '') +
      '<hr><p style="color:#999;font-size:12px">Enviado desde el formulario de contacto de silviaearth.com</p>';

    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: name ? (name + ' <' + email + '>') : email,
      subject: 'Contacto web — ' + name + (organization ? (' (' + organization + ')') : ''),
      text: textBody,
      html: htmlBody
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('[contact] error:', err && err.message ? err.message : err);
    return res.status(500).json({ ok: false, error: 'No se pudo enviar el mensaje. Escríbenos a info@silviaearth.com.' });
  }
});

// Manejo de errores de CORS y otros
app.use(function (err, req, res, next) {
  if (err && /Origin no permitido/.test(err.message)) {
    return res.status(403).json({ ok: false, error: 'Origen no permitido.' });
  }
  console.error(err);
  return res.status(500).json({ ok: false, error: 'Error interno.' });
});

app.listen(PORT, function () {
  console.log('SilvIA contact backend escuchando en el puerto ' + PORT);
  console.log('Orígenes permitidos:', ALLOWED_ORIGINS.join(', '));
  console.log('Destino del correo:', MAIL_TO);
});
