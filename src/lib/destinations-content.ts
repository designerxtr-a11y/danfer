export interface DestinationContent {
  slug: string;
  name: string;
  shortName: string;
  alternateNames: string[];
  metaTitle: string;
  metaDescription: string;
  h1: string;
  tagline: string;
  hero: {
    image: string;
    imageAlt: string;
  };
  intro: string;
  quickFacts: { label: string; value: string }[];
  sections: { id: string; title: string; body: string }[];
  faq: { q: string; a: string }[];
  geo: { lat: number; lng: number; altitudeM: number };
  region: string;
  bestMonths: string[];
  difficulty: "easy" | "moderate" | "challenging" | "expert";
  tourCategorySlugs: string[];
  tourTitleMatchers: RegExp[];
  relatedSlugs: string[];
}

export const DESTINATIONS: Record<string, DestinationContent> = {
  "machu-picchu": {
    slug: "machu-picchu",
    name: "Machu Picchu",
    shortName: "MP",
    alternateNames: [
      "Ciudadela de Machu Picchu",
      "Llaqta de Machu Picchu",
      "Old Mountain",
    ],
    metaTitle:
      "Tours a Machu Picchu desde Cusco 2026 · Reserva con operador oficial",
    metaDescription:
      "Tours guiados a Machu Picchu desde Cusco con Danfer Tours. Tren panorámico, entrada oficial, guía bilingüe. Desde US$380, grupos pequeños, 12+ años de experiencia.",
    h1: "Tours a Machu Picchu desde Cusco",
    tagline: "La ciudadela inca del siglo XV · 7 Maravillas del Mundo Moderno",
    hero: {
      image:
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1920&auto=format&fit=crop",
      imageAlt:
        "Vista panorámica de la ciudadela inca de Machu Picchu con el Huayna Picchu al fondo, en la región Cusco, Perú",
    },
    intro:
      "Machu Picchu es la ciudadela inca más famosa del mundo, construida en el siglo XV durante el reinado de Pachacútec y redescubierta por el explorador Hiram Bingham en 1911. Ubicada a 2,430 metros sobre el nivel del mar en la región Cusco, Perú, es Patrimonio de la Humanidad por la UNESCO desde 1983 y una de las Siete Maravillas del Mundo Moderno. Visitarla con un operador autorizado garantiza acceso oficial, transporte seguro y un guía certificado que te explica cada rincón del complejo arqueológico. En Danfer Tours operamos tours diarios desde Cusco con tren panorámico, entrada oficial al santuario y grupos reducidos para una experiencia íntima en el techo del mundo andino.",
    quickFacts: [
      { label: "Altitud", value: "2,430 msnm" },
      { label: "Ubicación", value: "Provincia de Urubamba, Cusco" },
      { label: "Coordenadas", value: "13°09'47\"S 72°32'44\"W" },
      { label: "Estatus", value: "Patrimonio UNESCO desde 1983" },
      { label: "Construcción", value: "Siglo XV (c. 1450 d.C.)" },
      { label: "Visitantes/año", value: "~1.5 millones" },
      { label: "Mejor época", value: "Mayo - Septiembre (seco)" },
      { label: "Duración tour", value: "1 día (Full Day) o 2D/1N" },
    ],
    sections: [
      {
        id: "por-que-visitar",
        title: "¿Por qué visitar Machu Picchu?",
        body: "Machu Picchu no es solo un sitio arqueológico — es una obra maestra de ingeniería andina construida sin mortero, sobre una cresta entre dos picos a más de 2,400 metros de altura. Sus terrazas agrícolas, templos solares, observatorio astronómico y red de canales hidráulicos demuestran un conocimiento profundo de astronomía, geología y agronomía. Caminar por la Plaza Sagrada al amanecer, ver el sol entrar por la Ventana del Intihuatana en solsticio, o subir al Huayna Picchu para una vista aérea de la ciudadela son experiencias que cambian la perspectiva de cualquier viajero. Además, el valle del río Urubamba que rodea la ciudadela es una de las regiones biológicamente más diversas del planeta — bosque nubloso, orquídeas, colibríes y gallitos de las rocas conviven a un paso de las ruinas.",
      },
      {
        id: "como-llegar",
        title: "Cómo llegar a Machu Picchu desde Cusco",
        body: "Existen tres rutas oficiales para llegar a Machu Picchu: (1) Tren desde Cusco (Estación Poroy o San Pedro) a Aguas Calientes, seguido de bus de subida — la opción más popular, dura ~3.5 horas en tren panorámico con paisajes del Valle Sagrado y la selva alta. (2) Camino Inca clásico de 4 días/3 noches a pie por la ruta original de los chasquis incas, llegando al Intipunku (Puerta del Sol) al amanecer del día 4. (3) Trek Salkantay de 5 días, alternativa al Camino Inca por la ruta del nevado Salkantay (6,271 msnm) — no requiere permiso del SERNANP y combina nevados con selva. Danfer Tours ofrece las tres rutas con todos los permisos, transporte privado, alimentación y guías certificados.",
      },
      {
        id: "cuando-viajar",
        title: "Mejor época para visitar Machu Picchu",
        body: "La temporada seca (mayo a septiembre) es la ideal: cielos despejados, temperaturas de 8°C a 20°C, baja probabilidad de lluvia y vistas máximas. Junio y julio son los meses con mayor afluencia turística — reserva con 2-3 meses de anticipación y considera entrar por el primer turno (6:00 am) para evitar grupos. La temporada de lluvias (diciembre a marzo) tiene vegetación más verde y menos turistas pero los caminos pueden estar resbalosos. Febrero el Camino Inca cierra por mantenimiento — el tren a Aguas Calientes sigue operativo. Mayo y septiembre son los \"sweet spot\" entre clima estable y menos multitudes.",
      },
      {
        id: "que-llevar",
        title: "Qué llevar para Machu Picchu",
        body: "Esencial: pasaporte vigente (te lo piden en la entrada), entrada impresa o digital, protector solar SPF 50+, lentes de sol, gorra o sombrero, ropa por capas (mañanas frías, mediodía caluroso), zapatos cerrados con suela de agarre, repelente de mosquitos para Aguas Calientes, agua (1L mínimo), snacks energéticos y poncho de lluvia ligero (incluso en temporada seca). Recomendable: cámara con batería extra, binoculares para avistar fauna, bastón de trekking si haces Huayna Picchu o Montaña Machu Picchu. Prohibido: trípodes grandes, drones, comida invasiva, palos selfie largos, mochilas de más de 40L (hay guarda-equipaje al inicio).",
      },
      {
        id: "soroche-altitud",
        title: "Soroche y altitud: cómo prepararse",
        body: "Machu Picchu está a 2,430 msnm — menor altura que Cusco (3,400 msnm), por lo que la mayoría de viajeros se siente bien. El reto es aclimatarse en Cusco antes. Llega a Cusco 1-2 días antes de subir a Machu Picchu, hidrátate constantemente (3L de agua/día), evita alcohol las primeras 24 horas, come ligero, mastica hoja de coca o toma mate de coca. Si haces Camino Inca o Salkantay, la aclimatación es crítica porque cruzas pasos de hasta 4,650 msnm — Danfer Tours incluye 2 días de aclimatación obligatorios para esos treks.",
      },
    ],
    faq: [
      {
        q: "¿Cuánto cuesta visitar Machu Picchu en 2026?",
        a: "El tour Full Day a Machu Picchu desde Cusco con Danfer Tours cuesta desde US$380 por persona, incluyendo tren panorámico ida y vuelta, bus de subida y bajada, entrada oficial al santuario, guía profesional bilingüe (español/inglés) y almuerzo buffet en Aguas Calientes. La entrada sola al santuario cuesta S/152 (~US$40) para extranjeros adultos.",
      },
      {
        q: "¿Cuánto tiempo se necesita para conocer Machu Picchu?",
        a: "Un Full Day (1 día desde Cusco) permite recorrer la ciudadela en 2-3 horas con guía. Para una visita más relajada, el tour de 2D/1N con noche en Aguas Calientes permite entrar al amanecer y subir Huayna Picchu o Montaña Machu Picchu sin prisa. Para combinarlo con el Valle Sagrado, reserva 3-4 días.",
      },
      {
        q: "¿Necesito reservar Machu Picchu con anticipación?",
        a: "Sí, los cupos son limitados a ~4,500 personas por día y se agotan en temporada alta (junio-agosto). Recomendamos reservar con 2-3 meses de anticipación. Para Camino Inca: 4-6 meses (cupos limitados a 500 personas/día incluyendo porteadores).",
      },
      {
        q: "¿Se puede subir al Huayna Picchu?",
        a: "Sí, pero con boleto adicional (circuito 4) y cupo de 200 personas/turno. La subida toma ~1 hora desde el ingreso del Huayna Picchu hasta la cima (2,720 msnm). Es empinada y con escaleras incas — no recomendada para vértigo. La Montaña Machu Picchu es alternativa más larga (2-3h) pero menos empinada.",
      },
      {
        q: "¿Hay baños y restaurantes en Machu Picchu?",
        a: "Solo a la entrada del santuario (antes de pasar el control). Dentro de la ciudadela no hay baños ni venta de alimentos. Lleva agua, snacks y úsalos antes de ingresar. En Aguas Calientes (pueblo al pie de la montaña) hay restaurantes, hoteles, baños públicos y cajeros.",
      },
    ],
    geo: { lat: -13.1631, lng: -72.545, altitudeM: 2430 },
    region: "Cusco",
    bestMonths: ["Mayo", "Junio", "Julio", "Agosto", "Septiembre"],
    difficulty: "moderate",
    tourCategorySlugs: ["machu-picchu", "machupicchu"],
    tourTitleMatchers: [/machu picchu/i, /machupicchu/i],
    relatedSlugs: ["camino-inca", "valle-sagrado"],
  },

  "camino-inca": {
    slug: "camino-inca",
    name: "Camino Inca",
    shortName: "Inca Trail",
    alternateNames: ["Inca Trail", "Qhapaq Ñan", "Sendero Inca"],
    metaTitle:
      "Camino Inca a Machu Picchu 4D/3N · Tour clásico desde Cusco 2026",
    metaDescription:
      "Camino Inca clásico de 4 días/3 noches a Machu Picchu. Permiso oficial SERNANP, porteadores, comidas, carpas y guía certificado. Desde US$750. Reserva 4-6 meses antes.",
    h1: "Camino Inca a Machu Picchu · 4 días por la ruta original",
    tagline: "La caminata más famosa de Sudamérica · Permisos SERNANP",
    hero: {
      image:
        "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1920&auto=format&fit=crop",
      imageAlt:
        "Sendero del Camino Inca atravesando los Andes peruanos rumbo a Machu Picchu, con porteadores y trekkers",
    },
    intro:
      "El Camino Inca clásico es una ruta de trekking de 43 kilómetros que conecta el Valle Sagrado con Machu Picchu, siguiendo el mismo sendero empedrado que recorrían los chasquis hace 500 años. Forma parte del Qhapaq Ñan, la red vial inca declarada Patrimonio de la Humanidad por la UNESCO. La caminata clásica dura 4 días y 3 noches, cruzando tres pasos de montaña — el más alto, el Paso de la Mujer Muerta (Warmiwañusca) a 4,215 msnm — y visitando 8 sitios arqueológicos perdidos en la selva andina (Llaqtapata, Runkuracay, Sayacmarca, Phuyupatamarca, Wiñay Wayna) antes de llegar al Intipunku (Puerta del Sol) al amanecer del cuarto día, con la ciudadela de Machu Picchu emergiendo entre la niebla. El acceso está estrictamente regulado por el SERNANP: solo 500 personas por día (incluyendo porteadores y guías), permisos personales intransferibles, y operadores con licencia oficial.",
    quickFacts: [
      { label: "Distancia", value: "43 km" },
      { label: "Duración", value: "4 días / 3 noches" },
      { label: "Altura máxima", value: "4,215 msnm (Warmiwañusca)" },
      { label: "Altura mínima", value: "2,400 msnm (Aguas Calientes)" },
      { label: "Dificultad", value: "Exigente — buen estado físico" },
      { label: "Cupo diario", value: "500 personas (incl. porteadores)" },
      { label: "Sitios arqueológicos", value: "8 ruinas en la ruta" },
      { label: "Mejor época", value: "Mayo - Septiembre (febrero CERRADO)" },
    ],
    sections: [
      {
        id: "itinerario",
        title: "Itinerario clásico día por día",
        body: "**Día 1 — KM 82 a Wayllabamba (12 km, ~6h, fácil).** Recojo a las 4:30 am en Cusco, traslado en bus al km 82 (inicio del sendero, 2,720 msnm). Caminata por valle del río Vilcanota visitando Llaqtapata. Acampe en Wayllabamba (3,000 msnm). **Día 2 — Wayllabamba a Pacaymayo (12 km, ~7h, exigente).** Día más duro: ascenso al paso de Warmiwañusca (4,215 msnm). Descenso al campamento Pacaymayo (3,600 msnm). **Día 3 — Pacaymayo a Wiñay Wayna (16 km, ~8h, moderado).** Día más largo pero técnicamente fácil: 3 ruinas (Runkuracay, Sayacmarca, Phuyupatamarca), bosque nubloso, descenso a Wiñay Wayna (2,700 msnm). **Día 4 — Wiñay Wayna a Machu Picchu (6 km, ~3h, fácil).** Despertar 3:30 am, llegada al Intipunku al amanecer (6:30 am aprox.), ingreso a Machu Picchu y tour guiado de 2 horas. Retorno en tren a Cusco por la tarde.",
      },
      {
        id: "permisos",
        title: "Permisos SERNANP y reserva anticipada",
        body: "El Camino Inca es la única ruta a Machu Picchu con cupo regulado por el Estado peruano. El SERNANP (Servicio Nacional de Áreas Naturales Protegidas) emite 500 permisos por día — 200 para turistas + 300 para porteadores, guías y cocineros. Los permisos se ponen a la venta a partir de octubre del año anterior y se agotan rápido para los meses pico (junio-agosto). Cada permiso lleva tu nombre, número de pasaporte y fecha — es intransferible. En Danfer Tours te asesoramos para reservar con 4-6 meses de anticipación, asegurando el permiso y los cupos en tren de retorno. Febrero el Camino Inca está cerrado por mantenimiento — las alternativas son Salkantay, Lares o Choquequirao.",
      },
      {
        id: "preparacion-fisica",
        title: "Preparación física y aclimatación",
        body: "El Camino Inca es exigente pero no técnico — no requiere experiencia previa en montañismo, solo buen estado cardiovascular y mental. Recomendamos: 2-3 meses de preparación con caminatas, escaleras o trekking ligero (4-6 horas/semana), 2 días mínimo de aclimatación en Cusco antes del trek, hidratación constante (3-4L/día durante el trek), evitar alcohol, y descansar bien la noche anterior. Si tienes condiciones médicas (corazón, hipertensión, asma severa) consulta a tu médico. La edad recomendada es 12-65 años; mayores de 65 con buen estado físico también lo completan.",
      },
      {
        id: "que-incluye",
        title: "Qué incluye y qué llevar",
        body: "**Incluye con Danfer Tours**: permiso oficial SERNANP, entrada a Machu Picchu, transporte ida y vuelta (bus + tren), todas las comidas (16 en total), agua hervida y purificada cada mañana, carpas dobles, colchonetas inflables, porteadores oficiales (cargan equipo común), cocinero, guía certificado bilingüe, botiquín de primeros auxilios, tanque de oxígeno de emergencia, baños químicos en campamentos. **Lleva tú**: mochila de día (35L), saco de dormir (-5°C), bastones de trekking, ropa térmica por capas, casaca impermeable, zapatos de trekking probados, gorro, guantes, lentes de sol, linterna frontal, protector solar y labial, repelente de insectos, kit personal de higiene, snacks energéticos, cámara, pasaporte original.",
      },
      {
        id: "alternativas",
        title: "Alternativas si el Camino Inca está agotado",
        body: "Si los permisos del Camino Inca clásico están agotados o no puedes hacer 4 días seguidos, hay alternativas de altísima calidad: **Salkantay Trek (5D/4N)** — la mejor alternativa, rodea el nevado Salkantay (6,271 msnm), llega a Machu Picchu por Llaqtapata. No requiere permiso SERNANP, paisajes más variados (nevados + selva). **Lares Trek (4D/3N)** — culturalmente más rico, atraviesa comunidades quechuas tradicionales, baños termales naturales en Lares. **Inca Trail corto (2D/1N)** — solo para los últimos 14 km, llega al Intipunku el día 2. **Choquequirao (5D/4N)** — la \"hermana sagrada\" de Machu Picchu, sin turistas, trek físicamente más exigente. Danfer Tours opera todas estas alternativas con la misma calidad.",
      },
    ],
    faq: [
      {
        q: "¿Cuánto cuesta el Camino Inca clásico en 2026?",
        a: "El Camino Inca clásico 4D/3N con Danfer Tours cuesta desde US$750 por persona en servicio compartido (grupo de 8-16), incluyendo permiso SERNANP, entrada a Machu Picchu, todas las comidas, carpas, porteadores, cocinero y guía bilingüe. El servicio privado o premium con porteador personal cuesta desde US$1,100.",
      },
      {
        q: "¿Cuándo cierra el Camino Inca?",
        a: "El Camino Inca clásico cierra todo el mes de febrero por mantenimiento y temporada de lluvias intensas. Durante febrero el tren a Machu Picchu sigue funcionando y las alternativas Salkantay/Lares siguen operativas. El resto del año está abierto, con mayor demanda mayo-septiembre.",
      },
      {
        q: "¿Necesito experiencia previa en trekking?",
        a: "No es obligatoria pero recomendable. El Camino Inca es físicamente exigente — caminas 4-8 horas por día por sendero empedrado y escaleras incas, con altitudes de hasta 4,215 msnm. Si nunca has hecho trekking, prepara 2-3 meses antes con caminatas en escaleras y entrenamiento cardiovascular.",
      },
      {
        q: "¿Cómo son los baños en el camino?",
        a: "En los campamentos oficiales hay baños químicos básicos (no inodoros con agua). Danfer Tours lleva carpa-baño con WC químico portátil para grupos privados. Durante el trek (entre campamentos) no hay baños — se usa el método del 'cat hole' siguiendo principios Leave No Trace.",
      },
      {
        q: "¿Puedo cancelar mi permiso del Camino Inca?",
        a: "El permiso SERNANP es intransferible y no reembolsable una vez emitido (a partir del momento del pago al gobierno). Por eso pedimos un depósito del 50% al confirmar la reserva. Si necesitas reprogramar por emergencia médica con documentación, intentamos cambiar la fecha con el SERNANP — no siempre es posible en temporada alta.",
      },
    ],
    geo: { lat: -13.3517, lng: -72.5328, altitudeM: 4215 },
    region: "Cusco",
    bestMonths: ["Mayo", "Junio", "Julio", "Agosto", "Septiembre"],
    difficulty: "challenging",
    tourCategorySlugs: ["camino-inca", "trekking"],
    tourTitleMatchers: [/camino inca/i, /inca trail/i, /salkantay/i],
    relatedSlugs: ["machu-picchu", "valle-sagrado"],
  },

  "valle-sagrado": {
    slug: "valle-sagrado",
    name: "Valle Sagrado de los Incas",
    shortName: "Valle Sagrado",
    alternateNames: [
      "Sacred Valley",
      "Urubamba Valley",
      "Valle del Urubamba",
    ],
    metaTitle:
      "Tours Valle Sagrado Cusco 2026 · Pisac, Ollantaytambo, Chinchero",
    metaDescription:
      "Tour Valle Sagrado VIP desde Cusco con Danfer Tours: Pisac, Ollantaytambo, Chinchero, Maras-Moray. Almuerzo buffet incluido, guía certificado. Desde US$195.",
    h1: "Tours al Valle Sagrado de los Incas desde Cusco",
    tagline: "Pisac · Ollantaytambo · Chinchero · Maras · Moray",
    hero: {
      image:
        "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1920&auto=format&fit=crop",
      imageAlt:
        "Valle Sagrado de los Incas visto desde lo alto, con terrazas agrícolas, el río Urubamba y montañas andinas",
    },
    intro:
      "El Valle Sagrado de los Incas (Willka Qhichwa en quechua) es un valle fértil de 60 kilómetros formado por el río Urubamba, ubicado entre Cusco y Machu Picchu. Para los incas era el granero del imperio: clima templado, suelos volcánicos y un sistema de terrazas agrícolas que permitían cultivar más de 200 variedades de maíz y papa. Hoy es uno de los recorridos imprescindibles del sur peruano, con sitios arqueológicos vivos como Pisac (fortaleza + mercado), Ollantaytambo (única ciudad inca aún habitada), Chinchero (textiles tradicionales), las salineras de Maras (3,000 pozas de sal pre-inca) y los andenes circulares de Moray (laboratorio agrícola inca). A solo 1-2 horas de Cusco, es la mejor opción para aclimatarse antes de Machu Picchu y conectar con la cultura andina viva.",
    quickFacts: [
      { label: "Altitud promedio", value: "2,800 msnm" },
      { label: "Río principal", value: "Urubamba (Vilcanota)" },
      { label: "Distancia desde Cusco", value: "15-90 km según sitio" },
      { label: "Duración tour clásico", value: "Full Day (10-12h)" },
      { label: "Sitios principales", value: "Pisac, Ollantaytambo, Chinchero" },
      { label: "Sitios extra (VIP)", value: "Maras, Moray, Urubamba" },
      { label: "Idiomas locales", value: "Español + Quechua" },
      { label: "Mejor época", value: "Mayo - Octubre" },
    ],
    sections: [
      {
        id: "que-ver",
        title: "Qué ver en el Valle Sagrado",
        body: "**Pisac (3,000 msnm)** — Fortaleza inca con terrazas agrícolas y un mercado tradicional famoso por sus textiles, joyería de plata y cerámica. Visita ideal por la mañana. **Ollantaytambo (2,792 msnm)** — Único pueblo del Perú que conserva trazado urbano inca con calles empedradas y casas habitadas. Su fortaleza fue la única que resistió la conquista española. **Chinchero (3,762 msnm)** — Cuna textil del Valle Sagrado, donde las mujeres aún tejen con técnicas precolombinas y tintes naturales. **Maras (3,380 msnm)** — Más de 3,000 pozas de sal explotadas desde tiempos pre-incas, alimentadas por un manantial salado subterráneo. **Moray (3,500 msnm)** — Anfiteatro circular de andenes a distintas alturas, considerado un laboratorio agrícola inca para experimentar con microclimas.",
      },
      {
        id: "tour-clasico-vs-vip",
        title: "Tour clásico vs Tour VIP — diferencias",
        body: "El **Tour clásico del Valle Sagrado** (Full Day, US$95-140) cubre Pisac (mercado + ruinas), Urubamba (almuerzo buffet) y Ollantaytambo (fortaleza). Es la opción más popular, ideal si combinas con Machu Picchu al día siguiente — terminas en Ollantaytambo y puedes pernoctar ahí para tomar tren al amanecer. El **Tour VIP del Valle Sagrado** (Full Day, US$195) agrega Chinchero (textiles + iglesia colonial), Maras (salineras) y Moray (andenes circulares), con menos personas en el grupo, almuerzo gourmet y transporte privado. Recomendado si tienes solo un día en el valle o si quieres profundizar en historia y geografía.",
      },
      {
        id: "como-llegar",
        title: "Cómo llegar y moverse",
        body: "Desde Cusco hay 3 opciones: (1) Tour organizado con bus, guía y todo incluido — Danfer Tours te recoge del hotel a las 8:00 am y regresa a las 19:00 aprox. (2) Bus público desde paradero Pavitos hasta Pisac, Urubamba u Ollantaytambo (S/8-15) — económico pero requiere coordinación. (3) Taxi privado por el día (~US$80-120 todo el grupo) — flexible pero sin guía especializado. Para Maras y Moray necesitas combi o auto privado desde Urubamba — están fuera de la ruta principal. La carretera Cusco-Valle Sagrado está asfaltada y es segura.",
      },
      {
        id: "que-comprar",
        title: "Compras en el Valle Sagrado",
        body: "El Valle Sagrado es el mejor lugar para comprar artesanía auténtica del Perú a precios justos. **Pisac (mercado)**: textiles, mantas, joyería de plata, cerámica, instrumentos andinos (quenas, charangos). Negocia respetuosamente — los precios son ya bajos. **Chinchero**: cooperativas de mujeres tejedoras que demuestran el proceso completo (esquilado, hilado, tinte natural, telar) — más caros pero auténticos. **Awana Kancha** (camino a Pisac): centro de tejido en vivo con llamas, alpacas, vicuñas — buenos chales de baby alpaca y vicuña. Evita: artesanía hecha en serie en kioscos turísticos y \"plata 950\" sin certificación.",
      },
      {
        id: "aclimatacion",
        title: "Aclimatación: por qué empezar por el Valle",
        body: "El Valle Sagrado está más bajo que Cusco (2,800 vs 3,400 msnm), lo que lo hace ideal como primer destino. Si llegas a Cusco desde nivel del mar (Lima, Quito, Bogotá), pasar la primera noche en Urubamba u Ollantaytambo reduce el riesgo de soroche. Muchos viajeros hacen este itinerario: Día 1 llegada a Cusco → traslado directo al Valle Sagrado (almuerzo + tour clásico, noche en Urubamba). Día 2 Machu Picchu desde Ollantaytambo (tren más corto). Día 3 retorno a Cusco con energía para explorar la ciudad. Pregúntanos por este paquete completo.",
      },
    ],
    faq: [
      {
        q: "¿Cuánto cuesta el tour del Valle Sagrado?",
        a: "El Tour clásico del Valle Sagrado desde Cusco cuesta US$95-140 por persona (Pisac + Urubamba + Ollantaytambo, almuerzo buffet incluido, guía bilingüe). El Tour VIP Valle Sagrado con Danfer Tours cuesta US$195 e incluye además Chinchero, Maras, Moray, transporte privado, almuerzo gourmet y grupo reducido.",
      },
      {
        q: "¿Cuánto dura el tour del Valle Sagrado?",
        a: "Es un Full Day de 10-12 horas: recojo del hotel a las 8:00 am y retorno entre 18:00-19:00. El tour VIP puede extenderse hasta 13 horas por las paradas adicionales en Maras y Moray.",
      },
      {
        q: "¿Es mejor hacer Valle Sagrado antes o después de Machu Picchu?",
        a: "Mejor ANTES de Machu Picchu, por dos razones: (1) Aclimatación gradual — el Valle está más bajo que Cusco. (2) Logística — puedes terminar el tour en Ollantaytambo y dormir ahí para tomar tren a Aguas Calientes muy temprano al día siguiente, evitando regresar a Cusco.",
      },
      {
        q: "¿Se puede ver todo el Valle Sagrado en un día?",
        a: "Sí pero apretado. El tour clásico Full Day cubre los 3 sitios principales (Pisac, Urubamba, Ollantaytambo). Para incluir Maras, Moray y Chinchero necesitas el Tour VIP (mismo día pero más estresante) o partirlo en 2 días con noche en Urubamba (recomendado para fotografía y disfrute).",
      },
      {
        q: "¿Necesito pasaporte para entrar a las ruinas del Valle?",
        a: "Sí, en cualquier sitio arqueológico del Cusco te piden pasaporte original (no fotocopia) — la entrada se llama Boleto Turístico del Cusco (BTC). Tu guía lo gestiona si reservas tour. Compra individual S/130 (parcial) o S/130 (integral, válido 10 días). Estudiantes con carnet ISIC pagan mitad.",
      },
    ],
    geo: { lat: -13.2545, lng: -72.2666, altitudeM: 2800 },
    region: "Cusco",
    bestMonths: [
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
    ],
    difficulty: "easy",
    tourCategorySlugs: ["valle-sagrado"],
    tourTitleMatchers: [/valle sagrado/i, /sacred valley/i, /pisac/i, /ollanta/i],
    relatedSlugs: ["machu-picchu", "camino-inca"],
  },

  "rainbow-mountain": {
    slug: "rainbow-mountain",
    name: "Montaña de 7 Colores",
    shortName: "Rainbow Mountain",
    alternateNames: ["Vinicunca", "Cerro Colorado", "Rainbow Mountain"],
    metaTitle:
      "Tour Rainbow Mountain (Vinicunca) desde Cusco 2026 · Full Day",
    metaDescription:
      "Tour Full Day a la Montaña de 7 Colores (Vinicunca, 5,200 msnm) desde Cusco. Transporte, desayuno, almuerzo, guía y entrada. Desde US$85.",
    h1: "Tour Rainbow Mountain (Vinicunca) desde Cusco",
    tagline: "5,200 msnm · La montaña más fotografiada del Perú",
    hero: {
      image:
        "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1920&auto=format&fit=crop",
      imageAlt:
        "Montaña Vinicunca (Rainbow Mountain) con sus franjas naturales de minerales coloreados en rojo, amarillo, turquesa y dorado",
    },
    intro:
      "La Montaña de 7 Colores, llamada Vinicunca en quechua, es una formación geológica única en los Andes peruanos: capas sedimentarias de minerales (hierro oxidado, sulfuro de cobre, óxido de zinc, calcio carbonatado) que crean franjas naturales rojas, ocres, turquesas, doradas y verdes a 5,200 metros sobre el nivel del mar. Se hizo viral en 2015 cuando el deshielo expuso colores antes cubiertos por nieve. Hoy es la atracción más fotografiada del sur peruano después de Machu Picchu, con visitas diarias desde Cusco (~3 horas de viaje en bus + 2 horas de caminata). La altitud extrema y el sendero empinado la convierten en un desafío físico — pero el paisaje al llegar al mirador justifica cada paso. Operamos esta excursión Full Day saliendo a las 4:00 am desde tu hotel en Cusco.",
    quickFacts: [
      { label: "Altitud", value: "5,200 msnm (mirador)" },
      { label: "Distancia desde Cusco", value: "100 km / 3h en bus" },
      { label: "Caminata", value: "6 km (ida y vuelta), 3-4h" },
      { label: "Desnivel", value: "+500 metros" },
      { label: "Dificultad", value: "Exigente (por altitud, no técnico)" },
      { label: "Temperatura", value: "-5°C a 12°C" },
      { label: "Duración total tour", value: "12-14 horas" },
      { label: "Mejor época", value: "Abril - Octubre (seco)" },
    ],
    sections: [
      {
        id: "como-es-el-tour",
        title: "Cómo es el tour Full Day",
        body: "Salida 4:00 am de tu hotel en Cusco en bus turístico. Desayuno en Cusipata (~6:30 am, comunidad andina). Llegada al inicio del trail en Phulawasipata (4,700 msnm, ~8:00 am). Caminata de 3 km cuesta arriba hasta el mirador de Vinicunca (5,200 msnm, ~2h subiendo lento). Tiempo libre 45 min para fotos. Descenso al punto de partida (~1.5h). Almuerzo buffet en Cusipata (~14:00). Retorno a Cusco (~18:00-19:00). Para quienes no pueden caminar toda la subida hay caballos disponibles (US$25-30 ida) operados por comuneros locales.",
      },
      {
        id: "altitud-soroche",
        title: "Altitud: lo que NO te dicen",
        body: "Rainbow Mountain está a **5,200 metros** — más alto que el campamento base del Everest (5,150 m). A esa altura hay ~50% del oxígeno disponible a nivel del mar. El soroche (mal de altura) afecta incluso a personas en buena forma. **Requisito absoluto**: 2-3 días mínimo de aclimatación en Cusco (3,400 m) antes de este tour. Si llegaste ayer a Cusco desde nivel del mar, **NO vayas todavía** — espera 48 horas mínimo. Síntomas a tener cuidado: dolor de cabeza intenso, náuseas, mareos, falta de coordinación. Lleva: agua (2L), hoja de coca, pastillas para soroche (Diamox si tu médico lo aprobó), snacks con azúcar.",
      },
      {
        id: "que-llevar",
        title: "Qué llevar para Rainbow Mountain",
        body: "Vestimenta por capas (mañanas a -5°C, mediodía hasta 12°C, sol intenso): camiseta térmica, polar, chaqueta cortavientos impermeable, pantalón térmico o trekking, calcetines de lana, zapatillas o botas de trekking con buen agarre, gorro de lana o sombrero ancho, guantes ligeros, lentes de sol UV400 (la nieve refleja). Protector solar SPF 50+ (la altura reduce filtro UV natural), labial con SPF. Mochila pequeña con agua (2L), snacks energéticos (chocolate, frutos secos, barras), hoja de coca o caramelos de coca, cámara con batería extra (el frío drena baterías rápido), pasaporte (lo piden en la entrada de la comunidad), efectivo en soles para caballo o souvenirs.",
      },
      {
        id: "alternativa-palccoyo",
        title: "Alternativa: Palccoyo (Rainbow Mountain II)",
        body: "Si la altitud o caminata extrema te preocupa, **Palccoyo** es una excelente alternativa: tres montañas multicolores en la misma región pero a menor altura (4,900 msnm vs 5,200), caminata mucho más corta y plana (~30 min vs 2h), muchos menos turistas (Vinicunca recibe 1,500/día, Palccoyo apenas 200), y paisaje igual de impresionante con tres miradores. Tour Full Day a Palccoyo desde Cusco cuesta similar a Vinicunca (US$80-95) y es ideal para familias con niños, adultos mayores o viajeros sin tiempo de aclimatar. Danfer Tours opera ambas opciones.",
      },
    ],
    faq: [
      {
        q: "¿Cuánto cuesta Rainbow Mountain desde Cusco?",
        a: "El tour Full Day a Rainbow Mountain (Vinicunca) desde Cusco con Danfer Tours cuesta US$85 por persona en servicio compartido, incluyendo transporte ida y vuelta en bus turístico, desayuno, almuerzo, guía bilingüe y entrada a la montaña. El caballo extra (US$25-30) se paga directo a los comuneros si lo necesitas.",
      },
      {
        q: "¿Es muy difícil llegar a Rainbow Mountain?",
        a: "Técnicamente NO es difícil — solo caminas por sendero amplio y plano-cuesta. El reto es la altitud (5,200 msnm) y la inclinación final. Si estás aclimatado (48h+ en Cusco), tienes buen estado físico básico y caminas lento, llegas. Para personas con problemas cardíacos, embarazadas o niños menores de 8 años no se recomienda — mejor Palccoyo.",
      },
      {
        q: "¿Cuántos días en Cusco antes de hacer Rainbow Mountain?",
        a: "Mínimo 48 horas en Cusco (3,400 m) para aclimatarse antes de subir a 5,200 m. Idealmente 3-4 días — usa ese tiempo para hacer City Tour Cusco, Valle Sagrado y/o Machu Picchu primero. Subir a 5,200 m sin aclimatación previa puede provocar edema pulmonar/cerebral, condición grave.",
      },
      {
        q: "¿Hay nieve en Rainbow Mountain?",
        a: "En temporada seca (mayo-septiembre) generalmente NO hay nieve, lo que permite ver los colores. En temporada de lluvias (noviembre-marzo) puede nevar y cubrir parcialmente los colores. Diciembre-febrero es el peor momento. Mayo-septiembre tienen las mejores condiciones de visibilidad.",
      },
    ],
    geo: { lat: -13.8694, lng: -71.3022, altitudeM: 5200 },
    region: "Cusco",
    bestMonths: [
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
    ],
    difficulty: "challenging",
    tourCategorySlugs: ["aventura", "rainbow-mountain"],
    tourTitleMatchers: [/rainbow/i, /vinicunca/i, /7 colores/i, /siete colores/i],
    relatedSlugs: ["laguna-humantay", "machu-picchu"],
  },

  "laguna-humantay": {
    slug: "laguna-humantay",
    name: "Laguna Humantay",
    shortName: "Humantay",
    alternateNames: ["Humantay Lake", "Laguna de Humantay"],
    metaTitle:
      "Tour Laguna Humantay desde Cusco 2026 · Full Day Salkantay",
    metaDescription:
      "Tour Full Day a Laguna Humantay (4,200 msnm) desde Cusco. Trekking 2h hasta laguna glaciar turquesa al pie del nevado Salkantay. Desde US$80.",
    h1: "Tour Laguna Humantay desde Cusco",
    tagline: "4,200 msnm · Laguna glaciar turquesa · Salkantay",
    hero: {
      image:
        "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1920&auto=format&fit=crop",
      imageAlt:
        "Laguna glaciar Humantay de aguas turquesas al pie del nevado Salkantay, en la región Cusco",
    },
    intro:
      "La Laguna Humantay es una laguna glaciar de origen morrénico ubicada a 4,200 msnm al pie del nevado Salkantay (6,271 m), uno de los apus (montañas sagradas) más venerados de los Andes peruanos. Su nombre significa \"Cabeza de Halcón\" en quechua. El color turquesa-esmeralda intenso del agua se debe a partículas glaciares finas (harina de roca) suspendidas en suspensión. Es una excursión Full Day desde Cusco — el viaje en bus toma 3 horas hasta Soraypampa (3,900 msnm), el trekking de subida 1.5-2 horas (1.5 km, +300m desnivel), 30-45 minutos en la laguna y descenso similar. Más fácil físicamente que Rainbow Mountain pero igual de impresionante. Es también el primer día del trek Salkantay de 5 días a Machu Picchu — muchos viajeros lo hacen como antesala de ese trek mayor.",
    quickFacts: [
      { label: "Altitud laguna", value: "4,200 msnm" },
      { label: "Nevado dominante", value: "Salkantay (6,271 m)" },
      { label: "Distancia desde Cusco", value: "80 km / 3h en bus" },
      { label: "Caminata", value: "3 km ida y vuelta, 3-4h total" },
      { label: "Desnivel", value: "+300 m" },
      { label: "Dificultad", value: "Moderada — apta para principiantes" },
      { label: "Temperatura", value: "0°C a 15°C" },
      { label: "Duración tour", value: "12-13 horas Full Day" },
    ],
    sections: [
      {
        id: "como-es-el-tour",
        title: "Cómo es el tour a Humantay",
        body: "Salida 4:30 am de Cusco en bus. Desayuno en Mollepata (~7:00 am, pueblo andino de la entrada al valle Salkantay). Llegada al punto de inicio Soraypampa (3,900 msnm, ~9:00 am). Caminata de subida 1.5-2 horas (lento, por altitud). Tiempo en la laguna 45 min — ritual de ofrendas a la pachamama opcional con tu guía. Descenso 1-1.5h. Almuerzo buffet en Mollepata (~14:00). Retorno a Cusco (~18:00). Hay opción de caballo de subida (US$30) para quien no pueda caminar todo. Recomendado para todas las edades con aclimatación previa.",
      },
      {
        id: "salkantay-conexion",
        title: "Conexión con el trek Salkantay 5D/4N",
        body: "La Laguna Humantay es la primera parada del legendario **Trek Salkantay 5 días/4 noches a Machu Picchu**, una de las mejores alternativas al Camino Inca (no requiere permiso SERNANP). El trek completo: Día 1 Cusco a Soraypampa + visita Humantay. Día 2 cruce del paso Salkantay (4,650 msnm) — el día más exigente, vista de cara norte del nevado. Día 3 descenso a selva alta (Lucmabamba), bosque nubloso. Día 4 trek a Llaqtapata + bus a Aguas Calientes. Día 5 entrada a Machu Picchu al amanecer. Si Humantay te gustó como aperitivo, considera hacer el Salkantay completo en tu próxima visita.",
      },
      {
        id: "soroche-prevencion",
        title: "Soroche en Humantay: cómo prevenirlo",
        body: "Aunque Humantay está a 4,200 m (menos extremo que Rainbow Mountain), sigue siendo altitud significativa. **Antes**: 2 días mínimo en Cusco (3,400 m) para aclimatar. **Mañana del tour**: desayuno ligero, evita lácteos pesados. **Durante**: camina LENTO con paradas frecuentes, hidrátate cada 15 min, mastica hoja de coca. **Síntomas leves normales**: dolor de cabeza ligero, falta de aire al subir. **Síntomas para retroceder**: vómitos, confusión, dolor de cabeza intenso, falta de coordinación. Los guías llevan tanque de oxígeno de emergencia.",
      },
    ],
    faq: [
      {
        q: "¿Cuánto cuesta el tour a Laguna Humantay?",
        a: "El tour Full Day a Laguna Humantay desde Cusco cuesta desde US$80 por persona en servicio compartido (Danfer Tours), incluyendo transporte, desayuno, almuerzo buffet, entrada al sitio, guía profesional y tanque de oxígeno. Caballo opcional US$30.",
      },
      {
        q: "¿Es más fácil que Rainbow Mountain?",
        a: "Sí, considerablemente. Humantay: 4,200 m vs Rainbow 5,200 m (1 km menos). Caminata 1.5h vs 2h. Sendero más gradual. Si estás dudando entre las dos por dificultad, Humantay es mejor primera experiencia de alta montaña.",
      },
      {
        q: "¿Se puede nadar en la Laguna Humantay?",
        a: "NO. La laguna es sagrada para las comunidades locales (Apu Salkantay), está prohibido ingresar al agua. Además, la temperatura del agua es ~2°C (proviene del deshielo glaciar) — hipotermia en minutos. Solo fotos y contemplación.",
      },
      {
        q: "¿Cuándo es la mejor época para visitar Humantay?",
        a: "Abril-octubre (temporada seca) tienen los cielos más despejados y el color de la laguna más intenso. Diciembre-marzo (temporada de lluvias) la laguna puede verse más turbia y el sendero embarrado. Mayo-junio y septiembre-octubre son los meses sweet-spot.",
      },
    ],
    geo: { lat: -13.3458, lng: -72.6261, altitudeM: 4200 },
    region: "Cusco",
    bestMonths: [
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
    ],
    difficulty: "moderate",
    tourCategorySlugs: ["aventura"],
    tourTitleMatchers: [/humantay/i, /salkantay/i],
    relatedSlugs: ["rainbow-mountain", "machu-picchu"],
  },
};

// Versiones en inglés (una por destino). Si falta alguna, cae a español.
import { machuPicchuEn } from "./destinations-en/machu-picchu";
import { caminoIncaEn } from "./destinations-en/camino-inca";
import { valleSagradoEn } from "./destinations-en/valle-sagrado";
import { rainbowMountainEn } from "./destinations-en/rainbow-mountain";
import { lagunaHumantayEn } from "./destinations-en/laguna-humantay";

const DESTINATIONS_EN: Record<string, DestinationContent> = {
  "machu-picchu": machuPicchuEn,
  "camino-inca": caminoIncaEn,
  "valle-sagrado": valleSagradoEn,
  "rainbow-mountain": rainbowMountainEn,
  "laguna-humantay": lagunaHumantayEn,
};

export function getDestinationBySlug(
  slug: string,
  locale: string = "es"
): DestinationContent | null {
  if (locale === "en") return DESTINATIONS_EN[slug] ?? DESTINATIONS[slug] ?? null;
  return DESTINATIONS[slug] ?? null;
}

export function listDestinations(
  locale: string = "es"
): DestinationContent[] {
  return Object.keys(DESTINATIONS).map(
    (slug) => getDestinationBySlug(slug, locale) as DestinationContent
  );
}
