# Plan de fusión: index-10.html (Downloads) → sitio del proyecto

Fecha: 2026-07-06. Comparación de `C:\Users\R901672\Downloads\index-10.html` (500 KB, fichero único con todo el sitio, imágenes embebidas en base64 y 127 KB de JS inline) contra las 8 páginas del proyecto.

## Diagnóstico general

- El adjunto es un **single-file** con todas las páginas fusionadas, estilo propio inline (39 KB CSS), JS de navegación SPA y las fotos del equipo embebidas como data-URIs. Como arquitectura es despreciable: el proyecto multipágina con `silvia.css` es superior.
- El **contenido de las páginas de sectores (Administraciones, Aseguradoras, Empresas, Utilities) es verbatim idéntico** en ambas versiones. Ahí no hay nada que migrar.
- La info nueva y buena del adjunto está en: ubicación (Leganés), sección "Nuestra misión", sección "Dónde estamos" en Contacto, y el selector de idiomas.

## ✅ Información BUENA del adjunto (incorporar)

1. **Ubicación: Leganés, no Barcelona** — la actualización más importante y transversal.
   - Footer de las 8 páginas: `© 2026 SilvIA S.L. · Barcelona` → `© 2026 SilvIA S.L. · Leganés, Madrid`.
   - `quienes-somos.html` intro: "desde Barcelona" → "desde Leganés (Madrid)".

2. **Contacto: nueva sección "Dónde estamos"** (no existe en el proyecto).
   - Título: "Estamos en Leganés Tecnológico."
   - Texto: oficina en el C3N-IA, incubadora del Parque Científico de la UC3M.
   - Tarjeta: "C3N-IA · Parque Científico UC3M — Avenida Gregorio Peces-Barba, 1, 28919 Leganés, Madrid (España) — Oficina 1.1.b.07" + botón "Cómo llegar" (enlace a mapas).

3. **Quiénes somos: nueva sección "Nuestra misión"** ("Nace del dato. Existe por los bosques.") — 3 párrafos: origen (frustración con herramientas dispersas), propósito (proteger a España de los grandes incendios), y límite (no sustituir a quienes conocen el territorio). Encaja con el tono del sitio; incorporar entre el hero y "El equipo".

4. **Selector de idiomas EN/ES/FR/PT** en la cabecera — decisión pendiente: solo tiene sentido si de verdad va a haber traducciones. Si no, despreciar.

## ⚠️ Dudoso (decidir con el usuario)

- **Nombres del equipo acortados** en el adjunto ("Alejandro Cano", "Armando Navarro", "Rafael Dias") vs. nombres completos en el proyecto ("Alejandro Cano Rojas", "Armando Navarro Morales", "Rafael Dias Ribeiro de Almeida"). ¿Simplificación deliberada o pérdida? Mantener proyecto salvo indicación.

## ❌ Despreciable del adjunto (NO migrar)

- **Toda la portada (home)**: es una versión ANTERIOR y más débil que la del proyecto:
  - Le falta la sección "El núcleo de SilvIA" (motor de riesgo con KPIs AUC ≥ 0.75, < 60 min, 375 m, 24/7) — el corazón del mensaje actual.
  - Su hero es más plano ("SilvIA convierte datos satelitales…" vs. "SilvIA anticipa el riesgo de incendio… confianza explícita").
  - En "Para quién" **le falta la tarjeta de Utilities** (solo 3 tarjetas; el proyecto tiene 4).
  - Incluye "Cómo hablamos" (Claro/Riguroso/Fiable) en la home; el proyecto lo tiene mejor ubicado en Quiénes somos.
- **Plataforma**: los textos del adjunto están recortados — el proyecto conserva detalles valiosos que el adjunto perdió (clasificación mensual Bosque/No bosque/Degradado con NDVI y NBR; ejemplo "85 % de confianza"; redacción completa de "áreas de interés (AOI)"). Mantener proyecto.
- **Arquitectura single-file**: CSS inline, JS SPA, imágenes base64 → despreciar por completo.
- Eyebrow del hero "Monitorización forestal con IA" (el proyecto usa "Monitorización forestal predictiva", más alineado con el posicionamiento).

## Orden de ejecución propuesto

1. Footer Leganés en las 8 páginas (buscar/reemplazar).
2. `quienes-somos.html`: intro Leganés + sección "Nuestra misión".
3. `contacto.html`: sección "Dónde estamos" con estilo silvia.css.
4. Decidir idiomas y nombres del equipo con el usuario.
