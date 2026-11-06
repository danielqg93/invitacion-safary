/**
 * ============================================================
 *  CONFIGURACIÓN DE LA INVITACIÓN — TEMA SAFARI
 *  Todo lo que dice "TODO" debe reemplazarse con los datos reales.
 * ============================================================
 */

/** Años que cumple. Con 1 se usan los textos "Wild One / Mi primer añito". */
const EDAD: number = 1; // TODO: 1 o 5

export const config = {
   /** Nombre del cumpleañero/a tal como aparece en grande. */
   nombre: "Nombre", // TODO

   edad: EDAD,

   /** "pequeño explorador" o "pequeña exploradora". */
   explorador: "pequeño explorador", // TODO

   /** Cómo referirse a él/ella en textos ("el cumpleañero" / "la cumpleañera"). */
   cumpleanero: "el cumpleañero", // TODO

   /** Texto bajo el nombre. Se calcula según la edad, pero puedes escribir otro. */
   edadTexto: EDAD === 1 ? "Mi primer añito" : `Mis ${EDAD} añitos`,

   /** Etiqueta pequeña sobre el nombre en la portada. */
   etiqueta: EDAD === 1 ? "Wild One" : "¡Expedición salvaje!",

   /**
    * Fecha y hora de inicio. OJO: el mes empieza en 0 (0 = enero, 11 = diciembre).
    * Ejemplo: new Date(2027, 2, 20, 15, 0) = 20 de marzo 2027, 3:00 pm.
    */
   fechaEvento: new Date(2027, 2, 20, 15, 0), // TODO

   /** Duración aproximada en horas (para el botón "Agendar" de Google Calendar). */
   duracionHoras: 4,

   /** Frase principal de la introducción. */
   frase: "Prepara tus binoculares, ajusta tu sombrero y únete a la expedición más salvaje del año.",

   lugar: "Nombre del local", // TODO
   direccion: "Dirección del local", // TODO
   referencia: "Referencia: cerca de...", // TODO (deja "" para ocultarla)
   mapsUrl: "https://maps.google.com", // TODO link de Google Maps

   /**
    * ID del video de YouTube para la música de fondo
    * (lo que va después de "watch?v=" en el link). Deja "" para no usar música.
    */
   youtubeVideoId: "", // TODO

   /**
    * Dónde se guardan las confirmaciones de asistencia.
    * - "/api/confirmaciones": funciona en local (bun run dev) y en Netlify.
    * - Para GitHub Pages usa la URL de tu propio Google Apps Script
    *   (https://script.google.com/macros/s/.../exec).
    */
   rsvpEndpoint: "/api/confirmaciones",

   galeria: {
      titulo: "Mi álbum de aventuras", // TODO
      subtitulo: "Los mejores recuerdos de mi expedición por la vida",
      /** Archivos dentro de public/img/galeria/. Si la lista está vacía, la sección se oculta. */
      fotos: [] as string[], // TODO ej: ["1.jpg", "2.jpg", "3.jpg"]
   },

   fotos: {
      /** Álbum compartido donde los invitados suben fotos. "" para ocultar el enlace. */
      albumUrl: "", // TODO
      hashtag: "#ExpediciónSalvaje", // TODO
   },

   modales: {
      vestimenta: {
         titulo: "¡Ven vestido de explorador!",
         texto: "Tonos caqui, verde o beige. Si tienes sombrero, chaleco o binoculares, ¡tráelos a la aventura!",
      },
      tips: {
         titulo: "¡La expedición sale puntual!",
         texto: "Te recomendamos llegar unos minutos antes para no perderte ninguna aventura.",
      },
      regalos: {
         titulo: "Tu presencia es mi mejor regalo",
         texto: "Si aun así deseas obsequiarme algo, podrás consultar los datos con mi familia.",
      },
   },

   /** Frase de cierre del pie de página. */
   cierre: "¡Ruge de emoción, te esperamos!",

   /** Créditos del pie de página. */
   creditos: "Daniel Quezada",

   /**
    * Imágenes opcionales en public/img/ (ver public/img/LEEME.txt).
    * Si no existen, se usan los animalitos ilustrados incluidos.
    */
   imagenes: {
      /** Foto del cumpleañero/a (marco redondo de la intro y fondo de "Comparte tus fotos"). */
      fotoCumple: "foto-cumple.jpg",
   },
};
