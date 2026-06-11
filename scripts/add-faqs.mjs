// Añade una sección "## Preguntas frecuentes" (ES) / "## Frequently asked
// questions" (EN) al final del body_md de los posts listados abajo.
// El frontend la detecta (src/lib/seo/faq-extract.ts) y emite schema FAQPage.
// Idempotente: si el body ya tiene sección FAQ en ese idioma, lo salta.
// Uso: node scripts/add-faqs.mjs [slug]   (sin slug = todos)
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const FAQ_HEADING = /^##\s+.*(preguntas frecuentes|frequently asked|faq)\b/im;

/** @type {Record<string, { es: {q:string,a:string}[], en: {q:string,a:string}[] }>} */
const FAQS = {
  "como-llegar-a-machu-picchu-desde-cusco": {
    es: [
      {
        q: "¿Se puede llegar a Machu Picchu en auto?",
        a: "No. No existe carretera directa hasta la ciudadela: toda ruta combina tren o caminata. Lo más común es tomar el tren desde Ollantaytambo hasta Aguas Calientes y subir en bus los últimos 30 minutos.",
      },
      {
        q: "¿Cuánto cuesta el tren a Machu Picchu?",
        a: "Entre US$70 y US$170 por tramo según el servicio: Expedition/Voyager son los económicos y Vistadome/The 360° los panorámicos. Ida y vuelta, calcula entre US$140 y US$340 por persona.",
      },
      {
        q: "¿Cuál es la forma más barata de llegar?",
        a: "La ruta por Hidroeléctrica: minivan desde Cusco (6–7 horas) más una caminata de 2,5–3 horas junto a la vía férrea. Cuesta US$30–60 ida y vuelta, pero toma un día entero de viaje y no se recomienda en plena temporada de lluvias.",
      },
      {
        q: "¿Necesito pasaporte para entrar a Machu Picchu?",
        a: "Sí, el pasaporte original (no fotocopia). Te lo piden al abordar el tren y en la puerta de la ciudadela, y debe coincidir con el documento con el que compraste la entrada.",
      },
    ],
    en: [
      {
        q: "Can you get to Machu Picchu by car?",
        a: "No. There is no direct road to the citadel: every route combines train or hiking. The most common option is taking the train from Ollantaytambo to Aguas Calientes and riding the bus up for the last 30 minutes.",
      },
      {
        q: "How much does the train to Machu Picchu cost?",
        a: "Between US$70 and US$170 each way depending on the service: Expedition/Voyager are the budget options and Vistadome/The 360° the panoramic ones. Round trip, expect US$140 to US$340 per person.",
      },
      {
        q: "What is the cheapest way to get there?",
        a: "The Hidroeléctrica route: a minivan from Cusco (6–7 hours) plus a 2.5–3 hour walk along the railway. It costs US$30–60 round trip, but it takes a full travel day and is not recommended at the height of the rainy season.",
      },
      {
        q: "Do I need my passport to enter Machu Picchu?",
        a: "Yes, your original passport (not a copy). It is checked when boarding the train and at the citadel gate, and it must match the document you used to buy your ticket.",
      },
    ],
  },

  "entradas-machu-picchu-circuitos": {
    es: [
      {
        q: "¿Cuánto cuesta la entrada a Machu Picchu en 2026?",
        a: "Alrededor de S/152 (unos US$40) para extranjero adulto en un circuito estándar. Los boletos combinados con Huayna Picchu o Montaña Machupicchu suben a S/200 aproximadamente.",
      },
      {
        q: "¿Con cuánta anticipación debo comprar mi entrada?",
        a: "Con 1 a 2 meses en temporada baja. En temporada alta (mayo a septiembre), y siempre que quieras Huayna Picchu o Montaña, reserva con 4 a 6 meses de anticipación.",
      },
      {
        q: "¿Qué circuito de Machu Picchu me conviene?",
        a: "Para una primera visita, el Circuito 2: incluye la foto clásica y el recorrido por el sector urbano. El Circuito 1 es panorámico y el Circuito 3 es el que se combina con Huayna Picchu.",
      },
      {
        q: "¿Cuánto tiempo puedo estar dentro de la ciudadela?",
        a: "Máximo 3 horas desde tu hora de ingreso. El recorrido es unidireccional y no hay reingreso: si sales, no puedes volver a entrar con el mismo boleto.",
      },
    ],
    en: [
      {
        q: "How much does the Machu Picchu ticket cost in 2026?",
        a: "Around S/152 (about US$40) for a foreign adult on a standard circuit. Combo tickets with Huayna Picchu or Machu Picchu Mountain go up to roughly S/200.",
      },
      {
        q: "How far in advance should I buy my ticket?",
        a: "One to two months in low season. In high season (May to September), and whenever you want Huayna Picchu or the Mountain, book 4 to 6 months ahead.",
      },
      {
        q: "Which Machu Picchu circuit should I choose?",
        a: "For a first visit, Circuit 2: it includes the classic postcard view and the walk through the urban sector. Circuit 1 is the panoramic one and Circuit 3 is the one combined with Huayna Picchu.",
      },
      {
        q: "How long can I stay inside the citadel?",
        a: "A maximum of 3 hours from your entry time. The route is one-way and there is no re-entry: once you leave, you cannot go back in with the same ticket.",
      },
    ],
  },

  "rainbow-mountain-vinicunca-guia": {
    es: [
      {
        q: "¿Qué altitud tiene Rainbow Mountain?",
        a: "El mirador de Vinicunca está a 5.036 metros sobre el nivel del mar, más alto que el Campo Base del Everest. Es la mayor altitud que alcanzará la mayoría de viajeros en Cusco.",
      },
      {
        q: "¿Qué tan difícil es la caminata?",
        a: "El sendero no es técnico: 1,5 a 2 horas de subida moderada. Lo exigente es la altitud, que reduce el oxígeno a la mitad. Si te agotas, hay caballos por US$30–40 que te acercan al mirador.",
      },
      {
        q: "¿Cuál es la mejor época para ir?",
        a: "De mayo a septiembre (temporada seca): cielos despejados y colores nítidos. En temporada de lluvias hay riesgo de niebla o de nieve que cubre los colores.",
      },
      {
        q: "¿Necesito aclimatarme antes de ir?",
        a: "Sí: pasa mínimo 2 días en Cusco antes de la excursión. Nunca la hagas el mismo día que llegas de Lima; el mal de altura puede arruinarte el viaje.",
      },
    ],
    en: [
      {
        q: "How high is Rainbow Mountain?",
        a: "The Vinicunca viewpoint sits at 5,036 meters (16,522 ft) above sea level, higher than Everest Base Camp. It is the highest altitude most travelers will reach in Cusco.",
      },
      {
        q: "How hard is the hike?",
        a: "The trail itself is not technical: 1.5 to 2 hours of moderate uphill walking. The altitude is what makes it tough, with half the oxygen of sea level. If you get exhausted, horses are available for US$30–40 most of the way up.",
      },
      {
        q: "When is the best time to go?",
        a: "May to September (dry season): clear skies and vivid colors. In the rainy season there is a risk of fog or snow covering the colors.",
      },
      {
        q: "Do I need to acclimatize first?",
        a: "Yes: spend at least 2 days in Cusco before this tour. Never do it the same day you arrive from Lima — altitude sickness can ruin your trip.",
      },
    ],
  },

  "laguna-humantay-guia": {
    es: [
      {
        q: "¿A qué altura está la Laguna Humantay?",
        a: "A 4.200 metros sobre el nivel del mar, al pie del nevado Humantay (5.473 m). El trek parte de Soraypampa, a 3.900 metros.",
      },
      {
        q: "¿Cuánto dura la caminata?",
        a: "Aproximadamente 1,5 horas de subida (2 km empinados) y 1 hora de bajada. Hay caballos por unos US$30 si prefieres no caminar la subida.",
      },
      {
        q: "¿Cuánto cuesta la entrada?",
        a: "La entrada comunal cuesta alrededor de S/20 y suele pagarse aparte del tour. Lleva efectivo en soles también para baños y caballo.",
      },
      {
        q: "¿Cuál es la mejor época para visitarla?",
        a: "De mayo a septiembre el turquesa se ve más intenso y el nevado despejado. En temporada de lluvias la laguna sigue siendo hermosa, pero la niebla puede apagar el color.",
      },
    ],
    en: [
      {
        q: "How high is Humantay Lake?",
        a: "It sits at 4,200 meters (13,780 ft) above sea level, at the foot of the Humantay glacier (5,473 m). The trek starts at Soraypampa, at 3,900 meters.",
      },
      {
        q: "How long is the hike?",
        a: "About 1.5 hours up (a steep 2 km) and 1 hour down. Horses are available for around US$30 if you prefer not to hike the ascent.",
      },
      {
        q: "How much is the entrance fee?",
        a: "The community entrance fee is around S/20 and is usually paid separately from the tour. Bring cash in soles for restrooms and the horse as well.",
      },
      {
        q: "When is the best time to visit?",
        a: "From May to September the turquoise color is at its most intense and the glacier is clearly visible. In the rainy season the lake is still beautiful, but fog can dull the color.",
      },
    ],
  },

  "salkantay-trek-guia": {
    es: [
      {
        q: "¿El Salkantay necesita permiso como el Camino Inca?",
        a: "No. El Salkantay no requiere permiso del SERNANP: puedes reservar con 2 a 4 semanas de anticipación, mientras el Camino Inca exige 4 a 6 meses.",
      },
      {
        q: "¿Qué tan difícil es el Salkantay Trek?",
        a: "Es exigente: unos 70 km en 5 días con el punto más alto en el abra Salkantay (4.630 m). No necesitas ser atleta, pero sí llegar aclimatado y con preparación física básica.",
      },
      {
        q: "¿Cuánto cuesta el trek?",
        a: "La versión clásica de 5 días / 4 noches cuesta entre US$550 y US$700, algo menos que el Camino Inca. Incluye guía, campamentos, comidas y la entrada a Machu Picchu según el operador.",
      },
      {
        q: "¿Cuál es la mejor época para hacerlo?",
        a: "De mayo a septiembre, en temporada seca. Febrero es el peor mes por las lluvias máximas; en esas fechas conviene replantear la ruta.",
      },
    ],
    en: [
      {
        q: "Does Salkantay require a permit like the Inca Trail?",
        a: "No. Salkantay does not require a SERNANP permit: you can book 2 to 4 weeks ahead, while the Inca Trail requires 4 to 6 months.",
      },
      {
        q: "How hard is the Salkantay Trek?",
        a: "It is demanding: about 70 km over 5 days, topping out at the Salkantay Pass (4,630 m / 15,190 ft). You do not need to be an athlete, but you must arrive acclimatized and with basic fitness.",
      },
      {
        q: "How much does the trek cost?",
        a: "The classic 5-day / 4-night version costs between US$550 and US$700, somewhat less than the Inca Trail. Depending on the operator it includes guide, camps, meals and the Machu Picchu ticket.",
      },
      {
        q: "When is the best time to do it?",
        a: "May to September, in the dry season. February is the worst month due to peak rains; around those dates it is better to reconsider the route.",
      },
    ],
  },

  "boleto-turistico-cusco": {
    es: [
      {
        q: "¿Cuánto cuesta el Boleto Turístico de Cusco?",
        a: "El Integral cuesta S/130, cubre los 16 sitios y vale por 10 días. Los Parciales cuestan S/70 y cubren un solo circuito (city tour, museos o Valle Sagrado) por 1 o 2 días.",
      },
      {
        q: "¿El Boleto Turístico incluye Machu Picchu?",
        a: "No. Machu Picchu se compra aparte en la web del Ministerio de Cultura. Tampoco incluye la Catedral, el templo de Qoricancha ni las Salineras de Maras.",
      },
      {
        q: "¿Dónde se compra?",
        a: "En la oficina del COSITUC (Av. El Sol 103, Cusco) o en la boletería del primer sitio que visites, como Sacsayhuamán o Pisac. Evita revendedores callejeros.",
      },
      {
        q: "¿Hay descuentos para estudiantes?",
        a: "Sí: con carné ISIC vigente pagas aproximadamente la mitad. Peruanos y ciudadanos de la Comunidad Andina (Bolivia, Colombia, Ecuador) tienen tarifa nacional presentando su documento.",
      },
    ],
    en: [
      {
        q: "How much does the Cusco Tourist Ticket cost?",
        a: "The full ticket (Integral) costs S/130, covers all 16 sites and is valid for 10 days. Partial tickets cost S/70 and cover a single circuit (city tour ruins, museums or Sacred Valley) for 1 or 2 days.",
      },
      {
        q: "Does the Tourist Ticket include Machu Picchu?",
        a: "No. Machu Picchu is purchased separately on the Ministry of Culture website. It also excludes the Cathedral, the Qoricancha temple and the Maras salt mines.",
      },
      {
        q: "Where do I buy it?",
        a: "At the COSITUC office (Av. El Sol 103, Cusco) or at the ticket booth of the first site you visit, such as Sacsayhuamán or Pisac. Avoid street resellers.",
      },
      {
        q: "Are there student discounts?",
        a: "Yes: with a valid ISIC card you pay roughly half price. Peruvians and Andean Community citizens (Bolivia, Colombia, Ecuador) get the national rate by showing their ID.",
      },
    ],
  },

  "tren-a-machu-picchu": {
    es: [
      {
        q: "¿PeruRail o IncaRail: cuál es mejor?",
        a: "Ambas son seguras y de buen nivel; difieren en horarios y servicio a bordo. Para el viajero promedio cualquiera de las dos cumple perfecto: elige por horario y precio.",
      },
      {
        q: "¿Desde qué estación conviene salir?",
        a: "Desde Ollantaytambo, en el Valle Sagrado: es el tramo más corto (~1,5 horas) y económico. Las salidas desde Poroy/Cusco duran unas 3,5 horas y cuestan más.",
      },
      {
        q: "¿Cuánto equipaje puedo llevar en el tren?",
        a: "Solo un bolso de mano de unos 5 kg (157 cm lineales). Deja la maleta grande en tu hotel de Cusco u Ollantaytambo; todos lo hacen así.",
      },
      {
        q: "¿El tren llega hasta la ciudadela?",
        a: "No: llega a Aguas Calientes (Machu Picchu Pueblo). Desde ahí falta el bus de subida de 25–30 minutos (boleto aparte) o una caminata de 1,5 horas de escaleras.",
      },
    ],
    en: [
      {
        q: "PeruRail or IncaRail: which is better?",
        a: "Both are safe and well run; they differ in schedules and onboard service. For the average traveler either works perfectly — choose based on departure time and price.",
      },
      {
        q: "Which station should I depart from?",
        a: "From Ollantaytambo, in the Sacred Valley: it is the shortest (~1.5 hours) and cheapest leg. Departures from Poroy/Cusco take about 3.5 hours and cost more.",
      },
      {
        q: "How much luggage can I take on the train?",
        a: "Only a carry-on bag of about 5 kg (157 linear cm). Leave your big suitcase at your hotel in Cusco or Ollantaytambo — everyone does.",
      },
      {
        q: "Does the train reach the citadel itself?",
        a: "No: it arrives at Aguas Calientes (Machu Picchu Pueblo). From there you still need the 25–30 minute shuttle bus (separate ticket) or a 1.5-hour stair climb.",
      },
    ],
  },

  "cuanto-cuesta-viajar-a-machu-picchu": {
    es: [
      {
        q: "¿Cuánto cuesta en total un viaje a Machu Picchu?",
        a: "Para 4 días centrados en Machu Picchu y Cusco: US$240–300 estilo mochilero, US$600–750 estándar y US$1.300 o más en plan premium, sin contar vuelos.",
      },
      {
        q: "¿Cuánto cuesta solo la entrada?",
        a: "Alrededor de S/152 (unos US$41) para extranjero adulto. Con Huayna Picchu o Montaña sube a S/200 aproximadamente.",
      },
      {
        q: "¿Cuánto cuesta un tour Full Day todo incluido?",
        a: "Entre US$380 y US$450 por persona, con transporte, tren, bus Consettur, entrada y guía resueltos en un solo día desde Cusco.",
      },
      {
        q: "¿Cómo puedo ahorrar en el viaje?",
        a: "Viaja en temporada media (abril–mayo o septiembre–octubre), reserva entrada y tren con anticipación, considera la ruta por Hidroeléctrica y come en menús locales en vez de restaurantes turísticos.",
      },
    ],
    en: [
      {
        q: "How much does a Machu Picchu trip cost in total?",
        a: "For 4 days focused on Machu Picchu and Cusco: US$240–300 backpacker style, US$600–750 standard and US$1,300+ premium, not counting flights.",
      },
      {
        q: "How much is the entrance ticket alone?",
        a: "Around S/152 (about US$41) for a foreign adult. With Huayna Picchu or the Mountain it rises to roughly S/200.",
      },
      {
        q: "How much is an all-inclusive Full Day tour?",
        a: "Between US$380 and US$450 per person, covering transport, train, Consettur bus, entrance ticket and guide in a single day from Cusco.",
      },
      {
        q: "How can I save money on the trip?",
        a: "Travel in shoulder season (April–May or September–October), book your ticket and train early, consider the Hidroeléctrica route, and eat local set menus instead of tourist restaurants.",
      },
    ],
  },
};

function buildSection(lc, items) {
  const heading =
    lc === "en" ? "## Frequently asked questions" : "## Preguntas frecuentes";
  const blocks = items.map((f) => `### ${f.q}\n\n${f.a}`);
  return `\n\n${heading}\n\n${blocks.join("\n\n")}\n`;
}

const only = process.argv[2];
const slugs = only ? [only] : Object.keys(FAQS);

for (const slug of slugs) {
  const faqs = FAQS[slug];
  if (!faqs) {
    console.error(`No hay FAQs definidas para "${slug}"`);
    continue;
  }
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("slug, body_md")
    .eq("slug", slug)
    .single();
  if (error || !post) {
    console.error(`${slug}: no encontrado (${error?.message})`);
    continue;
  }

  const body = { ...post.body_md };
  const applied = [];
  for (const lc of ["es", "en"]) {
    const current = body[lc];
    if (!current) continue; // sin cuerpo en ese idioma, no tocar
    if (FAQ_HEADING.test(current)) continue; // ya tiene FAQ, idempotente
    body[lc] = current.trimEnd() + buildSection(lc, faqs[lc]);
    applied.push(lc);
  }

  if (applied.length === 0) {
    console.log(`${slug}: ya tenía FAQ, sin cambios`);
    continue;
  }

  const { error: upErr } = await supabase
    .from("blog_posts")
    .update({ body_md: body })
    .eq("slug", slug);
  if (upErr) {
    console.error(`${slug}: ERROR ${upErr.message}`);
  } else {
    console.log(`${slug}: FAQ añadida [${applied.join(", ")}]`);
  }
}
