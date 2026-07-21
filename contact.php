<?php
/**
 * SilvIA — Manejador del formulario de contacto (hosting PHP / Arsys).
 *
 * Recibe el envío del formulario (JSON o form-urlencoded), valida los datos
 * y envía el correo por SMTP autenticado a través de Google (smtp.gmail.com),
 * para que llegue a la bandeja de entrada con SPF/DKIM/DMARC correctos.
 *
 * La configuración con la contraseña va en un archivo aparte,
 * contact-config.php, que NO se sube al repositorio (ver .gitignore).
 * Copia contact-config.example.php a contact-config.php y rellénalo.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond($ok, $error = null, $code = 200) {
    http_response_code($code);
    $out = array('ok' => $ok);
    if ($error !== null) { $out['error'] = $error; }
    echo json_encode($out);
    exit;
}

/* --- Cargar configuración (con secretos, fuera del repo) --- */
$configFile = __DIR__ . '/contact-config.php';
if (!is_readable($configFile)) {
    error_log('contact.php: falta contact-config.php');
    respond(false, 'El formulario no está configurado todavía.', 500);
}
$cfg = require $configFile;
if (!is_array($cfg) || empty($cfg['smtp_pass']) || $cfg['smtp_pass'] === 'xxxxxxxxxxxxxxxx') {
    error_log('contact.php: contact-config.php sin smtp_pass');
    respond(false, 'El formulario no está configurado todavía.', 500);
}
$cfg += array(
    'smtp_host' => 'smtp.gmail.com',
    'smtp_port' => 587,
    'mail_to' => $cfg['smtp_user'],
    'mail_from' => $cfg['smtp_user'],
    'mail_from_name' => 'Web SilvIA',
    'subject_prefix' => '[Contacto web]',
);

/* --- Solo POST --- */
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

/* --- Límite básico por IP (5 envíos / 10 min) con un archivo temporal. --- */
$ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
$throttleFile = sys_get_temp_dir() . '/silvia_contact_' . md5($ip) . '.txt';
$now = time();
$hits = array();
if (is_readable($throttleFile)) {
    $prev = @file_get_contents($throttleFile);
    if ($prev !== false && $prev !== '') {
        foreach (explode(',', $prev) as $t) {
            $t = (int) $t;
            if ($t > $now - 600) { $hits[] = $t; }
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
    return trim(str_replace(array("\r", "\n"), ' ', $s));
}
$safeEmail = oneLine($email);
$safeName  = oneLine($name);

/* --- Componer el correo (texto plano, UTF-8) --- */
$bodyLines = array(
    'Nuevo mensaje desde el formulario de contacto de la web.',
    '',
    'Nombre:        ' . $name,
    'Email:         ' . $email,
    'Organización:  ' . ($organization !== '' ? $organization : '(sin especificar)'),
    'Sector:        ' . ($sector !== '' ? $sector : '(sin especificar)'),
    'Territorio:    ' . ($territory !== '' ? $territory : '(sin especificar)'),
    'Idioma web:    ' . ($lang !== '' ? $lang : 'es'),
    '',
    'Mensaje:',
    ($message !== '' ? $message : '(sin mensaje)'),
    '',
    '— Enviado automáticamente desde silviaearth.com',
);
$body = implode("\n", $bodyLines);

$subjectText = $cfg['subject_prefix'] . ' '
    . ($organization !== '' ? $organization . ' — ' : '') . $safeName;

/* --- Enviar por SMTP autenticado (Google) --- */
$err = '';
$sent = smtp_send($cfg, $cfg['mail_to'], $subjectText, $body, $safeName, $safeEmail, $err);

if (!$sent) {
    error_log('contact.php: fallo SMTP: ' . $err);
    respond(false, 'No se pudo enviar el mensaje. Escríbenos a ' . $cfg['mail_to'] . '.', 502);
}

/* --- Registrar el envío para el límite por IP (best-effort) --- */
$hits[] = $now;
@file_put_contents($throttleFile, implode(',', $hits), LOCK_EX);

respond(true);


/* ================================================================== */
/*  Cliente SMTP mínimo con STARTTLS + AUTH LOGIN (sin dependencias)   */
/* ================================================================== */

function mimeEncodeHeader($s) {
    // Codifica solo si hay caracteres no ASCII.
    if (preg_match('/[^\x20-\x7E]/', $s)) {
        return '=?UTF-8?B?' . base64_encode($s) . '?=';
    }
    return $s;
}

function smtp_send($cfg, $to, $subject, $body, $replyToName, $replyToEmail, &$err) {
    $host = $cfg['smtp_host'];
    $port = (int) $cfg['smtp_port'];
    $timeout = 20;

    $transport = ($port === 465) ? 'ssl://' : 'tcp://';
    $fp = @stream_socket_client($transport . $host . ':' . $port, $errno, $errstr, $timeout);
    if (!$fp) { $err = "conexión ($errno): $errstr"; return false; }
    stream_set_timeout($fp, $timeout);

    $read = function () use ($fp) {
        $out = '';
        while (($line = fgets($fp, 515)) !== false) {
            $out .= $line;
            // La última línea de una respuesta SMTP tiene un espacio en la 4ª posición.
            if (strlen($line) < 4 || $line[3] === ' ') { break; }
        }
        return $out;
    };
    $send = function ($cmd) use ($fp) { fwrite($fp, $cmd . "\r\n"); };
    $code = function ($resp) { return (int) substr($resp, 0, 3); };

    $r = $read();               if ($code($r) !== 220) { $err = trim($r); fclose($fp); return false; }
    $send('EHLO silviaearth.com'); $r = $read(); if ($code($r) !== 250) { $err = trim($r); fclose($fp); return false; }

    if ($port !== 465) {
        $send('STARTTLS'); $r = $read(); if ($code($r) !== 220) { $err = trim($r); fclose($fp); return false; }
        $crypto = STREAM_CRYPTO_METHOD_TLS_CLIENT;
        if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
            $crypto |= STREAM_CRYPTO_METHOD_TLSv1_1_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
        }
        if (!@stream_socket_enable_crypto($fp, true, $crypto)) { $err = 'STARTTLS falló'; fclose($fp); return false; }
        $send('EHLO silviaearth.com'); $r = $read(); if ($code($r) !== 250) { $err = trim($r); fclose($fp); return false; }
    }

    $send('AUTH LOGIN'); $r = $read(); if ($code($r) !== 334) { $err = trim($r); fclose($fp); return false; }
    $send(base64_encode($cfg['smtp_user'])); $r = $read(); if ($code($r) !== 334) { $err = trim($r); fclose($fp); return false; }
    $send(base64_encode($cfg['smtp_pass'])); $r = $read(); if ($code($r) !== 235) { $err = 'auth: ' . trim($r); fclose($fp); return false; }

    $from = $cfg['mail_from'];
    $send('MAIL FROM:<' . $from . '>'); $r = $read(); if ($code($r) !== 250) { $err = trim($r); fclose($fp); return false; }
    $send('RCPT TO:<' . $to . '>');     $r = $read(); if ($code($r) !== 250) { $err = trim($r); fclose($fp); return false; }
    $send('DATA');                      $r = $read(); if ($code($r) !== 354) { $err = trim($r); fclose($fp); return false; }

    $headers  = 'From: ' . mimeEncodeHeader($cfg['mail_from_name']) . ' <' . $from . ">\r\n";
    $headers .= 'To: <' . $to . ">\r\n";
    $headers .= 'Reply-To: ' . mimeEncodeHeader($replyToName) . ' <' . $replyToEmail . ">\r\n";
    $headers .= 'Subject: ' . mimeEncodeHeader($subject) . "\r\n";
    $headers .= 'Date: ' . date('r') . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "Content-Transfer-Encoding: 8bit\r\n";

    // Normaliza a CRLF y aplica "dot-stuffing" (líneas que empiezan por '.').
    $payload = $headers . "\r\n" . $body;
    $payload = str_replace("\r\n", "\n", $payload);
    $payload = str_replace("\n", "\r\n", $payload);
    $payload = preg_replace('/^\./m', '..', $payload);

    fwrite($fp, $payload . "\r\n.\r\n");
    $r = $read(); if ($code($r) !== 250) { $err = trim($r); fclose($fp); return false; }

    $send('QUIT');
    fclose($fp);
    return true;
}
