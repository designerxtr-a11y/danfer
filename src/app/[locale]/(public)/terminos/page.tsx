import { LegalShell } from "@/components/legal/legal-shell";
import { Link } from "@/i18n/navigation";
import { buildAlternates } from "@/lib/seo/alternates";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const en = locale === "en";
  return {
    title: en
      ? "Terms and conditions · Danfer Tours Cusco"
      : "Términos y condiciones · Danfer Tours Cusco",
    description: en
      ? "Terms and conditions for using the website and the travel services of Danfer Tours Cusco."
      : "Términos y condiciones de uso del sitio y de los servicios turísticos de Danfer Tours Cusco.",
    alternates: buildAlternates("/terminos", locale),
  };
}

export default async function TerminosPage({ params }: PageProps) {
  const { locale } = await params;
  return locale === "en" ? <TermsEn /> : <TerminosEs />;
}

function TerminosEs() {
  return (
    <LegalShell title="Términos y condiciones" updatedAt="27 de mayo de 2026">
      <p>
        Bienvenido a <strong>Danfer Tours Cusco</strong> (&quot;nosotros&quot;,
        &quot;nuestra&quot;). Al usar este sitio y reservar nuestros servicios, aceptas
        estos términos.
      </p>

      <h2>1. Quiénes somos</h2>
      <p>
        Danfer Tours Cusco S.A.C. es un operador turístico registrado en el
        Ministerio de Comercio Exterior y Turismo del Perú (MINCETUR) con sede
        en Av. El Sol 314, Cusco, Perú.
      </p>

      <h2>2. Reservas</h2>
      <ul>
        <li>Las reservas se confirman una vez recibido el pago total (o el depósito acordado).</li>
        <li>Para el Camino Inca y otros tours con cupos limitados, se requiere el pago completo al momento de reservar debido a la disponibilidad de permisos oficiales.</li>
        <li>Es responsabilidad del cliente proveer información correcta de pasaporte y datos de contacto.</li>
      </ul>

      <h2>3. Precios</h2>
      <p>
        Los precios están en dólares americanos (USD) salvo indicación. Pueden
        variar por temporada o cambios en tarifas oficiales (entradas, trenes).
        El precio mostrado al momento de reservar es el que se aplica.
      </p>

      <h2>4. Responsabilidades del viajero</h2>
      <ul>
        <li>Aclimatarse a la altitud antes de tours exigentes (mínimo 2 días en Cusco).</li>
        <li>Consultar a su médico si tiene condiciones preexistentes.</li>
        <li>Llevar pasaporte vigente y, si aplica, visa.</li>
        <li>Contratar seguro de viaje (recomendado).</li>
      </ul>

      <h2>5. Cambios de itinerario</h2>
      <p>
        Por razones de seguridad, clima o decisiones de autoridades, podríamos
        modificar el itinerario. Siempre buscaremos una alternativa equivalente
        o reembolsaremos la parte no realizada.
      </p>

      <h2>6. Cancelación</h2>
      <p>
        Consulta nuestra <Link href="/cancelacion">política de cancelación</Link>{" "}
        detallada.
      </p>

      <h2>7. Limitación de responsabilidad</h2>
      <p>
        Danfer Tours no se hace responsable por:
      </p>
      <ul>
        <li>Pérdida de equipaje fuera de nuestros vehículos.</li>
        <li>Lesiones derivadas de no seguir las instrucciones del guía.</li>
        <li>Cambios en horarios de proveedores terceros (trenes, vuelos).</li>
        <li>Eventos de fuerza mayor (terremotos, huelgas, pandemias).</li>
      </ul>

      <h2>8. Propiedad intelectual</h2>
      <p>
        Todo el contenido del sitio (textos, fotos, logos) es propiedad de
        Danfer Tours Cusco S.A.C. y está protegido por derechos de autor.
      </p>

      <h2>9. Jurisdicción</h2>
      <p>
        Estos términos se rigen por las leyes del Perú. Cualquier disputa se
        someterá a los tribunales de Cusco.
      </p>

      <h2>10. Contacto</h2>
      <p>
        Para consultas legales escríbenos a{" "}
        <a href="mailto:legal@danfertourscusco.com">
          legal@danfertourscusco.com
        </a>
        .
      </p>
    </LegalShell>
  );
}

function TermsEn() {
  return (
    <LegalShell title="Terms and conditions" updatedAt="May 27, 2026" en>
      <p>
        Welcome to <strong>Danfer Tours Cusco</strong> (&quot;we&quot;, &quot;us&quot;,
        &quot;our&quot;). By using this website and booking our services, you
        agree to these terms.
      </p>

      <h2>1. Who we are</h2>
      <p>
        Danfer Tours Cusco S.A.C. is a tour operator registered with Peru&apos;s
        Ministry of Foreign Trade and Tourism (MINCETUR), based at Av. El Sol
        314, Cusco, Peru.
      </p>

      <h2>2. Bookings</h2>
      <ul>
        <li>Bookings are confirmed once full payment (or the agreed deposit) is received.</li>
        <li>For the Inca Trail and other tours with limited spaces, full payment is required at the time of booking because of official permit availability.</li>
        <li>Customers are responsible for providing correct passport and contact details.</li>
      </ul>

      <h2>3. Prices</h2>
      <p>
        Prices are in US dollars (USD) unless stated otherwise. They may vary
        by season or with changes to official rates (entrance tickets,
        trains). The price shown at the time of booking is the one that applies.
      </p>

      <h2>4. Traveler responsibilities</h2>
      <ul>
        <li>Acclimatize to the altitude before demanding tours (at least 2 days in Cusco).</li>
        <li>Consult your doctor if you have pre-existing conditions.</li>
        <li>Carry a valid passport and, if required, a visa.</li>
        <li>Take out travel insurance (recommended).</li>
      </ul>

      <h2>5. Itinerary changes</h2>
      <p>
        For safety, weather or decisions by the authorities, we may need to
        change the itinerary. We will always look for an equivalent
        alternative or refund the part not carried out.
      </p>

      <h2>6. Cancellation</h2>
      <p>
        See our detailed <Link href="/cancelacion">cancellation policy</Link>.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        Danfer Tours is not responsible for:
      </p>
      <ul>
        <li>Loss of luggage outside our vehicles.</li>
        <li>Injuries resulting from not following the guide&apos;s instructions.</li>
        <li>Schedule changes by third-party providers (trains, flights).</li>
        <li>Force majeure events (earthquakes, strikes, pandemics).</li>
      </ul>

      <h2>8. Intellectual property</h2>
      <p>
        All website content (texts, photos, logos) belongs to Danfer Tours
        Cusco S.A.C. and is protected by copyright.
      </p>

      <h2>9. Jurisdiction</h2>
      <p>
        These terms are governed by the laws of Peru. Any dispute will be
        submitted to the courts of Cusco.
      </p>

      <h2>10. Contact</h2>
      <p>
        For legal inquiries, email us at{" "}
        <a href="mailto:legal@danfertourscusco.com">
          legal@danfertourscusco.com
        </a>
        .
      </p>
    </LegalShell>
  );
}
