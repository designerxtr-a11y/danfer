import type { DestinationContent } from "@/lib/destinations-content";

export const lagunaHumantayEn: DestinationContent = {
  slug: "laguna-humantay",
  name: "Humantay Lake",
  shortName: "Humantay",
  alternateNames: ["Laguna Humantay", "Lake Humantay"],
  metaTitle: "Humantay Lake Tour from Cusco 2026 · Full Day Salkantay",
  metaDescription:
    "Full Day tour to Humantay Lake (4,200 m.a.s.l.) from Cusco. A 2-hour trek to a turquoise glacial lake at the foot of the Salkantay snow peak. From US$80.",
  h1: "Humantay Lake Tour from Cusco",
  tagline: "4,200 m.a.s.l. · Turquoise glacial lake · Salkantay",
  hero: {
    image:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1920&auto=format&fit=crop",
    imageAlt:
      "Turquoise glacial Humantay Lake at the foot of the Salkantay snow peak, in the Cusco region",
  },
  intro:
    "Humantay Lake is a glacial lake of morainic origin located at 4,200 m.a.s.l. at the foot of the Salkantay snow peak (6,271 m), one of the most revered apus (sacred mountains) of the Peruvian Andes. Its name means \"Hawk's Head\" in Quechua. The intense turquoise-emerald color of the water comes from fine glacial particles (rock flour) held in suspension. It is a Full Day excursion from Cusco — the bus journey takes 3 hours to reach Soraypampa (3,900 m.a.s.l.), the uphill trek 1.5-2 hours (1.5 km, +300m elevation gain), 30-45 minutes at the lake, and a similar descent. It is physically easier than Rainbow Mountain but just as breathtaking. It is also the first day of the 5-day Salkantay trek to Machu Picchu — many travelers do it as a prelude to that bigger trek.",
  quickFacts: [
    { label: "Lake altitude", value: "4,200 m.a.s.l." },
    { label: "Dominant snow peak", value: "Salkantay (6,271 m)" },
    { label: "Distance from Cusco", value: "80 km / 3h by bus" },
    { label: "Hike", value: "3 km round trip, 3-4h total" },
    { label: "Elevation gain", value: "+300 m" },
    { label: "Difficulty", value: "Moderate — suitable for beginners" },
    { label: "Temperature", value: "0°C to 15°C" },
    { label: "Tour duration", value: "12-13 hours Full Day" },
  ],
  sections: [
    {
      id: "como-es-el-tour",
      title: "What the Humantay tour is like",
      body: "Departure at 4:30 am from Cusco by bus. Breakfast in Mollepata (~7:00 am, an Andean village at the entrance to the Salkantay valley). Arrival at the Soraypampa starting point (3,900 m.a.s.l., ~9:00 am). Uphill hike of 1.5-2 hours (slow, due to the altitude). Time at the lake 45 min — an optional offering ritual to Pachamama with your guide. Descent 1-1.5h. Buffet lunch in Mollepata (~14:00). Return to Cusco (~18:00). There is a horse option for the climb (US$30) for those who cannot walk the whole way. Recommended for all ages with prior acclimatization.",
    },
    {
      id: "salkantay-conexion",
      title: "Connection with the 5D/4N Salkantay trek",
      body: "Humantay Lake is the first stop on the legendary **5-day/4-night Salkantay Trek to Machu Picchu**, one of the best alternatives to the Inca Trail (no SERNANP permit required). The full trek: Day 1 Cusco to Soraypampa + Humantay visit. Day 2 crossing the Salkantay pass (4,650 m.a.s.l.) — the most demanding day, with views of the snow peak's north face. Day 3 descent to the high jungle (Lucmabamba), cloud forest. Day 4 trek to Llaqtapata + bus to Aguas Calientes. Day 5 entrance to Machu Picchu at sunrise. If you enjoyed Humantay as an appetizer, consider doing the full Salkantay on your next visit.",
    },
    {
      id: "soroche-prevencion",
      title: "Altitude sickness at Humantay: how to prevent it",
      body: "Although Humantay sits at 4,200 m (less extreme than Rainbow Mountain), it is still a significant altitude. **Before**: at least 2 days in Cusco (3,400 m) to acclimatize. **Morning of the tour**: a light breakfast, avoid heavy dairy. **During**: walk SLOWLY with frequent stops, hydrate every 15 min, chew coca leaves. **Normal mild symptoms**: a slight headache, shortness of breath while climbing. **Symptoms to turn back**: vomiting, confusion, a severe headache, loss of coordination. The guides carry an emergency oxygen tank.",
    },
  ],
  faq: [
    {
      q: "How much does the Humantay Lake tour cost?",
      a: "The Full Day tour to Humantay Lake from Cusco costs from US$80 per person in a shared service (Danfer Tours), including transport, breakfast, buffet lunch, site entrance, a professional guide, and an oxygen tank. Optional horse US$30.",
    },
    {
      q: "Is it easier than Rainbow Mountain?",
      a: "Yes, considerably. Humantay: 4,200 m vs Rainbow 5,200 m (1 km lower). Hike 1.5h vs 2h. A more gradual trail. If you are torn between the two on difficulty, Humantay is the better first high-mountain experience.",
    },
    {
      q: "Can you swim in Humantay Lake?",
      a: "NO. The lake is sacred to the local communities (Apu Salkantay), and entering the water is forbidden. In addition, the water temperature is ~2°C (it comes from glacial meltwater) — hypothermia within minutes. Photos and contemplation only.",
    },
    {
      q: "When is the best time to visit Humantay?",
      a: "April-October (the dry season) has the clearest skies and the most intense lake color. December-March (the rainy season) can leave the lake murkier and the trail muddy. May-June and September-October are the sweet-spot months.",
    },
  ],
  geo: { lat: -13.3458, lng: -72.6261, altitudeM: 4200 },
  region: "Cusco",
  bestMonths: [
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
  ],
  difficulty: "moderate",
  tourCategorySlugs: ["aventura"],
  tourTitleMatchers: [/humantay/i, /salkantay/i],
  relatedSlugs: ["rainbow-mountain", "machu-picchu"],
};
