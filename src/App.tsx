import { useEffect, useRef, useState } from "react";
import invitados from "../db/invitados.json";
import itinerario from "../db/itinerario.json";
import {
   ANIMALES,
   Acacia,
   Animal,
   type AnimalName,
   Leaf,
   Paw,
} from "./animales";
import { config } from "./config";

declare global {
   interface Window {
      YT?: {
         Player: new (
            element: HTMLElement | string,
            options: {
               height?: string;
               width?: string;
               videoId?: string;
               playerVars?: Record<string, number | string>;
               events?: {
                  onReady?: (event: {
                     target: { playVideo: () => void; pauseVideo: () => void };
                  }) => void;
                  onStateChange?: (event: { data: number }) => void;
               };
            },
         ) => YTPlayer;
         PlayerState?: { PLAYING: number; PAUSED: number };
      };
      onYouTubeIframeAPIReady?: () => void;
   }
}

type YTPlayer = {
   playVideo: () => void;
   pauseVideo: () => void;
   destroy: () => void;
};

/* ------------------------------------------------------------------ */
/* Datos derivados de la configuración                                 */
/* ------------------------------------------------------------------ */

const ASSET_IMG = `${import.meta.env.BASE_URL}img`;
const img = (file: string) => `${ASSET_IMG}/${file}`;
const fotoCumpleUrl = img(config.imagenes.fotoCumple);

const pad = (n: number) => String(n).padStart(2, "0");
const capitalize = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

const fecha = config.fechaEvento;
const fechaCorta = `${pad(fecha.getDate())}.${pad(fecha.getMonth() + 1)}.${fecha.getFullYear()}`;
const horaTexto = fecha
   .toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
   })
   .replace(/\s*a\.?\s*m\.?/i, " am")
   .replace(/\s*p\.?\s*m\.?/i, " pm");
const diaTexto = capitalize(
   fecha.toLocaleDateString("es-PE", {
      weekday: "long",
      day: "numeric",
      month: "long",
   }),
);

const toCalendarDate = (date: Date) =>
   date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
   `${config.nombre} - ${config.edadTexto}`,
)}&dates=${toCalendarDate(fecha)}/${toCalendarDate(
   new Date(fecha.getTime() + config.duracionHoras * 3600000),
)}&location=${encodeURIComponent(`${config.lugar}, ${config.direccion}`)}`;

const galleryImages = config.galeria.fotos.map((f) => img(`galeria/${f}`));
const hasMusic = config.youtubeVideoId.trim() !== "";

type ModalName = "welcome" | "rsvp" | "dress" | "tips" | "gifts" | null;

type IconName =
   | "calendar"
   | "pin"
   | "check"
   | "dress"
   | "info"
   | "gift"
   | "camera"
   | "heart";

type Invitado = {
   nombre: string;
   apellidos: string;
   codigoInvitacion: string;
};

type ItinerarioItem = {
   hour: string;
   event: string;
   animal?: AnimalName;
};

const invitadosRegistrados = invitados as Invitado[];
const eventos = itinerario as ItinerarioItem[];

function obtenerInvitado(): Invitado | null {
   const hash = window.location.hash.replace(/^#\/?/, "").trim();
   const codigo = hash.split("/").filter(Boolean)[0] || "";
   if (!codigo) return null;
   return (
      invitadosRegistrados.find(
         (i) => i.codigoInvitacion.toUpperCase() === codigo.toUpperCase(),
      ) ?? null
   );
}

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

/** Agrega la clase "is-visible" a los elementos con data-reveal al entrar en pantalla. */
function useReveal() {
   useEffect(() => {
      const elements = document.querySelectorAll("[data-reveal]");
      if (!("IntersectionObserver" in window)) {
         for (const el of elements) el.classList.add("is-visible");
         return;
      }
      const observer = new IntersectionObserver(
         (entries) => {
            for (const entry of entries) {
               if (entry.isIntersecting) {
                  entry.target.classList.add("is-visible");
                  observer.unobserve(entry.target);
               }
            }
         },
         { threshold: 0.2 },
      );
      for (const el of elements) observer.observe(el);
      return () => observer.disconnect();
   }, []);
}

/** Expone el scroll como variable CSS --scroll para el parallax de la portada. */
function useParallax() {
   useEffect(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
         return;
      let frame = 0;
      const update = () => {
         frame = 0;
         const y = Math.min(window.scrollY, window.innerHeight);
         document.documentElement.style.setProperty("--scroll", String(y));
      };
      const onScroll = () => {
         if (!frame) frame = window.requestAnimationFrame(update);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      update();
      return () => {
         window.removeEventListener("scroll", onScroll);
         if (frame) window.cancelAnimationFrame(frame);
      };
   }, []);
}

/* ------------------------------------------------------------------ */
/* Componentes pequeños                                                */
/* ------------------------------------------------------------------ */

function Icon({ name }: { name: IconName }) {
   const paths: Record<IconName, React.ReactNode> = {
      calendar: (
         <>
            <rect x="3" y="5" width="18" height="16" rx="3" />
            <path d="M7 3v4M17 3v4M3 10h18" />
         </>
      ),
      pin: (
         <>
            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
         </>
      ),
      check: (
         <>
            <circle cx="12" cy="12" r="9" />
            <path d="m8 12 2.6 2.6L16.5 9" />
         </>
      ),
      dress: (
         <>
            <path d="M3 13c0-3 4-6 9-6s9 3 9 6" />
            <path d="M1.5 13.5h21M8 7.5C8 4.5 9.8 3 12 3s4 1.5 4 4.5" />
         </>
      ),
      info: (
         <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v6M12 7h.01" />
         </>
      ),
      gift: (
         <>
            <path d="M3 10h18v11H3zM2 7h20v4H2zM12 7v14" />
            <path d="M12 7C8 7 6 6 6 4.5S8 2 9.5 3C11 4 12 7 12 7Zm0 0c4 0 6-1 6-2.5S16 2 14.5 3C13 4 12 7 12 7Z" />
         </>
      ),
      camera: (
         <>
            <path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
            <circle cx="12" cy="13" r="4" />
         </>
      ),
      heart: (
         <path d="M12 21S3 16 3 9.5A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 9 1.5C21 16 12 21 12 21Z" />
      ),
   };
   return (
      <svg
         className="icon"
         viewBox="0 0 24 24"
         aria-hidden="true"
         fill="none"
         stroke="currentColor"
         strokeWidth={1.8}
         strokeLinecap="round"
         strokeLinejoin="round"
      >
         {paths[name]}
      </svg>
   );
}

function Button({
   children,
   onClick,
   href,
   variant = "solid",
   type = "button",
}: {
   children: React.ReactNode;
   onClick?: () => void;
   href?: string;
   variant?: "solid" | "light";
   type?: "button" | "submit";
}) {
   const className = `btn btn-${variant}`;
   return href ? (
      <a
         className={className}
         href={href}
         target={href.startsWith("http") ? "_blank" : undefined}
         rel="noreferrer"
      >
         {children}
      </a>
   ) : (
      <button className={className} type={type} onClick={onClick}>
         {children}
      </button>
   );
}

function SectionTitle({
   kicker,
   title,
   children,
}: {
   kicker?: string;
   title: string;
   children?: React.ReactNode;
}) {
   return (
      <header className="section-title" data-reveal>
         {kicker && <span className="kicker">{kicker}</span>}
         <h2>{title}</h2>
         {children && <p>{children}</p>}
         <div className="leaf-divider" aria-hidden="true">
            <Leaf className="ld-left" />
            <Paw />
            <Leaf className="ld-right" />
         </div>
      </header>
   );
}

/** Rastro de huellas que aparecen una por una al hacer scroll. */
function PawTrail({ flip = false }: { flip?: boolean }) {
   return (
      <div
         className={`paw-trail ${flip ? "flip" : ""}`}
         data-reveal
         aria-hidden="true"
      >
         {[0, 1, 2, 3, 4].map((i) => (
            <Paw key={i} />
         ))}
      </div>
   );
}

/** Foto del cumpleañero; si no existe, muestra al león. */
function FotoCumple({ className = "" }: { className?: string }) {
   const [failed, setFailed] = useState(false);
   return (
      <div className={`foto-cumple ${className}`}>
         {failed ? (
            <Animal name="leon" />
         ) : (
            <img src={fotoCumpleUrl} alt="" onError={() => setFailed(true)} />
         )}
      </div>
   );
}

function Stamp({
   children,
   className = "",
}: {
   children: React.ReactNode;
   className?: string;
}) {
   return (
      <div className={`stamp ${className}`} aria-hidden="true">
         <span>{children}</span>
      </div>
   );
}

async function enviarConfirmacion(body: {
   nombre: string;
   asistira: boolean;
   mensaje: FormDataEntryValue | null;
}) {
   const endpoint = config.rsvpEndpoint;
   const isAppsScript = endpoint.includes("script.google.com");
   const response = await fetch(endpoint, {
      method: "POST",
      // Google Apps Script no permite CORS: se envía "a ciegas".
      mode: isAppsScript ? "no-cors" : "cors",
      headers: {
         "Content-Type": isAppsScript
            ? "text/plain;charset=utf-8"
            : "application/json",
      },
      body: JSON.stringify(body),
   });
   if (!isAppsScript && !response.ok) throw new Error("No se pudo guardar");
}

/* ------------------------------------------------------------------ */
/* Modales                                                             */
/* ------------------------------------------------------------------ */

function Modal({
   active,
   close,
   invitado,
}: {
   active: Exclude<ModalName, "welcome" | null>;
   close: () => void;
   invitado: Invitado | null;
}) {
   const [status, setStatus] = useState<
      "idle" | "saving" | "success" | "error"
   >("idle");
   const info = {
      rsvp: { title: "Únete a la expedición", animal: "leon" as AnimalName },
      dress: { title: "Vestimenta", animal: "jirafa" as AnimalName },
      tips: { title: "Tips y notas", animal: "elefante" as AnimalName },
      gifts: { title: "Regalos", animal: "mono" as AnimalName },
   }[active];
   const copy = {
      dress: config.modales.vestimenta,
      tips: {
         titulo: config.modales.tips.titulo,
         texto: `La expedición comienza a las ${horaTexto}. ${config.modales.tips.texto}`,
      },
      gifts: config.modales.regalos,
   };

   return (
      <div className="modal-backdrop" role="presentation" onMouseDown={close}>
         <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onMouseDown={(e) => e.stopPropagation()}
         >
            <button className="modal-close" onClick={close} aria-label="Cerrar">
               ×
            </button>
            <Animal name={info.animal} className="modal-animal" />
            <h2 id="modal-title">{info.title}</h2>

            {active === "rsvp" && status !== "success" && (
               <form
                  onSubmit={async (e) => {
                     e.preventDefault();
                     setStatus("saving");
                     const formElement = e.currentTarget;
                     const form = new FormData(formElement);
                     try {
                        await enviarConfirmacion({
                           nombre: invitado
                              ? `${invitado.nombre} ${invitado.apellidos}`.trim()
                              : "Invitado sin código",
                           asistira: form.get("asistira") === "si",
                           mensaje: form.get("mensaje"),
                        });
                        setStatus("success");
                        formElement.reset();
                        window.setTimeout(close, 3500);
                     } catch {
                        setStatus("error");
                     }
                  }}
               >
                  <fieldset>
                     <legend>¿Vienes a la aventura? *</legend>
                     <label className="choice">
                        <input type="radio" name="asistira" value="si" required />
                        <span>¡Sí, ahí estaré!</span>
                     </label>
                     <label className="choice">
                        <input type="radio" name="asistira" value="no" />
                        <span>No podré ir</span>
                     </label>
                  </fieldset>
                  <label>
                     Mensaje para {config.cumpleanero} (opcional)
                     <textarea
                        name="mensaje"
                        placeholder="Déjale un mensaje lleno de cariño"
                     />
                  </label>
                  <Button type="submit">
                     {status === "saving" ? "ENVIANDO..." : "CONFIRMAR"}
                  </Button>
                  {status === "error" && (
                     <p className="form-status error" role="alert">
                        No se pudo guardar. Inténtalo nuevamente.
                     </p>
                  )}
               </form>
            )}
            {active === "rsvp" && status === "success" && (
               <div className="rsvp-success" role="status">
                  <Stamp className="stamp-confirmed is-visible">
                     ¡Expedición
                     <br />
                     confirmada!
                  </Stamp>
                  <p>¡Gracias! Tu respuesta fue guardada.</p>
               </div>
            )}

            {active !== "rsvp" && (
               <div className="modal-copy">
                  <p>{copy[active].titulo}</p>
                  <span>{copy[active].texto}</span>
               </div>
            )}
         </div>
      </div>
   );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

function App() {
   const invitado = obtenerInvitado();
   const [modal, setModal] = useState<ModalName>("welcome");
   const [welcomeClosed, setWelcomeClosed] = useState(false);
   const [slide, setSlide] = useState<number | null>(null);
   const touchStartX = useRef<number | null>(null);
   const [musicOn, setMusicOn] = useState(false);
   const [isMusicPlaying, setIsMusicPlaying] = useState(false);
   const playerRef = useRef<YTPlayer | null>(null);
   const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
   const gallery = galleryImages;

   useReveal();
   useParallax();

   useEffect(() => {
      const tick = () => {
         const d = Math.max(0, fecha.getTime() - Date.now());
         setTime({
            days: Math.floor(d / 86400000),
            hours: Math.floor(d / 3600000) % 24,
            mins: Math.floor(d / 60000) % 60,
            secs: Math.floor(d / 1000) % 60,
         });
      };
      tick();
      const id = window.setInterval(tick, 1000);
      return () => window.clearInterval(id);
   }, []);

   const changeSlide = (direction: 1 | -1) => {
      setSlide((current) =>
         current === null
            ? null
            : (current + gallery.length + direction) % gallery.length,
      );
   };

   useEffect(() => {
      const key = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            if (modal === "welcome") setWelcomeClosed(true);
            setModal(null);
            setSlide(null);
         }
         if (slide === null) return;
         if (e.key === "ArrowLeft") changeSlide(-1);
         if (e.key === "ArrowRight") changeSlide(1);
      };
      window.addEventListener("keydown", key);
      return () => window.removeEventListener("keydown", key);
   });

   useEffect(() => {
      if (!welcomeClosed) return;
      const id = window.setTimeout(() => {
         setModal((current) => (current === null ? "tips" : current));
      }, 15000);
      return () => window.clearTimeout(id);
   }, [welcomeClosed]);

   const open = (name: ModalName) => setModal(name);

   const enter = (withMusic: boolean) => {
      setMusicOn(hasMusic);
      setIsMusicPlaying(withMusic && hasMusic);
      setWelcomeClosed(true);
      setModal(null);
   };

   const toggleMusic = () => {
      const next = !isMusicPlaying;
      setIsMusicPlaying(next);
      if (!playerRef.current) return;
      if (next) playerRef.current.playVideo();
      else playerRef.current.pauseVideo();
   };

   // biome-ignore lint/correctness/useExhaustiveDependencies: el reproductor se crea una sola vez al ingresar
   useEffect(() => {
      if (!musicOn || !hasMusic) return;
      const setupPlayer = () => {
         const container = document.getElementById("music-player-container");
         if (!container || !window.YT?.Player) return;
         playerRef.current = new window.YT.Player(container, {
            height: "1",
            width: "1",
            videoId: config.youtubeVideoId,
            playerVars: {
               autoplay: isMusicPlaying ? 1 : 0,
               loop: 1,
               playlist: config.youtubeVideoId,
               controls: 0,
               rel: 0,
               playsinline: 1,
            },
            events: {
               onReady: (event) => {
                  if (isMusicPlaying) event.target.playVideo();
               },
               onStateChange: (event) => {
                  setIsMusicPlaying(
                     event.data === window.YT?.PlayerState?.PLAYING,
                  );
               },
            },
         });
      };
      if (window.YT?.Player) {
         setupPlayer();
      } else {
         if (
            !document.querySelector(
               'script[src="https://www.youtube.com/iframe_api"]',
            )
         ) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);
         }
         window.onYouTubeIframeAPIReady = setupPlayer;
      }
      return () => {
         playerRef.current?.destroy();
         playerRef.current = null;
         window.onYouTubeIframeAPIReady = undefined;
      };
   }, [musicOn]);

   const handleTouchStart = (event: React.TouchEvent) => {
      touchStartX.current = event.touches[0]?.clientX ?? null;
   };
   const handleTouchEnd = (event: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const distance = event.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(distance) < 45) return;
      changeSlide(distance < 0 ? 1 : -1);
   };

   const mainStyle = {
      "--fotocumple": `url("${fotoCumpleUrl}")`,
   } as React.CSSProperties;

   return (
      <main style={mainStyle}>
         {musicOn && hasMusic && (
            <>
               <div className="hidden-music-player" aria-hidden="true">
                  <div id="music-player-container" />
               </div>
               <button
                  type="button"
                  className="music-toggle"
                  onClick={toggleMusic}
                  aria-label={
                     isMusicPlaying ? "Pausar música" : "Reproducir música"
                  }
               >
                  {isMusicPlaying ? "❚❚" : "▶"}
               </button>
            </>
         )}

         {/* ---------------- PORTADA ---------------- */}
         <section className="hero" id="inicio">
            <div className="hero-sky" />
            <div className="hero-sun parallax" style={{ "--speed": 0.15 } as React.CSSProperties} />
            <svg
               className="hero-hills hills-far parallax"
               style={{ "--speed": 0.1 } as React.CSSProperties}
               viewBox="0 0 1440 320"
               preserveAspectRatio="none"
               aria-hidden="true"
            >
               <path
                  fill="#dfe3bf"
                  d="M0 190 C220 120 380 150 560 120 C760 86 900 160 1100 120 C1260 90 1360 110 1440 100 V320 H0Z"
               />
            </svg>
            <div
               className="hero-trees parallax"
               style={{ "--speed": 0.2 } as React.CSSProperties}
            >
               <Acacia className="tree-1" />
               <Acacia className="tree-2" />
               <Acacia className="tree-3" />
            </div>
            <svg
               className="hero-hills hills-mid parallax"
               style={{ "--speed": 0.28 } as React.CSSProperties}
               viewBox="0 0 1440 320"
               preserveAspectRatio="none"
               aria-hidden="true"
            >
               <path
                  fill="#b9cf9f"
                  d="M0 220 C200 170 360 230 600 190 C820 152 980 230 1200 196 C1320 178 1400 190 1440 186 V320 H0Z"
               />
            </svg>
            <Animal name="jirafa" className="hero-jirafa" />
            <svg
               className="hero-hills hills-near"
               viewBox="0 0 1440 320"
               preserveAspectRatio="none"
               aria-hidden="true"
            >
               <path
                  fill="#8fb486"
                  d="M0 250 C240 210 420 270 700 240 C960 212 1160 280 1440 236 V320 H0Z"
               />
            </svg>
            <Animal name="leon" className="hero-leon" />
            <Animal name="elefante" className="hero-elefante" />
            <Animal name="cebra" className="hero-cebra" />

            <div className="hero-content">
               <span className="hero-tag">{config.etiqueta}</span>
               <h1>{config.nombre}</h1>
               <p className="hero-age">{config.edadTexto}</p>
               <p className="hero-date">{fechaCorta}</p>
            </div>
         </section>

         <div className="content">
            {/* ---------------- INTRO ---------------- */}
            <section className="intro">
               <Leaf className="intro-leaf-1" />
               <Leaf className="intro-leaf-2" color="#a9c296" />
               <div className="intro-grid">
                  <div className="intro-photo" data-reveal>
                     <FotoCumple />
                     <Leaf className="frame-leaf fl-1" />
                     <Leaf className="frame-leaf fl-2" color="#a9c296" />
                     <Leaf className="frame-leaf fl-3" />
                  </div>
                  <div className="intro-copy" data-reveal>
                     <span className="kicker">
                        Un {config.explorador} cumple {config.edad}{" "}
                        {config.edad === 1 ? "añito" : "añitos"}
                     </span>
                     <p className="quote">{config.frase}</p>
                     <ul className="facts">
                        <li>
                           <strong>{config.edad * 12}</strong> meses de
                           aventuras
                        </li>
                        <li>
                           <strong>
                              {(config.edad * 365).toLocaleString("es-PE")}
                           </strong>{" "}
                           días explorando
                        </li>
                        <li>
                           <strong>∞</strong> rugidos de alegría
                        </li>
                     </ul>
                  </div>
               </div>

               <div className="countdown-block" data-reveal>
                  <span className="kicker">La expedición sale en</span>
                  <div className="planks">
                     <div className="rope" aria-hidden="true" />
                     {[
                        [time.days, "días"],
                        [time.hours, "horas"],
                        [time.mins, "min"],
                        [time.secs, "seg"],
                     ].map(([n, label]) => (
                        <div className="plank" key={label}>
                           <strong>{pad(Number(n))}</strong>
                           <small>{label}</small>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            <PawTrail />

            {/* ---------------- PASAPORTE ---------------- */}
            <section className="passport-section">
               <SectionTitle
                  kicker="Documento oficial"
                  title="Tu pasaporte está listo"
               >
                  Tu presencia es lo más importante. ¡No faltes!
               </SectionTitle>
               <div className="passport" data-reveal>
                  <div className="passport-head">
                     <span>Pasaporte de explorador</span>
                     <Paw />
                  </div>
                  <div className="passport-body">
                     <div className="passport-photo">
                        <Animal name="mono" />
                     </div>
                     <dl>
                        <div>
                           <dt>Nombre</dt>
                           <dd>{invitado?.nombre ?? "Explorador(a)"}</dd>
                        </div>
                        {invitado?.apellidos && (
                           <div>
                              <dt>Apellidos</dt>
                              <dd>{invitado.apellidos}</dd>
                           </div>
                        )}
                        <div>
                           <dt>N° de expedición</dt>
                           <dd>{invitado?.codigoInvitacion ?? "SAFARI"}</dd>
                        </div>
                        <div>
                           <dt>Destino</dt>
                           <dd>{config.lugar}</dd>
                        </div>
                        <div>
                           <dt>Salida</dt>
                           <dd>
                              {fechaCorta} · {horaTexto}
                           </dd>
                        </div>
                     </dl>
                  </div>
                  <div className="passport-mrz" aria-hidden="true">
                     P&lt;SAFARI&lt;&lt;
                     {(invitado?.nombre ?? "EXPLORADOR")
                        .toUpperCase()
                        .replace(/\s+/g, "<")}
                     &lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                  </div>
                  <Stamp className="stamp-admitted">Admitido</Stamp>
               </div>
            </section>

            {/* ---------------- CELEBRACIÓN ---------------- */}
            <section className="celebration" id="celebracion">
               <SectionTitle kicker="Punto de encuentro" title="Celebración">
                  Será un día inolvidable y queremos vivirlo contigo.
               </SectionTitle>
               <div className="notes">
                  <article className="note" data-reveal>
                     <div className="note-icon">
                        <Icon name="calendar" />
                     </div>
                     <h3>Día</h3>
                     <p>
                        {diaTexto}
                        <br />
                        {horaTexto}
                     </p>
                     <Button href={calendarUrl}>AGENDAR</Button>
                  </article>
                  <article className="note" data-reveal>
                     <div className="note-icon">
                        <Icon name="check" />
                     </div>
                     <h3>Lugar</h3>
                     <p>{config.lugar}</p>
                     <Button onClick={() => open("rsvp")}>CONFIRMAR</Button>
                  </article>
                  <article className="note" data-reveal>
                     <div className="note-icon">
                        <Icon name="pin" />
                     </div>
                     <h3>Dirección</h3>
                     <p>
                        {config.direccion}
                        {config.referencia && (
                           <small className="note-ref">
                              {config.referencia}
                           </small>
                        )}
                     </p>
                     <Button href={config.mapsUrl}>¿CÓMO LLEGAR?</Button>
                  </article>
               </div>
            </section>

            {/* ---------------- ITINERARIO (MAPA) ---------------- */}
            <section className="itinerary" id="itinerario">
               <SectionTitle kicker="Mapa de expedición" title="Itinerario">
                  Sigue las huellas: estas son las paradas de nuestra aventura.
               </SectionTitle>
               <ol className="route">
                  {eventos.map((item, i) => (
                     <li
                        className="stop"
                        key={`${item.hour}-${item.event}`}
                        data-reveal
                     >
                        <div className="stop-marker">
                           <Animal
                              name={item.animal ?? ANIMALES[i % ANIMALES.length]}
                           />
                        </div>
                        <div className="stop-card">
                           <time>{item.hour}</time>
                           <p>{item.event}</p>
                        </div>
                     </li>
                  ))}
                  <li className="stop stop-end" data-reveal>
                     <div className="stop-marker flag" aria-hidden="true">
                        ⛳
                     </div>
                  </li>
               </ol>
            </section>

            {/* ---------------- CONFIRMAR ---------------- */}
            <section className="rsvp-banner">
               <Leaf className="rb-leaf rb-1" color="#a9c296" />
               <Leaf className="rb-leaf rb-2" color="#cfe0b8" />
               <Leaf className="rb-leaf rb-3" color="#a9c296" />
               <Leaf className="rb-leaf rb-4" color="#cfe0b8" />
               <div className="rsvp-inner" data-reveal>
                  <Animal name="elefante" className="rsvp-animal" />
                  <h2>¡Únete a la expedición!</h2>
                  <p>
                     Confirma tu lugar en el jeep para que no te quedes en la
                     sabana.
                  </p>
                  <Button variant="light" onClick={() => open("rsvp")}>
                     CONFIRMAR ASISTENCIA
                  </Button>
               </div>
            </section>

            {/* ---------------- GALERÍA (POLAROIDS) ---------------- */}
            {gallery.length > 0 && (
               <section className="gallery" id="galeria">
                  <SectionTitle
                     kicker="Recuerdos"
                     title={config.galeria.titulo}
                  >
                     {config.galeria.subtitulo}
                  </SectionTitle>
                  <div className="vine" aria-hidden="true" />
                  <div className="polaroids">
                     {gallery.map((src, i) => (
                        <button
                           type="button"
                           className="polaroid"
                           key={src}
                           onClick={() => setSlide(i)}
                           aria-label={`Ver foto ${i + 1} en grande`}
                        >
                           <span className="clip" aria-hidden="true" />
                           <img src={src} alt="" loading="lazy" />
                           <span className="caption">Aventura #{i + 1}</span>
                        </button>
                     ))}
                  </div>
               </section>
            )}

            {slide !== null && gallery.length > 0 && (
               <div
                  className="lightbox"
                  role="dialog"
                  aria-modal="true"
                  aria-label={`Foto ${slide + 1} de ${gallery.length}`}
                  onMouseDown={(e) => {
                     if (e.target === e.currentTarget) setSlide(null);
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
               >
                  <button
                     type="button"
                     className="lightbox-close"
                     onClick={() => setSlide(null)}
                     aria-label="Cerrar foto ampliada"
                  >
                     ×
                  </button>
                  <button
                     type="button"
                     className="lightbox-nav prev"
                     onClick={() => changeSlide(-1)}
                     aria-label="Foto anterior"
                  >
                     ‹
                  </button>
                  <img src={gallery[slide]} alt={`Foto ${slide + 1}`} />
                  <button
                     type="button"
                     className="lightbox-nav next"
                     onClick={() => changeSlide(1)}
                     aria-label="Foto siguiente"
                  >
                     ›
                  </button>
                  <span className="lightbox-counter">
                     {slide + 1} / {gallery.length}
                  </span>
               </div>
            )}

            {/* ---------------- FIESTA ---------------- */}
            <section className="party" id="fiesta">
               <SectionTitle kicker="Guía del explorador" title="Antes de partir">
                  Algunos detalles para que la aventura sea perfecta.
               </SectionTitle>
               <div className="party-grid">
                  {(
                     [
                        ["dress", "Vestimenta", "¿Qué me pongo?", "jirafa"],
                        ["tips", "Tips y notas", "Información útil", "elefante"],
                        ["gifts", "Regalos", "Si deseas obsequiarme", "mono"],
                     ] as const
                  ).map(([key, title, sub, animal]) => (
                     <article className="party-card" key={key} data-reveal>
                        <Animal name={animal} className="party-animal" />
                        <h3>{title}</h3>
                        <p>{sub}</p>
                        <Button onClick={() => open(key)}>+ INFO</Button>
                     </article>
                  ))}
               </div>
            </section>

            <PawTrail flip />

            {/* ---------------- COMPARTE FOTOS ---------------- */}
            <section className="photos-section">
               <div className="photos-inner" data-reveal>
                  <Icon name="camera" />
                  <h2>Captura cada momento salvaje</h2>
                  <p>Comparte tus fotos y videos de este día tan especial</p>
                  {config.fotos.albumUrl ? (
                     <a
                        className="hashtag"
                        href={config.fotos.albumUrl}
                        target="_blank"
                        rel="noreferrer"
                     >
                        <strong>{config.fotos.hashtag}</strong>
                        <span>COMPARTE TUS FOTOS AQUÍ</span>
                     </a>
                  ) : (
                     <strong className="hashtag">{config.fotos.hashtag}</strong>
                  )}
               </div>
            </section>

            {/* ---------------- PIE ---------------- */}
            <footer>
               <div className="footer-animals" aria-hidden="true">
                  {ANIMALES.map((a) => (
                     <Animal key={a} name={a} />
                  ))}
               </div>
               <p className="footer-cierre">{config.cierre}</p>
               <h2>{config.nombre}</h2>
               <p className="footer-age">{config.edadTexto}</p>
               <nav>
                  <button type="button" onClick={() => open("rsvp")}>
                     Confirmar asistencia
                  </button>
                  <a href="#celebracion">Agendar celebración</a>
               </nav>
               <small>
                  Desarrollado con <Icon name="heart" /> por{" "}
                  <b>{config.creditos}</b>
               </small>
            </footer>
         </div>

         {/* ---------------- BIENVENIDA ---------------- */}
         {modal === "welcome" && (
            <div className="modal-backdrop welcome" role="presentation">
               <div
                  className="modal-card welcome-card"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="welcome-title"
               >
                  <div className="welcome-animals" aria-hidden="true">
                     <Animal name="elefante" />
                     <Animal name="leon" />
                     <Animal name="mono" />
                  </div>
                  <p>¡Hola, explorador! Bienvenid@ a la aventura de</p>
                  <h2 id="welcome-title">{config.nombre}</h2>
                  {hasMusic ? (
                     <>
                        <span>La música de fondo es parte de la expedición</span>
                        <Button onClick={() => enter(true)}>
                           ENTRAR CON MÚSICA
                        </Button>
                        <button
                           type="button"
                           className="text-button"
                           onClick={() => enter(false)}
                        >
                           Entrar sin música
                        </button>
                     </>
                  ) : (
                     <Button onClick={() => enter(false)}>
                        ¡COMENZAR LA AVENTURA!
                     </Button>
                  )}
               </div>
            </div>
         )}
         {modal && modal !== "welcome" && (
            <Modal
               active={modal}
               close={() => setModal(null)}
               invitado={invitado}
            />
         )}
      </main>
   );
}

export default App;
