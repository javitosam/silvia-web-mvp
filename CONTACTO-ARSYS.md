# Formulario de contacto (Arsys + envío por Google)

El formulario de la web envía los mensajes a través de **`contact.php`**, un
script PHP sin dependencias que se aloja en el hosting de Arsys. Para que los
correos lleguen a la **bandeja de entrada** de `info@silviaearth.com` (Google
Workspace), el envío se hace por **SMTP autenticado de Google**
(`smtp.gmail.com`), no con el `mail()` de Arsys. Así el correo va firmado por
Google y pasa SPF/DKIM/DMARC.

## Resumen de archivos

| Archivo | Qué es | ¿Va al repo? |
|---|---|---|
| `contact.php` | Recibe el formulario y envía el correo por SMTP. | Sí |
| `contact-config.example.php` | Plantilla de configuración. | Sí |
| `contact-config.php` | Tu configuración real **con la contraseña**. | **No** (`.gitignore`) |

## Puesta en marcha (una sola vez)

### 1. Genera una "contraseña de aplicación" en Google

La cuenta que envía es `info@silviaearth.com` (tu cuenta de Workspace). Google
no deja usar tu contraseña normal desde un script; hay que crear una
**contraseña de aplicación**:

1. Entra en la cuenta de Google de `info@silviaearth.com`.
2. Activa la **Verificación en 2 pasos** (si no lo está):
   `Cuenta de Google → Seguridad → Verificación en 2 pasos`.
3. Ve a **Contraseñas de aplicaciones**:
   `Cuenta de Google → Seguridad → Contraseñas de aplicaciones`
   (o entra directamente en https://myaccount.google.com/apppasswords).
4. Crea una nueva (nombre libre, p. ej. «Web SilvIA»). Google te da una
   clave de **16 letras**. Cópiala.

> Si no aparece «Contraseñas de aplicaciones», el administrador de Workspace
> debe permitirlas en la consola de administración. Con la Verificación en 2
> pasos activada suele salir directamente.

### 2. Crea tu `contact-config.php`

1. Copia `contact-config.example.php` a **`contact-config.php`**.
2. Rellena:
   - `smtp_user` → `info@silviaearth.com`
   - `smtp_pass` → la contraseña de aplicación de 16 letras (los espacios dan
     igual, puedes quitarlos)
   - `mail_to` → `info@silviaearth.com` (dónde recibes los formularios)
   - `mail_from` → `info@silviaearth.com` (debe ser la misma cuenta o un alias
     verificado suyo)

### 3. Sube los archivos a Arsys

Sube toda la web **incluyendo `contact.php` y `contact-config.php`** en la
misma carpeta que los `.html`. (El `contact-config.php` no está en el repo, lo
subes tú manualmente por FTP o por el gestor de archivos de Arsys.)

Listo. El formulario apunta a `contact.php` con ruta relativa
(`data-endpoint="contact.php"`), así que funciona sin CORS.

## Qué incluye el script

- Envío por **SMTP autenticado** (STARTTLS en el puerto 587) — sin librerías.
- **Honeypot** anti-spam (campo oculto `company_website`).
- **Límite por IP**: 5 envíos cada 10 minutos.
- **Validación** de nombre, email y mensaje/territorio.
- **Protección contra inyección de cabeceras**.
- El email del visitante se pone como `Reply-To`: respondes con un clic.

## Comprobar que funciona

Abre la página de contacto, rellena el formulario y envíalo. Debe aparecer
«¡Gracias! Te responderemos pronto.» y llegarte el correo a
`info@silviaearth.com` (lo verás en Gmail).

Si no llega:
- Revisa que la **contraseña de aplicación** es correcta y está en
  `contact-config.php`.
- Revisa que tu plan de Arsys **permite conexiones salientes al puerto 587**
  (la mayoría sí). Si Arsys bloquea el 587, cambia en `contact-config.php`
  `smtp_port` a `465` (el script también lo soporta, con SSL directo).
- Mira el log de errores de PHP en el panel de Arsys: el script registra ahí
  el detalle del fallo SMTP.
