<?php
/**
 * Configuración del formulario de contacto de SilvIA.
 *
 * CÓMO USARLO:
 *   1. Copia este archivo a  contact-config.php  (mismo directorio).
 *   2. Rellena tus datos reales abajo.
 *   3. Sube contact-config.php a Arsys junto a contact.php.
 *
 * IMPORTANTE: contact-config.php está en .gitignore y NO se sube al
 * repositorio, para que la contraseña no quede pública en GitHub.
 *
 * La contraseña es una "contraseña de aplicación" de Google (16 letras),
 * NO la contraseña normal de la cuenta. Ver CONTACTO-ARSYS.md.
 */

return array(
    // --- Servidor SMTP de Google (no lo cambies) ---
    'smtp_host' => 'smtp.gmail.com',
    'smtp_port' => 587,

    // --- Cuenta de Google Workspace que ENVÍA (autentica) ---
    'smtp_user' => 'info@silviaearth.com',
    'smtp_pass' => 'xxxxxxxxxxxxxxxx', // contraseña de aplicación de Google (16 caracteres)

    // --- Direcciones del correo ---
    'mail_to'        => 'info@silviaearth.com', // dónde RECIBES los formularios
    'mail_from'      => 'info@silviaearth.com', // debe ser la cuenta de arriba (o un alias suyo verificado)
    'mail_from_name' => 'Web SilvIA',
    'subject_prefix' => '[Contacto web]',
);
