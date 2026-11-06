# Invitación digital — temática Safari

Invitación de cumpleaños de una sola página (React + Vite + TypeScript) con estilo safari tierno:
animalitos ilustrados en SVG, portada con parallax, pasaporte de explorador, mapa de expedición
y galería tipo polaroid.

## 1. Editar los datos del evento

Todo lo editable está en **`src/config.ts`** (busca `TODO`):

- `EDAD` (arriba del archivo): con **1** los textos dicen "Wild One / Mi primer añito"; con otro
  número, "¡Expedición salvaje! / Mis N añitos". Ambos se pueden sobrescribir (`etiqueta`, `edadTexto`).
- `nombre`, `explorador` ("pequeño explorador" / "pequeña exploradora"), `cumpleanero`
- `fechaEvento`: **el mes empieza en 0** (`new Date(2027, 2, 20, 15, 0)` = 20 de marzo de 2027, 3:00 pm).
- `lugar`, `direccion`, `referencia`, `mapsUrl`, `youtubeVideoId`, `rsvpEndpoint`
- Textos de galería, hashtag, modales y frase de cierre.

Actualiza también `<title>` y las etiquetas `og:` en `index.html`.

## 2. Imágenes

No hace falta ninguna: los animales y decorados son SVG propios (`src/animales.tsx`).
Opcionalmente agrega `public/img/foto-cumple.jpg` y fotos en `public/img/galeria/` (ver `public/img/LEEME.txt`).
Fuentes y licencias en `CREDITOS.md`.

## 3. Invitados e itinerario

- `db/invitados.json` → link personal: `https://danielqg93.github.io/invitacion-safari/#/CODIGO`
- `db/itinerario.json` → cada parada admite `"animal"`: `leon`, `elefante`, `jirafa`, `cebra` o `mono`.

## 4. Confirmaciones de asistencia

- **Local y Netlify:** `rsvpEndpoint: "/api/confirmaciones"` guarda en `db/confirmarAsistencia.json`
  (en Netlify no es permanente).
- **GitHub Pages:** usa la URL de tu propio Google Apps Script en `rsvpEndpoint`.

## Comandos

```bash
bun install
bun run dev      # http://localhost:5173/invitacion-safari/
bun run lint
bun run build
```
