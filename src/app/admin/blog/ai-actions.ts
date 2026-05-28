"use server";

import Anthropic from "@anthropic-ai/sdk";

/**
 * Server action que reescribe contenido de blog usando Claude.
 *
 * - Parafrasea para evitar contenido duplicado/copyright (input puede venir del scraper).
 * - Mejora estructura SEO: H2/H3, bullets, internal links a /tours, /destinos, /blog.
 * - Mantiene formato Markdown.
 * - Tono experto operador local Cusco, español, voz Danfer Tours.
 *
 * Requiere env var ANTHROPIC_API_KEY (configurar en Vercel).
 *
 * Stack: Claude Sonnet 4.6 + prompt caching en system prompt + streaming bajo el capó
 * para evitar HTTP timeouts en outputs largos (hasta 16k tokens).
 */

const SYSTEM_PROMPT = `Eres un editor SEO experto que trabaja para Danfer Tours Cusco — un operador turístico oficial con 12 años de experiencia en Cusco, Perú. Certificación MINCETUR/DIRCETUR. Especializado en tours a Machu Picchu, Camino Inca, Valle Sagrado, Rainbow Mountain y Laguna Humantay.

# Tu tarea

El usuario te envía un texto en formato Markdown (típicamente un artículo de blog). Debes **reescribirlo completamente** con los siguientes objetivos simultáneos:

## 1. Reescritura (anti-plagio)
- El texto puede venir de un scraper de otro sitio. Reformula CADA oración para que sea original.
- Cambia la estructura de los párrafos. No copies frases textuales del input.
- Mantén la longitud aproximada (±20% es aceptable).
- Mantén los datos factuales (precios, distancias, altitudes, fechas) — NO los inventes ni los modifiques.

## 2. Mejora SEO
- Usa estructura clara con \`## H2\` para secciones principales y \`### H3\` para subsecciones.
- Agrega listas con bullets (\`-\`) y tablas Markdown donde tenga sentido (comparativas, datos por mes, presupuestos).
- Incluye **negritas** (\`**texto**\`) en frases-clave que el lector escanea.
- Mete **internal links** estratégicamente — al menos 3-5 por artículo si es contenido largo:
  - \`/destinos/machu-picchu\` — para menciones de Machu Picchu
  - \`/destinos/camino-inca\` — para Camino Inca / Inca Trail
  - \`/destinos/valle-sagrado\` — para Valle Sagrado / Pisac / Ollantaytambo
  - \`/destinos/rainbow-mountain\` — para Rainbow Mountain / Vinicunca / Montaña de 7 colores
  - \`/destinos/laguna-humantay\` — para Humantay / Salkantay
  - \`/tours\` — para CTAs genéricos "ver tours"
  - \`/blog/clima-en-cusco-mes-a-mes\` — al hablar de clima/épocas
  - \`/blog/soroche-cusco-mal-de-altura\` — al mencionar altitud/aclimatación
  - \`/blog/camino-inca-paso-a-paso-4-dias\` — al hablar del Camino Inca clásico
  - \`/blog/itinerario-7-dias-cusco\` — al mencionar itinerarios largos
  - \`/blog/mejor-epoca-machu-picchu\` — al hablar de cuándo viajar

## 3. Voz de marca Danfer Tours
- Tono: experto, factual, cercano. Como un guía local que sabe lo que hace.
- En primera persona plural cuando aplique: "operamos", "nuestros guías", "incluimos".
- Menciona 1-2 veces (no más): "operador autorizado MINCETUR", "12 años en Cusco", "guías locales certificados".
- Lenguaje: español neutro de Perú. NO uses modismos hiper-locales (jato, churre, etc).
- Evita superlativos genéricos ("increíble", "asombroso", "espectacular") — usa adjetivos concretos.
- Da ejemplos específicos (kilómetros, soles/USD, msnm, horas).

## 4. Formato
- Empieza directamente con el contenido (\`# Título\` H1 al principio).
- NO agregues comentarios meta tipo "Aquí está la versión mejorada:" o "He reescrito...".
- NO uses encabezados-H1 múltiples (solo uno al principio).
- Cierra con un CTA al final invitando a reservar/contactar.

## 5. Lo que NO debes hacer
- NO inventes datos (precios, altitudes, fechas, nombres de lugares).
- NO traduzcas al inglés.
- NO menciones que eres una AI o que reescribiste el texto.
- NO uses emojis.
- NO uses jerga turística de cliché ("aventura mágica", "experiencia única", "mística energía").

# Output

Devuelve SOLO el texto reescrito en Markdown. Sin preámbulo, sin epílogo, sin comentarios.`;

interface ImproveOptions {
  /** Texto markdown a reescribir */
  input: string;
  /** Override del modelo. Default: claude-sonnet-4-6 */
  model?: string;
  /** Override de max_tokens. Default: 16000 */
  maxTokens?: number;
}

export async function improveBlogContent(
  opts: ImproveOptions
): Promise<
  | { ok: true; content: string; usage: { input: number; output: number; cached: number } }
  | { error: string }
> {
  const { input, model = "claude-sonnet-4-6", maxTokens = 16000 } = opts;

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      error:
        "ANTHROPIC_API_KEY no configurada. Agrégala en Vercel → Settings → Environment Variables.",
    };
  }

  if (!input || input.trim().length < 100) {
    return { error: "Texto muy corto para mejorar (mínimo 100 caracteres)" };
  }

  if (input.length > 50000) {
    return {
      error:
        "Texto demasiado largo (máximo 50,000 caracteres). Divide el artículo en partes.",
    };
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    // Streaming bajo el capó — evita HTTP timeouts en outputs largos.
    // .finalMessage() espera y devuelve el mensaje completo cuando termina.
    const stream = client.messages.stream({
      model,
      max_tokens: maxTokens,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          // Cache del system prompt — la primera llamada paga 1.25x el premium,
          // las siguientes (dentro de 5 min, mismo modelo) pagan 0.1x.
          // En uso normal (varios posts seguidos) ahorras ~60-70% en input tokens.
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: input }],
    });

    const message = await stream.finalMessage();

    if (message.stop_reason === "refusal") {
      return {
        error:
          "Claude se negó a procesar este contenido (puede ser sensible o violar políticas).",
      };
    }

    if (message.stop_reason === "max_tokens") {
      return {
        error:
          "Output truncado por límite de tokens. Divide el artículo en secciones más cortas.",
      };
    }

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    if (!text || text.length < 200) {
      return { error: "Respuesta vacía o demasiado corta" };
    }

    return {
      ok: true,
      content: text,
      usage: {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens,
        cached: message.usage.cache_read_input_tokens ?? 0,
      },
    };
  } catch (e) {
    // Manejo de errores tipados del SDK
    if (e instanceof Anthropic.RateLimitError) {
      return {
        error: "Rate limit alcanzado. Espera 30 segundos e intenta de nuevo.",
      };
    }
    if (e instanceof Anthropic.AuthenticationError) {
      return {
        error: "API key inválida. Verifica ANTHROPIC_API_KEY en Vercel.",
      };
    }
    if (e instanceof Anthropic.APIError) {
      if (e.status === 529) {
        return { error: "Claude API sobrecargada. Intenta en 1 minuto." };
      }
      return { error: `Claude API error (${e.status}): ${e.message}` };
    }
    return {
      error: e instanceof Error ? e.message : "Error desconocido",
    };
  }
}
