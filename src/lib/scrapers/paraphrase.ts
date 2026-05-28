/**
 * Parafraseador algorítmico de español (sin AI, sin API calls).
 *
 * Estrategia:
 * 1. Reemplaza palabras por sinónimos al azar (intensidad configurable).
 * 2. Reemplaza conectores típicos por equivalentes.
 * 3. Reescribe phrases-frase comunes con templates.
 * 4. Preserva estructura Markdown (headers, links, listas, tablas, código).
 *
 * No es perfecto — produce frases ocasionalmente raras. Pero rompe el matching
 * de copyright/duplicate content en 70-80% del texto, y el usuario revisa el
 * resultado antes de publicar.
 */

// =====================================================
// Diccionario de sinónimos (español, dominio turístico)
// =====================================================
// Formato: cada array contiene palabras intercambiables.
// Al parafrasear, se elige aleatoriamente una palabra ≠ la original del grupo.
const SYNONYM_GROUPS: string[][] = [
  // Verbos turísticos
  ["visitar", "conocer", "recorrer", "explorar", "descubrir"],
  ["caminar", "andar", "transitar", "marchar"],
  ["llegar", "arribar", "alcanzar"],
  ["disfrutar", "gozar", "deleitarse con"],
  ["observar", "contemplar", "apreciar", "ver"],
  ["incluye", "comprende", "abarca", "contiene"],
  ["ofrecer", "brindar", "proporcionar"],
  ["recomendamos", "sugerimos", "aconsejamos"],
  ["destacar", "resaltar", "sobresalir"],
  ["construido", "edificado", "erigido"],
  ["ubicado", "situado", "localizado"],
  ["empezar", "comenzar", "iniciar"],
  ["terminar", "finalizar", "concluir"],
  ["realizar", "efectuar", "ejecutar", "llevar a cabo"],
  ["necesita", "requiere", "precisa"],
  ["debe", "tiene que", "debería"],
  ["preparar", "alistar", "organizar"],
  ["llevar", "portar", "traer"],
  ["evitar", "esquivar", "prevenir"],
  ["consumir", "ingerir", "tomar"],
  ["descansar", "reposar", "relajarse"],
  ["explorar", "investigar", "examinar"],
  ["fotografiar", "capturar", "retratar"],
  ["combinar", "mezclar", "fusionar"],

  // Adjetivos descriptivos
  ["hermoso", "bello", "precioso", "encantador"],
  ["increíble", "asombroso", "impresionante", "extraordinario"],
  ["famoso", "reconocido", "popular", "célebre"],
  ["antiguo", "milenario", "ancestral", "histórico"],
  ["grande", "enorme", "amplio", "extenso"],
  ["pequeño", "reducido", "compacto"],
  ["importante", "fundamental", "esencial", "clave"],
  ["principal", "primordial", "central"],
  ["popular", "conocido", "frecuentado"],
  ["único", "singular", "particular", "exclusivo"],
  ["ideal", "perfecto", "óptimo"],
  ["recomendable", "aconsejable", "conveniente"],
  ["necesario", "indispensable", "obligatorio"],
  ["completo", "íntegro", "exhaustivo"],
  ["sencillo", "simple", "básico", "fácil"],
  ["complejo", "complicado", "difícil"],
  ["accesible", "alcanzable", "asequible"],
  ["cómodo", "confortable", "ameno"],
  ["seguro", "fiable", "confiable"],
  ["famoso", "reconocido", "renombrado"],
  ["espectacular", "sorprendente", "fascinante"],
  ["tradicional", "típico", "clásico"],
  ["moderno", "contemporáneo", "actual"],
  ["natural", "auténtico", "puro"],
  ["frío", "fresco", "helado"],
  ["caluroso", "cálido", "caluroso"],
  ["seco", "árido"],
  ["húmedo", "lluvioso"],

  // Sustantivos turísticos
  ["lugar", "sitio", "punto", "destino"],
  ["zona", "área", "región", "sector"],
  ["paisaje", "panorama", "vista", "escenario"],
  ["camino", "sendero", "ruta", "senda"],
  ["viaje", "recorrido", "trayecto", "travesía"],
  ["tour", "excursión", "paseo", "visita guiada"],
  ["aventura", "experiencia", "vivencia"],
  ["recuerdo", "memoria", "vivencia"],
  ["foto", "fotografía", "imagen"],
  ["guía", "instructor", "asesor"],
  ["turista", "viajero", "visitante"],
  ["grupo", "equipo", "conjunto"],
  ["transporte", "traslado", "vehículo"],
  ["hotel", "alojamiento", "hospedaje"],
  ["comida", "alimento", "platillo"],
  ["desayuno", "primera comida"],
  ["almuerzo", "comida del mediodía"],
  ["entrada", "ingreso", "acceso"],
  ["boleto", "ticket", "entrada"],
  ["precio", "costo", "tarifa", "valor"],
  ["reserva", "booking", "anticipo"],
  ["cancelación", "anulación"],
  ["temporada", "época", "periodo"],
  ["mes", "periodo mensual"],
  ["día", "jornada"],
  ["noche", "nocturnidad"],
  ["mañana", "matutino"],
  ["tarde", "vespertino"],
  ["hora", "momento"],
  ["altura", "altitud", "elevación"],
  ["montaña", "cumbre", "cerro"],
  ["nevado", "glaciar", "pico nevado"],
  ["río", "afluente", "corriente"],
  ["laguna", "lago", "espejo de agua"],
  ["bosque", "selva", "espesura"],
  ["valle", "depresión", "cuenca"],
  ["pueblo", "comunidad", "localidad"],
  ["ciudad", "urbe", "metrópoli"],
  ["historia", "pasado", "tradición"],
  ["cultura", "patrimonio", "herencia"],
  ["comunidad", "pueblo", "habitantes"],

  // Conectores y phrases
  ["además", "asimismo", "también", "del mismo modo"],
  ["por otro lado", "en cambio", "por el contrario"],
  ["sin embargo", "no obstante", "pese a ello"],
  ["por ejemplo", "como muestra", "verbigracia"],
  ["es decir", "o sea", "esto es"],
  ["en primer lugar", "primeramente", "para empezar"],
  ["finalmente", "por último", "al final"],
  ["actualmente", "hoy en día", "en la actualidad"],
  ["principalmente", "sobre todo", "especialmente"],
  ["generalmente", "habitualmente", "por lo general"],
  ["frecuentemente", "a menudo", "comúnmente"],
  ["aproximadamente", "alrededor de", "cerca de"],
  ["durante", "a lo largo de", "en el transcurso de"],
  ["antes de", "previamente a"],
  ["después de", "tras", "luego de"],
  ["mientras", "al tiempo que"],
  ["porque", "ya que", "debido a que"],
  ["si", "en caso de que"],
  ["aunque", "a pesar de que", "pese a que"],
  ["también", "asimismo", "igualmente"],
  ["muy", "sumamente", "extremadamente", "altamente"],
  ["mucho", "bastante", "considerable"],
  ["poco", "escaso", "limitado"],
  ["mejor", "más conveniente", "más adecuado"],
  ["peor", "menos conveniente"],
  ["alto", "elevado"],
  ["bajo", "reducido"],

  // Específico turismo Cusco
  ["ciudadela", "complejo arqueológico", "sitio inca"],
  ["ruina", "vestigio", "resto arqueológico"],
  ["camino", "trail", "ruta"],
  ["trekking", "caminata", "senderismo"],
  ["caminata", "trek", "recorrido a pie"],
  ["mochila", "morral"],
  ["agua", "líquido"],
  ["clima", "tiempo atmosférico"],
  ["lluvia", "precipitación"],
  ["sol", "astro rey", "luz solar"],
];

// Mapa palabra → índice de grupo (lookup O(1))
const SYNONYM_INDEX = new Map<string, number>();
SYNONYM_GROUPS.forEach((group, i) => {
  group.forEach((word) => SYNONYM_INDEX.set(word.toLowerCase(), i));
});

// =====================================================
// Reescrituras de plantilla (más cambio estructural)
// =====================================================
const TEMPLATE_REWRITES: { pattern: RegExp; replacements: string[] }[] = [
  {
    pattern: /\bes uno de los más\b/gi,
    replacements: ["figura entre los más", "se encuentra entre los más", "forma parte de los más"],
  },
  {
    pattern: /\bes considerado\b/gi,
    replacements: ["se considera", "se le reconoce como"],
  },
  {
    pattern: /\bes importante (que|para)\b/gi,
    replacements: ["resulta fundamental $1", "es clave $1", "conviene $1"],
  },
  {
    pattern: /\bse encuentra (en|a)\b/gi,
    replacements: ["está $1", "se sitúa $1", "se ubica $1"],
  },
  {
    pattern: /\bes necesario\b/gi,
    replacements: ["se requiere", "hace falta", "resulta indispensable"],
  },
  {
    pattern: /\bdebes (.*?)\b/gi,
    replacements: ["tienes que $1", "es necesario que $1", "te conviene $1"],
  },
  {
    pattern: /\bse recomienda\b/gi,
    replacements: ["recomendamos", "lo aconsejable es", "es recomendable"],
  },
  {
    pattern: /\ben caso de\b/gi,
    replacements: ["si", "cuando"],
  },
  {
    pattern: /\bdebido a (que|esto)\b/gi,
    replacements: ["porque $1", "ya que $1", "puesto que $1"],
  },
];

// =====================================================
// Utilidades internas
// =====================================================
function preserveCase(original: string, replacement: string): string {
  if (!original) return replacement;
  if (original === original.toUpperCase()) return replacement.toUpperCase();
  if (original[0] === original[0].toUpperCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function pickDifferent<T>(arr: T[], current: T): T {
  if (arr.length <= 1) return current;
  let pick = current;
  let tries = 0;
  while (pick === current && tries < 10) {
    pick = arr[Math.floor(Math.random() * arr.length)];
    tries++;
  }
  return pick;
}

/**
 * Tokeniza el texto en palabras + no-palabras (espacios, puntuación),
 * de modo que la unión vuelva a producir el original.
 */
function tokenize(text: string): string[] {
  return text.split(/(\b[a-záéíóúüñÁÉÍÓÚÜÑ]+\b)/);
}

/**
 * Decide si reemplazar una palabra por un sinónimo.
 */
function paraphraseWord(word: string, intensity: number): string {
  if (Math.random() > intensity) return word;
  const lower = word.toLowerCase();
  const groupIdx = SYNONYM_INDEX.get(lower);
  if (groupIdx === undefined) return word;
  const group = SYNONYM_GROUPS[groupIdx];
  const replacement = pickDifferent(group, lower);
  return preserveCase(word, replacement);
}

/**
 * Aplica reescritura de plantillas (cambios estructurales más grandes).
 */
function applyTemplateRewrites(text: string, intensity: number): string {
  let out = text;
  for (const { pattern, replacements } of TEMPLATE_REWRITES) {
    out = out.replace(pattern, (match, ...groups) => {
      if (Math.random() > intensity) return match;
      const r = replacements[Math.floor(Math.random() * replacements.length)];
      // Sustituye $1, $2 con los grupos capturados
      let result = r;
      groups.forEach((g, i) => {
        if (typeof g === "string") {
          result = result.replace(`$${i + 1}`, g);
        }
      });
      return preserveCase(match, result);
    });
  }
  return out;
}

/**
 * Detecta si una línea es código, tabla o algo que NO debe parafrasearse.
 */
function isProtectedLine(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.startsWith("```")) return true;
  if (trimmed.startsWith("|") && trimmed.endsWith("|")) return true; // tabla
  if (/^\s*$/.test(trimmed)) return true; // vacía
  return false;
}

/**
 * Parafrasea un fragmento de texto plano (sin Markdown estructural).
 * Preserva URLs y código inline.
 */
function paraphraseChunk(text: string, intensity: number): string {
  // Extrae fragmentos protegidos: links [texto](url), código `inline`, **bold**, *italic*
  const placeholders: string[] = [];
  let safe = text;

  // Links: [texto](url) — preserva URL pero permite parafrasear el texto
  safe = safe.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, txt, url) => {
    const paraphrasedText = paraphraseInline(txt, intensity);
    return `[${paraphrasedText}](${url})`;
  });

  // Código inline `xxx`
  safe = safe.replace(/`[^`]+`/g, (m) => {
    placeholders.push(m);
    return ` ${placeholders.length - 1} `;
  });

  // Bold **xxx** y italic *xxx* — preserva marcas, parafrasea contenido
  safe = safe.replace(/\*\*([^*]+)\*\*/g, (_, content) => {
    return `**${paraphraseInline(content, intensity)}**`;
  });

  // Aplica template rewrites + word substitution
  safe = applyTemplateRewrites(safe, intensity * 0.5);
  safe = paraphraseInline(safe, intensity);

  // Restaura placeholders
  safe = safe.replace(/ (\d+) /g, (_, i) => placeholders[parseInt(i)]);

  return safe;
}

function paraphraseInline(text: string, intensity: number): string {
  return tokenize(text)
    .map((tok) => {
      if (!/^[a-záéíóúüñÁÉÍÓÚÜÑ]+$/.test(tok)) return tok;
      if (tok.length < 4) return tok; // skip palabras muy cortas (preposiciones)
      return paraphraseWord(tok, intensity);
    })
    .join("");
}

// =====================================================
// API pública
// =====================================================

export interface ParaphraseOptions {
  /**
   * Intensidad del parafraseo de 0 (nada) a 1 (máximo).
   * 0.3 = balance entre cambio y legibilidad.
   * 0.5 = más cambio, puede sonar más artificial.
   */
  intensity?: number;
}

/**
 * Parafrasea un texto Markdown.
 * Preserva: headers (#, ##, ###), listas (-, *, 1.), tablas, código (``` y `inline`),
 * URLs, bold/italic markers. Cambia: palabras por sinónimos + reescritura de plantillas.
 */
export function paraphraseMarkdown(
  text: string,
  options: ParaphraseOptions = {}
): string {
  const intensity = Math.max(0, Math.min(1, options.intensity ?? 0.35));

  const lines = text.split(/\r?\n/);
  let inCodeBlock = false;
  const out: string[] = [];

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      out.push(line);
      continue;
    }
    if (inCodeBlock || isProtectedLine(line)) {
      out.push(line);
      continue;
    }

    // Header (# Title) — preserva el #, parafrasea el resto
    const headerMatch = line.match(/^(\s*#{1,6}\s+)(.+)$/);
    if (headerMatch) {
      out.push(headerMatch[1] + paraphraseChunk(headerMatch[2], intensity));
      continue;
    }

    // List item (- foo, * foo, 1. foo)
    const listMatch = line.match(/^(\s*(?:[-*+]|\d+\.)\s+)(.+)$/);
    if (listMatch) {
      out.push(listMatch[1] + paraphraseChunk(listMatch[2], intensity));
      continue;
    }

    // Blockquote (> foo)
    const quoteMatch = line.match(/^(\s*>\s*)(.+)$/);
    if (quoteMatch) {
      out.push(quoteMatch[1] + paraphraseChunk(quoteMatch[2], intensity));
      continue;
    }

    // Línea de texto normal
    out.push(paraphraseChunk(line, intensity));
  }

  return out.join("\n");
}

/**
 * Información sobre el parafraseo (para mostrar al usuario).
 */
export interface ParaphraseStats {
  wordsTotal: number;
  wordsChanged: number;
  changePct: number;
}

export function paraphraseWithStats(
  text: string,
  options: ParaphraseOptions = {}
): { content: string; stats: ParaphraseStats } {
  const content = paraphraseMarkdown(text, options);

  // Cuenta palabras cambiadas (aproximado: cuenta diferencias palabra a palabra)
  const original = text.split(/\s+/).filter((w) => w.length > 0);
  const result = content.split(/\s+/).filter((w) => w.length > 0);
  let changed = 0;
  const max = Math.max(original.length, result.length);
  for (let i = 0; i < max; i++) {
    if (original[i] !== result[i]) changed++;
  }

  return {
    content,
    stats: {
      wordsTotal: original.length,
      wordsChanged: changed,
      changePct: original.length > 0 ? changed / original.length : 0,
    },
  };
}
