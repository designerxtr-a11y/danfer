import Image from "next/image";
import { getLocale } from "next-intl/server";

/**
 * Franja de acreditaciones. SOLO deben listarse organismos en los que la
 * empresa esté realmente registrada o afiliada: son marcas registradas y
 * mostrarlas sin acreditación es una afirmación falsa ante el cliente.
 *
 * Para agregar una: subir el logo a Supabase Storage (carpeta `certificaciones`)
 * y sumar la entrada acá. Si el array queda vacío, la sección no se renderiza.
 */
interface Certification {
  /** Nombre del organismo, usado como alt y título accesible. */
  name: string;
  src: string;
  /** Ancho intrínseco del archivo, para que next/image no deforme el logo. */
  width: number;
  height: number;
}

const BUCKET =
  "https://pgzrzvvdrldlwiyopqgh.supabase.co/storage/v1/object/public/tour-images/certificaciones";

const CERTIFICATIONS: Certification[] = [
  { name: "CARTUC", src: `${BUCKET}/cartuc.png`, width: 596, height: 200 },
  { name: "GERCETUR Cusco", src: `${BUCKET}/gercetur.webp`, width: 500, height: 317 },
  {
    name: "Adventure Travel Trade Association",
    src: `${BUCKET}/atta.png`,
    width: 596,
    height: 200,
  },
  { name: "Tripadvisor", src: `${BUCKET}/tripadvisor.png`, width: 596, height: 200 },
  { name: "MINCETUR", src: `${BUCKET}/mincetur.jpg`, width: 209, height: 136 },
  { name: "Marca Perú", src: `${BUCKET}/marca-peru.png`, width: 2048, height: 1409 },
  { name: "CALTUR", src: `${BUCKET}/caltur.png`, width: 225, height: 88 },
  { name: "IATA", src: `${BUCKET}/iata.png`, width: 800, height: 499 },
];

export async function Certifications() {
  if (CERTIFICATIONS.length === 0) return null;

  const locale = await getLocale();
  const eyebrow =
    locale === "en" ? "Registered and affiliated with" : "Registrados y afiliados a";

  return (
    <section className="py-14 border-y border-night/5 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 mb-8 text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-night/40 font-medium">
          {eyebrow}
        </span>
      </div>

      {/* Cinta infinita: dos pistas idénticas que se desplazan -100% de su
          propio ancho, así la segunda entra justo cuando la primera sale.
          `min-w-full` + `justify-around` evita el hueco blanco cuando los
          logos juntos miden menos que la pantalla: la pista se estira al
          ancho del viewport y reparte el espacio sobrante entre los logos.
          Con `justify-around` cada extremo queda con media separación, así
          la unión entre pistas conserva el mismo espaciado que el interior. */}
      <div className="group relative flex">
        {[0, 1].map((track) => (
          <ul
            key={track}
            aria-hidden={track === 1}
            className="flex min-w-full shrink-0 items-center justify-around gap-14 sm:gap-20 px-7 sm:px-10 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
          >
            {CERTIFICATIONS.map((c) => (
              <li key={`${track}-${c.name}`} className="shrink-0">
                <Image
                  src={c.src}
                  alt={track === 1 ? "" : c.name}
                  title={c.name}
                  width={c.width}
                  height={c.height}
                  className="h-10 sm:h-12 w-auto object-contain grayscale opacity-50 transition duration-300 hover:grayscale-0 hover:opacity-100"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
