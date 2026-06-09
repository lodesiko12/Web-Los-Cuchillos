# Restaurante Los Cuchillos — sitio web

Sitio web estático (HTML/CSS/JS, sin build) para el **Restaurante Los Cuchillos** (Almansa,
Albacete · desde 1973). Diseño editorial oscuro y premium, bilingüe ES/EN.

## Estructura

```
index.html            Inicio (hero con slideshow, intro, platos, producto, CTA reserva)
carta.html            Carta completa con precios + bodega (índice sticky)
restaurante.html      Historia, filosofía y el espacio
contacto.html         Reservas (tel/WhatsApp), horario y mapa
aviso-legal.html      Aviso legal (LSSI)
privacidad.html       Política de privacidad (RGPD/LOPDGDD)
cookies.html          Política de cookies + botón para revocar consentimiento
404.html              Página de error personalizada
css/site.css          Sistema visual completo (tokens, componentes, responsive)
js/site.js            Interacción (nav, idioma, reveal, parallax, slideshow, horario, cookies, mapa)
js/menu.js            Lee la carta y el menú del día desde Google Sheets (CSV) y los pinta
data/carta.csv        Carta de EJEMPLO/respaldo (la real saldrá del Google Sheet)
data/menu-dia.csv     Menú del día de EJEMPLO/respaldo
data/GUIA-CARTA.md    Guía para el dueño: cómo editar carta y menú del día
assets/               Fotografía de producto y logo (WebP)
fonts/                Tipografías auto-alojadas (WOFF2) + fonts.css
sitemap.xml           Mapa del sitio para buscadores
robots.txt            Reglas de rastreo + referencia al sitemap
.htaccess             Caché, compresión y seguridad (solo Apache/Hostinger; GitHub lo ignora)
favicon.ico/.svg      Iconos del sitio (pestaña del navegador)
apple-touch-icon.png  Icono para iOS / accesos directos
og-image.jpg          Imagen 1200×630 al compartir en redes (WhatsApp, Facebook…)
_design-source/       Bundle de diseño original + transcripción del chat (referencia)
```

## Cómo verlo en local

No requiere build. Sírvelo con cualquier servidor estático, por ejemplo:

```bash
python -m http.server 8000
# y abre http://localhost:8000
```

(Abrir `index.html` con doble clic también funciona, salvo que algunos navegadores
restringen el mapa embebido bajo `file://`.)

## Publicar

Es un sitio 100% estático: sube el contenido de la carpeta (sin `_design-source/`) a
cualquier hosting estático (Hostinger, Netlify, GitHub Pages…) por drag & drop.

## Funcionalidad

- **Idioma ES/EN** client-side: cada texto traducible lleva `data-es` / `data-en`;
  la elección persiste en `localStorage` (`lc-lang`).
- **Hero** con slideshow en crossfade + Ken Burns (4,5 s por imagen).
- **Animaciones de aparición** y parallax suave; respetan `prefers-reduced-motion`.
- **Carta**: índice sticky con enlace activo según scroll.
- **Horario**: el día actual se resalta automáticamente.
- Reservas mediante enlaces `tel:` y `wa.me` (sin formulario, por decisión del cliente).

## SEO

El sitio incluye SEO técnico y local completo:

- **Títulos y meta-descripciones** únicos y con palabras clave locales (Almansa, cocina
  tradicional, arroces…) en cada página.
- **URL canónica**, `robots` y `theme-color` en cada página.
- **Open Graph + Twitter Card** con imagen `og-image.jpg` → vista previa al compartir el enlace.
- **Datos estructurados JSON-LD**: ficha `Restaurant` (NAP, horario, teléfono, geo, cocina,
  rango de precios, enlace a la carta, Instagram) en Inicio y Contacto, y `BreadcrumbList`
  (migas de pan) en las páginas internas. Esto habilita resultados enriquecidos en Google.
- **`sitemap.xml`** y **`robots.txt`**.
- **Core Web Vitals**: imágenes WebP con `width`/`height` (evita saltos de layout),
  `loading="lazy"` bajo el pliegue, `fetchpriority="high"` + `preload` en la imagen principal.

### ⚠️ Si cambias de dominio (importante)

Todo el SEO usa como base la URL **`https://lodesiko12.github.io/Web-Los-Cuchillos`**.
Cuando tengas tu dominio definitivo (p. ej. `https://www.loscuchillos.es`), haz un
**buscar y reemplazar** de esa cadena por la nueva en estos archivos:

```
index.html · carta.html · restaurante.html · contacto.html
aviso-legal.html · privacidad.html · cookies.html
sitemap.xml · robots.txt
```

(Reemplaza la base SIN barra final; el `/` de las rutas ya está puesto. Para el dominio raíz,
la home es `https://tudominio.com/` y las páginas `https://tudominio.com/carta.html`, etc.)

Después, en **Google Search Console**: añade la propiedad del dominio, verifícala y envía
`sitemap.xml`. Confirma también tu ficha de **Google Business Profile** (Perfil de Empresa)
con el mismo nombre, dirección y teléfono (NAP) — es lo que más posiciona a un restaurante local.

### Verificar antes de publicar
- Datos estructurados: [Rich Results Test](https://search.google.com/test/rich-results)
- Vista previa al compartir: [opengraph.xyz](https://www.opengraph.xyz/)
- Rendimiento: [PageSpeed Insights](https://pagespeed.web.dev/)

## Carta y menú del día editables (Google Sheets)

La **carta de comida** y el **menú del día** se generan dinámicamente desde un Google Sheet
publicado como CSV, para que el restaurante los edite sin tocar código (cambian a diario).

- **Cómo lo edita el dueño**: ver `data/GUIA-CARTA.md` (pensada para no técnicos).
- **Cómo se conecta** (una vez): publica las pestañas del Sheet como CSV
  (*Archivo → Compartir → Publicar en la web → CSV*) y pega las 2 URLs en
  `js/menu.js`, en `MENU_SOURCES` (arriba del archivo). Mientras tanto, usa los CSV de
  ejemplo en `data/`.
- **Qué es dinámico**: menú del día (Inicio + Carta) y la carta de comida
  (entrantes, guisos, arroces, carnes, pescados, postres).
- **Qué es estático**: la **bodega** (vinos), que cambia poco. Se puede pasar al Sheet si se desea.
- **Robustez**: estados de carga y de error; si el Sheet falla, muestra un aviso para llamar por
  teléfono en lugar de romperse. El índice de secciones y los datos estructurados `Menu` (SEO)
  se generan automáticamente desde los datos.
- **SEO**: el contenido de la carta pasa a cargarse por JavaScript (Google lo renderiza e indexa).
  Lo que más posiciona —título, meta-descripción y ficha `Restaurant`— sigue estático en el HTML.
- ⏱️ Los cambios en el Sheet tardan unos minutos en propagarse (caché de Google).

## Legal y cookies

- **Páginas legales**: `aviso-legal.html`, `privacidad.html`, `cookies.html` (enlazadas en el
  footer de todas las páginas). ⚠️ **Contienen marcadores `[COMPLETAR: …]`** (NIF/CIF, razón
  social, email). Busca `[COMPLETAR` y rellena tus datos fiscales antes de publicar.
  *(No es asesoramiento jurídico; para algo crítico que lo revise un profesional.)*
- **Banner de cookies** (en `js/site.js`): aparece en la 1.ª visita, con "Aceptar"/"Rechazar"
  por igual. Guarda la decisión en `localStorage['lc-consent']`.
- **Google Maps con carga al clic**: el mapa NO se carga (ni pone cookies) hasta que el usuario
  pulsa "Ver el mapa" o acepta las cookies. Cumple la guía de la AEPD.
- **Fuentes auto-alojadas** (`fonts/`): ya no se piden a Google → más rápido y sin transferir
  IPs a servidores de Google (evita el problema legal de Google Fonts).

## Analítica (opcional, sin cookies)

No hay analítica activada. Para añadir una **sin cookies** (no requiere consentimiento):
1. Crea una cuenta en **Plausible** o **Umami** y copia su script.
2. En `js/site.js`, dentro de `applyConsent()`, hay un marcador `// loadAnalytics();`.
   Para analítica sin cookies puedes cargar el script directamente en el `<head>` (no hace
   falta esperar al consentimiento). Si usas Google Analytics (con cookies), entonces sí debe
   cargarse solo tras "Aceptar".

## Datos del negocio

- **Dirección**: C. Campo, 76, 02640 Almansa, Albacete.
- **Teléfono / WhatsApp**: 611 46 23 82.
- **Instagram**: @restauranteloscuchillos
- **Horario**: Lun–Mar 8:00–17:30 · Mié cerrado · Jue 8:00–17:30 ·
  Vie 8:00–17:30 y 20:30–24:00 · Sáb 9:00–17:30 y 20:30–24:00 · Dom 9:00–17:30.

## Pendiente / a sustituir por el cliente

- **Fotos de sala/interior** reales para "El espacio" en `restaurante.html`
  (ahora reutiliza fotos de plato como placeholder).
- **Arroces y fideuá**: hoy es texto "por encargo"; añadir variedades/precios si se fijan.
- El logo (`assets/logo.webp`) puede vectorizarse a SVG para mayor nitidez.
- **Coordenadas geo** del JSON-LD (`latitude`/`longitude` en `index.html` y `contacto.html`)
  son aproximadas al centro de Almansa. Sustitúyelas por las exactas de tu local: en Google
  Maps, clic derecho sobre el restaurante → "¿Qué hay aquí?" → copia lat, long.

> Las fotos están optimizadas a **WebP** (calidad 85, ~980 KB en total frente a los
> ~10 MB originales). Los PNG originales se conservan en `_design-source/` por si hicieran falta.

> Nota: el panel de "Tweaks" (React) del prototipo era solo una herramienta de diseño
> y **no** se ha portado a producción, tal como indicaba el handoff.
