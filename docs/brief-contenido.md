# Brief de contenido — Web SilvIA

Fuentes: `docs/product-definition-es.txt` (PDF definición de producto, 27 págs.) y volcado de la web anterior (`C:\Users\User\Downloads\silvia_web_dump\pages\es*.txt`). No inventar datos: todo claim debe rastrearse a una de las dos fuentes.

## 1. Marca y tono

- **SilvIA** — "Inteligencia para los bosques". Plataforma de monitorización forestal con IA que convierte datos de observación de la Tierra en decisiones claras.
- Tres pilares de producto: **SilvIA Earth** (mapas y alertas continuas), **SilvIA Analysis** (analítica profunda bajo demanda), **SilvIA AI Assistant** (traduce métricas a lenguaje claro).
- Capa transversal: **Risk Mitigation Model** (seguros, finanzas, cumplimiento).
- Tono: claro, riguroso, fiable. Frases cortas. Sin hype. Patrón distintivo de la marca: afirmar una capacidad y explicitar también **lo que NO prometemos** ("Apoyo a la decisión, no autoridad decisional"; "no ocultamos la incertidumbre"). Público institucional: administraciones públicas y aseguradoras leen esta web.
- Español correcto CON TODAS LAS TILDES (la versión anterior las omitía; corregir siempre).
- Email: info@silviaearth.com · Web: silviaearth.com · Barcelona, España. © 2026 SilvIA S.L.

## 2. Datos duros verificados (usar con su atribución)

### Claims propios de SilvIA (afirmables en primera persona)
- Clasificación de cubierta forestal ~**97 %** de precisión (Sentinel-2/Landsat).
- Alertas: ≤ **24 h** tras adquisición óptica; **minutos** para anomalías térmicas; capa NRT hasta cada **30 min** (plan Premium).
- Detección **24/7** con radar SAR (Sentinel-1): atraviesa nubes, funciona de noche.
- Térmico **VIIRS 375 m** (vs. MODIS 1 km) para focos incipientes, también nocturnos.
- Biomasa y stock de carbono a **30 m** de resolución (LiDAR espacial GEDI/ICESat-2 + Landsat/Sentinel).
- Clasificación Bosque / No bosque / Bosque degradado con actualización mensual; índices NDVI y NBR; algoritmos LandTrendr/BFAST.
- Fusión multisensor (óptico + SAR + LiDAR + térmico): el diferenciador central.
- Datos abiertos: Copernicus, NASA/USGS; opción submétrica (PlanetLabs).
- Rendimiento del sistema (KPIs de la web anterior): alertas en < 60 min, IoU ≥ 0.70 clasificación forestal, AUC ≥ 0.75 predicción de incendios; uptime SLA > 99 %.
- AI Assistant: siempre reporta confianza/incertidumbre (ej. "85 % de confianza en la identificación de especie").
- Exportación GIS (GeoTIFF), CSV, informes automatizados; API de emergencia (F10); motor de riesgo (F11); previsión de tendencias (F12).

### Referencias del sector (atribuir SIEMPRE como caso/estudio externo, nunca como resultado de SilvIA)
- **Caso Tahoe Donner (California)**: tratamientos preventivos verificados tecnológicamente sobre 1.500 acres → **−39 % prima**, **−89 % franquicia**. Formular como "un caso de referencia del sector demuestra que…".
- Framework de investigación CapsNet-AGSO: recuperación del 95,65 % de incendios incipientes (desde 0,1 ha) con 3,2 % de falsas alarmas. Formular como "la literatura científica reciente demuestra que es posible…".
- Pérdidas globales por desastres naturales > **300.000 M$/año**.
- Buffer pools tradicionales del mercado de carbono retienen solo 10–20 % de los créditos.
- EUDR: sanciones de hasta el **4 % del volumen de negocio anual** en la UE; corte de deforestación 31-dic-2020; aplicación 30-dic-2025 (pymes: mediados de 2026).

## 3. Contenido por página

### administraciones.html — Administraciones públicas
Audiencia: agencias forestales/ambientales, unidades de prevención y extinción, gestores de territorio público, ONG ambientales.
- Dolores: vigilancia reactiva, territorio enorme con medios limitados, datos dispersos.
- Capacidades: detección NRT de tala ilícita/deforestación/incendios con alertas georreferenciadas; motor de riesgo de incendio predictivo (combustible+topografía+clima); conciencia situacional en emergencias (VIIRS + estrés hídrico, líneas de defensa, evacuaciones en interfaz urbano-forestal, apoyo a medios aéreos); seguimiento NDVI del éxito de políticas de reforestación; **gemelos digitales** del territorio (simulación: p. ej. cómo cambia la propagación si se retira el 30 % del sotobosque); API de emergencia para centros de mando.
- Plan: Premium institucional.

### aseguradoras.html — Aseguradoras y finanzas
Audiencia: aseguradoras, reaseguradoras, suscriptores de carbono, bancos, fondos (TNFD/ESG).
- Dolores: ajuste de siniestros lento y subjetivo; retirada de zonas de alto riesgo; riesgo de reversión del carbono; presión regulatoria de divulgación.
- Capacidades: **seguros paramétricos** (índice NBR de área quemada como disparador objetivo → liquidación en horas/días, no meses); modelado probabilístico de pérdidas y precios dinámicos (F11+F12); **dMRV de permanencia de carbono** (cuantificación inmediata del tonelaje perdido vs. línea base dinámica; actores del sector: Oka, Howden, Descartes); auditoría de carteras TNFD (HMI, fragmentación, NDVI); **Bonos de Resiliencia Forestal** (pay-for-success verificado por SilvIA).
- Prueba social: caso Tahoe Donner (como referencia del sector).

### empresas.html — Empresas y particulares
Nombre oficial del segmento: **"Empresas y particulares"** (decisión de julio 2026: los propietarios individuales se atienden DENTRO de esta página, sin subpágina separada — el PDF no da contenido suficiente para una página propia de particulares).
Audiencia: importadores sujetos a EUDR (madera, caucho, soja, café, cacao, vacuno, palma), madereras, desarrolladores de proyectos de carbono, corporaciones, propietarios particulares de terreno forestal (entrada: plan básico gratuito).
- Capacidades: **cumplimiento EUDR** (trazabilidad de parcelas contra imágenes de 2020, scoring de proveedores bajo/estándar/alto a nivel de lote, DDS automatizada, integración API con ERP y TRACES NT); **inventario de biomasa** 30 m para MRV/REDD+ y certificación de adicionalidad; detección temprana de plagas/sequía/degradación (ej. nematodo del pino con Faster R-CNN); series históricas de décadas para línea base; exportación GIS/CSV/informes.
- Escala: del propietario individual (plan básico) a la corporación (Premium).

### utilities.html — Utilities y energía [PÁGINA NUEVA]
Audiencia: eléctricas, operadores de red, gestores de infraestructura lineal.
- Dolores: la infraestructura eléctrica es uno de los mayores vectores antropogénicos de ignición; pasivos legales multimillonarios; primas astronómicas (casos notorios en California).
- Capacidades: **gestión inteligente de la vegetación** en derechos de vía (detección de biomasa invasiva y arbolado muerto junto al cableado → cuadrillas con precisión quirúrgica); **optimización de cortes preventivos (PSPS)**: alcance temporal y geográfico ajustado con humedad de suelo, NDVI y viento a nivel de circuito → menos clientes sin luz, menos penalizaciones; monitorización continua del corredor; priorización de inversión en poda/soterramiento con scoring de riesgo.

### plataforma.html — Plataforma y metodología
- Los 3 pilares en detalle (Earth / Analysis / AI Assistant, ver §1 y §2).
- Metodología: ingesta (Copernicus, USGS, PlanetLabs) → fusión multisensor → modelos (clasificación, detección de anomalías, LandTrendr/BFAST, motor de riesgo) → interpretación con confianza explícita → entrega (GIS web con OpenLayers, API, informes).
- Validación: verdad de campo, datasets de referencia, feedback de pilotos; límites reconocidos.
- Bloque de confianza ("Lo que no hacemos"): no prometemos detección perfecta; no ocultamos incertidumbre tras un único score; no reemplazamos la verificación en campo ni los sistemas oficiales de alerta; apoyo a la decisión, no autoridad decisional.
- Planes (sin precios; cualitativo): Básico (público general) / Medio (estudiantes e investigadores) / Premium (agencias, aseguradoras, corporaciones) — diferencias: profundidad de análisis AOI, alertas, frecuencia (diaria/semanal vs NRT 30 min), histórico, F11/F12, Assistant, API.

### contacto.html — Contacto
- Sin formulario falso: CTA de email prominente (info@silviaearth.com) + "qué pasa después" en 3 pasos: (1) cuéntanos qué territorio gestionas, (2) te enseñamos SilvIA sobre tus propios bosques, (3) definimos un piloto con métricas de éxito. Barcelona, España.

### index.html — Portada (ya escrita; no tocar)
Hero + intro pilares + 4 tarjetas de audiencia + valores + equipo + CTA.

## 4. Equipo (actualizado el 2-jul-2026 desde silviaearth.com; fotos en assets/; vive en quienes-somos.html, NO en la portada)
- Alejandro Cano Rojas (alex2.jpg): CEO
- Armando Navarro Morales (armando2.jpg): CMO
- Javier Chaves (javier.jpg): CFO
- Rafael Dias Ribeiro de Almeida (rafael.jpg): CTO
- David Arias (david.png): Head of AI Engineering
- Eneko González (eneko.jpg): Product Advisor
- Rubén Rodríguez (ruben.jpg): Full-Stack Developer
Sin bios inventadas: solo nombre completo y cargo (la web oficial no publica más).

## 5. Reglas de estilo tipográfico añadidas
- PROHIBIDO el guion largo (rayas) en todo el copy y títulos: usar coma, dos puntos, paréntesis o punto. En títulos de página, separador "·" (p. ej. "Contacto · SilvIA").
- Nada de mockups falsos de producto (mapas, dashboards inventados) NI ilustraciones vectoriales de escenas (dan "vibes de IA"): solo visualizaciones honestas rotuladas como ilustrativas (p. ej. la curva del índice de ignición) o IMÁGENES REALES con licencia limpia.
- Imagen del hero: `assets/hero-sat.jpg` (bosque de Białowieża, Sentinel-2). Licencia de atribución Copernicus/UE: mantener SIEMPRE el crédito visible ("Sentinel-2 · Copernicus / UE · Bosque de Białowieża"). Si se sustituye, usar solo Sentinel (atribución) o Landsat/NASA (dominio público) y acreditar igual.
