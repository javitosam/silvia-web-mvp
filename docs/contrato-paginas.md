# Contrato de páginas — Web SilvIA

Reglas vinculantes para cada página. El design system vive en `assets/css/silvia.css` y `assets/js/silvia.js`. La referencia canónica de nav, footer y head es `index.html`: **copia su nav y su footer EXACTOS** y ajusta solo `aria-current`/clase `active` del enlace de tu página.

## Archivos del sitio
```
index.html  administraciones.html  aseguradoras.html  empresas.html
utilities.html  plataforma.html  contacto.html
assets/css/silvia.css   assets/js/silvia.js
assets/ (logos, favicon.png, fotos equipo)
```
Enlaces SIEMPRE relativos (`administraciones.html`, `assets/...`).

## Head obligatorio (adaptar título/description por página)
```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[Título específico] — SilvIA</title>
<meta name="description" content="[140-160 caracteres específicos de la página]">
<link rel="icon" type="image/png" href="assets/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/silvia.css">
</head>
```
Antes de `</body>`: `<script src="assets/js/silvia.js"></script>`.
Tras `<body>`: `<a class="skip-link" href="#contenido">Saltar al contenido</a>`, y el `<main id="contenido">`.

## Estructura de una página de segmento
> **Design system v2 (jul 2026)**: lenguaje "instrumento cartográfico". SIN chips de icono en tarjetas (nada de `.fi`/`.icon` — jerarquía por tipografía y numeración mono). Los `.stat` son lecturas de instrumento (filete izquierdo, sin caja). Botones rectangulares, no píldora.
1. `header.sub-hero` (variante `ink` | `green` | `dark` — cada página una distinta, ver abajo) con: `.sub-back` a index, `.eyebrow` con `.pulse-dot`, `h1` (único de la página), párrafo, `.stats` con 3 `.stat` (cifras del brief).
2. 2–3 `section.feat` con `.feat-head` (`.section-label` + `h2` + `p`) y `.feat-grid` de 3–4 `.feat-card` (`<span class="tag">` mono como PRIMER hijo, luego `h3`, luego `p` — sin iconos).
3. Opcional y recomendado: `.case-quote` (cita/caso de referencia) o `.steps` (proceso numerado) — componentes ya en el CSS.
4. `section.plan` con `.plan-box` (plan recomendado + botón a contacto.html).
5. `section.cta` final idéntica a la de index.html.
6. `footer` idéntico al de index.html.

Variantes de sub-hero: administraciones=`ink`, aseguradoras=`green`, empresas=`dark`, utilities=`ink`, plataforma=`dark`, contacto=`green`.

## Reglas duras
- **Honestidad**: los datos marcados en el brief como "referencia del sector" (Tahoe Donner, CapsNet-AGSO, 300.000 M$…) se atribuyen como tales; NUNCA como resultados de SilvIA. Está prohibido inventar cifras, clientes o testimonios.
- **Ortografía**: español impecable, con todas las tildes y signos de apertura ¿¡.
- **Accesibilidad**: un solo `h1`; jerarquía de encabezados sin saltos; `alt` descriptivo en imágenes (o `alt=""` + `aria-hidden` si decorativas); los SVG decorativos con `aria-hidden="true"`; enlace activo del nav con `aria-current="page"`.
- **Sin estilos nuevos**: no añadir `<style>` ni CSS inline (excepto posicionamiento puntual de `.dots`, como hace index.html). Si falta un componente, usa el más cercano del sistema.
- **Animaciones**: usa `.reveal` (+ `.d1/.d2/.d3/.d4`) en secciones y tarjetas; el JS ya las activa. Nada de librerías externas.
- **Cifras**: usa `.stat b` y `.tag` para datos (llevan fuente mono automáticamente). Formato español: 300.000 M$, 97 %, ≤ 24 h.
- **CTAs**: botón primario → `contacto.html`; email siempre info@silviaearth.com.
- Longitud objetivo por página: 250–420 líneas HTML. Legible, aireado, sin muros de texto.
