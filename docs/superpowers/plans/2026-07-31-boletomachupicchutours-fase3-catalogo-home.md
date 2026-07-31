# boletomachupicchutours.com — Fase 3: Catálogo de tours + contenido del home — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Poblar boletomachupicchutours.com con los 6 tours reales del negocio (contenido redactado desde cero, no copiado), FAQ por tour, y limpiar todo el contenido fabricado (fechas/cifras/ratings inventados) que quedó de un rebrand mecánico anterior, tanto en "Sobre nosotros"/footer como en el propio home (hero y sección de stats).

**Architecture:** Todo el trabajo ocurre en el repo `C:\xampp\htdocs\boletomachupicchutours` (git propio, Fase 1 ya completa y en producción, sitio sigue `noindex`). Un script Node uno-a-uno importa los datos "hecho" (precio, duración, fotos, categoría) desde el Supabase de Danfer (cuscotours-v2) y escribe contenido redactado a mano al Supabase propio. El resto son ediciones directas a componentes React/Next existentes.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Supabase (`@supabase/supabase-js` en el script, `@supabase/ssr` en la app), Tailwind, framer-motion, lucide-react.

## Global Constraints

- Todo el contenido nuevo (tours, FAQs, copy de sobre-nosotros) va **solo en español** — el inglés se deja para Fase 5, siguiendo el roadmap original. Los campos localizados (`Localized = {es, en?}`) se escriben solo con `es`; el helper `t()` ya hace fallback a `es` en páginas `/en`.
- Ninguna cifra/fecha/rating debe ser inventada o copiada de Danfer bajo el nombre "Boleto Machu Picchu Tours" salvo que sea verificable para esta marca. Donde se necesite un número de respaldo, usar hechos reales verificables en la propia base de datos (6 tours, 4 categorías, guías 100% certificados — confirmado por el usuario, mismo equipo real que Danfer).
- El sitio sigue `noindex, nofollow` — este plan no toca `robots.ts` ni el bloque `robots` de `layout.tsx` (eso es Fase 5).
- Sin framework de tests en el proyecto (`package.json` solo tiene `dev/build/start/lint`) — la verificación de cada tarea es manual: `npm run dev` + consultas SQL directas contra Supabase + revisión visual en el navegador, siguiendo el mismo patrón usado en el plan de Fase 1.
- Precios/categorías reales verificados en el Supabase de Danfer (cuscotours-v2), ya usados en este plan: `machu-picchu-full-day` $100, `camino-inca-4-dias` $150, `city-tour-cusco` $15, `valle-sagrado-vip` $125, `rainbow-mountain` $35, `laguna-humantay` $35.

---

### Task 1: Query `getToursBySlugs` (base para las filas temáticas del home)

**Files:**
- Modify: `src/lib/queries/tours.ts`

**Interfaces:**
- Produces: `getToursBySlugs(slugs: string[]): Promise<TourWithCategory[]>` — usada por Task 4.

- [ ] **Step 1: Agregar la función**

Al final de `src/lib/queries/tours.ts`, después de `getTourBySlug` (que termina en la línea 53 con `}`), agregar:

```ts
export async function getToursBySlugs(
  slugs: string[]
): Promise<TourWithCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tours")
    .select("*, category:categories(slug, name)")
    .in("slug", slugs)
    .eq("is_published", true);

  if (error) {
    console.error("[getToursBySlugs]", error);
    return [];
  }
  return (data ?? []) as unknown as TourWithCategory[];
}
```

- [ ] **Step 2: Verificar que compila**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && npx tsc --noEmit
```

Expected: sin errores nuevos relacionados a `tours.ts` (puede haber warnings preexistentes no relacionados; ignóralos).

- [ ] **Step 3: Commit**

```bash
git add src/lib/queries/tours.ts
git commit -m "feat(queries): getToursBySlugs para filas temáticas del home"
```

---

### Task 2: Importar y redactar los 6 tours reales

**Files:**
- Create: `scripts/import-tours-from-danfer.mjs`

**Depende de:** ninguna (independiente).

- [ ] **Step 1: Crear el script**

Crear `scripts/import-tours-from-danfer.mjs`:

```js
// scripts/import-tours-from-danfer.mjs
// Importa los datos "hecho" (precio, duración, fotos, categoría) de los 6
// tours reales desde el Supabase de Danfer (cuscotours-v2) y escribe el
// contenido redactado a mano (abajo, en CONTENT) al Supabase propio.
//
// Uso:
//   SOURCE_SUPABASE_URL=https://xxx.supabase.co \
//   SOURCE_SUPABASE_SERVICE_ROLE_KEY=eyJ... \
//   node scripts/import-tours-from-danfer.mjs
//
// Las credenciales de origen NUNCA se guardan en este repo — se pasan por
// variable de entorno en el momento (infraestructura separada, Fase 1).
// Re-ejecutable: upsert por slug, no duplica.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = readFileSync(join(__dirname, "..", ".env.local"), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.+)$`, "m"))?.[1]?.trim();

const target = createClient(
  get("NEXT_PUBLIC_SUPABASE_URL"),
  get("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const sourceUrl = process.env.SOURCE_SUPABASE_URL;
const sourceKey = process.env.SOURCE_SUPABASE_SERVICE_ROLE_KEY;
if (!sourceUrl || !sourceKey) {
  console.error(
    "Uso: SOURCE_SUPABASE_URL=... SOURCE_SUPABASE_SERVICE_ROLE_KEY=... node scripts/import-tours-from-danfer.mjs"
  );
  process.exit(1);
}
const source = createClient(sourceUrl, sourceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SLUGS = [
  "machu-picchu-full-day",
  "camino-inca-4-dias",
  "city-tour-cusco",
  "valle-sagrado-vip",
  "rainbow-mountain",
  "laguna-humantay",
];

// =====================================================
// Contenido redactado a mano (marca "Boleto Machu Picchu Tours").
// Los datos "hecho" (precio, duración, fotos, dificultad, etc.) se
// obtienen en vivo del Supabase de Danfer más abajo — no se hardcodean.
// =====================================================
const CONTENT = [
  {
    slug: "machu-picchu-full-day",
    category: "machu-picchu",
    coordinates: { lat: -13.1631, lng: -72.545, zoom: 13 },
    duration_label: "1 día",
    title: "Machu Picchu Full Day",
    subtitle: "Tu boleto, tren y guía — coordinados en un solo día",
    short_desc:
      "El clásico imprescindible: tren panorámico, ciudadela inca y almuerzo, todo resuelto para ti.",
    description:
      "<p>Machu Picchu no necesita presentación — pero sí necesita logística: boleto de ingreso, tren, bus y un guía que sepa contarte lo que estás viendo. Eso es exactamente lo que resolvemos en este día completo desde Cusco.</p><p>Salimos temprano hacia Ollantaytambo para tomar el tren panorámico Vistadome, con ventanales que siguen el río Urubamba hasta Aguas Calientes. Desde ahí, el bus oficial te sube directo a la ciudadela, donde un guía bilingüe certificado te acompaña durante dos horas recorriendo templos, terrazas y los miradores más fotografiados del sitio.</p><p>Después del recorrido guiado tienes tiempo libre para explorar a tu ritmo o simplemente sentarte a mirar, antes de bajar a almorzar en Aguas Calientes y tomar el tren de regreso a Cusco.</p>",
    highlights: [
      "Tren panorámico Vistadome",
      "Guía bilingüe certificado",
      "Boleto de ingreso a Machu Picchu incluido",
      "Bus oficial Consettur ida y vuelta",
      "Almuerzo buffet en Aguas Calientes",
    ],
    includes: [
      "Transporte Cusco – Ollantaytambo",
      "Tren panorámico ida y vuelta",
      "Bus oficial subida y bajada a la ciudadela",
      "Boleto de ingreso a Machu Picchu",
      "Guía profesional bilingüe",
      "Almuerzo buffet en Aguas Calientes",
    ],
    excludes: [
      "Desayuno y cena",
      "Propinas",
      "Ingreso a Huayna Picchu o Montaña Machu Picchu (extra, cupos limitados)",
    ],
    what_to_bring: [
      "Pasaporte (el mismo con el que compraste el boleto)",
      "Protector solar y sombrero",
      "Botella de agua reutilizable",
      "Efectivo para propinas y compras",
    ],
    faqs: [
      {
        q: "¿Necesito reservar con mucha anticipación?",
        a: "El boleto de ingreso a Machu Picchu tiene cupos diarios limitados. Recomendamos reservar con 2-4 semanas de anticipación, y con más tiempo aún en temporada alta (junio-agosto).",
      },
      {
        q: "¿Puedo subir Huayna Picchu o Montaña Machu Picchu?",
        a: "Sí, como extra opcional (cupos muy limitados, se agotan semanas antes). Avísanos al reservar si te interesa y lo coordinamos aparte del tour base.",
      },
      {
        q: "¿Qué pasa si llueve?",
        a: "El tour opera igual — Machu Picchu está en ceja de selva y la lluvia es parte del paisaje. Te recomendamos traer una casaca impermeable ligera, sobre todo en temporada de lluvias (diciembre-marzo).",
      },
      {
        q: "¿El tren y el bus ya están incluidos en el precio?",
        a: "Sí, el precio incluye el tren panorámico ida y vuelta, el bus de subida y bajada a la ciudadela, y el boleto de ingreso — no hay pagos adicionales el día del tour salvo propinas o extras que elijas.",
      },
    ],
  },
  {
    slug: "camino-inca-4-dias",
    category: "camino-inca",
    coordinates: { lat: -13.1631, lng: -72.545, zoom: 13 },
    duration_label: "4 días / 3 noches",
    title: "Camino Inca Clásico 4D/3N",
    subtitle: "El trek original hasta la Puerta del Sol",
    short_desc:
      "4 días caminando los caminos de piedra incas, con porteadores, cocinero y el amanecer en Machu Picchu como cierre.",
    description:
      "<p>El Camino Inca Clásico es la manera en la que se supone que hay que llegar a Machu Picchu: caminando, por el mismo trazo de piedra que construyeron los incas hace más de 500 años, cruzando pisos ecológicos que van de la puna fría a la ceja de selva.</p><p>Cuatro días, tres noches de campamento, porteadores que cargan el peso pesado y un cocinero de trekking que prepara comidas calientes cada día — tú solo te preocupas de caminar y de llegar. El segundo día, el más duro, sube hasta el paso de Warmiwañusca (Mujer Muerta) a 4,215 msnm; el tercero recorre los sitios arqueológicos menos conocidos de la ruta.</p><p>La última madrugada salimos antes del amanecer para llegar a Inti Punku — la Puerta del Sol — y ver Machu Picchu aparecer con la primera luz del día, antes de que lleguen los buses desde Aguas Calientes.</p>",
    highlights: [
      "Llegada a Machu Picchu por la Puerta del Sol al amanecer",
      "Ruta original de piedra inca, no la alternativa",
      "Porteadores y cocinero de trekking incluidos",
      "Grupos reducidos (máx. 12 personas)",
      "Permiso oficial del Camino Inca incluido",
    ],
    includes: [
      "Permiso oficial del Camino Inca",
      "Boleto de ingreso a Machu Picchu",
      "Porteadores para equipo de campamento",
      "Cocinero de trekking y todas las comidas (3 desayunos, 4 almuerzos, 3 cenas)",
      "Carpas y equipo de campamento",
      "Tren de regreso Aguas Calientes – Ollantaytambo",
      "Guía profesional bilingüe",
    ],
    excludes: [
      "Saco de dormir (alquiler disponible)",
      "Bastones de trekking (alquiler disponible)",
      "Porteador personal para tu mochila (extra opcional)",
      "Primer desayuno y última cena",
    ],
    what_to_bring: [
      "Mochila pequeña para el día (el resto lo cargan los porteadores)",
      "Ropa por capas — hace frío de noche y calor de día",
      "Casaca impermeable",
      "Linterna frontal",
      "Efectivo para propinas de porteadores y cocinero",
    ],
    faqs: [
      {
        q: "¿Con cuánta anticipación debo reservar?",
        a: "El SERNANP limita el Camino Inca a 500 personas por día (incluyendo porteadores y guías), y los permisos se agotan con meses de anticipación. Recomendamos reservar 3-6 meses antes, especialmente para junio-agosto.",
      },
      {
        q: "¿Qué tan difícil es físicamente?",
        a: "Es exigente — el segundo día sube a 4,215 msnm en varias horas de ascenso continuo. No necesitas experiencia previa en trekking, pero sí una condición física razonable y, sobre todo, buena aclimatación previa en Cusco.",
      },
      {
        q: "¿Necesito aclimatarme antes?",
        a: "Sí, es clave. Recomendamos al menos 2 días en Cusco (3,400 msnm) antes de empezar la caminata para reducir el riesgo de mal de altura.",
      },
      {
        q: "¿Puedo contratar un porteador para mi propia mochila?",
        a: "Sí, es un extra opcional que se coordina antes de la salida — así solo cargas una mochila pequeña de día con agua, cámara y capas de ropa.",
      },
    ],
    itinerary: [
      {
        day_number: 1,
        title: "Día 1 — Km 82 a Wayllabamba",
        description:
          "Recojo del hotel a las 5am. Traslado a Ollantaytambo (desayuno) y luego al km 82, punto de inicio. Caminata de 12 km (6h) por terreno mayormente plano hasta el campamento de Wayllabamba (3,000 msnm).",
        meals: ["lunch", "dinner"],
        accommodation: "Campamento Wayllabamba",
      },
      {
        day_number: 2,
        title: "Día 2 — Paso Warmiwañusca",
        description:
          "El día más duro: ascenso al paso de la Mujer Muerta (4,215 msnm). 16 km (9h) atravesando ecosistemas de puna y ceja de selva. Llegada al campamento de Pacaymayo.",
        meals: ["breakfast", "lunch", "dinner"],
        accommodation: "Campamento Pacaymayo",
      },
      {
        day_number: 3,
        title: "Día 3 — Sitios arqueológicos",
        description:
          "Día más espectacular: visita a Runkurakay, Sayacmarca, Phuyupatamarca y Wiñay Wayna. 10 km de caminata principalmente en bajada por escalinatas incas. Llegada al campamento final.",
        meals: ["breakfast", "lunch", "dinner"],
        accommodation: "Campamento Wiñay Wayna",
      },
      {
        day_number: 4,
        title: "Día 4 — Machu Picchu por la Puerta del Sol",
        description:
          "Salida 3:30am para llegar a Inti Punku (Puerta del Sol) al amanecer y descender a Machu Picchu con la primera luz. Tour guiado de 2h en la ciudadela. Tren de regreso por la tarde.",
        meals: ["breakfast"],
        accommodation: null,
      },
    ],
  },
  {
    slug: "city-tour-cusco",
    category: "machu-picchu",
    coordinates: { lat: -13.5183, lng: -71.9781, zoom: 14 },
    duration_label: "Medio día",
    title: "City Tour Cusco",
    subtitle: "La ciudad imperial, a tu ritmo de aclimatación",
    short_desc:
      "Medio día por el centro histórico y las cuatro ruinas incas sobre la ciudad — ideal para tu primer día en Cusco.",
    description:
      "<p>Antes de subir a Machu Picchu o cruzar un paso de 4,000 metros, tu cuerpo necesita un par de días para adaptarse a la altura de Cusco. Este city tour de medio día está pensado justo para eso: te mueve lo suficiente para aclimatar sin exigirte de más, mientras conoces el corazón de la antigua capital inca.</p><p>Empezamos en el centro histórico — la Catedral y el Qoricancha, el templo del sol sobre el que los españoles construyeron un convento entero sin poder derribar los muros incas — y seguimos hacia las cuatro ruinas que rodean la ciudad: la fortaleza de Sacsayhuamán, el centro ceremonial de Qenqo, el mirador de Puka Pukara y las fuentes de Tambomachay.</p><p>Tu guía bilingüe conecta cada parada con la historia del imperio y, de paso, con recomendaciones prácticas para el resto de tu viaje por Cusco.</p>",
    highlights: [
      "Catedral de Cusco y Qoricancha",
      "Fortaleza de Sacsayhuamán",
      "Las cuatro ruinas incas sobre la ciudad",
      "Ideal para el primer día de aclimatación",
      "Guía bilingüe incluido",
    ],
    includes: [
      "Transporte turístico",
      "Guía bilingüe",
      "Boleto turístico parcial (4 sitios arqueológicos)",
    ],
    excludes: [
      "Entrada a la Catedral (S/40)",
      "Entrada al Qoricancha (S/15)",
      "Almuerzo",
    ],
    what_to_bring: [
      "Ropa abrigadora — Cusco baja de temperatura rápido al atardecer",
      "Protector solar",
      "Agua",
      "Cámara",
    ],
    faqs: [
      {
        q: "¿Es un buen primer tour al llegar a Cusco?",
        a: "Sí, es justamente para eso — el ritmo es suave y te ayuda a aclimatarte antes de actividades más exigentes como Rainbow Mountain o el Camino Inca.",
      },
      {
        q: "¿Cuánto se camina?",
        a: "Poco — el tour es mayormente en transporte con paradas cortas a pie en cada sitio arqueológico. Nivel fácil, apto para todas las edades.",
      },
      {
        q: "¿Las entradas a la Catedral y el Qoricancha están incluidas?",
        a: "No, el boleto turístico parcial cubre las cuatro ruinas incas fuera de la ciudad; la Catedral y el Qoricancha tienen entrada aparte, que puedes pagar en el lugar.",
      },
    ],
  },
  {
    slug: "valle-sagrado-vip",
    category: "valle-sagrado",
    coordinates: { lat: -13.4196, lng: -72.0817, zoom: 11 },
    duration_label: "1 día",
    title: "Valle Sagrado VIP",
    subtitle: "Pisac, Ollantaytambo y Chinchero, sin apuros ni grupos grandes",
    short_desc:
      "Tour privado por los pueblos más emblemáticos del Valle Sagrado, con vehículo y guía exclusivos para tu grupo.",
    description:
      "<p>El Valle Sagrado se recorre mejor despacio, y este tour está diseñado exactamente así: vehículo privado, guía exclusivo y un grupo máximo de 8 personas, para que el ritmo del día lo pongas tú, no un bus lleno de gente.</p><p>Empezamos en Pisac, entre las terrazas agrícolas incas y su mercado artesanal, seguimos hacia Ollantaytambo — la única ciudad inca que sigue habitada sobre su trazado original, con calles y canales de agua que funcionan igual que hace 500 años — y cerramos en Chinchero, donde tejedoras locales muestran cómo se hila y tiñe la lana con técnicas ancestrales.</p><p>El almuerzo es en una hacienda colonial en medio del valle, con vista a los andenes y los nevados de fondo — parte del día, no un trámite entre paradas.</p>",
    highlights: [
      "Vehículo y guía privados (no compartido)",
      "Pisac, Ollantaytambo y Chinchero",
      "Demostración textil en Chinchero",
      "Almuerzo en hacienda colonial incluido",
      "Grupo máximo de 8 personas",
    ],
    includes: [
      "Transporte privado",
      "Guía profesional exclusivo",
      "Almuerzo en hacienda colonial",
      "Boleto turístico (ingreso a Pisac y Ollantaytambo)",
    ],
    excludes: ["Bebidas", "Propinas"],
    what_to_bring: [
      "Ropa cómoda para caminar",
      "Protector solar y sombrero",
      "Efectivo para artesanías en Pisac y Chinchero",
    ],
    faqs: [
      {
        q: "¿Qué diferencia hay con un tour grupal al Valle Sagrado?",
        a: "Este es privado — vehículo y guía solo para tu grupo (hasta 8 personas), con horarios flexibles. Puedes pasar más tiempo donde te interese sin esperar al resto de un bus.",
      },
      {
        q: "¿Incluye el boleto turístico completo de Cusco?",
        a: "Incluye el ingreso puntual a Pisac y Ollantaytambo. El boleto turístico general de Cusco (con más sitios) se compra aparte si planeas visitar otros lugares.",
      },
      {
        q: "¿Es un buen tour para el mismo día que llego a Cusco?",
        a: "Es mejor esperar 1-2 días para aclimatar antes — el valle está a menor altura que Cusco, pero el traslado y las caminatas cortas rinden más si ya estás adaptado.",
      },
    ],
  },
  {
    slug: "rainbow-mountain",
    category: "aventura",
    coordinates: { lat: -13.8688, lng: -71.307, zoom: 12 },
    duration_label: "1 día",
    title: "Montaña de 7 Colores",
    subtitle: "Vinicunca a 5,200 msnm — el paisaje que rompe internet",
    short_desc:
      "Caminata de un día hasta las laderas multicolor de Vinicunca, con Ausangate nevado de fondo.",
    description:
      "<p>Las fotos de la Montaña de 7 Colores parecen editadas — no lo están. Vinicunca debe sus franjas de rojo, ocre y turquesa a capas minerales que quedaron expuestas por la erosión, y verlas en persona, a 5,200 metros sobre el nivel del mar, es de los momentos que más se recuerdan de un viaje a Cusco.</p><p>Salimos muy temprano desde Cusco hacia Cusipata, con desayuno en el camino, y empezamos la caminata hacia la cordillera del Ausangate. La subida es exigente por la altura más que por la distancia — se puede tomar con calma, y hay caballos disponibles para quien prefiera no caminar todo el tramo.</p><p>Al llegar a la cima, el nevado Ausangate se ve de fondo sobre las franjas de color de la montaña. Después de tiempo libre para fotos, bajamos a almorzar antes de volver a Cusco.</p>",
    highlights: [
      "Montaña de 7 Colores (Vinicunca) a 5,200 msnm",
      "Vista al nevado Ausangate",
      "Desayuno y almuerzo incluidos",
      "Caballos disponibles como opción",
      "Salida temprano para evitar aglomeración de grupos",
    ],
    includes: [
      "Transporte privado desde tu hotel",
      "Desayuno y almuerzo",
      "Guía profesional",
      "Entrada al sendero",
    ],
    excludes: [
      "Caballo (opcional, se paga en el lugar)",
      "Bastones de trekking",
      "Cena",
    ],
    what_to_bring: [
      "Ropa térmica por capas",
      "Casaca impermeable",
      "Protector solar y bloqueador labial",
      "Botas o zapatillas de trekking",
      "Pasaporte o DNI",
    ],
    faqs: [
      {
        q: "¿Es muy difícil la caminata?",
        a: "La distancia no es larga (unos 6-7 km ida y vuelta) pero la altura (hasta 5,200 msnm) la hace exigente para la respiración. Recomendamos 1-2 días de aclimatación en Cusco antes de venir.",
      },
      {
        q: "¿Vale la pena el caballo?",
        a: "Si te preocupa la altura o no haces ejercicio regularmente, sí — cubre buena parte de la subida y te deja energía para disfrutar la cima. Es un pago opcional directo en el lugar, no está incluido en el precio del tour.",
      },
      {
        q: "¿Qué tan temprano hay que salir?",
        a: "Salimos de madrugada (usualmente entre 3:30 y 4:30am) para llegar antes que la mayoría de grupos — la montaña se ve mejor y hay menos gente en las fotos.",
      },
      {
        q: "¿Cuál es la mejor época para ir?",
        a: "La temporada seca (mayo-septiembre) tiene mejor visibilidad y menos barro en el sendero. En temporada de lluvias (diciembre-marzo) el tour igual opera, pero el camino puede estar más resbaladizo.",
      },
    ],
  },
  {
    slug: "laguna-humantay",
    category: "aventura",
    coordinates: { lat: -13.4115, lng: -72.5499, zoom: 12 },
    duration_label: "1 día",
    title: "Laguna Humantay",
    subtitle: "La laguna turquesa bajo el nevado Salkantay",
    short_desc:
      "Caminata de medio día hasta una laguna glaciar de color turquesa, a los pies del Salkantay.",
    description:
      "<p>La Laguna Humantay es una de esas paradas que parecen sacadas de otro planeta: agua glaciar en tonos que van del verde esmeralda al turquesa, enmarcada por el nevado Salkantay (6,271 msnm) y silencio casi total, salvo por el viento.</p><p>Después del recojo y un desayuno en el pueblo de Soraypampa, la caminata sube durante hora y media hasta la orilla de la laguna — el tramo más exigente del día, todo en subida y a más de 4,000 msnm. Una vez arriba hay tiempo libre para fotos, para simplemente sentarte a mirar el agua, o para sumarte a una ofrenda andina tradicional a la Pachamama si el grupo lo desea.</p><p>La bajada es más rápida, y cerramos el día con un almuerzo buffet antes de volver a Cusco.</p>",
    highlights: [
      "Laguna glaciar turquesa a 4,200 msnm",
      "Vista al nevado Salkantay",
      "Ofrenda andina opcional a la Pachamama",
      "Desayuno y almuerzo buffet incluidos",
      "Caminata de medio día, sin necesidad de trekking previo",
    ],
    includes: [
      "Transporte",
      "Desayuno",
      "Almuerzo buffet",
      "Guía profesional",
      "Entrada a la laguna",
    ],
    excludes: ["Bastones de trekking (alquiler S/15)", "Caballo opcional"],
    what_to_bring: [
      "Ropa por capas",
      "Casaca impermeable",
      "Protector solar",
      "Botella de agua",
      "Zapatillas o botas de trekking",
    ],
    faqs: [
      {
        q: "¿Qué tan difícil es la caminata?",
        a: "Es de dificultad moderada — hora y media de subida constante a más de 4,000 msnm. No requiere experiencia previa en trekking, pero sí buena aclimatación.",
      },
      {
        q: "¿Es lo mismo que el Camino Inca a Salkantay?",
        a: "No — este es un tour de un solo día hasta la laguna, a los pies del Salkantay. El trek completo de Salkantay son varios días de caminata; esta es la forma de ver el nevado sin comprometer tu itinerario.",
      },
      {
        q: "¿Qué es la ofrenda andina que mencionan?",
        a: "Es una ceremonia tradicional opcional a la Pachamama (Madre Tierra), guiada por un chamán local, que algunos grupos hacen en la laguna. No tiene costo adicional y es completamente opcional.",
      },
    ],
  },
];

// =====================================================
// Fetch de datos "hecho" desde el Supabase de Danfer
// =====================================================
const { data: sourceTours, error: srcErr } = await source
  .from("tours")
  .select(
    "slug,price_usd,duration_days,difficulty,max_group_size,min_age,altitude_max,cover_image,gallery"
  )
  .in("slug", SLUGS);

if (srcErr) {
  console.error("Error leyendo el Supabase de origen:", srcErr);
  process.exit(1);
}
const factsBySlug = Object.fromEntries(sourceTours.map((t) => [t.slug, t]));

const { data: categories, error: catErr } = await target
  .from("categories")
  .select("id,slug");
if (catErr) {
  console.error("Error leyendo categorías del Supabase destino:", catErr);
  process.exit(1);
}
const categoryIdBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

// =====================================================
// Upsert
// =====================================================
for (const c of CONTENT) {
  const facts = factsBySlug[c.slug];
  if (!facts) {
    console.error("No se encontró en el origen, se omite:", c.slug);
    continue;
  }
  const categoryId = categoryIdBySlug[c.category];
  if (!categoryId) {
    console.error("Categoría no encontrada en destino:", c.category);
    continue;
  }

  const row = {
    slug: c.slug,
    category_id: categoryId,
    title: { es: c.title },
    subtitle: { es: c.subtitle },
    short_desc: { es: c.short_desc },
    description: { es: c.description },
    cover_image: facts.cover_image,
    gallery: facts.gallery,
    duration_days: facts.duration_days,
    duration_label: { es: c.duration_label },
    difficulty: facts.difficulty,
    max_group_size: facts.max_group_size,
    min_age: facts.min_age,
    altitude_max: facts.altitude_max,
    price_usd: facts.price_usd,
    highlights: c.highlights,
    includes: c.includes,
    excludes: c.excludes,
    what_to_bring: c.what_to_bring,
    faqs: c.faqs.map((f) => ({ q: { es: f.q }, a: { es: f.a } })),
    coordinates: c.coordinates,
    is_featured: true,
    is_published: true,
  };

  const { data: upserted, error } = await target
    .from("tours")
    .upsert(row, { onConflict: "slug" })
    .select("id,slug")
    .single();

  if (error) {
    console.error("Error insertando", c.slug, error);
    continue;
  }
  console.log("OK:", c.slug, upserted.id);

  if (c.itinerary) {
    await target.from("tour_itinerary").delete().eq("tour_id", upserted.id);
    const days = c.itinerary.map((d) => ({
      tour_id: upserted.id,
      day_number: d.day_number,
      title: { es: d.title },
      description: { es: d.description },
      meals: d.meals,
      accommodation: d.accommodation ? { es: d.accommodation } : null,
    }));
    const { error: itiErr } = await target.from("tour_itinerary").insert(days);
    if (itiErr) console.error("  error itinerario", c.slug, itiErr);
    else console.log("  itinerario:", days.length, "días");
  }
}

console.log("Listo.");
```

- [ ] **Step 2: Ejecutar**

```bash
cd /c/xampp/htdocs/boletomachupicchutours
SOURCE_SUPABASE_URL=<url del Supabase de cuscotours-v2, de su .env.local> \
SOURCE_SUPABASE_SERVICE_ROLE_KEY=<service role key de cuscotours-v2, de su .env.local> \
node scripts/import-tours-from-danfer.mjs
```

Expected: 6 líneas `OK: <slug> <uuid>`, una de ellas (`camino-inca-4-dias`) seguida de `  itinerario: 4 días`, y termina con `Listo.`.

- [ ] **Step 3: Verificar en el Supabase destino**

En el SQL Editor del proyecto Supabase de boletomachupicchutours:

```sql
select slug, title->>'es' as titulo, category_id, price_usd, is_featured, is_published,
       jsonb_array_length(faqs) as n_faqs, coordinates is not null as tiene_coords
from public.tours order by slug;

select tour_id, count(*) from public.tour_itinerary group by tour_id;
```

Expected: 6 filas en `tours`, todas con `is_featured=true`, `is_published=true`, `n_faqs` entre 3 y 4, `tiene_coords=true`; y exactamente 1 fila en el segundo query con `count=4` (el `tour_id` de `camino-inca-4-dias`).

- [ ] **Step 4: Verificación visual rápida**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && npm run dev
```

Abrir `http://localhost:3000/tours/machu-picchu-full-day` y `http://localhost:3000/tours/camino-inca-4-dias`. Expected: cada página muestra descripción, highlights, incluye/no incluye, FAQ (sección "Preguntas frecuentes" visible y desplegable), y `camino-inca-4-dias` además muestra el itinerario de 4 días y un mapa (coordenadas). Detener el server (Ctrl+C).

- [ ] **Step 5: Commit**

```bash
git add scripts/import-tours-from-danfer.mjs
git commit -m "feat(content): script de importación + los 6 tours reales redactados"
```

---

### Task 3: FAQ del home — corregir precios y hacerlo visible

**Files:**
- Modify: `src/lib/seo/schema.ts`
- Create: `src/components/sections/faq.tsx`
- Modify: `src/lib/i18n/messages.ts`
- Modify: `src/app/[locale]/(public)/page.tsx`

**Depende de:** ninguna (independiente de Task 2).

- [ ] **Step 1: Extraer las FAQ a una constante exportada y corregir los 2 precios falsos**

En `src/lib/seo/schema.ts`, reemplazar la función `homepageFaqSchema` completa (líneas 618-653) por:

```ts
export const HOMEPAGE_FAQS: { q: string; a: string }[] = [
  {
    q: "¿Cuál es la mejor época para visitar Machu Picchu?",
    a: "La temporada seca, de mayo a septiembre, es ideal: días soleados, cielos despejados y baja probabilidad de lluvia. Junio y julio son los meses con mayor afluencia turística — reserva con 2-3 meses de anticipación. De diciembre a marzo es temporada de lluvias con vegetación más verde pero el Camino Inca cierra en febrero por mantenimiento.",
  },
  {
    q: "¿Cuánto cuesta un tour a Machu Picchu desde Cusco?",
    a: "Un tour Full Day a Machu Picchu desde Cusco con Boleto Machu Picchu Tours cuesta desde US$100 por persona, incluyendo transporte en tren panorámico, entrada a la ciudadela, guía profesional bilingüe y almuerzo buffet en Aguas Calientes. El Camino Inca de 4 días desde US$150.",
  },
  {
    q: "¿Cuántos días se necesitan para conocer Cusco y Machu Picchu?",
    a: "Lo recomendable son 5-7 días: 1-2 días de aclimatación en Cusco, 1 día en el Valle Sagrado, 2 días para Machu Picchu (con noche en Aguas Calientes opcional) y 1-2 días para destinos extra como Rainbow Mountain o Laguna Humantay.",
  },
  {
    q: "¿Es seguro hacer el Camino Inca?",
    a: "Sí, el Camino Inca es seguro cuando se hace con operador autorizado por el SERNANP. Boleto Machu Picchu Tours cuenta con permisos oficiales, guías certificados con formación en primeros auxilios y altitud, y porteadores con seguro. Los grupos son de máximo 16 personas.",
  },
  {
    q: "¿Cómo evito el mal de altura (soroche) en Cusco?",
    a: "Llega con tiempo: 1-2 días en Cusco (3,400 msnm) antes de actividades exigentes. Hidrátate constantemente, evita alcohol las primeras 24h, come ligero, mastica hoja de coca o toma mate de coca. Si haces Rainbow Mountain o Camino Inca, aclimátate al menos 48 horas en Cusco.",
  },
  {
    q: "¿Qué incluye un tour a Rainbow Mountain?",
    a: "El tour Full Day a la Montaña de 7 Colores (Vinicunca) incluye recojo del hotel a las 4am, desayuno y almuerzo, transporte privado a Cusipata, guía profesional y entrada al sendero (5,200 msnm). Llevar ropa térmica, protector solar, agua y pasaporte.",
  },
  {
    q: "¿Necesito visa para visitar Perú?",
    a: "La mayoría de países (UE, EE.UU., Canadá, Reino Unido, Australia, latinoamericanos) NO necesitan visa para estancias turísticas de hasta 183 días. Solo se requiere pasaporte vigente con al menos 6 meses de validez al ingreso.",
  },
  {
    q: "¿Puedo reservar el tour con cuánta anticipación?",
    a: "Para Machu Picchu y tours regulares recomendamos 2-4 semanas de anticipación. Para Camino Inca 3-6 meses (los cupos del SERNANP son limitados a 500 personas/día incluyendo porteadores). En temporada alta (junio-agosto) reserva con la máxima anticipación posible.",
  },
];

export function homepageFaqSchema() {
  return faqSchema(HOMEPAGE_FAQS);
}
```

- [ ] **Step 2: Agregar los textos del encabezado de sección a los mensajes i18n**

En `src/lib/i18n/messages.ts`, dentro del bloque `es.sections` (después de `testimonials`, línea 46 `},`), agregar:

```ts
      faq: {
        eyebrow: "Preguntas frecuentes",
        title_a: "Todo lo que necesitas saber",
        title_emphasis: "antes de viajar",
      },
```

Y en el bloque `en.sections` (después de `testimonials` en inglés, línea 135 `},`), agregar:

```ts
      faq: {
        eyebrow: "Frequently asked questions",
        title_a: "Everything you need to know",
        title_emphasis: "before you travel",
      },
```

- [ ] **Step 3: Crear el componente visible**

Crear `src/components/sections/faq.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HOMEPAGE_FAQS } from "@/lib/seo/schema";
import { tr } from "@/lib/i18n/messages";
import type { Locale } from "@/types/database";

export function Faq({ locale }: { locale: Locale }) {
  const m = tr(locale);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-20 md:py-32 bg-stone">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <span className="font-hand text-gold text-2xl">
            {m.sections.faq.eyebrow}
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-6xl text-night">
            {m.sections.faq.title_a}{" "}
            <span className="text-gradient-gold italic">
              {m.sections.faq.title_emphasis}
            </span>
          </h2>
        </div>
        <div className="space-y-3">
          {HOMEPAGE_FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="bg-white border border-night/8 rounded-2xl overflow-hidden shadow-soft hover:border-gold/40 transition"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 text-left"
                >
                  <span className="font-display text-base sm:text-lg text-night">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold shrink-0 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-5 text-night/75 leading-relaxed text-sm sm:text-base">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Insertarlo en el home**

En `src/app/[locale]/(public)/page.tsx`, cambiar la firma de `Home` para recibir `params` y renderizar `Faq` después de `Testimonials`:

```ts
import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { FeaturedTours } from "@/components/sections/featured-tours";
import { Destinations } from "@/components/sections/destinations";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { buildAlternates, ogLocale } from "@/lib/seo/alternates";
import { getSettings } from "@/lib/queries/settings";
import type { Locale } from "@/types/database";
import {
  heroVideoSchema,
  homepageFaqSchema,
  speakableSchema,
  topDestinationsSchemas,
} from "@/lib/seo/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: buildAlternates("/", locale),
    openGraph: { locale: ogLocale(locale) },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lc: Locale = locale === "en" ? "en" : "es";
  // Organization + WebSite los emite el layout público (todas las páginas).
  const settings = await getSettings();
  return (
    <>
      <JsonLd
        data={[
          speakableSchema(),
          heroVideoSchema(),
          homepageFaqSchema(),
          ...topDestinationsSchemas(),
        ]}
      />
      <Hero cardImages={settings.hero_images} cardTexts={settings.hero_cards} />
      <Stats polaroidImages={settings.stats_images} />
      <FeaturedTours />
      <Destinations />
      <Testimonials />
      <Faq locale={lc} />
    </>
  );
}
```

- [ ] **Step 5: Verificar**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && npm run dev
```

Abrir `http://localhost:3000/es`. Expected: al final de la página, antes del footer, una sección "Preguntas frecuentes" con 8 preguntas desplegables; la segunda pregunta ("¿Cuánto cuesta...") muestra "US$100" y "US$150" (no 380/750). Detener el server.

- [ ] **Step 6: Commit**

```bash
git add src/lib/seo/schema.ts src/lib/i18n/messages.ts src/components/sections/faq.tsx "src/app/[locale]/(public)/page.tsx"
git commit -m "fix(seo): precios reales en FAQ del home + hacerlo visible (antes solo JSON-LD)"
```

---

### Task 4: Reorganizar tours destacados del home en filas temáticas

**Files:**
- Modify: `src/components/sections/featured-tours.tsx`

**Depende de:** Task 1 (`getToursBySlugs`) y Task 2 (los 6 tours deben existir en la base para verse en la verificación visual — el código en sí compila sin ellos).

- [ ] **Step 1: Reescribir el componente**

Reemplazar el contenido completo de `src/components/sections/featured-tours.tsx`:

```tsx
import { ArrowRight } from "lucide-react";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getToursBySlugs } from "@/lib/queries/tours";
import { tr } from "@/lib/i18n/messages";
import type { Locale, TourWithCategory } from "@/types/database";
import { TourCard } from "./featured-tours.client";

const THEMES = [
  {
    slugs: ["machu-picchu-full-day", "camino-inca-4-dias"],
    eyebrow_es: "Lo más buscado",
    eyebrow_en: "Most requested",
    title_es: "¿Cuáles son las mejores opciones para Machu Picchu?",
    title_en: "What are the best options to visit Machu Picchu?",
  },
  {
    slugs: ["valle-sagrado-vip", "city-tour-cusco"],
    eyebrow_es: "Cerca de Cusco",
    eyebrow_en: "Near Cusco",
    title_es: "Valle Sagrado y Cusco, lo esencial",
    title_en: "Sacred Valley and Cusco, the essentials",
  },
  {
    slugs: ["rainbow-mountain", "laguna-humantay"],
    eyebrow_es: "Para los más aventureros",
    eyebrow_en: "For the adventurous",
    title_es: "Aventura en las alturas",
    title_en: "High-altitude adventure",
  },
] as const;

export async function FeaturedTours() {
  const locale = (await getLocale()) as Locale;
  const m = tr(locale);
  const allSlugs = THEMES.flatMap((theme) => theme.slugs);
  const tours = await getToursBySlugs(allSlugs);

  if (tours.length === 0) {
    return (
      <section id="tours" className="py-32 px-6 bg-stone">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-hand text-gold text-2xl">Próximamente</span>
          <h2 className="mt-2 font-display text-4xl md:text-5xl text-night">
            Aún no hay tours destacados
          </h2>
          <p className="mt-4 text-night/60">
            Crea tus primeros tours en el panel admin y márcalos como
            destacados (<code>is_featured = true</code>) para que aparezcan aquí.
          </p>
          <a
            href="/admin"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-night px-6 py-3 text-white text-sm font-semibold hover:bg-gold transition"
          >
            Ir al admin
          </a>
        </div>
      </section>
    );
  }

  const bySlug = new Map(tours.map((t) => [t.slug, t]));

  return (
    <section
      id="tours"
      className="relative py-20 md:py-32 overflow-hidden bg-background"
    >
      {/* Decorative background */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gold/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-turquoise/6 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 max-w-2xl">
          <div className="flex items-center gap-3 text-night/60 mb-3">
            <span className="h-px w-8 bg-gold" />
            <span className="text-[11px] uppercase tracking-[0.3em]">
              {m.sections.featured.eyebrow}
            </span>
          </div>
          <span className="font-hand text-gold text-2xl">
            {locale === "en" ? "Unforgettable, guaranteed" : "Inolvidables, garantizado"}
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-night leading-[1.02]">
            {m.sections.featured.title_a}{" "}
            <span className="text-gradient-gold italic font-normal">
              {m.sections.featured.title_emphasis}
            </span>
          </h2>
          <p className="mt-4 text-night/60 max-w-md">
            {m.sections.featured.subtitle}
          </p>
        </div>

        <div className="space-y-16">
          {THEMES.map((theme) => {
            const rowTours = theme.slugs
              .map((slug) => bySlug.get(slug))
              .filter((t): t is TourWithCategory => Boolean(t));
            if (rowTours.length === 0) return null;
            return (
              <div key={theme.title_es}>
                <div className="mb-6">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-gold">
                    {locale === "en" ? theme.eyebrow_en : theme.eyebrow_es}
                  </span>
                  <h3 className="mt-1 font-display text-xl sm:text-2xl text-night">
                    {locale === "en" ? theme.title_en : theme.title_es}
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                  {rowTours.map((tour, i) => (
                    <TourCard
                      key={tour.id}
                      tour={tour}
                      index={i}
                      isBestseller={false}
                      locale={locale}
                      m={m}
                      wrapperClassName="w-full group"
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/tours"
            className="group inline-flex items-center gap-2 text-night font-semibold text-sm hover:text-gold transition"
          >
            {locale === "en" ? "View all tours" : "Ver todos los tours"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && npm run dev
```

Abrir `http://localhost:3000/es#tours`. Expected: 3 filas de 2 tours cada una, cada fila con su propio encabezado tipo pregunta ("¿Cuáles son las mejores opciones para Machu Picchu?", "Valle Sagrado y Cusco, lo esencial", "Aventura en las alturas"), sin badge "Más vendido" en ninguna tarjeta. Detener el server.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/featured-tours.tsx
git commit -m "feat(home): tours destacados reorganizados en 3 filas temáticas"
```

---

### Task 5: Retirar contenido fabricado de "Sobre nosotros" y footer

**Files:**
- Modify: `src/app/[locale]/(public)/sobre-nosotros/page.tsx`
- Modify: `src/components/layout/footer.tsx`

**Depende de:** ninguna (independiente).

- [ ] **Step 1: Quitar MINCETUR/+12 años de la metadata**

En `sobre-nosotros/page.tsx`, reemplazar el bloque `description` dentro de `generateMetadata` (líneas 18-21):

```ts
  const description =
    lc === "en"
      ? "Meet Boleto Machu Picchu Tours: a team with years of real experience running tours in Cusco, now focused on making your Machu Picchu ticket and trip simple."
      : "Conoce a Boleto Machu Picchu Tours: un equipo con años de experiencia real operando tours en Cusco, ahora enfocado en hacerte fácil tu boleto y tu viaje a Machu Picchu.";
```

- [ ] **Step 2: Corregir el value-card "Autorizados MINCETUR"**

En el array `values` (líneas 34-67), reemplazar el segundo elemento (`icon: Award`, líneas 43-50):

```ts
  {
    icon: Award,
    title: { es: "Operador autorizado", en: "Authorized operator" },
    body: {
      es: "Operador turístico registrado. Guías locales licenciados y certificados.",
      en: "Registered tour operator. Licensed and certified local guides.",
    },
  },
```

- [ ] **Step 3: Eliminar el array `milestones` y reemplazar Timeline + Stats strip por una sola sección honesta**

Eliminar por completo el array `milestones` (líneas 69-105).

Reemplazar las dos secciones "Timeline" y "Stats strip" (líneas 220-271, desde `{/* Timeline */}` hasta el `</section>` que cierra la stats strip, justo antes de `{/* CTA final */}`) por:

```tsx
      {/* Quiénes somos */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
        <span className="font-hand text-gold text-2xl">
          {lc === "en" ? "Our story" : "Nuestra historia"}
        </span>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-5xl text-night">
          {lc === "en" ? "Same team, new focus" : "Mismo equipo, nuevo enfoque"}
        </h2>
        <p className="mt-6 text-night/70 text-lg leading-relaxed">
          {lc === "en" ? (
            <>
              Behind Boleto Machu Picchu Tours is a team that has spent years
              running tours in Cusco — same certified guides, same official
              permits, now focused 100% on making your Machu Picchu ticket and
              trip simple.
            </>
          ) : (
            <>
              Detrás de Boleto Machu Picchu Tours hay un equipo que lleva años
              operando tours en Cusco — mismos guías certificados, mismos
              permisos oficiales, ahora enfocados 100% en hacerte fácil tu
              boleto y tu viaje a Machu Picchu.
            </>
          )}
        </p>
      </section>
```

Nota: esto también elimina el uso de `Users`, `Sparkles` y la función `Stat` — en el Step 4 se limpian esos imports y la función ya sin uso.

- [ ] **Step 4: Limpiar imports y la función `Stat` ya sin uso**

Cambiar la línea de import (línea 3):

```ts
import { Shield, Award, Heart, Mountain, ArrowRight } from "lucide-react";
```

Eliminar por completo la función `Stat` al final del archivo (líneas 305-323, `function Stat({...}) {...}`).

- [ ] **Step 5: Footer — corregir trust strip**

En `src/components/layout/footer.tsx`, reemplazar las líneas 94-105:

```tsx
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-gold" />
            {en ? "Authorized tour operator" : "Operador turístico autorizado"}
          </span>
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold" />
            {en ? "Book with confidence" : "Reservas con confianza"}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold" />
            {en ? "Real experience in Cusco" : "Experiencia real en Cusco"}
          </span>
```

- [ ] **Step 6: Verificar**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && npm run dev
```

Abrir `http://localhost:3000/es/sobre-nosotros`. Expected: no aparece ninguna fecha (2012-2025), ni "8,500+", ni "35", ni "4.9", ni "MINCETUR"; sí aparece la nueva sección "Mismo equipo, nuevo enfoque". Revisar el footer en cualquier página: dice "Operador turístico autorizado" y "Experiencia real en Cusco", no "MINCETUR" ni "12+ años". Detener el server.

```bash
grep -rn "MINCETUR\|8,500\|8500\|TripAdvisor" "src/app/[locale]/(public)/sobre-nosotros/page.tsx" src/components/layout/footer.tsx
```

Expected: sin resultados.

- [ ] **Step 7: Commit**

```bash
git add "src/app/[locale]/(public)/sobre-nosotros/page.tsx" src/components/layout/footer.tsx
git commit -m "fix(brand): retirar cifras/fechas/certificaciones fabricadas de sobre-nosotros y footer"
```

---

### Task 6: Retirar cifras fabricadas del hero y la sección de stats del home

**Files:**
- Modify: `src/components/sections/hero.tsx`
- Modify: `src/components/sections/stats.tsx`
- Modify: `src/lib/hero-cards.ts`
- Modify: `src/lib/i18n/messages.ts`

**Depende de:** ninguna (independiente).

- [ ] **Step 1: Hero — barra de stats inferior (3 stats reales en vez de 4 inventados)**

`Hero()` ya desestructura `const { m, locale } = useI18n();` (línea 43) — se reutilizan las mismas claves `m.sections.stats.*` que Task 6 Step 5 agrega a `messages.ts`, para no tener el mismo texto duplicado en dos archivos (esa duplicación fue justo la causa del bug de precios que se corrigió en Task 3). En `src/components/sections/hero.tsx`, reemplazar las líneas 286-296:

```tsx
          <BottomStat value="6" label={m.sections.stats.tours} />
          <span className="w-px h-7 bg-white/15 hidden sm:block" />
          <BottomStat value="4" label={m.sections.stats.destinations} />
          <span className="w-px h-7 bg-white/15 hidden sm:block" />
          <BottomStat value="100%" label={m.sections.stats.certifiedGuides} />
```

- [ ] **Step 2: Hero — precios y reseñas reales/honestos en las tarjetas flotantes**

En `src/lib/hero-cards.ts`, reemplazar el array `HERO_CARD_DEFAULTS` completo:

```ts
export const HERO_CARD_DEFAULTS: HeroCard[] = [
  {
    country: "Perú",
    region: "Cusco",
    title: "Machu Picchu",
    slug: "machu-picchu",
    rating: 5,
    reviews: 0,
    days: "Full day",
    price: 100,
    img: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=800&auto=format&fit=crop",
  },
  {
    country: "Perú",
    region: "Valle Sagrado",
    title: "Pisac & Ollanta",
    slug: "valle-sagrado",
    rating: 5,
    reviews: 0,
    days: "Full day",
    price: 125,
    img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800&auto=format&fit=crop",
  },
  {
    country: "Perú",
    region: "Cusco",
    title: "Rainbow Mountain",
    slug: "rainbow-mountain",
    rating: 5,
    reviews: 0,
    days: "Full day",
    price: 35,
    img: "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=800&auto=format&fit=crop",
  },
];
```

(Precios ahora iguales a los reales: Machu Picchu $100, Valle Sagrado $125, Rainbow Mountain $35 — antes decían 380/195/85, sin relación con los tours reales.)

- [ ] **Step 3: Hero — ocultar el badge de rating/reseñas cuando no hay reseñas reales (0)**

En `src/components/sections/hero.tsx`, dentro de `FloatingCard`, reemplazar el bloque "Top row: location + rating" (líneas 399-409):

```tsx
        {/* Top row: location + rating */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <div className="text-white text-[10px] uppercase tracking-[0.25em] drop-shadow-lg">
            <div className="opacity-75">{destination.country}</div>
            <div className="font-semibold mt-0.5">{destination.region}</div>
          </div>
          {destination.reviews > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-gold to-gold-bright px-2.5 py-1 text-[11px] text-night shadow-lg">
              <Star className="w-3 h-3 fill-night text-night" />
              <span className="font-bold">{destination.rating}</span>
            </div>
          )}
        </div>
```

Y el bloque "Bottom: title + meta", la línea con `{destination.reviews}+ reseñas` (líneas 412-417):

```tsx
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 text-white/70 text-[10px] uppercase tracking-wider mb-2">
            <span>{destination.days}</span>
            {destination.reviews > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-gold" />
                <span>{destination.reviews}+ reseñas</span>
              </>
            )}
          </div>
```

- [ ] **Step 4: Stats.tsx — contador animado con hechos reales**

En `src/components/sections/stats.tsx`, cambiar el import de iconos (línea 6):

```ts
import { Compass, Globe2, ShieldCheck } from "lucide-react";
```

Y el array `stats` (líneas 9-13):

```ts
const stats = [
  { icon: Compass, value: 6, labelKey: "tours" as const, suffix: "" },
  { icon: Globe2, value: 4, labelKey: "destinations" as const, suffix: "" },
  { icon: ShieldCheck, value: 100, labelKey: "certifiedGuides" as const, suffix: "%" },
];
```

- [ ] **Step 5: Actualizar las claves de mensajes i18n**

En `src/lib/i18n/messages.ts`, en el bloque `es`:

Reemplazar `sections.stats` (líneas 23-27):

```ts
      stats: {
        tours: "Tours únicos",
        destinations: "Destinos",
        certifiedGuides: "Guías certificados",
      },
```

Eliminar las 3 líneas `stats_travelers`, `stats_rating`, `stats_tours` dentro de `hero` (líneas 18-20).

En el bloque `en`, reemplazar `sections.stats` (líneas 112-116):

```ts
      stats: {
        tours: "Unique tours",
        destinations: "Destinations",
        certifiedGuides: "Certified guides",
      },
```

Eliminar las 3 líneas `stats_travelers`, `stats_rating`, `stats_tours` dentro de `hero` (líneas 107-109).

- [ ] **Step 6: Verificar**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && npx tsc --noEmit
```

Expected: sin errores (confirma que ningún archivo sigue referenciando `m.hero.stats_travelers` ni las claves viejas de `sections.stats`).

```bash
npm run dev
```

Abrir `http://localhost:3000/es`. Expected: la barra inferior del hero muestra "6 Tours únicos", "4 Destinos", "100% Guías certificados" (no 8,500+/12+/35); las 3 tarjetas flotantes del hero ya no muestran estrella/rating ni "+reseñas" (porque `reviews=0`), y el precio de la tarjeta de Machu Picchu dice "US$ 100" (no 380). La sección de stats con los polaroids muestra "6 Tours", "4 Destinos", "100% Guías certificados". Detener el server.

```bash
grep -rn "8,500\|8500\|TripAdvisor\|stats_travelers\|stats_rating\|stats_tours" src/components/sections/hero.tsx src/components/sections/stats.tsx src/lib/hero-cards.ts src/lib/i18n/messages.ts
```

Expected: sin resultados.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/hero.tsx src/components/sections/stats.tsx src/lib/hero-cards.ts src/lib/i18n/messages.ts
git commit -m "fix(brand): cifras reales (6 tours, 4 destinos, 100% guías) en vez de las inventadas del hero/stats"
```

---

### Task 7: Verificación final end-to-end

**Depende de:** Tasks 1-6 completos.

- [ ] **Step 1: Build de producción**

```bash
cd /c/xampp/htdocs/boletomachupicchutours && npm run build
```

Expected: build exitoso, sin errores de TypeScript ni de Next.js.

- [ ] **Step 2: Levantar y recorrer el sitio**

```bash
npm run dev
```

Recorrer en el navegador: `/es` (home completo: hero con 6/4/100%, stats con 6/4/100%, 3 filas temáticas de tours, testimonials —vacío si no hay reviews reales, es normal—, FAQ visible al final), cada una de las 6 `/tours/[slug]`, y `/es/sobre-nosotros`. Expected: ningún dato inventado visible en ninguna página (ninguna fecha específica, ningún rating/reviews que no sea 0 o real, ningún precio que no coincida con la base de datos). Detener el server.

- [ ] **Step 3: Grep final de contenido fabricado en todo `src/`**

```bash
grep -rin "mincetur\|8,500\|8500\|tripadvisor\|danfer" src --include="*.tsx" --include="*.ts"
```

Expected: sin resultados.

- [ ] **Step 4: Confirmar que el sitio sigue bloqueado a indexación**

```bash
curl -s http://localhost:3000/robots.txt
```

(requiere el dev server corriendo — repetir `npm run dev` si se había detenido)

Expected: `Disallow: /` sigue presente — Fase 3 no cambia el estado de indexación, eso es Fase 5.

- [ ] **Step 5: Push (si el usuario lo confirma)**

```bash
git log --oneline -10
git push
```

Solo ejecutar tras confirmación explícita del usuario — este plan no incluye deploy a producción (eso ya está corriendo desde Fase 1; los cambios de contenido se despliegan solos si Vercel está conectado al mismo repo/rama, a confirmar con el usuario antes de este paso).

---

## Self-Review

**Spec coverage:** sección 1 del spec (catálogo de tours + FAQ por tour) → Task 2. Sección 2 (contenido fabricado en sobre-nosotros/footer/home) → Tasks 5 y 6. Sección 3 (FAQ del home) → Task 3. Sección 4 (filas temáticas) → Tasks 1 y 4. Verificación de la sección "Testing" del spec → Task 7.

**Placeholder scan:** sin TBD/TODO. Las únicas credenciales sin valor literal son las de Supabase (URL/keys), que por diseño (spec Fase 1 y Fase 3) nunca van escritas en el plan ni en el repo — se piden interactivamente en Task 2 Step 2.

**Type consistency:** `getToursBySlugs` (Task 1) devuelve `TourWithCategory[]`, mismo tipo que consume `FeaturedTours` (Task 4). `HOMEPAGE_FAQS: {q,a}[]` (Task 3) es el tipo que usa tanto `homepageFaqSchema()` como el nuevo componente `Faq`. `HeroCard` (Task 6) no cambia de forma, solo de valores. Los 6 slugs de tours son consistentes entre Task 2 (los crea), Task 4 (los agrupa en `THEMES`) y Task 6 (`HERO_CARD_DEFAULTS` usa 3 de los mismos slugs/precios).
