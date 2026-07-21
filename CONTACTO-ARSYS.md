# Formulario de contacto en Arsys

El formulario de la web envía los mensajes a través de **`contact.php`**, un
script PHP sin dependencias pensado para el alojamiento compartido de Arsys.
No necesita Node, ni npm, ni ningún proceso corriendo: Arsys ejecuta el PHP
cada vez que alguien envía el formulario.

## Puesta en marcha (una sola vez)

1. **Crea el buzón remitente en el panel de Arsys.**
   El script envía *desde* `noreply@silviaearth.com`. Crea esa cuenta (o
   cámbiala en `contact.php`, constante `MAIL_FROM`). Debe ser una dirección
   real de tu dominio: los servidores rechazan correos con remitentes falsos.

2. **Sube los archivos de la web a tu hosting de Arsys**, incluyendo
   `contact.php`, tal cual, en la misma carpeta que los `.html`.

3. **Comprueba el destino.** Por defecto los mensajes llegan a
   `info@silviaearth.com` (constante `MAIL_TO` en `contact.php`).

Eso es todo. El formulario apunta a `contact.php` con una ruta relativa
(`data-endpoint="contact.php"`), así que funciona sin configurar CORS porque
web y script están en el mismo dominio.

## Configuración (`contact.php`, arriba del todo)

| Constante         | Para qué sirve                                    |
|-------------------|---------------------------------------------------|
| `MAIL_TO`         | Buzón que recibe los mensajes.                    |
| `MAIL_FROM`       | Remitente. Cuenta REAL de tu dominio en Arsys.    |
| `MAIL_FROM_NAME`  | Nombre visible del remitente.                     |
| `SUBJECT_PREFIX`  | Prefijo del asunto del correo.                    |

## Qué incluye el script

- Envío por la función `mail()` de PHP (estándar en Arsys).
- **Honeypot** anti-spam (campo oculto `company_website`).
- **Límite por IP**: 5 envíos cada 10 minutos.
- **Validación** de nombre, email y mensaje/territorio.
- **Protección contra inyección de cabeceras** en los campos del correo.
- El email del visitante se pone como `Reply-To`, así respondes con un clic.

## Si algún día sirves la web desde otro dominio (p. ej. GitHub Pages)

Entonces el formulario haría una petición entre dominios y habría que:

1. Poner en `data-endpoint` la URL completa del PHP en Arsys
   (`https://silviaearth.com/contact.php`).
2. Añadir en `contact.php` la cabecera
   `Access-Control-Allow-Origin` con el origen de la web.

Para el montaje actual (todo en Arsys) no hace falta nada de esto.

## Comprobar que funciona

Abre la página de contacto, rellena el formulario y envíalo. Debe aparecer
«¡Gracias! Te responderemos pronto.» y llegar el correo a `MAIL_TO`. Si no
llega, revisa en el panel de Arsys que la cuenta `MAIL_FROM` existe y que el
envío de correo por PHP está habilitado en tu plan.
