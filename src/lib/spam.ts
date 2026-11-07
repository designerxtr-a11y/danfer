// Detector de spam de bots en formularios (sin dependencias, testeable).
// Patrón visto en Consultas: nombre y mensaje = cadenas aleatorias sin
// espacios ("hDjjimGMlblKBsfJPZxf") y Gmail con puntos entre casi cada letra
// ("y.uc.os.i.le.m.ef.i85@gmail.com").

/** Cadena tipo "aBcDeFgHiJkL": una sola palabra larga con mayúsculas en medio. */
export function looksRandom(s: string | null | undefined): boolean {
  const t = (s ?? "").trim();
  if (t.length < 10 || /\s/.test(t)) return false;
  if (!/^[A-Za-z]+$/.test(t)) return false;
  const innerUpper = (t.slice(1).match(/[A-Z]/g) ?? []).length;
  return innerUpper >= 3;
}

/** Gmail con 4+ puntos en la parte local (truco para evadir filtros). */
export function dottedGmail(email: string | null | undefined): boolean {
  const m = (email ?? "").toLowerCase().match(/^([^@]+)@(gmail|googlemail)\.com$/);
  if (!m) return false;
  return (m[1].match(/\./g) ?? []).length >= 4;
}

/** Mensaje de una sola "palabra" larga de letras (ninguna persona escribe así). */
export function oneWordGibberish(s: string | null | undefined): boolean {
  const t = (s ?? "").trim();
  return t.length >= 10 && /^[A-Za-z]+$/.test(t);
}

export function isSpamInquiry(i: { name?: string | null; email?: string | null; message?: string | null }): boolean {
  const signals = [
    looksRandom(i.name),
    looksRandom(i.message) || oneWordGibberish(i.message),
    dottedGmail(i.email),
  ].filter(Boolean).length;
  return signals >= 2;
}
