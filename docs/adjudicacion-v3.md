# Adjudicación v3 (Series A) — instrucciones vinculantes por archivo

Decisiones ya tomadas por el orquestador sobre el backlog de auditoría. El CSS y el JS YA están actualizados: no tocar `assets/css/silvia.css` ni `assets/js/silvia.js`. Español impecable con tildes. PROHIBIDO el guion largo (raya): comas, dos puntos o paréntesis. No tocar nada fuera de tu lista.

## TRATAMIENTOS COMUNES (aplícalos en TUS archivos)
- **A. Dots**: eliminar TODOS los `<div class="dots" ...>...</div>` (el CSS ya no existe).
- **B. Pulse-dot**: eliminar `<span class="pulse-dot"></span>` del eyebrow en TODAS las páginas EXCEPTO index.html.
- **C. Tags**: eliminar TODOS los `<span class="tag">...</span>` de las feat-cards (el CSS ya no existe).
- **D. Códigos internos**: purgar toda mención "F11", "F12", "(F11 + F12)", "F11+F12" dejando los nombres descriptivos (motor/puntuación de riesgo, previsión de tendencias).
- **E. Fuentes**: en la línea de Google Fonts, `family=Alexandria:wght@400;500;600;700` → `family=Alexandria:wght@500;600`.
- **F. Section-label** (solo 4 páginas de audiencia): "Qué hacemos por ti" → "Capacidades".
- **G. CTA duplicado** (solo 4 páginas de audiencia): eliminar la `section.cta` COMPLETA del final (el plan-box queda como cierre, luego footer).

## index.html (escritor 1)
1. Eyebrow → máquina de escribir. Sustituir el eyebrow actual por:
```html
<span class="eyebrow anim"><span class="pulse-dot"></span>Monitorización forestal <span class="type-word" data-words='["predictiva.","fiable.","en tiempo real.","sostenible.","automatizada.","inteligente."]'>predictiva.</span><span class="type-cursor" aria-hidden="true"></span></span>
```
2. Imagen hero sin descarga en móvil: sustituir `<img src="assets/hero-sat.jpg" alt="">` por:
```html
<picture><source media="(min-width:1151px)" srcset="assets/hero-sat.jpg"><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="" fetchpriority="high"></picture>
```
3. Eliminar la sección "Cómo hablamos" (`section.how`) COMPLETA. Mover su enlace "Conoce al equipo detrás de SilvIA" (con su svg) como `<div class="pillars-more reveal d4">...</div>` al final de la `section.aud`, tras el cierre de `.aud-grid`.
4. Eliminar los 4 `<span class="card-num">..</span>` de las tarjetas de audiencia.
5. CTA final: h2 "Actúa antes de que sea irreversible." → "Actúa antes de que empiece el incendio."
6. Párrafo `.lede` del core: añadir al final: ` La detección tradicional tarda de media 48 horas. Los bosques no pueden esperar; SilvIA tampoco.`
7. Común: A (si queda alguno), E. El pulse-dot de index SE QUEDA.

## administraciones.html + empresas.html (escritor 2)
Común: A, B, C, D, E, F, G en ambos.
administraciones:
- El `<p class="reveal d2">Seis capacidades pensadas para...</p>` → `<p class="reveal d2">Capacidades de la alerta temprana a la simulación de intervenciones.</p>`
- El h2 de la sección de pasos ("De la ... a la ..." o "Cómo se integra") → `Así entra SilvIA en tu operativa.` (el h1 del hero NO se toca).
empresas:
- h1: `Tus bosques, bajo control.` → `Demuestra el origen. Anticipa el daño.`
- h2 de la sección de pasos → `El flujo EUDR, paso a paso.`
- Párrafo bajo ese h2: eliminar la frase final "Este es el proceso que sigue SilvIA para tu cumplimiento." (queda solo el dato EUDR con fechas y sanción).
- Tarjeta "Vista histórica de décadas", párrafo → `Series temporales de varias décadas para fijar la línea base de cada parcela y respaldar tus declaraciones de carbono y de cumplimiento con evidencia verificable.`
- En el h2 "De la parcela individual a la cartera corporativa completa." quitar "completa" (→ "...cartera corporativa.").
- El plan-box "Del propietario a la corporación" SE QUEDA como está.

## aseguradoras.html + utilities.html (escritor 3)
Común: A, B, C, D, E, F, G en ambos.
aseguradoras:
- `header class="sub-hero green"` → `header class="sub-hero ink"`.
- Eliminar el `<div class="stat">` de "Dinámico" completo (quedan 2 stats).
- Eliminar la feat-card entera de "Exposición ante un riesgo creciente" (la de los 300.000 M$).
- h2 de capacidades ("De ... a ...") → `Datos objetivos para suscribir, liquidar y auditar.`
- Párrafo bajo la cita Tahoe → `Caso Tahoe Donner (California). No es un resultado de SilvIA: ilustra el principio en que se apoya nuestra propuesta. Cuando la reducción de riesgo se verifica de forma independiente y continua, se puede premiar con mejores condiciones. SilvIA aporta esa capa de verificación.`
- Párrafo de bonos: → `Instrumentos de pago por resultados cuyo cumplimiento se verifica con monitorización independiente y continua, no con autodeclaraciones puntuales.`
utilities:
- Párrafo del hero → `Para eléctricas, operadores de red y gestores de infraestructura lineal: la vegetación junto a la red es uno de los principales vectores de ignición. SilvIA dirige la gestión de vegetación y los cortes preventivos con datos, no con calendarios.`
- h2 de capacidades → `La vegetación, priorizada por riesgo real.`
- Tarjeta derechos de vía, párrafo → `Detección de biomasa invasiva y arbolado muerto o estresado junto a las líneas, para dirigir cuadrillas justo donde el riesgo lo exige.`
- Párrafo del plan-box → `Puntuación dinámica de riesgo, capa NRT hasta cada 30 minutos e integración API con tus sistemas de gestión de activos.`
- En el párrafo o h2 de pasos, quitar el numeral "en cuatro pasos" (reformular sin contar).

## plataforma.html + contacto.html + quienes-somos.html (escritor 4)
Común: A, B, C, D, E (F y G no aplican: no son páginas de audiencia; la CTA de plataforma y quienes-somos SE QUEDA).
plataforma:
- En los 3 tiers, arreglar el botón anidado: eliminar el `<div class="btn">` envolvente dejando solo `<a class="btn btn-ghost" href="contacto.html">Hablar con el equipo</a>` (en el tier `rec`, `btn-primary`).
- Stat: "alertas en tiempo real" → "alertas casi en tiempo real".
- Párrafo del hero → `Lo que distingue a SilvIA es la fusión multisensor: óptico, radar, térmico y LiDAR, para que ni la nubosidad ni la noche dejen un vacío en la vigilancia del territorio.`
- Paso "Fusión multisensor", párrafo → `Óptico, radar, LiDAR y térmico combinados en una única serie de observación continua.`
- Párrafo "Cinco etapas..." → `De la ingesta a la entrega, con la confianza explícita en cada paso.`
- Sección compromiso: el `p` del `.feat-head` → `Señales para decidir mejor. No certezas absolutas.`
- NUEVA sección comparativa (tras la metodología, `section.feat` blanca o tint según alterne): `.feat-head` con section-label "Comparativa" y h2 `Qué cambia con SilvIA.`; luego `<div class="table-wrap"><table class="compare">` con cabecera `<th></th><th>Monitorización tradicional</th><th>SilvIA</th>` y 5 filas booleanas sacadas del namespace `comparison` del archivo `C:\Users\User\AppData\Local\Temp\claude\C--Users-User-Documents-Claude-Projects-Silvia-WEB\c1640130-c6e5-4792-978d-ac8d846fcfba\scratchpad\es_sections.json` (léelo; usa las 5 filas literales en español). Celdas booleanas: `<td class="c-no">✕</td>` para tradicional, `<td class="c-yes">✓</td>` para SilvIA (si alguna fila no es booleana en el original, usa su texto corto).
contacto:
- `header class="sub-hero green"` → `header class="sub-hero ink"`.
- Eliminar la franja `.stats` del hero completa.
- El párrafo "Tres pasos y ..." o equivalente con numeral → `Sin trámites de más.`
- "el territorio aproximado que gestionas, su extensión en hectáreas" → `qué territorio gestionas, su extensión aproximada en hectáreas y tu sector`.
quienes-somos:
- Eliminar la franja `.stats` del hero completa.
- `assets/david.png` → `assets/david.jpg`.
- A las 7 `<img>` del equipo: añadir `width="400" height="500" loading="lazy" decoding="async"` (las fotos ya están a 400x500).
- La sección "Cómo trabajamos" SE QUEDA (es ahora la única del sitio).

## Al terminar (cada escritor)
Verifica con grep en TUS archivos: 0 restos de `class="dots"`, `pulse-dot` (salvo index), `class="tag"`, `F11`, `F12`, `card-num` (index), guiones largos. Responde solo con: archivos tocados y checklist de ítems aplicados.
