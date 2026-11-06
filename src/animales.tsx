/**
 * Ilustraciones propias en SVG (estilo tierno/kawaii).
 * No dependen de imágenes externas: son transparentes, livianas y libres de derechos.
 */

export type AnimalName = "leon" | "elefante" | "jirafa" | "cebra" | "mono";

export const ANIMALES: AnimalName[] = [
   "leon",
   "elefante",
   "jirafa",
   "cebra",
   "mono",
];

const INK = "#3b2a20";
const CHEEK = "#f4a6a0";

function Eye({ x, y }: { x: number; y: number }) {
   return (
      <g>
         <circle cx={x} cy={y} r={5} fill={INK} />
         <circle cx={x + 1.7} cy={y - 1.8} r={1.7} fill="#fff" />
      </g>
   );
}

function Cheeks({ y, dx = 20 }: { y: number; dx?: number }) {
   return (
      <g fill={CHEEK} opacity={0.75}>
         <ellipse cx={60 - dx} cy={y} rx={6} ry={3.6} />
         <ellipse cx={60 + dx} cy={y} rx={6} ry={3.6} />
      </g>
   );
}

function Smile({ y, w = 10 }: { y: number; w?: number }) {
   return (
      <path
         d={`M${60 - w / 2} ${y} q${w / 2} ${w / 2} ${w} 0`}
         fill="none"
         stroke={INK}
         strokeWidth={2.4}
         strokeLinecap="round"
      />
   );
}

function Leon() {
   const mane = Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2;
      return [60 + Math.cos(a) * 38, 62 + Math.sin(a) * 38];
   });
   return (
      <svg viewBox="0 0 120 124" aria-hidden="true">
         <g fill="#e39a4f">
            <circle cx={60} cy={62} r={40} />
            {mane.map(([x, y]) => (
               <circle key={`${x}-${y}`} cx={x} cy={y} r={13} />
            ))}
         </g>
         <circle cx={37} cy={38} r={10} fill="#f6d08a" />
         <circle cx={37} cy={38} r={5} fill="#eaa98a" />
         <circle cx={83} cy={38} r={10} fill="#f6d08a" />
         <circle cx={83} cy={38} r={5} fill="#eaa98a" />
         <circle cx={60} cy={64} r={32} fill="#f6d08a" />
         <ellipse cx={60} cy={77} rx={15} ry={10.5} fill="#fbe6bd" />
         <Eye x={48} y={60} />
         <Eye x={72} y={60} />
         <Cheeks y={72} dx={19} />
         <path
            d="M54 71 q6 -3 12 0 q-2 6 -6 6 q-4 0 -6 -6z"
            fill="#8a5a3c"
         />
         <path
            d="M60 77 v3 M53 80 q3.5 4 7 0 q3.5 4 7 0"
            fill="none"
            stroke={INK}
            strokeWidth={2.2}
            strokeLinecap="round"
         />
      </svg>
   );
}

function Elefante() {
   return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
         <ellipse cx={26} cy={58} rx={22} ry={27} fill="#aebbd0" />
         <ellipse cx={28} cy={58} rx={13} ry={18} fill="#f3c2c8" />
         <ellipse cx={94} cy={58} rx={22} ry={27} fill="#aebbd0" />
         <ellipse cx={92} cy={58} rx={13} ry={18} fill="#f3c2c8" />
         <path
            d="M51 76 q-2 22 8 30 q9 6 14 -3 q-7 2 -9 -5 q-3 -10 -1 -22z"
            fill="#c3cee0"
         />
         <circle cx={60} cy={56} r={32} fill="#c3cee0" />
         <path
            d="M54 28 q-2 -8 4 -8 M60 26 q0 -9 6 -7"
            fill="none"
            stroke="#aebbd0"
            strokeWidth={3}
            strokeLinecap="round"
         />
         <Eye x={48} y={55} />
         <Eye x={72} y={55} />
         <Cheeks y={67} dx={20} />
         <path
            d="M57 92 q2 2 4 0"
            fill="none"
            stroke="#9aa7bc"
            strokeWidth={2}
            strokeLinecap="round"
         />
      </svg>
   );
}

function Jirafa() {
   return (
      <svg viewBox="0 0 120 160" aria-hidden="true">
         <path d="M47 64 h26 v96 h-26z" fill="#f4c76b" />
         <g fill="#dc9a50">
            <ellipse cx={55} cy={86} rx={6} ry={5} />
            <ellipse cx={67} cy={104} rx={5} ry={6} />
            <ellipse cx={54} cy={122} rx={6} ry={5} />
            <ellipse cx={66} cy={142} rx={5} ry={5} />
         </g>
         <g stroke="#c98a3e" strokeWidth={4} strokeLinecap="round">
            <path d="M48 26 L45 10" />
            <path d="M72 26 L75 10" />
         </g>
         <circle cx={45} cy={9} r={4.5} fill="#b5743a" />
         <circle cx={75} cy={9} r={4.5} fill="#b5743a" />
         <ellipse
            cx={31}
            cy={34}
            rx={11}
            ry={5.5}
            fill="#f4c76b"
            transform="rotate(-25 31 34)"
         />
         <ellipse
            cx={89}
            cy={34}
            rx={11}
            ry={5.5}
            fill="#f4c76b"
            transform="rotate(25 89 34)"
         />
         <ellipse cx={60} cy={44} rx={27} ry={25} fill="#f4c76b" />
         <g fill="#e3a456">
            <circle cx={42} cy={30} r={4} />
            <circle cx={77} cy={28} r={3} />
            <circle cx={80} cy={46} r={2.5} />
         </g>
         <ellipse cx={60} cy={62} rx={18} ry={12} fill="#f9deb0" />
         <circle cx={54} cy={60} r={1.9} fill="#8a5a3c" />
         <circle cx={66} cy={60} r={1.9} fill="#8a5a3c" />
         <Eye x={49} y={42} />
         <Eye x={71} y={42} />
         <Cheeks y={52} dx={23} />
         <Smile y={66} w={9} />
      </svg>
   );
}

function Cebra() {
   return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
         <g stroke="#3b3b3b" strokeWidth={3}>
            <ellipse
               cx={38}
               cy={24}
               rx={7}
               ry={14}
               fill="#fff"
               transform="rotate(-22 38 24)"
            />
            <ellipse
               cx={82}
               cy={24}
               rx={7}
               ry={14}
               fill="#fff"
               transform="rotate(22 82 24)"
            />
         </g>
         <ellipse
            cx={38}
            cy={25}
            rx={3}
            ry={8}
            fill="#f3c2c8"
            transform="rotate(-22 38 25)"
         />
         <ellipse
            cx={82}
            cy={25}
            rx={3}
            ry={8}
            fill="#f3c2c8"
            transform="rotate(22 82 25)"
         />
         <path
            d="M46 24 l4 -12 l4 9 l4 -12 l4 12 l4 -9 l4 12 z"
            fill="#3b3b3b"
         />
         <ellipse
            cx={60}
            cy={58}
            rx={29}
            ry={34}
            fill="#fff"
            stroke="#3b3b3b"
            strokeWidth={3}
         />
         <g
            fill="none"
            stroke="#3b3b3b"
            strokeWidth={4}
            strokeLinecap="round"
         >
            <path d="M60 25 v10" />
            <path d="M45 33 q8 4 5 12" />
            <path d="M75 33 q-8 4 -5 12" />
            <path d="M33 50 q8 2 8 8" />
            <path d="M87 50 q-8 2 -8 8" />
         </g>
         <ellipse cx={60} cy={80} rx={21} ry={14} fill="#ddd3c9" />
         <ellipse cx={53} cy={79} rx={2.6} ry={3.2} fill="#6b5b4e" />
         <ellipse cx={67} cy={79} rx={2.6} ry={3.2} fill="#6b5b4e" />
         <Eye x={48} y={57} />
         <Eye x={72} y={57} />
         <Cheeks y={68} dx={21} />
         <Smile y={86} w={8} />
      </svg>
   );
}

function Mono() {
   return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
         <circle cx={22} cy={62} r={14} fill="#a8714c" />
         <circle cx={22} cy={62} r={8} fill="#f1cfa6" />
         <circle cx={98} cy={62} r={14} fill="#a8714c" />
         <circle cx={98} cy={62} r={8} fill="#f1cfa6" />
         <circle cx={60} cy={60} r={38} fill="#a8714c" />
         <path d="M52 24 q4 -12 10 -4 q4 -8 8 2" fill="#8d5c3b" />
         <g fill="#f1cfa6">
            <circle cx={48} cy={55} r={14} />
            <circle cx={72} cy={55} r={14} />
            <ellipse cx={60} cy={75} rx={26} ry={18} />
         </g>
         <Eye x={48} y={56} />
         <Eye x={72} y={56} />
         <circle cx={56.5} cy={69} r={1.7} fill={INK} />
         <circle cx={63.5} cy={69} r={1.7} fill={INK} />
         <Cheeks y={74} dx={22} />
         <Smile y={78} w={16} />
      </svg>
   );
}

export function Animal({
   name,
   className = "",
}: {
   name: AnimalName;
   className?: string;
}) {
   const C = {
      leon: Leon,
      elefante: Elefante,
      jirafa: Jirafa,
      cebra: Cebra,
      mono: Mono,
   }[name];
   return (
      <span className={`animal animal-${name} ${className}`}>
         <C />
      </span>
   );
}

/** Huella de animal. */
export function Paw({ className = "" }: { className?: string }) {
   return (
      <svg className={`paw ${className}`} viewBox="0 0 40 40" aria-hidden="true">
         <g fill="currentColor">
            <ellipse cx={20} cy={27} rx={9} ry={8} />
            <ellipse cx={9} cy={16} rx={3.6} ry={4.6} />
            <ellipse cx={16} cy={9} rx={3.6} ry={4.8} />
            <ellipse cx={24} cy={9} rx={3.6} ry={4.8} />
            <ellipse cx={31} cy={16} rx={3.6} ry={4.6} />
         </g>
      </svg>
   );
}

/** Hoja tropical. */
export function Leaf({
   className = "",
   color = "#7fa77a",
}: {
   className?: string;
   color?: string;
}) {
   return (
      <svg className={`leaf ${className}`} viewBox="0 0 100 100" aria-hidden="true">
         <path d="M50 98 C8 80 4 30 50 3 C96 30 92 80 50 98Z" fill={color} />
         <g
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth={2.2}
            strokeLinecap="round"
         >
            <path d="M50 96 V10" />
            <path d="M50 30 L30 20 M50 45 L24 36 M50 60 L22 54 M50 75 L28 72" />
            <path d="M50 30 L70 20 M50 45 L76 36 M50 60 L78 54 M50 75 L72 72" />
         </g>
      </svg>
   );
}

/** Acacia (árbol típico de la sabana). */
export function Acacia({ className = "" }: { className?: string }) {
   return (
      <svg className={`acacia ${className}`} viewBox="0 0 200 140" aria-hidden="true">
         <path
            d="M96 140 C98 110 92 92 78 78 M100 140 C102 108 108 92 126 76 M98 112 C90 100 70 92 58 84"
            fill="none"
            stroke="#9b7653"
            strokeWidth={7}
            strokeLinecap="round"
         />
         <g fill="#8fae7e">
            <ellipse cx={100} cy={62} rx={92} ry={20} />
            <ellipse cx={70} cy={50} rx={48} ry={16} />
            <ellipse cx={132} cy={48} rx={52} ry={17} />
         </g>
      </svg>
   );
}
