<?php
/**
 * SilvIA — Manejador del formulario de contacto (Arsys / hosting PHP).
 *
 * Recibe el envío del formulario (JSON o form-urlencoded), valida los datos
 * y envía un correo con la función mail() de PHP. Pensado para alojamiento
 * compartido de Arsys, sin dependencias externas ni procesos en segundo plano.
 *
 * Configura las 3 constantes de abajo y sube este archivo junto al resto de
 * la web. El formulario apunta a él con data-endpoint="contact.php".
 */

/* ------------------------------------------------------------------ */
/*  CONFIGURACIÓN — edita solo estas líneas                            */
/* ------------------------------------------------------------------ */

// Buzón que RECIBE los mensajes del formulario.
const MAIL_TO = 'info@silviaearth.com';

// Remitente. IMPORTANTE: en Arsys debe ser una cuenta de TU dominio que
// exista de verdad (créala en el panel si hace falta). No pongas el correo
// del visitante aquí: los servidores lo rechazarían como falsificación.
const MAIL_FROM = 'noreply@silviaearth.com';

// Nombre visible del remitente y prefijo del asunto.
const MAIL_FROM_NAME = 'Web SilvIA';
const SUBJECT_PREFIX = '[Contacto web]';

/* ------------------------------------------------------------------ */
/*  A partir de aquí no hace falta tocar nada                          */
/* ------------------------------------------------------------------ */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Mismo dominio (web + PHP en Arsys): no se necesita CORS. Si algún día
// sirves la web desde otro origen, añade aquí la cabecera correspondiente.

function respond($ok, $error = null, $code = 200) {
    http_response_code($code);
    $out = array('ok' => $ok);
    if ($error !== null) { $out['error'] = $error; }
    echo json_encode($out);
    exit;
}

// Solo POST.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Método no permitido.', 405);
}

/* --- Leer el cuerpo: primero JSON (fetch), luego formulario clásico --- */
$raw = file_get_contents('php://input');
$data = array();
if ($raw !== '' && $raw !== false) {
    $json = json_decode($raw, true);
    if (is_array($json)) { $data = $json; }
}
if (empty($data)) { $data = $_POST; }

function field($data, $key) {
    return isset($data[$key]) ? trim((string) $data[$key]) : '';
}

$name         = field($data, 'name');
$email        = field($data, 'email');
$organization = field($data, 'organization');
$sector       = field($data, 'sector');
$territory    = field($data, 'territory');
$message      = field($data, 'message');
$honeypot     = field($data, 'company_website');
$lang         = substr(field($data, 'lang'), 0, 2);

/* --- Anti-spam: honeypot. Si viene relleno, fingimos éxito y no enviamos. --- */
if ($honeypot !== '') {
    respond(true);
}

/* --- Límite básico por IP (5 envíos / 10 min) usando un archivo temporal. --- */
$ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
$throttleFile = sys_get_temp_dir() . '/silvia_contact_' . md5($ip) . '.txt';
$now = time();
$hits = array();
if (is_readable($throttleFile)) {
    $prev = @file_get_contents($throttleFile);
    if ($prev !== false && $prev !== '') {
        foreach (explode(',', $prev) as $t) {
            $t = (int) $t;
            if ($t > $now - 600) { $hits[] = $t; } // últimos 10 min
        }
    }
}
if (count($hits) >= 5) {
    respond(false, 'Demasiados envíos. Inténtalo de nuevo en unos minutos.', 429);
}

/* --- Validación --- */
if ($name === '') {
    respond(false, 'Falta el nombre.', 400);
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Email no válido.', 400);
}
if ($message === '' && $territory === '') {
    respond(false, 'Cuéntanos algo: un mensaje o tu territorio.', 400);
}

/* --- Evitar inyección de cabeceras: sin saltos de línea en campos de cabecera. --- */
function oneLine($s) {
    return trim(str_replace(array("\r", "\n", "%0a", "%0d"), ' ', $s));
}
$safeEmail = oneLine($email);
$safeName  = oneLine($name);

/* --- Componer el correo (texto plano, UTF-8) --- */
$sectorLabel = $sector !== '' ? $sector : '(sin especificar)';
$bodyLines = array(
    'Nuevo mensaje desde el formulario de contacto de la web.',
    '',
    'Nombre:        ' . $name,
    'Email:         ' . $email,
    'Organización:  ' . ($organization !== '' ? $organization : '(sin especificar)'),
    'Sector:        ' . $sectorLabel,
    'Territorio:    ' . ($territory !== '' ? $territory : '(sin especificar)'),
    'Idioma web:    ' . ($lang !== '' ? $lang : 'es'),
    '',
    'Mensaje:',
    ($message !== '' ? $message : '(sin mensaje)'),
    '',
    '— Enviado automáticamente desde silviaearth.com',
);
$body = implode("\n", $bodyLines);

$subject = SUBJECT_PREFIX . ' ' . ($organization !== '' ? $organization . ' — ' : '') . $safeName;

$headers  = 'From: ' . MAIL_FROM_NAME . ' <' . MAIL_FROM . ">\r\n";
$headers .= 'Reply-To: ' . $safeName . ' <' . $safeEmail . ">\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

// El 5º parámetro fija el remitente de sobre (envelope). En Arsys ayuda a
// que el correo no se rechace; debe ser una cuenta real de tu dominio.
$sent = @mail(MAIL_TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-f' . MAIL_FROM);

if (!$sent) {
    respond(false, 'No se pudo enviar el correo. Escríbenos a ' . MAIL_TO . '.', 500);
}

/* --- Registrar el envío para el límite por IP (best-effort) --- */
$hits[] = $now;
@file_put_contents($throttleFile, implode(',', $hits), LOCK_EX);

respond(true);
