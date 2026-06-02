# Restaurante Los Cuchillos — sitio web

Sitio web estático (HTML/CSS/JS, sin build) para el **Restaurante Los Cuchillos** (Almansa,
Albacete · desde 1973). Diseño editorial oscuro y premium, bilingüe ES/EN.

## Estructura

```
index.html          Inicio (hero con slideshow, intro, platos, producto, CTA reserva)
carta.html          Carta completa con precios + bodega (índice sticky)
restaurante.html    Historia, filosofía y el espacio
contacto.html       Reservas (tel/WhatsApp), horario y mapa
css/site.css        Sistema visual completo (tokens, componentes, responsive)
js/site.js          Interacción (nav, idioma, reveal, parallax, slideshow, horario)
assets/             Fotografía de producto y logo
_design-source/     Bundle de diseño original + transcripción del chat (referencia)
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
- El logo PNG (`assets/logo.png`) puede vectorizarse a SVG para mayor nitidez.

> Nota: el panel de "Tweaks" (React) del prototipo era solo una herramienta de diseño
> y **no** se ha portado a producción, tal como indicaba el handoff.
