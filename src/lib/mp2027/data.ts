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

export type PackageId = "fullday" | "2d1n" | "2d1n-valle";

export interface Mp2027Package {
  id: PackageId;
  price: number;
  tourSlug: string;
  name: T3;
  desc: T3;
  duration: T3;
  includes: T3[];
  excludes: T3;
  /** Hora mínima de ingreso (Full Day: el tren llega cerca del mediodía). */
  minHour?: string;
}

const t3 = (es: string, en: string, ja: string): T3 => ({ es, en, ja });

const MP_CORE: T3[] = [
  t3("Recojo en tu hotel de Cusco y traslado a Ollantaytambo (ida y vuelta)", "Hotel pickup in Cusco and transfer to Ollantaytambo (round trip)", "クスコのホテル送迎とオリャンタイタンボまでの往復移動"),
  t3("Tren turístico ida y vuelta", "Round-trip tourist train", "観光列車（往復）"),
  t3("Bus de subida y bajada a Machu Picchu", "Bus up and down to Machu Picchu", "マチュピチュ往復バス"),
  t3("Entrada a Machu Picchu (tu ruta y hora)", "Machu Picchu entrance ticket (your route and time)", "マチュピチュ入場券（ご希望のルート・時間）"),
  t3("Guía profesional", "Professional guide", "プロのガイド"),
];
const HOTEL = t3("1 noche de hotel en Aguas Calientes con desayuno", "1 hotel night in Aguas Calientes with breakfast", "アグアスカリエンテスのホテル1泊（朝食付き）");

export const PACKAGES: Mp2027Package[] = [
  {
    id: "fullday", price: 320, tourSlug: "machu-picchu-full-day", minHour: "10:00",
    duration: t3("1 día", "1 day", "日帰り"),
    includes: MP_CORE,
    excludes: t3("Comidas, propinas, Huayna Picchu (extra)", "Meals, tips, Huayna Picchu (extra)", "食事、チップ、ワイナピチュ（追加料金）"),
    name: { es: "Full Day", en: "Full Day", ja: "日帰り" },
    desc: t3("Ida y vuelta a Machu Picchu el mismo día, en tren turístico desde Ollantaytambo.", "Same-day round trip to Machu Picchu by tourist train from Ollantaytambo.", "オリャンタイタンボから観光列車で行く日帰りマチュピチュ。"),
  },
  {
    id: "2d1n", price: 380, tourSlug: "machu-picchu-2d-1n",
    duration: t3("2 días / 1 noche", "2 days / 1 night", "1泊2日"),
    includes: [...MP_CORE, HOTEL],
    excludes: t3("Almuerzo y cena, propinas, Huayna Picchu (extra)", "Lunch and dinner, tips, Huayna Picchu (extra)", "昼食・夕食、チップ、ワイナピチュ（追加料金）"),
    name: { es: "2 días / 1 noche", en: "2 days / 1 night", ja: "1泊2日" },
    desc: t3("Llegas a Aguas Calientes el día anterior, duermes ahí y entras temprano, sin apuro.", "Arrive in Aguas Calientes the day before, stay overnight and enter early, unhurried.", "前日にアグアスカリエンテスへ。1泊して翌朝ゆっくり入場。"),
  },
  {
    id: "2d1n-valle", price: 420, tourSlug: "machu-picchu-2d-1n",
    duration: t3("2 días / 1 noche", "2 days / 1 night", "1泊2日"),
    includes: [
      t3("Día 1: Valle Sagrado con guía (Chinchero, Moray, Maras, Ollantaytambo)", "Day 1: guided Sacred Valley (Chinchero, Moray, Maras, Ollantaytambo)", "1日目：ガイド付き聖なる谷（チンチェロ、モライ、マラス、オリャンタイタンボ）"),
      t3("Almuerzo buffet en el Valle Sagrado", "Buffet lunch in the Sacred Valley", "聖なる谷でのビュッフェランチ"),
      ...MP_CORE.slice(1),
      HOTEL,
      t3("Traslado de regreso Ollantaytambo–Cusco", "Return transfer Ollantaytambo–Cusco", "オリャンタイタンボ→クスコの帰路送迎"),
    ],
    excludes: t3("Boleto Turístico del Cusco y entrada a Maras, cena, propinas", "Cusco Tourist Ticket and Maras entrance, dinner, tips", "クスコ周遊券・マラス入場料、夕食、チップ"),
    name: { es: "2D/1N + Valle Sagrado", en: "2D/1N + Sacred Valley", ja: "1泊2日＋聖なる谷" },
    desc: t3("Día 1 recorres el Valle Sagrado y tomas el tren desde Ollantaytambo; día 2 Machu Picchu.", "Day 1 tour the Sacred Valley and take the train from Ollantaytambo; day 2 Machu Picchu.", "1日目は聖なる谷を観光しオリャンタイタンボから列車へ。2日目はマチュピチュ。"),
  },
];

export function packageById(id: string): Mp2027Package | undefined {
  return PACKAGES.find((p) => p.id === id);
}

/** Horas de ingreso válidas para una ruta según el paquete. */
export function hoursFor(route: Mp2027Route, pkg: Mp2027Package | undefined): string[] {
  return pkg?.minHour ? route.hours.filter((h) => h >= pkg.minHour!) : route.hours;
}

export const CARD_FEE_RATE = 0.05;
export const MAX_TRAVELERS = 10;

const round2 = (n: number) => Math.round(n * 100) / 100;

export function mp2027Total(travelers: number, pkgId: PackageId = "2d1n") {
  if (!Number.isInteger(travelers) || travelers < 1 || travelers > MAX_TRAVELERS) {
    throw new Error(`invalid travelers: ${travelers}`);
  }
  const pkg = packageById(pkgId);
  if (!pkg) throw new Error(`invalid package: ${pkgId}`);
  const subtotal = pkg.price * travelers;
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
