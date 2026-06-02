# Restaurante Los Cuchillos — sitio web

Sitio web estático (HTML/CSS/JS, sin build) para el **Restaurante Los Cuchillos** (Almansa,
Albacete · desde 1973). Diseño editorial oscuro y premium, bilingüe ES/EN.

## Estructura

```
index.html            Inicio (hero con slideshow, intro, platos, producto, CTA reserva)
carta.html            Carta completa con precios + bodega (índice sticky)
restaurante.html      Historia, filosofía y el espacio
contacto.html         Reservas (tel/WhatsApp), horario y mapa
css/site.css          Sistema visual completo (tokens, componentes, responsive)
js/site.js            Interacción (nav, idioma, reveal, parallax, slideshow, horario)
assets/               Fotografía de producto y logo (WebP)
sitemap.xml           Mapa del sitio para buscadores
robots.txt            Reglas de rastreo + referencia al sitemap
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
index.html · carta.html · restaurante.html · contacto.html · sitemap.xml · robots.txt
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
