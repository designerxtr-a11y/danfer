// Calendario Machu Picchu 2027: rutas oficiales, horarios y precio.
// Módulo puro (sin imports de Next) para poder testearlo con node --test.

export type RouteId = "1A" | "1B" | "1C" | "1D" | "2A" | "2B" | "3A" | "3B" | "3C" | "3D";
type T3 = { es: string; en: string; ja: string };

export interface Mp2027Route {
  id: RouteId;
  circuit: 1 | 2 | 3;
  name: T3;
  desc: T3;
  /** Incluye una montaña o caminata extra: cupos muy limitados, turnos de mañana. */
  mountain: boolean;
  recommended?: boolean;
  /** Horas de ingreso preferidas (se confirman al comprar el boleto). */
  hours: string[];
  /** Foto real tomada con ese boleto (URL pública). Opcional. */
  photo?: string;
}

const DAY_HOURS = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];
const MOUNTAIN_HOURS = ["07:00", "08:00", "09:00", "10:00"];

export const ROUTES: Mp2027Route[] = [
  {
    id: "1A", circuit: 1, mountain: true, hours: MOUNTAIN_HOURS,
    name: { es: "Montaña Machupicchu", en: "Machupicchu Mountain", ja: "マチュピチュ山" },
    desc: { es: "Subida larga con la vista más alta de la ciudadela y el valle.", en: "Long climb to the highest viewpoint over the citadel and valley.", ja: "長い登りで、遺跡と谷を一番高い所から見渡せます。" },
  },
  {
    id: "1B", circuit: 1, mountain: false, hours: DAY_HOURS,
    name: { es: "Terraza superior", en: "Upper terrace", ja: "上部テラス" },
    desc: { es: "La foto panorámica clásica desde arriba. No baja a la ciudad.", en: "The classic panoramic photo from above. Does not go down into the city.", ja: "上から見る定番のパノラマ写真。市街地には下りません。" },
  },
  {
    id: "1C", circuit: 1, mountain: true, hours: MOUNTAIN_HOURS,
    name: { es: "Portada Intipunku", en: "Inti Punku Sun Gate", ja: "インティプンク（太陽の門）" },
    desc: { es: "Caminata a la Puerta del Sol, final del Camino Inca.", en: "Hike to the Sun Gate, the end of the Inca Trail.", ja: "インカ道の終点、太陽の門までのハイキング。" },
  },
  {
    id: "1D", circuit: 1, mountain: false, hours: DAY_HOURS,
    name: { es: "Puente Inca", en: "Inca Bridge", ja: "インカ橋" },
    desc: { es: "Sendero corto al puente inca sobre el precipicio.", en: "Short trail to the Inca bridge on the cliff.", ja: "断崖のインカ橋までの短い散策路。" },
  },
  {
    id: "2A", circuit: 2, mountain: false, recommended: true, hours: DAY_HOURS,
    name: { es: "Clásica (diseñada)", en: "Classic (designed)", ja: "クラシックルート" },
    desc: { es: "La foto postal y el recorrido completo por templos y plazas. Ideal para la primera visita.", en: "The postcard photo plus the full tour of temples and plazas. Best for a first visit.", ja: "絵はがきの景色と神殿・広場をすべて回るルート。初めての方におすすめ。" },
  },
  {
    id: "2B", circuit: 2, mountain: false, hours: DAY_HOURS,
    name: { es: "Terraza inferior", en: "Lower terrace", ja: "下部テラス" },
    desc: { es: "Recorrido por la ciudad desde la parte baja, con los templos principales.", en: "City tour from the lower level, with the main temples.", ja: "下の段から市街地と主要な神殿をめぐります。" },
  },
  {
    id: "3A", circuit: 3, mountain: true, hours: MOUNTAIN_HOURS,
    name: { es: "Huayna Picchu", en: "Huayna Picchu", ja: "ワイナピチュ" },
    desc: { es: "La montaña de las fotos: subida empinada y vistas de vértigo.", en: "The mountain in the photos: steep climb and dizzying views.", ja: "写真でおなじみの山。急な登りと迫力の眺め。" },
  },
  {
    id: "3B", circuit: 3, mountain: false, hours: DAY_HOURS,
    photo: "/images/rutas-mp/3b.jpg",
    name: { es: "Realeza (diseñada)", en: "Royalty (designed)", ja: "王族ルート" },
    desc: { es: "Sector de la realeza y templos del nivel inferior. Ritmo tranquilo.", en: "Royal sector and lower-level temples. Relaxed pace.", ja: "王族の区域と下層の神殿。ゆったり歩けます。" },
  },
  {
    id: "3C", circuit: 3, mountain: true, hours: MOUNTAIN_HOURS,
    name: { es: "Gran Caverna", en: "Great Cavern", ja: "大洞窟" },
    desc: { es: "Caminata al Templo de la Luna por la ladera de Huayna Picchu.", en: "Hike to the Temple of the Moon along Huayna Picchu.", ja: "ワイナピチュの斜面を通り月の神殿へ。" },
  },
  {
    id: "3D", circuit: 3, mountain: true, hours: MOUNTAIN_HOURS,
    name: { es: "Huchuy Picchu", en: "Huchuy Picchu", ja: "ウチュイピチュ" },
    desc: { es: "Montaña pequeña y corta, buena opción para todos.", en: "Small, short mountain, a good option for everyone.", ja: "小さく短い山で、どなたにもおすすめ。" },
  },
];

export const PRICE_PER_PERSON = 380;
export const CARD_FEE_RATE = 0.05;
export const MAX_TRAVELERS = 10;

const round2 = (n: number) => Math.round(n * 100) / 100;

export function mp2027Total(travelers: number) {
  if (!Number.isInteger(travelers) || travelers < 1 || travelers > MAX_TRAVELERS) {
    throw new Error(`invalid travelers: ${travelers}`);
  }
  const subtotal = PRICE_PER_PERSON * travelers;
  const fee = round2(subtotal * CARD_FEE_RATE);
  return { subtotal, fee, total: round2(subtotal + fee) };
}

export function isValid2027Date(iso: string): boolean {
  if (!/^2027-\d{2}-\d{2}$/.test(iso)) return false;
  const d = new Date(iso + "T00:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso;
}

/** Temporada alta: mayo a septiembre. */
export function isHighSeason(iso: string): boolean {
  const m = Number(iso.slice(5, 7));
  return m >= 5 && m <= 9;
}

export function routeById(id: string): Mp2027Route | undefined {
  return ROUTES.find((r) => r.id === id);
}

/**
 * Demanda real esperada por fecha (sin inventar cupos):
 * - event: festividades que se agotan primero
 * - highWeekend: fin de semana en temporada alta
 * - high: temporada alta (mayo–septiembre)
 * - rainy: temporada de lluvias (enero–marzo), más tranquila
 * - regular: resto del año
 */
export type Demand = "event" | "highWeekend" | "high" | "rainy" | "regular";

const EVENTS: { from: string; to: string; name: T3 }[] = [
  { from: "2027-01-01", to: "2027-01-03", name: { es: "Año Nuevo", en: "New Year", ja: "お正月" } },
  { from: "2027-03-25", to: "2027-03-28", name: { es: "Semana Santa", en: "Holy Week", ja: "聖週間" } },
  { from: "2027-06-20", to: "2027-06-26", name: { es: "Inti Raymi", en: "Inti Raymi", ja: "インティ・ライミ" } },
  { from: "2027-07-26", to: "2027-07-31", name: { es: "Fiestas Patrias", en: "Peru's National Holidays", ja: "ペルー独立記念日" } },
  { from: "2027-12-24", to: "2027-12-31", name: { es: "Navidad y Año Nuevo", en: "Christmas & New Year", ja: "クリスマス・年末" } },
];

export function eventOn(iso: string): T3 | null {
  return EVENTS.find((e) => iso >= e.from && iso <= e.to)?.name ?? null;
}

export function demandOf(iso: string): Demand {
  if (eventOn(iso)) return "event";
  const m = Number(iso.slice(5, 7));
  if (isHighSeason(iso)) {
    const dow = new Date(iso + "T00:00:00Z").getUTCDay(); // 0 dom, 6 sáb
    return dow === 0 || dow === 6 ? "highWeekend" : "high";
  }
  return m <= 3 ? "rainy" : "regular";
}
