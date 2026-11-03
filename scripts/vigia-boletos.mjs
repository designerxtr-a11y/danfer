// Vigía de la venta de boletos 2027 a Machu Picchu y Camino Inca.
// Revisa las noticias del Ministerio de Cultura y TuBoleto, y manda una
// notificación al celular (ntfy.sh) cuando aparece algo nuevo sobre la venta.
//
// En Windows muestra además una notificación de escritorio (toast).
//
// Uso:  node scripts/vigia-boletos.mjs              (toast en Windows)
//       NTFY_TOPIC=<tema> node scripts/vigia-boletos.mjs   (también al celular)
//       DRY_RUN=1 node scripts/vigia-boletos.mjs   (no notifica, solo imprime)
// Estado: .vigia/estado.json (lo que ya se avisó, para no repetir).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { spawnSync } from "child_process";

const STATE_FILE = ".vigia/estado.json";
const TOPIC = process.env.NTFY_TOPIC;
const DRY = process.env.DRY_RUN === "1";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

const TEMA = /machu ?picchu|camino(s)? in[kc]a|llaqta/i;
const VENTA = /boleto|entrada|venta|reserva|2027|aforo|tuboleto/i;

async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

const unescape = (s) =>
  s
    .replace(/\\u003c/g, "<")
    .replace(/\\u003e/g, ">")
    .replace(/\\u0026/g, "&")
    .replace(/\\"/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;|&#039;/g, "'")
    .replace(/&amp;/g, "&");

// Noticias de gob.pe: búsqueda de la institución "cultura", más recientes primero.
async function gobpe(term) {
  const url = `https://www.gob.pe/busquedas?institucion=cultura&sheet=1&sort_by=recent&contenido[]=noticias&term=${term}`;
  const html = unescape(await get(url));
  const out = [];
  for (const m of html.matchAll(/href="(\/institucion\/cultura\/noticias\/\d+[^"]*)"[^>]*>([^<]+)<\/a>/g)) {
    out.push({ id: m[1].match(/noticias\/(\d+)/)[1], title: m[2].trim(), url: "https://www.gob.pe" + m[1] });
  }
  return out;
}

// Noticias de la Dirección Desconcentrada de Cultura de Cusco.
async function culturaCusco() {
  const html = unescape(await get("https://www.culturacusco.gob.pe/noticias/"));
  const out = [];
  for (const m of html.matchAll(/href="(https:\/\/www\.culturacusco\.gob\.pe\/noticia\/[^"]+)"\s+title="([^"]+)"/g)) {
    out.push({ id: m[1], title: m[2].trim(), url: m[1] });
  }
  return out;
}

// Páginas oficiales de compra: avisa una vez si empiezan a mencionar 2027.
const PAGINAS_2027 = [
  "https://tuboleto.cultura.pe/",
  "https://www.gob.pe/institucion/cultura/pages/70649-comprar-entradas-para-visitar-machupicchu-en-tuboleto-cultura-pe",
];

// Notificación de Windows (toast). Usa Windows PowerShell 5.1, que trae las APIs de WinRT.
function toast(title, body, url) {
  const x = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const launch = url ? ` activationType="protocol" launch="${x(url)}"` : "";
  const xml = `<toast scenario="reminder"${launch}><visual><binding template="ToastGeneric"><text>${x(title)}</text><text>${x(body)}</text></binding></visual><actions><action content="Abrir" activationType="protocol" arguments="${x(url ?? "https://tuboleto.cultura.pe/")}"/><action content="Cerrar" activationType="system" arguments="dismiss"/></actions></toast>`;
  const ps = `
[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null
$d = New-Object Windows.Data.Xml.Dom.XmlDocument
$d.LoadXml('${xml.replace(/'/g, "''")}')
$app = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\\WindowsPowerShell\\v1.0\\powershell.exe'
[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($app).Show([Windows.UI.Notifications.ToastNotification]::new($d))`;
  const enc = Buffer.from(ps, "utf16le").toString("base64");
  spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-EncodedCommand", enc], { stdio: "inherit" });
}

async function notify(title, body, url) {
  console.log(`AVISO: ${title}\n  ${body}\n  ${url ?? ""}`);
  if (DRY) return;
  if (process.platform === "win32") toast(title, body, url);
  if (!TOPIC) return;
  await fetch(`https://ntfy.sh/${TOPIC}`, {
    method: "POST",
    body,
    headers: {
      Title: title.replace(/[^\x20-\x7E]/g, (c) => c.normalize("NFD").replace(/[̀-ͯ]/g, "")),
      Priority: "urgent",
      Tags: "rotating_light",
      ...(url ? { Click: url } : {}),
    },
  });
}

const state = existsSync(STATE_FILE)
  ? JSON.parse(readFileSync(STATE_FILE, "utf8"))
  : { seen: [], pages2027: [] };
const firstRun = state.seen.length === 0;
const seen = new Set(state.seen);

const items = [];
const errors = [];
for (const [name, fn] of [
  ["gob.pe machupicchu", () => gobpe("machupicchu")],
  ["gob.pe boletos", () => gobpe("boletos")],
  ["gob.pe camino inka", () => gobpe("camino+inka")],
  ["Cultura Cusco", culturaCusco],
]) {
  try {
    const r = await fn();
    console.log(`${name}: ${r.length} noticias`);
    items.push(...r);
  } catch (e) {
    errors.push(`${name}: ${e.message}`);
  }
}

let avisos = 0;
for (const it of items) {
  if (seen.has(it.id)) continue;
  seen.add(it.id);
  if (firstRun) continue; // la primera vez solo se guarda lo que ya existía
  if (TEMA.test(it.title) && VENTA.test(it.title)) {
    await notify("Ministerio de Cultura: noticia sobre boletos", it.title, it.url);
    avisos++;
  }
}

for (const url of PAGINAS_2027) {
  if (state.pages2027.includes(url)) continue;
  try {
    if (/2027/.test(await get(url))) {
      state.pages2027.push(url);
      await notify("TuBoleto ya menciona 2027", "Revisar ya si abrio la venta 2027 de Machu Picchu.", url);
      avisos++;
    }
  } catch (e) {
    errors.push(`${url}: ${e.message}`);
  }
}

if (firstRun) {
  await notify("Vigia de boletos activo", `Revisando ${items.length} noticias del Ministerio. Te aviso cuando salga algo nuevo sobre la venta.`);
}

// Si todas las fuentes fallan, avisar (puede que cambiaron las webs).
if (items.length === 0) {
  await notify("Vigia de boletos: no pudo leer las webs", errors.join("\n") || "0 noticias encontradas");
}

mkdirSync(".vigia", { recursive: true });
writeFileSync(STATE_FILE, JSON.stringify({ seen: [...seen].slice(-500), pages2027: state.pages2027 }, null, 1));
console.log(`${avisos} avisos. ${errors.length ? "Errores: " + errors.join(" | ") : ""}`);
