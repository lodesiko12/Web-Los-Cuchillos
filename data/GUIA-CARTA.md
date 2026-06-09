# Cómo cambiar la carta y el menú del día (Google Sheets)

La carta y el menú del día de la web se leen de **una hoja de Google** que podéis editar
vosotros. Lo que ponéis en la hoja aparece en la web (tarda unos minutos en actualizarse).
**No hay que tocar nada de código ni subir archivos.**

---

## La hoja tiene 2 pestañas

### Pestaña «Carta»
Una fila por plato. Columnas:

| Columna | Qué poner | ¿Obligatorio? |
|---|---|---|
| **Sección** | El apartado: Entrantes, Carnes, Pescados, Postres… | Sí |
| **Plato** | El nombre del plato | Sí |
| **Descripción** | Detalle o ingredientes (opcional) | No |
| **Precio** | Ej.: `14 €`, `3,20 € / ud`, `64 € / kg` | No |
| **Etiqueta** | Una etiqueta pequeña, ej.: `Selección premium` | No |

**Reglas fáciles:**
- **Para añadir un plato** → añade una fila.
- **Para quitar un plato** → borra la fila.
- **Para cambiar el orden** → mueve las filas (el orden de la hoja = el orden en la web).
- **Las secciones se crean solas**: todas las filas con la misma «Sección» se agrupan juntas,
  en el orden en que aparecen.
- Para **quitar los arroces entre semana**, borra esas filas; el viernes los vuelves a poner
  (o ten una pestaña aparte y copias/pegas).

### Pestaña «Menú del día»
Columnas: **Grupo**, **Plato**, **Descripción**.

- En **Grupo** pones: `Primeros`, `Segundos`, `Postres`… (los que queráis).
- Dos grupos especiales:
  - `Precio` → en **Plato** escribe el precio del menú. Ej.: `15,90 € · pan, bebida y postre incluidos`.
  - `Nota` → en **Plato** escribe un aviso. Ej.: `Disponible de lunes a viernes al mediodía`.
- El **viernes de tapas**: añade un grupo nuevo (ej. `Tapas`) con sus platos, o usa una nota.

---

## Cómo se publica la hoja (esto se hace UNA sola vez)

Para que la web pueda leer la hoja:

1. Abre la hoja en Google Sheets.
2. Menú **Archivo → Compartir → Publicar en la web**.
3. En «Vínculo», elige la pestaña (p. ej. *Carta*) y el formato **Valores separados por comas (.csv)**.
4. Pulsa **Publicar** y copia la URL que aparece.
5. Repite para la pestaña *Menú del día*.
6. Pásale esas 2 URLs a tu desarrollador (o pégalas tú en `js/menu.js`, arriba del todo,
   donde pone `MENU_SOURCES`).

> Mientras no se conecte la hoja real, la web muestra una carta de ejemplo (los archivos
> `data/carta.csv` y `data/menu-dia.csv`).

---

## Cosas a tener en cuenta

- ⏱️ Los cambios tardan **unos minutos** en verse (Google guarda una copia temporal). Es normal.
- ✅ Si la hoja falla o está mal editada, la web no se rompe: muestra un aviso para llamar por
  teléfono.
- 🍷 La **bodega (vinos)** NO está en la hoja (cambia poco). Si queréis editarla también vosotros,
  decídnoslo y la añadimos.
