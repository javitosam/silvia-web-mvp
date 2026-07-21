# Backend del formulario de contacto — SilvIA

Pequeño servicio Node/Express que recibe los envíos del formulario de contacto
(`POST /api/contact`) y los reenvía por correo mediante SMTP.

El sitio web es estático (GitHub Pages) y **no** puede ejecutar código de
servidor: este backend se despliega aparte (en vuestro servidor) y el
formulario le envía los datos por `fetch`.

## 1. Instalar

```bash
cd server
npm install
cp .env.example .env   # y rellena tus valores
```

## 2. Configurar (`.env`)

| Variable          | Qué es                                                        |
|-------------------|--------------------------------------------------------------|
| `PORT`            | Puerto en el que escucha (por defecto 3000).                 |
| `ALLOWED_ORIGINS` | Dominios del sitio autorizados (CORS), separados por comas.  |
| `MAIL_TO`         | Dirección que recibe los mensajes (info@silviaearth.com).    |
| `MAIL_FROM`       | Remitente de los correos.                                    |
| `SMTP_HOST/PORT`  | Servidor SMTP de vuestro proveedor de correo.                |
| `SMTP_SECURE`     | `true` para puerto 465, `false` para 587 (STARTTLS).         |
| `SMTP_USER/PASS`  | Credenciales SMTP. **Nunca** se suben al repositorio.        |

## 3. Arrancar

```bash
npm start        # producción
npm run dev      # desarrollo (recarga en caliente)
```

Comprueba que vive: `GET /health` → `{ "ok": true, ... }`.

## 4. Conectar el formulario

En las páginas de contacto, el formulario tiene un atributo `data-endpoint`.
Apúntalo a la URL pública de este backend, por ejemplo:

```html
<form class="contact-form" data-endpoint="https://api.silviaearth.com/api/contact">
```

(o dejarlo como `/api/contact` si sirves el sitio detrás del mismo dominio que
el backend mediante un proxy inverso).

## Detalles de seguridad

- **CORS** restringido a `ALLOWED_ORIGINS`.
- **Rate limiting**: 5 envíos por IP cada 10 minutos.
- **Honeypot**: campo oculto `company_website`; si viene relleno se descarta el
  envío silenciosamente (bots).
- Validación y saneado de todos los campos; el cuerpo se escapa en el HTML.
- Sin secretos en el código: todo va por variables de entorno.

## Despliegue

Sirve con cualquier proceso Node persistente (systemd, pm2, Docker, Render,
Railway, etc.). Ejemplo con pm2:

```bash
npm install -g pm2
pm2 start index.js --name silvia-contact
```

Recomendado ponerlo detrás de HTTPS (nginx/caddy) y exponer solo `/api/contact`
y `/health`.
